/** @format */

import { mapPaginationResponse } from '../common/pagination/helpers';
import { PaginationResponse } from '../common/pagination/types';
import { Commune, CommuneDTO, CommuneRow } from './commune.model';

export function mapCommuneToDTO(commune: CommuneRow): CommuneDTO {
  return Commune.toDTO(commune);
}

export function paginateCommunesToDTO(
  paginated: PaginationResponse<CommuneRow>,
): PaginationResponse<CommuneDTO> {
  return mapPaginationResponse(paginated, mapCommuneToDTO);
}
