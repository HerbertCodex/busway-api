/** @format */

import { mapPaginationResponse } from '../common/pagination/helpers';
import { PaginationResponse } from '../common/pagination/types';
import { TransportLine, TransportLineDTO } from './transport-line.model';

export function mapTransportLineToDTO(
  transportLine: TransportLine,
): TransportLineDTO {
  return transportLine.toDTO();
}

export function paginateTransportLinesToDTO(
  paginated: PaginationResponse<TransportLine>,
): PaginationResponse<TransportLineDTO> {
  return mapPaginationResponse(paginated, mapTransportLineToDTO);
}
