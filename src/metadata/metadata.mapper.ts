/** @format */

import { mapPaginationResponse } from '../common/pagination/helpers';
import { PaginationResponse } from '../common/pagination/types';
import { Metadata, MetadataDTO } from './metadata.model';

export function mapMetadataToDTO(metadata: Metadata): MetadataDTO {
  return metadata.toDTO();
}

export function paginateMetadataToDTO(
  paginated: PaginationResponse<Metadata>,
): PaginationResponse<MetadataDTO> {
  return mapPaginationResponse(paginated, mapMetadataToDTO);
}
