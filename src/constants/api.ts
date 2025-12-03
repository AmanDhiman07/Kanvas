/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
    // List endpoints
    LIST: {
        GET_ALL: '/list/titles',
        CREATE: '/list/title',
        MOVE: '/list/lists/move',
    },
    // Card endpoints
    CARD: {
        CREATE: (titleId: string) => `/list/title/${titleId}/card`,
        MOVE: '/list/cards/move',
    },
} as const;
