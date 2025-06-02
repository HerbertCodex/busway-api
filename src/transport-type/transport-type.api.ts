/** @format */

import { api } from 'encore.dev/api';
import { PaginationResponse } from '../common/pagination/types';
import { TransportCompanyRow } from '../transport-company/transport-company.model';
import TransportCompanyService from '../transport-company/transport-company.service';

export const getTransportTypes = api(
  {
    method: 'GET',
    path: '/transport-types',
  },
  async (params: {
    page?: number;
    pageSize?: number;
  }): Promise<PaginationResponse<TransportCompanyRow>> => {
    const transportTypes =
      await TransportCompanyService.getAllTransportCompanies(params);
    return transportTypes;
  },
);
