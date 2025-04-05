/** @format */

import { APIError, ErrCode } from 'encore.dev/api';
import {
  PaginationOptions,
  PaginationResponse,
} from '../common/pagination/types';
import { Commune } from './commune.model';
import { PGCommuneRepository } from './commune.repository';

const CommuneRepository = new PGCommuneRepository();

const CommuneService = {
  async getCommuneBySlug(slug: string): Promise<Commune> {
    try {
      return await CommuneRepository.getCommuneBySlug(slug);
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

  async getAllCommunes(
    options: PaginationOptions,
  ): Promise<PaginationResponse<Commune>> {
    try {
      return await CommuneRepository.getAllCommunes(options);
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

export default CommuneService;
