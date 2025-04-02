/** @format */

export interface PaginationResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface PaginationParams {
  limit: number;
  offset: number;
}

export interface PaginationResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  hasNext: boolean;
  hasPrevious: boolean;
  nextOffset: number | null;
  previousOffset: number | null;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface PaginationOptions {
  limit?: number;
  offset?: number;
  page?: number;
  pageSize?: number;
}
