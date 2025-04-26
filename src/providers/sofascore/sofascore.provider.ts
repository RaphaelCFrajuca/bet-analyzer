import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { zonedTimeToUtc } from "date-fns-tz";
import { Browser, chromium, Page } from "playwright"; // <-- PLAYWRIGHT
import { DataProviderInterface } from "../interfaces/data-providers.interface";
import { EventStatistics } from "../interfaces/event-statistics.interface";
import { Event, EventList } from "../interfaces/events-list.interface";
import { Lineup } from "../interfaces/lineup.interface";
import { MarketsResponse } from "../interfaces/market.interface";
import { RecentDuels } from "../interfaces/recent-duels.interface";
import { RecentFormResponse } from "../interfaces/recent-form.interface";
import { SofascoreConfig } from "./interfaces/sofascore-config.interface";

@Injectable()
export class SofascoreProvider implements DataProviderInterface {
    constructor(private readonly config: SofascoreConfig) {}

    private browser: Browser | null = null;

    private async getBrowserInstance(): Promise<Browser> {
        if (!this.browser) {
            this.browser = await chromium.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
        }
        return this.browser;
    }

    private async closeBrowserInstance(): Promise<void> {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }

    private async getPage(): Promise<Page> {
        const browser = await this.getBrowserInstance();
        const context = await browser.newContext();
        const page = await context.newPage();
        page.setDefaultNavigationTimeout(120000);
        return page;
    }

    async getEvents(date: string): Promise<EventList> {
        const page = await this.getPage();
        await page.goto(`${this.config.apiUrl}/sport/football/scheduled-events/${date}`);
        const body = await page.locator("body").innerText();
        await page.close();

        const parsedBody = JSON.parse(body) as EventList;

        const timeZone = "America/Sao_Paulo";
        const dayStartUtc = zonedTimeToUtc(`${date}T00:00:00`, timeZone);
        const dayEndUtc = zonedTimeToUtc(`${date}T23:59:59`, timeZone);

        parsedBody.events = parsedBody.events.filter(event => {
            const eventDateUtc = new Date(event.startTimestamp * 1000);
            return eventDateUtc >= dayStartUtc && eventDateUtc <= dayEndUtc;
        });

        const events = await Promise.all(
            parsedBody.events.slice(0, 50).map(async event => {
                return await this.getEventByEventId(event.id);
            }),
        );

        return { ...parsedBody, events };
    }

    async getEventByEventId(eventId: number): Promise<Event> {
        const page = await this.getPage();
        await page.goto(`${this.config.apiUrl}/event/${eventId}`);
        const body = await page.locator("body").innerText();
        await page.close();
        return (JSON.parse(body) as { event: Event }).event;
    }

    async getMarketOddsByEventId(eventId: number): Promise<MarketsResponse> {
        try {
            const page = await this.getPage();
            await page.goto(`${this.config.apiUrl}/event/${eventId}/odds/1/all`);
            const body = await page.locator("body").innerText();
            await page.close();
            const parsedBody = JSON.parse(body) as MarketsResponse;

            parsedBody.markets = parsedBody?.markets?.map(market => {
                market.choices = market.choices.map(choice => {
                    if (typeof choice.initialFractionalValue === "string") {
                        const [numerator, denominator] = choice.initialFractionalValue.split("/").map(Number);
                        choice.initialFractionalValue = numerator / denominator + 1;
                    }
                    if (typeof choice.fractionalValue === "string") {
                        const [numerator, denominator] = choice.fractionalValue.split("/").map(Number);
                        choice.fractionalValue = numerator / denominator + 1;
                    }
                    return choice;
                });
                return market;
            });

            return parsedBody;
        } catch (error: unknown) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new InternalServerErrorException("Failed to fetch market odds", errorMessage);
        }
    }

    async getRecentPerformanceByTeamId(teamId: number): Promise<RecentFormResponse> {
        const page = await this.getPage();
        await page.goto(`${this.config.apiUrl}/team/${teamId}/performance`);
        const body = await page.locator("body").innerText();
        await page.close();
        return JSON.parse(body) as RecentFormResponse;
    }

    async getMatchStatisticsByEventId(eventId: number): Promise<EventStatistics> {
        const page = await this.getPage();
        await page.goto(`${this.config.apiUrl}/event/${eventId}/statistics`);
        const body = await page.locator("body").innerText();
        await page.close();
        return JSON.parse(body) as EventStatistics;
    }

    async getMatchLineupsByEventId(eventId: number): Promise<Lineup> {
        const page = await this.getPage();
        await page.goto(`${this.config.apiUrl}/event/${eventId}/lineups`);
        const body = await page.locator("body").innerText();
        await page.close();
        return JSON.parse(body) as Lineup;
    }

    async getRecentDuelsByEventId(eventId: number): Promise<RecentDuels> {
        const page = await this.getPage();
        await page.goto(`${this.config.apiUrl}/event/${eventId}/h2h`);
        const body = await page.locator("body").innerText();
        await page.close();
        return JSON.parse(body) as RecentDuels;
    }

    async getTeamImageByTeamId(teamId: number): Promise<Buffer> {
        const page = await this.getPage();
        const response = await page.goto(`${this.config.apiUrl}/team/${teamId}/image`);
        if (!response) {
            throw new InternalServerErrorException("Failed to fetch team image: response is null");
        }
        const buffer = await response.body(); // <-- Playwright usa response.body() para Buffer
        await page.close();
        return buffer;
    }
}
