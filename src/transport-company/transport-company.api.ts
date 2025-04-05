/** @format */

import { api } from 'encore.dev/api';
import { PaginationResponse } from '../common/pagination/types';
import { TransportCompanyRow } from './transport-company.model';
import TransportCompanyService from './transport-company.service';

export const getTransportCompanies = api(
  {
    method: 'GET',
    path: '/transport-companies',
  },
  async (params: {
    page?: number;
    pageSize?: number;
  }): Promise<PaginationResponse<TransportCompanyRow>> => {
    const transportCompanies =
      await TransportCompanyService.getAllTransportCompanies(params);
    return transportCompanies;
  },
);

export const getTransportCompanyBySlug = api(
  {
    method: 'GET',
    path: '/transport-companies/:slug',
  },
  async (params: { slug: string }): Promise<TransportCompanyRow> => {
    const transportCompany =
      await TransportCompanyService.getTransportCompanyBySlug(params.slug);
    return transportCompany;
  },
);
