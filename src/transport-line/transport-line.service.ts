/** @format */

import { APIError, ErrCode } from 'encore.dev/api';
import {
  PaginationOptions,
  PaginationResponse,
} from '../common/pagination/types';
import { TransportLine } from './transport-line.model';
import { PGTransportLineRepository } from './transport-line.repository';

const TransportLineRepository = new PGTransportLineRepository();

const TransportLineService = {
  async getAllTransportLines(
    options: PaginationOptions,
  ): Promise<PaginationResponse<TransportLine>> {
    try {
      return await TransportLineRepository.getAllTransportLines(options);
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

export default TransportLineService;
