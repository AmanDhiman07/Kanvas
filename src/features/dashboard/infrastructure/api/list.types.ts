export interface CreateListRequest {
  title: string;
}

export interface List {
  title: string;
}

export interface CreateListResponse {
  status: boolean;
  message: string;
  statusCode: number;
  data: {
    title: string;
  };
}

