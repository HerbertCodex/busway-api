/** @format */

import { api } from 'encore.dev/api';
import { PaginationResponse } from '../common/pagination/types';
import { paginateTransportLinesToDTO } from './transport-line.mapper';
import { TransportLine, TransportLineDTO } from './transport-line.model';
import TransportLineService from './transport-line.service';

export const getTransportLines = api(
  {
    method: 'GET',
    path: '/transport-lines',
  },
  async (params: {
    page?: number;
    pageSize?: number;
  }): Promise<PaginationResponse<TransportLineDTO>> => {
    const paginatedTransportLines: PaginationResponse<TransportLine> =
      await TransportLineService.getAllTransportLines(params);
    return paginateTransportLinesToDTO(paginatedTransportLines);
  },
);
