import { Injectable, InternalServerErrorException } from "@nestjs/common";
import puppeteer, { Browser } from "puppeteer";
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

    private browser: Browser | null;

    private async getBrowserInstance(): Promise<Browser> {
        if (!this.browser) {
            this.browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
        }
        return this.browser;
    }

    private async closeBrowserInstance(): Promise<void> {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }

    async getEvents(date: string): Promise<EventList> {
        const browser = await this.getBrowserInstance();
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(120000);
        await page.goto(`${this.config.apiUrl}/sport/football/scheduled-events/${date}`);
        const body: string = await page.evaluate(() => document.body.innerText);
        const parsedBody = JSON.parse(body) as EventList;
        await page.close();

        const localDayStart = new Date(`${date}T00:00:00`);
        const localDayEnd = new Date(`${date}T23:59:59`);

        const dayStartUtc = new Date(localDayStart.getTime() - localDayStart.getTimezoneOffset() * 60 * 1000);
        const dayEndUtc = new Date(localDayEnd.getTime() - localDayEnd.getTimezoneOffset() * 60 * 1000);

        console.log("actualDate", new Date().toISOString());
        console.log("dayStartUtc", dayStartUtc, "dayEndUtc", dayEndUtc);

        parsedBody.events = parsedBody.events.filter(event => {
            const eventDateUtc = new Date(event.startTimestamp * 1000);
            return eventDateUtc >= dayStartUtc && eventDateUtc <= dayEndUtc;
        });

        // console.log({
        //     severity: "INFO",
        //     message: "Filtered events",
        //     events: parsedBody.events.map(event => ({
        //         id: event.id,
        //         date: new Date(event.startTimestamp * 1000).toISOString(),
        //         dateLocal: new Date(event.startTimestamp * 1000).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }),
        //         dayStartUtc: dayStartUtc.toISOString(),
        //         dayEndUtc: dayEndUtc.toISOString(),
        //         localDayStart: localDayStart.toISOString(),
        //         localDayEnd: localDayEnd.toISOString(),
        //         startTimestamp: event.startTimestamp,
        //         status: event.status.code,
        //         homeTeam: event.homeTeam.name,
        //         awayTeam: event.awayTeam.name,
        //     })),
        // });

        const finishedEvents = parsedBody.events.filter(event => event.status.code === 100).slice(0, 50);
        const [newFinishedEvents, newEvents] = await Promise.all([
            Promise.all(
                finishedEvents.map(async event => {
                    const newEvent = await this.getEventByEventId(event.id);
                    return newEvent;
                }),
            ),
            Promise.all(
                parsedBody.events.slice(0, 50).map(async event => {
                    const newEvent = await this.getEventByEventId(event.id);
                    return newEvent;
                }),
            ),
        ]);

        newEvents.push(...newFinishedEvents);

        return { ...parsedBody, events: newEvents };
    }

    async getEventByEventId(eventId: number): Promise<Event> {
        const browser = await this.getBrowserInstance();
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(120000);
        await page.goto(`${this.config.apiUrl}/event/${eventId}`);
        const body: string = await page.evaluate(() => document.body.innerText);
        const parsedBody = (JSON.parse(body) as { event: Event }).event;
        await page.close();
        return parsedBody;
    }

    async getMarketOddsByEventId(eventId: number): Promise<MarketsResponse> {
        try {
            const browser = await this.getBrowserInstance();
            const page = await browser.newPage();
            page.setDefaultNavigationTimeout(120000);
            await page.goto(`${this.config.apiUrl}/event/${eventId}/odds/1/all`);
            const body: string = await page.evaluate(() => document.body.innerText);
            const parsedBody = JSON.parse(body) as MarketsResponse;
            await page.close();

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
        const browser = await this.getBrowserInstance();
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(120000);
        await page.goto(`${this.config.apiUrl}/team/${teamId}/performance`);
        const body: string = await page.evaluate(() => document.body.innerText);
        const parsedBody = JSON.parse(body) as RecentFormResponse;
        await page.close();
        return parsedBody;
    }

    async getMatchStatisticsByEventId(eventId: number): Promise<EventStatistics> {
        const browser = await this.getBrowserInstance();
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(120000);
        await page.goto(`${this.config.apiUrl}/event/${eventId}/statistics`);
        const body: string = await page.evaluate(() => document.body.innerText);
        const parsedBody = JSON.parse(body) as EventStatistics;
        await page.close();
        return parsedBody;
    }

    async getMatchLineupsByEventId(eventId: number): Promise<Lineup> {
        const browser = await this.getBrowserInstance();
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(120000);
        await page.goto(`${this.config.apiUrl}/event/${eventId}/lineups`);
        const body: string = await page.evaluate(() => document.body.innerText);
        const parsedBody = JSON.parse(body) as Lineup;
        await page.close();
        return parsedBody;
    }

    async getRecentDuelsByEventId(eventId: number): Promise<RecentDuels> {
        const browser = await this.getBrowserInstance();
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(120000);
        await page.goto(`${this.config.apiUrl}/event/${eventId}/h2h`);
        const body: string = await page.evaluate(() => document.body.innerText);
        const parsedBody = JSON.parse(body) as RecentDuels;
        await page.close();
        return parsedBody;
    }

    async getTeamImageByTeamId(teamId: number): Promise<Buffer> {
        const browser = await this.getBrowserInstance();
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(120000);
        const response = await page.goto(`${this.config.apiUrl}/team/${teamId}/image`);
        if (!response) {
            throw new InternalServerErrorException("Failed to fetch team image: response is null");
        }
        const buffer = await response.buffer();
        return buffer;
    }
}
