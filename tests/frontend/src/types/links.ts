export interface Link {
  id: string;
  shortCode: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
  clickCount: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface LinksResponse {
  data: Link[];
  pagination: Pagination;
}
