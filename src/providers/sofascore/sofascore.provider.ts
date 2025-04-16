import { Injectable } from "@nestjs/common";
import puppeteer from "puppeteer";
import { DataProviderInterface } from "../interfaces/data-providers.interface";
import { EventList } from "./interfaces/events.interface";
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
}
