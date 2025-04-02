/** @format */

import { APIError, ErrCode } from 'encore.dev/api';
import log from 'encore.dev/log';
import { config } from '../common/config';
import { fetchJson } from '../common/fetch-json';
import {
  IGeoJsonFeatureCollection,
  IGeoJsonResource,
  MIMETYPE_GEOJSON,
} from './transport-lines.model';

/**
 * Fetches the URL of a GeoJSON file from the transport metadata service.
 *
 * This function retrieves a list of GeoJSON resources from the configured
 * transport metadata URL, filters the list to find a file with the specified
 * GeoJSON MIME type, and returns its URL. If no such file is found, an error
 * is thrown.
 *
 * @returns {Promise<string>} A promise that resolves to the URL of the GeoJSON file.
 * @throws {APIError} If no GeoJSON file is found or if there is an error during the fetch operation.
 */
export async function fetchTransportGeoJsonUrl(): Promise<string> {
  const url = config.transportMetadataUrl;

  try {
    const data = await fetchJson<IGeoJsonResource[]>(url);
    const file = data.find(file => file.mimetype === MIMETYPE_GEOJSON);

    if (!file) {
      throw new APIError(ErrCode.NotFound, 'Fichier GeoJSON non trouvé');
    }

    return file.url;
  } catch (error) {
    log.error(
      error,
      `Erreur lors de la récupération du fichier GeoJSON depuis ${url}`,
    );
    throw new APIError(
      ErrCode.Internal,
      'Erreur lors de la récupération du fichier GeoJSON',
    );
  }
}

/**
 * Fetches the GeoJSON data for transport and returns it as a feature collection.
 *
 * This function retrieves the URL for the GeoJSON data by calling `fetchTransportGeoJsonUrl`,
 * then fetches the GeoJSON data from that URL using `fetchJson`. If an error occurs during
 * the process, it logs the error and rethrows it.
 *
 * @returns {Promise<IGeoJsonFeatureCollection>} A promise that resolves to the GeoJSON feature collection.
 * @throws Will throw an error if fetching the GeoJSON URL or data fails.
 */
export async function fetchTransportGeoJson(): Promise<IGeoJsonFeatureCollection> {
  try {
    const geojsonUrl = await fetchTransportGeoJsonUrl();
    const geojson = await fetchJson<IGeoJsonFeatureCollection>(geojsonUrl);
    return geojson;
  } catch (error) {
    log.error(error, `Erreur lors du chargement du GeoJSON : ${error}`);
    throw new APIError(
      ErrCode.Internal,
      'Erreur lors du chargement du GeoJSON',
    );
  }
}
