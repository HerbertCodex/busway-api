/** @format */

import { APIError, ErrCode } from 'encore.dev/api';
import log from 'encore.dev/log';
import { orm } from '../../database';
import { modesTable, transportCompaniesTable } from '../../drizzle/schema';
import { slugify } from '../../drizzle/seed';
import { normalizeText } from '../common/normalizeText';
import { fetchTransportGeoJson } from './transport-line-action.client';
import {
  findCommuneByContainedName,
  findCommuneByExactNormalizedName,
  getByNameInsensitive,
  getCityIdByName,
  getTransportTypeId,
} from './transport-line-action.helpers';
import {
  GEOJSON_FEATURE_COLLECTION,
  GEOJSON_MULTILINESTRING,
  ITransportLineDownloadResponse,
  TTransportFeature,
} from './transport-line-action.model';
import {
  ITransportLineRepository,
  PGTransportLineRepository,
} from './transport-line-action.repository';

const transportLineRepo: ITransportLineRepository =
  new PGTransportLineRepository();

export async function ingestTransportData(): Promise<
  ITransportLineDownloadResponse[]
> {
  try {
    const geojson = await fetchTransportGeoJson();

    if (geojson.type !== GEOJSON_FEATURE_COLLECTION) {
      throw new Error(
        'Le fichier GeoJSON doit être une collection de features',
      );
    }

    let ignored = 0;

    const lines = geojson.features.reduce(
      (acc: ITransportLineDownloadResponse[], feature) => {
        if (feature.geometry.type !== GEOJSON_MULTILINESTRING) {
          ignored++;
          log.warn(`⛔️ Feature ignorée (geometry: ${feature.geometry.type})`);
          return acc;
        }

        const {
          name = '',
          code = '',
          operator = '',
          network = '',
          mode = '',
          opening_hours = '',
        } = feature.properties ?? {};

        acc.push({
          name,
          code,
          operator,
          network,
          mode,
          opening_hours,
          geometry: feature.geometry,
        });

        return acc;
      },
      [],
    );

    log.info(
      `✅ ${lines.length} lignes valides extraites, ${ignored} ignorées`,
    );

    return lines;
  } catch (error) {
    log.error(error, 'Erreur lors de l’ingestion des données de transport');
    throw new APIError(
      ErrCode.Internal,
      'Erreur lors de l’ingestion des données de transport',
    );
  }
}

export async function ingestTransportFeature(
  feature: TTransportFeature,
  metadataId: string,
): Promise<void> {
  const {
    code = '',
    mode,
    name,
    network,
    opening_hours = '',
    operator,
  } = feature.properties;

  // Normalisation des valeurs
  let normalizedMode = normalizeText(mode);
  const rawType = network.split('/').pop()?.trim() ?? network;
  let normalizedType = normalizeText(rawType);

  let inferredCommuneName: string | undefined;

  // Extraction de la commune depuis le réseau (ex: "woro-woro de/d' XXX")
  const woroRegex = /woro[-\s]?woro\s+(?:de|du|d['’])\s*([\wÀ-ÿ'-\s]+)/i;
  const woroMatch = woroRegex.exec(network);
  if (woroMatch) {
    inferredCommuneName = woroMatch[1].trim();
  }

  // Cas particuliers sur le type de transport
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

  // Extraction de la ligne depuis le nom
  const rawLine = name.split(':')[1]?.trim();
  if (!rawLine) {
    console.warn(`⚠️ Ligne introuvable dans le nom : ${name}`);
    return;
  }

  // Extraction des labels de départ et d’arrivée
  const regex = /(.+?)\s*↔\s*(.+)/;
  const match = regex.exec(rawLine);
  const startLabel = match?.[1] ?? '';
  const endLabel = match?.[2] ?? '';

  // Lancer en parallèle la recherche des communes et la récupération de la ville
  const [startCommune, endCommune, cityId] = await Promise.all([
    findCommuneByContainedName(startLabel),
    findCommuneByContainedName(endLabel),
    getCityIdByName('abidjan'),
  ]);

  let finalStartCommune = startCommune;
  let finalEndCommune = endCommune;

  // Si une commune est explicitement extraite depuis network
  if (inferredCommuneName) {
    const inferredCommune = await findCommuneByExactNormalizedName(
      inferredCommuneName,
    );
    if (inferredCommune) {
      finalStartCommune = inferredCommune;
      finalEndCommune = inferredCommune;
    } else {
      console.warn(`⚠️ Commune extraite non trouvée : ${inferredCommuneName}`);
      return;
    }
  }

  const slug = slugify(name);
  if (!finalStartCommune || !finalEndCommune) {
    console.warn(`⚠️ Commune non trouvée pour : ${slug}`);
    return;
  }

  if (!cityId) {
    console.warn("❌ Ville 'abidjan' introuvable");
    return;
  }

  // Normalisation de l’opérateur et recherche des identifiants en parallèle
  const normalizedOperator = normalizeText(operator).includes('divers')
    ? 'compagnie privée'
    : operator;

  const [companyId, modeId] = await Promise.all([
    getByNameInsensitive(
      orm.query.transportCompaniesTable,
      transportCompaniesTable.name,
      normalizedOperator,
    ),
    getByNameInsensitive(orm.query.modesTable, modesTable.name, normalizedMode),
  ]);

  if (!companyId || !modeId) {
    console.warn(`❌ Mode ou compagnie introuvable pour ${slug}`);
    return;
  }

  const typeId = await getTransportTypeId(normalizedType, companyId, modeId);
  if (!typeId) {
    console.warn(`❌ Type introuvable pour ${slug}`);
    return;
  }

  await transportLineRepo.createTransportLine({
    slug,
    line: rawLine,
    line_number: code || null,
    opening_hours,
    company_id: companyId,
    transport_type_id: typeId,
    city_id: cityId,
    start_commune_id: finalStartCommune.id,
    end_commune_id: finalEndCommune.id,
    geometry: feature.geometry,
    metadata_id: metadataId,
  });
  console.log(`✅ Ligne ${slug} ingérée avec succès`);
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
