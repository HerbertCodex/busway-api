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
  const pageSize = Math.max(
    1,
    options.pageSize ?? options.limit ?? defaultPageSize,
  );
  const page = Math.max(
    1,
    options.page ??
      (options.offset !== undefined
        ? Math.floor(options.offset / pageSize) + 1
        : 1),
  );
  const offset = (page - 1) * pageSize;

  return { limit: pageSize, offset };
}

export function buildPaginationResponse<T>(
  result: PaginationResult<T>,
  options: PaginationOptions,
): PaginationResponse<T> {
  const pageSize = Math.max(
    1,
    options.pageSize ?? options.limit ?? result.limit,
  );
  const currentPage = Math.max(
    1,
    options.page ??
      (options.offset !== undefined
        ? Math.floor(options.offset / pageSize) + 1
        : 1),
  );
  const totalPages = Math.max(1, Math.ceil(result.total / pageSize));

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

/**
 * Mappe une PaginationResponse<T> en PaginationResponse<U> à l’aide d’une fonction mapperFn.
 */
export function mapPaginationResponse<T, U>(
  paginated: PaginationResponse<T>,
  mapperFn: (item: T) => U,
): PaginationResponse<U> {
  return {
    data: paginated.data.map(mapperFn),
    total: paginated.total,
    limit: paginated.limit,
    offset: paginated.offset,
    hasNext: paginated.hasNext,
    hasPrevious: paginated.hasPrevious,
    nextOffset: paginated.nextOffset,
    previousOffset: paginated.previousOffset,
    totalPages: paginated.totalPages,
    currentPage: paginated.currentPage,
    pageSize: paginated.pageSize,
  };
}
