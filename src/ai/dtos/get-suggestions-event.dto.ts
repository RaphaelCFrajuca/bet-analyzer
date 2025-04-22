import { IsNumber, IsPositive } from "class-validator";

export class GetSuggestionsEventDto {
    @IsNumber({}, { message: "O id do evento é obrigatório" })
    @IsPositive({ message: "O id do evento deve ser um número positivo" })
    eventId: number;
}
