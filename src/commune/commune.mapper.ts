/** @format */

import { mapPaginationResponse } from '../common/pagination/helpers';
import { PaginationResponse } from '../common/pagination/types';
import { CommuneDTO, CommuneRow } from './commune.model';

export function mapCommuneToDTO(commune: CommuneRow): CommuneDTO {
  return {
    id: commune.id,
    name: commune.name,
    slug: commune.slug,
    code: commune.code,
    cityId: commune.city_id,
    createdAt: commune.created_at,
    updatedAt: commune.updated_at,
  };
}

export function paginateCommunesToDTO(
  paginated: PaginationResponse<CommuneRow>,
): PaginationResponse<CommuneDTO> {
  return mapPaginationResponse(paginated, mapCommuneToDTO);
}
