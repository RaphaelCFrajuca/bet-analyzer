export const bettingResponseSchema = {
    name: "betting_schema",
    strict: false,
    schema: {
        type: "object",
        description: "Objeto que contém uma lista de sugestões de apostas baseadas em estatísticas da partida.",
        properties: {
            suggestions: {
                type: "array",
                description: "Lista de sugestões de apostas baseadas em estatísticas da partida.",
                items: {
                    type: "object",
                    properties: {
                        marketName: {
                            type: "string",
                            description: "Nome do mercado de aposta, como 'Ambas Marcam', 'Resultado Final', etc.",
                        },
                        bet: {
                            type: "string",
                            description: "O que deve ser apostado, como 'Sim', 'Tottenham vence', 'Over 2.5', etc.",
                        },
                        odd: {
                            type: "number",
                            description: "Valor atual da odd para a aposta sugerida",
                        },
                        confidence: {
                            type: "integer",
                            description: "Nível de confiança de 0 a 100 indicando quão promissora é a aposta",
                        },
                        explanation: {
                            type: "string",
                            description: "Justificativa curta explicando por que essa aposta foi sugerida",
                        },
                    },
                    required: ["marketName", "bet", "odd", "confidence", "explanation"],
                },
            },
        },
        required: ["suggestions"],
    },
};
