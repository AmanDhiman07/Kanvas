export interface CreateListRequest {
  title: string;
}

export interface Card {
  card: string;
  _id: string;
  createdAt: string;
}

export interface List {
  id: string;
  title: string;
  cards: Card[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateListResponse {
  status: boolean;
  message: string;
  statusCode: number;
  data: {
    title: string;
  };
}

export interface GetListsResponse {
  status: boolean;
  message: string;
  statusCode: number;
  data: List[];
}

