/** @format */

import { api } from 'encore.dev/api';
import { PaginationResponse } from '../common/pagination/types';
import { paginateTransportTypesToDTO } from './transport-type.mapper';
import { TransportTypeDTO, TransportTypeRow } from './transport-type.model';
import TransportTypeService from './transport-type.service';

export const getTransportTypes = api(
  {
    method: 'GET',
    path: '/transport-types',
  },
  async (params: {
    page?: number;
    pageSize?: number;
  }): Promise<PaginationResponse<TransportTypeDTO>> => {
    const paginatedEntities: PaginationResponse<TransportTypeRow> =
      await TransportTypeService.getAllTransportTypes(params);
    return paginateTransportTypesToDTO(paginatedEntities);
  },
);
