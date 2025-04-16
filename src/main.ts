import { NestFactory } from "@nestjs/core";
import { BetAnalyzerModule } from "./bet-analyzer.module";
async function bootstrap() {
    const app = await NestFactory.create(BetAnalyzerModule);
    await app.listen(process.env.PORT ?? 8080);
}
void bootstrap();
