/** @format */

import { APIError, ErrCode } from 'encore.dev/api';
import {
  PaginationOptions,
  PaginationResponse,
} from '../common/pagination/types';
import { Metadata } from './metadata.model';
import { PGMetadataRepository } from './metadata.repository';

const MetadataRepository = new PGMetadataRepository();

const MetadataService = {
  async getAllMetadata(
    options: PaginationOptions,
  ): Promise<PaginationResponse<Metadata>> {
    try {
      return await MetadataRepository.getAllMetadata(options);
    } catch (error) {
      if (error instanceof APIError) {
        throw new APIError(
          ErrCode.Unavailable,
          'Le service de base de données est indisponible.',
        );
      }
      throw error;
    }
  },
};

export default MetadataService;
