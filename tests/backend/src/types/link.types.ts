export interface Link {
  id: string;
  userId: string;
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
}

export interface LinkResponse {
  id: string;
  shortCode: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: Date;
}

export interface LinkListItem {
  id: string;
  shortCode: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: Date;
  clickCount: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface LinkListResponse {
  data: LinkListItem[];
  pagination: PaginationInfo;
}

export interface ClickStats {
  date: string;
  count: number;
}

export interface LinkStats {
  totalClicks: number;
  dailyClicks: ClickStats[];
}
