import { httpClient } from '../../../../lib/http';
import { API_ENDPOINTS } from '../../../../constants/api';
import type { AddCardRequest, AddCardResponse, MoveCardRequest, MoveCardResponse } from './card.types';

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

    async moveCard(request: MoveCardRequest): Promise<MoveCardResponse> {
        try {
            const response = await httpClient.put<MoveCardResponse>(
                API_ENDPOINTS.CARD.MOVE,
                request
            );

            const moveData = response.data as MoveCardResponse;

            if (moveData && moveData.data && moveData.data.success) {
                return moveData;
            }

            throw new Error('Card move failed: Invalid response format');
        } catch (error) {
            console.error('Move card error:', error);
            throw error;
        }
    },
};
