/** @format */

import { mapPaginationResponse } from '../common/pagination/helpers';
import { PaginationResponse } from '../common/pagination/types';
import { TransportTypeDTO, TransportTypeRow } from './transport-type.model';

export function mapTransportTypeToDTO(
  transportType: TransportTypeRow,
): TransportTypeDTO {
  return {
    id: transportType.id,
    name: transportType.name,
    slug: transportType.slug,
    code: transportType.code,
    companyId: transportType.company_id,
    modeId: transportType.mode_id,
    createdAt: transportType.created_at,
    updatedAt: transportType.updated_at,
  };
}

export function paginateTransportTypesToDTO(
  paginated: PaginationResponse<TransportTypeRow>,
): PaginationResponse<TransportTypeDTO> {
  return mapPaginationResponse(paginated, mapTransportTypeToDTO);
}
