export interface EventStatistics {
    statistics: PeriodStatistics[];
}

export interface PeriodStatistics {
    period: string; // ex: "ALL"
    groups: StatisticsGroup[];
}

export interface StatisticsGroup {
    groupName: string; // ex: "Match overview", "Shots", etc.
    statisticsItems: StatisticsItem[];
}

export interface StatisticsItem {
    name: string; // ex: "Ball possession"
    home: string; // valor exibido, ex: "49%"
    away: string; // valor exibido, ex: "51%"
    compareCode: number; // 1 = home melhor, 2 = away melhor, 3 = empate
    statisticsType: "positive" | "negative";
    valueType: "event" | "team";
    homeValue: number;
    awayValue: number;
    renderType: number; // pode definir como é exibido, ex: 1 = barras, 2 = porcentagem, 3 = fração
    key: string;

    // Apenas quando valueType for "team" (ex: "26/39 (67%)")
    homeTotal?: number;
    awayTotal?: number;
}
