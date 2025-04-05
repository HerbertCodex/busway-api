/** @format */

import { api } from 'encore.dev/api';
import { PaginationResponse } from '../common/pagination/types';
import { CommuneRow } from './commune.model';
import CommuneService from './commune.service';

export const getCommunes = api(
  {
    method: 'GET',
    path: '/communes',
  },
  async (params: {
    page?: number;
    pageSize?: number;
  }): Promise<PaginationResponse<CommuneRow>> => {
    const communes = await CommuneService.getAllCommunes(params);
    return communes;
  },
);

export const getCommuneBySlug = api(
  {
    method: 'GET',
    path: '/communes/:slug',
  },
  async (params: { slug: string }): Promise<CommuneRow> => {
    const commune = await CommuneService.getCommuneBySlug(params.slug);
    return commune;
  },
);
