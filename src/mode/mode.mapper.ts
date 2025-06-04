/** @format */

import { PaginationResponse } from '../common/pagination/types';
import { Mode, ModeDTO, ModeRow } from './mode.model';

export function toModeDTO(model: Mode): ModeDTO {
  return {
    id: model.id,
    name: model.name,
    slug: model.slug,
    code: model.code,
    description: model.description,
    createdAt: model.created_at,
    updatedAt: model.updated_at,
  };
}

export function rowToModeDTO(row: ModeRow): ModeDTO {
  const model = Mode.fromDb(row);
  return toModeDTO(model);
}

export function paginateToModeDTO(
  paginated: PaginationResponse<Mode>,
): PaginationResponse<ModeDTO> {
  return {
    data: paginated.data.map(m => toModeDTO(m)),
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
