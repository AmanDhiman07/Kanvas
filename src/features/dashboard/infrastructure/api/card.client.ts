import { httpClient } from '../../../../lib/http';
import { API_ENDPOINTS } from '../../../../constants/api';
import type { AddCardRequest, AddCardResponse } from './card.types';

export const cardClient = {
    async addCard(titleId: string, cardText: string): Promise<AddCardResponse> {
        try {
            const request: AddCardRequest = {
                cards: [cardText],
            };

            const response = await httpClient.post<AddCardResponse>(
                API_ENDPOINTS.CARD.CREATE(titleId),
                request
            );

            // The httpClient wraps the response, so response.data contains the actual data
            const cardData = response.data as AddCardResponse;

            if (cardData && cardData.data && cardData.data.cards) {
                return cardData;
            }

            throw new Error('Card creation failed: Invalid response format');
        } catch (error) {
            console.error('Add card error:', error);
            throw error;
        }
    },
};
