/** @format */

import {
  PaginationOptions,
  PaginationParams,
  PaginationResponse,
  PaginationResult,
} from './types';

export function resolvePagination(
  options: PaginationOptions,
  defaultPageSize = 10,
): PaginationParams {
  const limit = options.pageSize ?? options.limit ?? defaultPageSize;
  const page =
    options.page ??
    (options.offset !== undefined ? Math.floor(options.offset / limit) + 1 : 1);
  const offset = (page - 1) * limit;

  return { limit, offset };
}

export function buildPaginationResponse<T>(
  result: PaginationResult<T>,
  options: PaginationOptions,
): PaginationResponse<T> {
  const pageSize = options.pageSize ?? options.limit ?? result.limit;
  const currentPage =
    options.page ??
    (options.offset !== undefined
      ? Math.floor(options.offset / pageSize) + 1
      : 1);
  const totalPages = Math.ceil(result.total / pageSize);

  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return {
    data: result.data,
    total: result.total,
    limit: pageSize,
    offset: result.offset,
    hasPrevious,
    hasNext,
    previousOffset: hasPrevious ? (currentPage - 2) * pageSize : null,
    nextOffset: hasNext ? currentPage * pageSize : null,
    totalPages,
    currentPage,
    pageSize,
  };
}

export async function paginate<T>(
  fetcher: (params: PaginationParams) => Promise<T[]>,
  counter: () => Promise<number>,
  options: PaginationOptions,
): Promise<PaginationResponse<T>> {
  const { limit, offset } = resolvePagination(options);

  const [data, total] = await Promise.all([
    fetcher({ limit, offset }),
    counter(),
  ]);

  const result: PaginationResult<T> = {
    data,
    total,
    limit,
    offset,
  };

  return buildPaginationResponse(result, options);
}
