/** @format */

import { api } from 'encore.dev/api';
import { PaginationResponse } from '../common/pagination/types';
import { paginatedTransportTypesToDTO } from './transport-type.mapper';
import { TransportType, TransportTypeDTO } from './transport-type.model';
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
    const paginatedEntities: PaginationResponse<TransportType> =
      await TransportTypeService.getAllTransportTypes(params);
    return paginatedTransportTypesToDTO(paginatedEntities);
  },
);
