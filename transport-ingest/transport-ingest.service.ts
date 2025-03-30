/** @format */

import log from 'encore.dev/log';
import { normalizeText } from '../common/normalizeText';
import { orm } from '../database';
import {
  modes,
  transportCompaniesTable,
  transportLinesTable,
} from '../drizzle/schema';
import { fetchTransportGeoJson } from './transport-ingest.client';
import {
  findCommuneByContainedName,
  findCommuneByExactNormalizedName,
  getByNameInsensitive,
  getCityIdByName,
  getTransportTypeId,
} from './transport-ingest.helpers';
import {
  GEOJSON_FEATURE_COLLECTION,
  GEOJSON_MULTILINESTRING,
  ITransportLine,
  TMultiLineString,
  TransportFeature,
} from './transport-ingest.type';

export async function ingestTransportData(): Promise<ITransportLine[]> {
  const geojson = await fetchTransportGeoJson();

  if (geojson.type !== GEOJSON_FEATURE_COLLECTION) {
    throw new Error('Le fichier GeoJSON doit être une collection de features');
  }

  const lines: ITransportLine[] = geojson.features
    .filter(feature => {
      const isValid = feature.geometry.type === GEOJSON_MULTILINESTRING;
      if (!isValid) {
        log.warn(`⛔️ Feature ignorée (geometry: ${feature.geometry.type})`);
      }
      return isValid;
    })
    .map(feature => {
      const { name, code, operator, network, mode, opening_hours } =
        feature.properties ?? {};
      const geometry = feature.geometry as {
        type: TMultiLineString;
        coordinates: number[][][];
      };

      return {
        name: name ?? '',
        code: code ?? '',
        operator: operator ?? '',
        network: network ?? '',
        mode: mode ?? '',
        opening_hours: opening_hours ?? '',
        geometry,
      };
    });

  return lines;
}

export async function ingestTransportFeature(
  feature: TransportFeature,
  metadataId: string,
) {
  const {
    code = '',
    mode,
    name,
    network,
    opening_hours = '',
    operator,
  } = feature.properties;

  let normalizedMode = normalizeText(mode);
  let rawType = network.split('/').pop()?.trim() ?? network;
  let normalizedType = normalizeText(rawType);

  let inferredCommuneName: string | undefined;

  // Extraction propre commune "woro-woro de/d' XXX" depuis network
  const woroRegex = /woro[-\s]?woro\s+(?:de|du|d['’])\s*([\wÀ-ÿ'-\s]+)/i;
  const woroMatch = woroRegex.exec(network);
  if (woroMatch) {
    inferredCommuneName = woroMatch[1].trim();
  }

  if (normalizedType.includes('gbaka')) {
    normalizedMode = 'mini-car';
    normalizedType = 'gbaka';
  } else if (
    normalizedType.includes('woro') ||
    normalizedType.includes('wôrô')
  ) {
    normalizedMode = 'taxi';
    normalizedType = 'wôrô-wôrô';
  }

  const rawLine = name.split(':')[1]?.trim();
  if (!rawLine) {
    console.warn(`⚠️ Ligne introuvable dans le nom : ${name}`);
    return;
  }

  const regex = /(.+?)\s*↔\s*(.+)/;
  const match = regex.exec(rawLine);
  const startLabel = match?.[1] ?? '';
  const endLabel = match?.[2] ?? '';

  let startCommune = await findCommuneByContainedName(startLabel);
  let endCommune = await findCommuneByContainedName(endLabel);

  if (inferredCommuneName) {
    const inferredCommune = await findCommuneByExactNormalizedName(
      inferredCommuneName,
    );

    if (inferredCommune) {
      startCommune = inferredCommune;
      endCommune = inferredCommune;
    } else {
      console.warn(`⚠️ Commune extraite non trouvée : ${inferredCommuneName}`);
      return;
    }
  }

  if (!startCommune || !endCommune) {
    console.warn(`⚠️ Commune non trouvée pour : ${name}`);
    return;
  }

  const cityId = await getCityIdByName('abidjan');
  if (!cityId) {
    console.warn("❌ Ville 'abidjan' introuvable");
    return;
  }

  const normalizedOperator = normalizeText(operator).includes('divers')
    ? 'compagnie privée'
    : operator;

  const companyId = await getByNameInsensitive(
    orm.query.transportCompaniesTable,
    transportCompaniesTable.name,
    normalizedOperator,
  );

  const modeId = await getByNameInsensitive(
    orm.query.modes,
    modes.name,
    normalizedMode,
  );

  if (!modeId || !companyId) {
    console.warn(`❌ Mode ou compagnie introuvable pour ${name}`);
    return;
  }

  const typeId = await getTransportTypeId(normalizedType, companyId, modeId);

  if (!typeId) {
    console.warn(`❌ Type introuvable pour ${name}`);
    return;
  }

  const nameCleaned = `${startCommune.code}-${endCommune.code}${
    code ? `-${code}` : ''
  }`.toUpperCase();

  await orm.insert(transportLinesTable).values({
    name: nameCleaned,
    line: rawLine,
    line_number: code || null,
    opening_hours,
    mode_id: modeId,
    company_id: companyId,
    type_id: typeId,
    city_id: cityId,
    start_commune_id: startCommune.id,
    end_commune_id: endCommune.id,
    geometry_type: feature.geometry.type,
    geometry_coordinates: feature.geometry.coordinates,
    metadata_id: metadataId,
  });

  console.log(`✅ Insertion OK : ${nameCleaned}`);
}

export async function ingestAllFeatures(metadataId: string = 'default') {
  const lines = await ingestTransportData();

  for (const line of lines) {
    try {
      await ingestTransportFeature(
        {
          geometry: line.geometry,
          properties: {
            code: line.code,
            mode: line.mode,
            name: line.name,
            network: line.network,
            operator: line.operator,
            opening_hours: line.opening_hours,
          },
        },
        metadataId,
      );
    } catch (err) {
      console.error(`❌ Erreur sur ${line.name}:`, err);
    }
  }

  console.log(`✅ Ingestion terminée (${lines.length} lignes traitées)`);
}
