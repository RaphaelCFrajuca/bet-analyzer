export interface Bet {
    marketName: string; // Nome do mercado de aposta, como 'Ambas Marcam', 'Resultado Final', etc.
    bet: string; // O que deve ser apostado, como 'Sim', 'Tottenham vence', 'Over 2.5', etc.
    odd: number; // Valor atual da odd para a aposta sugerida
    confidence: number; // Nível de confiança de 0 a 100 indicando quão promissora é a aposta
    explanation: string; // Justificativa curta explicando por que essa aposta foi sugerida
    ev: number; // Valor esperado da aposta, indicando o potencial de lucro
}

export interface BettingResponse {
    suggestions: Bet[]; // Lista de apostas sugeridas
}
