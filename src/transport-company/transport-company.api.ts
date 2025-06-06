/** @format */

import { api } from 'encore.dev/api';
import { PaginationResponse } from '../common/pagination/types';
import {
  mapTransportCompanyToDTO,
  paginateTransportCompaniesToDTO,
} from './transport-company.mapper';
import {
  TransportCompany,
  TransportCompanyDTO,
} from './transport-company.model';
import TransportCompanyService from './transport-company.service';

export const getTransportCompanies = api(
  {
    method: 'GET',
    path: '/transport-companies',
  },
  async (params: {
    page?: number;
    pageSize?: number;
  }): Promise<PaginationResponse<TransportCompanyDTO>> => {
    const paginatedTransportCompanies: PaginationResponse<TransportCompany> =
      await TransportCompanyService.getAllTransportCompanies(params);
    return paginateTransportCompaniesToDTO(paginatedTransportCompanies);
  },
);

export const getTransportCompanyBySlug = api(
  {
    method: 'GET',
    path: '/transport-companies/:slug',
  },
  async (params: { slug: string }): Promise<TransportCompanyDTO> => {
    const transportCompany: TransportCompany =
      await TransportCompanyService.getTransportCompanyBySlug(params.slug);
    return mapTransportCompanyToDTO(transportCompany);
  },
);
