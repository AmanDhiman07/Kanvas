import type { Card } from './list.types';

export interface AddCardRequest {
    cards: string[];
}

export interface AddCardResponse {
    status: boolean;
    message: string;
    statusCode: number;
    data: {
        cards: Card[];
        titleId: string;
        count: number;
    };
}

