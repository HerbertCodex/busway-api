/** @format */

import { APIError, ErrCode } from 'encore.dev/api';
import {
  PaginationOptions,
  PaginationResponse,
} from '../common/pagination/types';
import { TransportCompany } from './transport-company.model';
import { PGTransportCompanyRepository } from './transport-company.repository';

const TransportCompanyRepository = new PGTransportCompanyRepository();

const TransportCompanyService = {
  async getAllTransportCompanies(
    options: PaginationOptions,
  ): Promise<PaginationResponse<TransportCompany>> {
    try {
      return await TransportCompanyRepository.getAllTransportCompanies(options);
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

  async getTransportCompanyBySlug(slug: string): Promise<TransportCompany> {
    try {
      return await TransportCompanyRepository.getTransportCompanyBySlug(slug);
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

export default TransportCompanyService;
