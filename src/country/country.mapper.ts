/** @format */

import { mapPaginationResponse } from '../common/pagination/helpers';
import { PaginationResponse } from '../common/pagination/types';
import { CountryDTO, CountryRow } from './country.model';

export function mapCountryToDTO(country: CountryRow): CountryDTO {
  return {
    id: country.id,
    name: country.name,
    slug: country.slug,
    codeIso: country.code_iso,
    createdAt: country.created_at,
    updatedAt: country.updated_at,
  };
}

export function paginateCountriesToDTO(
  paginated: PaginationResponse<CountryRow>,
): PaginationResponse<CountryDTO> {
  return mapPaginationResponse(paginated, mapCountryToDTO);
}
