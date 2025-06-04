/** @format */

import { api } from 'encore.dev/api';
import { PaginationResponse } from '../common/pagination/types';
import { mapCommuneToDTO, paginateCommunesToDTO } from './commune.mapper';
import { Commune, CommuneDTO } from './commune.model';
import CommuneService from './commune.service';

export const getCommunes = api(
  {
    method: 'GET',
    path: '/communes',
  },
  async (params: {
    page?: number;
    pageSize?: number;
  }): Promise<PaginationResponse<CommuneDTO>> => {
    const paginatedEntities: PaginationResponse<Commune> =
      await CommuneService.getAllCommunes(params);
    return paginateCommunesToDTO(paginatedEntities);
  },
);

export const getCommuneBySlug = api(
  {
    method: 'GET',
    path: '/communes/:slug',
  },
  async (params: { slug: string }): Promise<CommuneDTO> => {
    const communeEntity: Commune = await CommuneService.getCommuneBySlug(
      params.slug,
    );
    return mapCommuneToDTO(communeEntity);
  },
);
