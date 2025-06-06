/** @format */

import { api } from 'encore.dev/api';
import { PaginationResponse } from '../common/pagination/types';
import { paginateMetadataToDTO } from './metadata.mapper';
import { Metadata, MetadataDTO } from './metadata.model';
import MetadataService from './metadata.service';

export const getMetadata = api(
  { method: 'GET', path: '/metadata' },
  async (params: {
    page?: number;
    pageSize?: number;
  }): Promise<PaginationResponse<MetadataDTO>> => {
    const paginatedMetadata: PaginationResponse<Metadata> =
      await MetadataService.getAllMetadata(params);
    return paginateMetadataToDTO(paginatedMetadata);
  },
);
