import { Controller, Post } from "@nestjs/common";
import { SyncService } from "../services/sync.service";

@Controller("sync")
export class SyncController {
    constructor(private readonly syncService: SyncService) {}

    @Post("")
    async sync() {
        return this.syncService.syncAllData();
    }
}
