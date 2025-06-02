/** @format */

import { APIError, ErrCode } from 'encore.dev/api';
import {
  PaginationOptions,
  PaginationResponse,
} from '../common/pagination/types';
import { TransportType } from './transport-type.model';
import { PGTransportTypeRepository } from './transport-type.repository';

const TransportTypeRepository = new PGTransportTypeRepository();

const TransportTypeService = {
  async getAllTransportTypes(
    options: PaginationOptions,
  ): Promise<PaginationResponse<TransportType>> {
    try {
      return await TransportTypeRepository.getAllTransportTypes(options);
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

export default TransportTypeService;
