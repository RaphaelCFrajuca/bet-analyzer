import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { BetAnalyzerModule } from "./bet-analyzer.module";
async function bootstrap() {
    const app = await NestFactory.create(BetAnalyzerModule);
    app.enableCors();
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            transformOptions: { enableImplicitConversion: true },
            forbidNonWhitelisted: true,
        }),
    );
    await app.listen(process.env.PORT ?? 8080);
}
void bootstrap();
