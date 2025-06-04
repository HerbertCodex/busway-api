/** @format */

import { api } from 'encore.dev/api';
import { PaginationResponse } from '../common/pagination/types';
import { mapModeToDTO, paginateModesToDTO } from './mode.mapper';
import { Mode, ModeDTO, ModeRow } from './mode.model';
import ModeService from './mode.service';

export const getModes = api(
  {
    method: 'GET',
    path: '/modes',
  },
  async (params: {
    page?: number;
    pageSize?: number;
  }): Promise<PaginationResponse<ModeDTO>> => {
    const paginatedEntities: PaginationResponse<ModeRow> =
      await ModeService.getAllModes(params);
    return paginateModesToDTO(paginatedEntities);
  },
);

export const getModeBySlug = api(
  {
    method: 'GET',
    path: '/modes/:slug',
  },
  async (params: { slug: string }): Promise<ModeDTO> => {
    const modeEntity: Mode = await ModeService.getModeBySlug(params.slug);
    return mapModeToDTO(modeEntity);
  },
);
