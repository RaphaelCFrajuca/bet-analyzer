import { Injectable, InternalServerErrorException } from "@nestjs/common";
import puppeteer from "puppeteer";
import { DataProviderInterface } from "../interfaces/data-providers.interface";
import { EventStatistics } from "./interfaces/event-statistics.interface";
import { EventList } from "./interfaces/events.interface";
import { MarketsResponse } from "./interfaces/market.interface";
import { RecentFormResponse } from "./interfaces/recent-form.interface";
import { SofascoreConfig } from "./interfaces/sofascore-config.interface";

@Injectable()
export class SofascoreProvider implements DataProviderInterface {
    constructor(private readonly config: SofascoreConfig) {}

    async getEvents(date: string): Promise<EventList> {
        const browser = await puppeteer.launch({
            headless: true,
        });
        const page = await browser.newPage();
        await page.goto(`${this.config.apiUrl}/sport/football/scheduled-events/${date}`);
        const body: string = await page.evaluate(() => document.body.innerText);
        const parsedBody = JSON.parse(body) as EventList;
        await browser.close();
        return parsedBody;
    }

    async getMarketOddsByEventId(eventId: number): Promise<MarketsResponse> {
        try {
            const browser = await puppeteer.launch({
                headless: true,
            });
            const page = await browser.newPage();
            await page.goto(`${this.config.apiUrl}/event/${eventId}/odds/100/all`);
            const body: string = await page.evaluate(() => document.body.innerText);
            const parsedBody = JSON.parse(body) as MarketsResponse;
            await browser.close();

            parsedBody.markets = parsedBody.markets.map(market => {
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
        const browser = await puppeteer.launch({
            headless: true,
        });
        const page = await browser.newPage();
        await page.goto(`${this.config.apiUrl}/team/${teamId}/performance`);
        const body: string = await page.evaluate(() => document.body.innerText);
        const parsedBody = JSON.parse(body) as RecentFormResponse;
        await browser.close();
        return parsedBody;
    }

    async getMatchStatisticsByEventId(eventId: number): Promise<EventStatistics> {
        const browser = await puppeteer.launch({
            headless: true,
        });
        const page = await browser.newPage();
        await page.goto(`${this.config.apiUrl}/event/${eventId}/statistics`);
        const body: string = await page.evaluate(() => document.body.innerText);
        const parsedBody = JSON.parse(body) as EventStatistics;
        await browser.close();
        return parsedBody;
    }
}
