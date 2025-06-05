/** @format */

import { mapPaginationResponse } from '../common/pagination/helpers';
import { PaginationResponse } from '../common/pagination/types';
import { City, CityDTO } from './city.model';

export function mapCityToDTO(city: City): CityDTO {
  return city.toDTO();
}

export function paginateCitiesToDTO(
  paginated: PaginationResponse<City>,
): PaginationResponse<CityDTO> {
  return mapPaginationResponse(paginated, mapCityToDTO);
}
