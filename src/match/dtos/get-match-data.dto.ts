import { IsDate, IsNotEmpty } from "class-validator";

export class GetMatchDataDto {
    @IsNotEmpty({ message: "A data do mercado é obrigatória" })
    @IsDate({ message: "A data do mercado deve ser no formato AAAA/MM/DD" })
    marketDate: Date;
}
