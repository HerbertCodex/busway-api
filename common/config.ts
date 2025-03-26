/** @format */

function getEnv(key: string, required = true): string {
  const value = process.env[key];
  if (!value && required) {
    throw new Error(
      `❌ La variable d'environnement "${key}" est requise mais manquante.`,
    );
  }
  return value ?? '';
}

export const config = {
  // Link to the metadata of the transport API
  transportMetadataUrl: getEnv('TRANSPORT_METADATA_URL'),
};
