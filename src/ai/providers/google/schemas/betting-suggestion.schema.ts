import { Schema, Type } from "@google/genai";

export const bettingResponseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        suggestions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    marketName: {
                        type: Type.STRING,
                        nullable: false,
                        description: "Nome do mercado de aposta, como 'Ambas Marcam', 'Resultado Final', etc.",
                    },
                    bet: {
                        type: Type.STRING,
                        nullable: false,
                        description: "O que deve ser apostado, como 'Sim', 'Tottenham vence', 'Over 2.5', etc.",
                    },
                    odd: {
                        type: Type.NUMBER,
                        nullable: false,
                        description: "Valor atual da odd para a aposta sugerida",
                    },
                    confidence: {
                        type: Type.NUMBER,
                        nullable: false,
                        description: "Nível de confiança de 0 a 100 indicando quão promissora é a aposta",
                    },
                    explanation: {
                        type: Type.STRING,
                        nullable: false,
                        description: "Justificativa curta explicando por que essa aposta foi sugerida",
                    },
                },
                required: ["marketName", "bet", "odd", "confidence", "explanation"],
            },
        },
    },
};
