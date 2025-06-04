/** @format */

import { api } from 'encore.dev/api';
import { PaginationResponse } from '../common/pagination/types';
import { paginateToModeDTO, toModeDTO } from './mode.mapper';
import { Mode, ModeDTO } from './mode.model';
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
    const paginatedEntities: PaginationResponse<Mode> =
      await ModeService.getAllModes(params);
    const paginatedDTO = paginateToModeDTO(paginatedEntities);

    return paginatedDTO;
  },
);

export const getModeBySlug = api(
  {
    method: 'GET',
    path: '/modes/:slug',
  },
  async (params: { slug: string }): Promise<ModeDTO> => {
    const modeEntity: Mode = await ModeService.getModeBySlug(params.slug);
    const dto: ModeDTO = toModeDTO(modeEntity);

    return dto;
  },
);
