/** @format */

import { mapPaginationResponse } from '../common/pagination/helpers';
import { PaginationResponse } from '../common/pagination/types';
import {
  TransportCompany,
  TransportCompanyDTO,
} from './transport-company.model';

export function mapTransportCompanyToDTO(
  transportCompany: TransportCompany,
): TransportCompanyDTO {
  return transportCompany.toDTO();
}

export function paginateTransportCompaniesToDTO(
  paginated: PaginationResponse<TransportCompany>,
): PaginationResponse<TransportCompanyDTO> {
  return mapPaginationResponse(paginated, mapTransportCompanyToDTO);
}
