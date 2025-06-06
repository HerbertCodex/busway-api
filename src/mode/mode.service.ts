/** @format */

import { APIError, ErrCode } from 'encore.dev/api';
import {
  PaginationOptions,
  PaginationResponse,
} from '../common/pagination/types';
import { Mode } from './mode.model';
import { PGModeRepository } from './mode.repository';

const ModeRepository = new PGModeRepository();

const ModeService = {
  async getModeBySlug(slug: string): Promise<Mode> {
    try {
      return await ModeRepository.getModeBySlug(slug);
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

  async getAllModes(
    options: PaginationOptions,
  ): Promise<PaginationResponse<Mode>> {
    try {
      return await ModeRepository.getAllModes(options);
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

export default ModeService;
