import { Schema, Type } from "@google/genai";

export const bettingVerifiedSchema: Schema = {
    type: Type.OBJECT,
    description: "Objeto que contém uma lista de apostas feitas pela IA baseadas em estatísticas da partida.",
    properties: {
        bets: {
            type: Type.ARRAY,
            description: "Lista de apostas feitas pela IA baseadas em estatísticas da partida.",
            items: {
                type: Type.OBJECT,
                properties: {
                    marketName: {
                        type: Type.STRING,
                        description: "Nome do mercado de aposta, como 'Ambas Marcam', 'Resultado Final', etc.",
                        nullable: false,
                    },
                    bet: {
                        type: Type.STRING,
                        description: "O que foi apostado, como 'Sim', 'Tottenham vence', 'Over 2.5', etc.",
                        nullable: false,
                    },
                    betPredicted: {
                        type: Type.BOOLEAN,
                        description: "Se a aposta foi prevista ou não (green ou red)",
                        nullable: false,
                    },
                },
                required: ["marketName", "bet", "betPredicted"],
            },
            nullable: false,
        },
    },
    required: ["bets"],
};
