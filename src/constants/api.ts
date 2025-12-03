/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
    // List endpoints
    LIST: {
        GET_ALL: '/list/titles',
        CREATE: '/list/title',
    },
    // Card endpoints
    CARD: {
        CREATE: (titleId: string) => `/list/title/${titleId}/card`,
    },
} as const;
