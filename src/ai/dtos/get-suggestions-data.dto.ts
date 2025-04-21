import { IsDate, IsNotEmpty } from "class-validator";

export class GetSuggestionsDataDto {
    @IsNotEmpty({ message: "A data de sugestão é obrigatória" })
    @IsDate({ message: "A data de sugestão deve ser no formato AAAA/MM/DD" })
    suggestionsDate: Date;
}
