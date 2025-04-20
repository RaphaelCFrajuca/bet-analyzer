import { Injectable, InternalServerErrorException } from "@nestjs/common";
import puppeteer from "puppeteer";
import { DataProviderInterface } from "../interfaces/data-providers.interface";
import { EventList } from "./interfaces/events.interface";
import { MarketsResponse } from "./interfaces/market.interface";
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
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException("Failed to fetch market odds", error);
        }
    }
}
