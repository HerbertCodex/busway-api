/** @format */

import { mapPaginationResponse } from '../common/pagination/helpers';
import { PaginationResponse } from '../common/pagination/types';
import { Mode, ModeDTO } from './mode.model';

export function mapModeToDTO(model: Mode): ModeDTO {
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

export function paginateToModeDTO(
  paginated: PaginationResponse<Mode>,
): PaginationResponse<ModeDTO> {
  return mapPaginationResponse(paginated, mapModeToDTO);
}
