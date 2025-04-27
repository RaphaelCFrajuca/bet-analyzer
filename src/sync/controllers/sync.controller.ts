import { Controller, Get, Post } from "@nestjs/common";
import { SyncService } from "../services/sync.service";

@Controller("sync")
export class SyncController {
    constructor(private readonly syncService: SyncService) {}

    @Post()
    async sync() {
        return this.syncService.syncAllData();
    }

    @Get()
    async getSync() {
        const isSynched = await this.syncService.getSync();
        if (isSynched) {
            return { message: "Sync completed successfully." };
        } else {
            return { message: "No matches to sync." };
        }
    }
}
