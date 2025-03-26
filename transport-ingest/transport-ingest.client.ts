/** @format */

import { APIError, ErrCode } from 'encore.dev/api';
import { config } from '../common/config';
import { fetchJson } from '../common/fetch';
import { GeoJsonResource, Mimetype } from './transport-ingest.type';

export async function fetchTransportGeoJsonUrl(): Promise<string> {
  const url = config.transportMetadataUrl;

  const data = await fetchJson<GeoJsonResource[]>(url);

  const file = data.find(file => file.mimetype === Mimetype.GeoJson);
  if (!file) {
    throw new APIError(ErrCode.NotFound, 'Fichier GeoJSON non trouvé');
  }

  return file.url;
}

export async function fetchTransportGeoJson(): Promise<any> {
  const geojsonUrl = await fetchTransportGeoJsonUrl();
  const geojson = await fetchJson(geojsonUrl);
  return geojson;
}
