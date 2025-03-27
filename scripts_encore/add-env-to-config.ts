/** @format */

import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'fs';
import inquirer from 'inquirer';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

(async () => {
  const { envVars } = await inquirer.prompt([
    {
      type: 'input',
      name: 'envVars',
      message:
        '🔑 Entrez les clés des variables d’environnement (ex: API_KEY,DB_URL):',
      validate: input =>
        input.trim() !== '' || 'Tu dois entrer au moins une clé.',
    },
  ]);

  const rawKeys = envVars
    .split(',')
    .map((k: string) => k.trim())
    .filter(Boolean);

  if (rawKeys.length === 0) {
    console.log('❌ Aucune variable à ajouter.');
    return;
  }

  // 📍 On demande si chaque variable est requise
  const answers = await inquirer.prompt(
    rawKeys.map((key: string) => ({
      type: 'confirm',
      name: key,
      message: `❓ "${key}" est-elle requise ?`,
      default: true,
    })),
  );

  const keys: { key: string; required: boolean }[] = rawKeys.map(
    (key: string) => ({
      key,
      required: answers[key] as boolean,
    }),
  );

  const configPath = join(__dirname, '..', 'common', 'config.ts');
  const envPath = join(__dirname, '..', '.env');

  const toCamel = (str: string): string =>
    str.toLowerCase().replace(/_([a-z])/g, (_, l) => l.toUpperCase());

  const configAlreadyHasKey = (configContent: string, key: string): boolean => {
    const regex = new RegExp(`${toCamel(key)}:\\s+getEnv\\(["'\`]${key}["'\`]`);
    return regex.test(configContent);
  };

  // ✨ 1. Mise à jour ou création de common/config.ts
  if (!existsSync(configPath)) {
    const base = `// common/config.ts

function getEnv(key: string, required = true): string {
  const value = process.env[key];
  if (!value && required) {
    throw new Error(\`❌ La variable d'environnement "\${key}" est requise mais manquante.\`);
  }
  return value ?? "";
}

export const config = {
${keys
  .map(({ key, required }) => {
    const arg = required ? '' : ', false';
    return `  ${toCamel(key)}: getEnv("${key}"${arg}),`;
  })
  .join('\n')}
};
`;
    mkdirSync(join(__dirname, '..', 'common'), { recursive: true });
    writeFileSync(configPath, base);
    console.log(
      '✅ Fichier common/config.ts créé avec :',
      keys.map(k => k.key).join(', '),
    );
  } else {
    let content = readFileSync(configPath, 'utf-8');

    const insert = keys
      .filter(({ key }) => !configAlreadyHasKey(content, key))
      .map(({ key, required }) => {
        const arg = required ? '' : ', false';
        return `  ${toCamel(key)}: getEnv("${key}"${arg}),`;
      })
      .join('\n');

    if (!insert) {
      console.log('ℹ️ Aucune variable nouvelle à ajouter dans config.ts');
    } else if (content.includes('export const config = {')) {
      content = content.replace(
        /export const config = \{([\s\S]*?)\n\};/,
        (match, inner) =>
          `export const config = {\n${inner.trimEnd()}\n${insert}\n};`,
      );
      writeFileSync(configPath, content);
      console.log(
        '✅ Variables ajoutées à common/config.ts :',
        keys.map(k => k.key).join(', '),
      );
    } else {
      console.warn(
        '⚠️ Structure inconnue dans common/config.ts — rien modifié.',
      );
    }
  }

  // 📄 2. Mise à jour du .env
  let envContent = existsSync(envPath) ? readFileSync(envPath, 'utf-8') : '';
  let newEnvLines: string[] = [];

  keys.forEach(({ key }) => {
    const alreadyExists = envContent.includes(`${key}=`);
    if (!alreadyExists) {
      newEnvLines.push(`${key}=`);
    }
  });

  if (newEnvLines.length > 0) {
    appendFileSync(
      envPath,
      `\n\n# === Variables ajoutées automatiquement ===\n${newEnvLines.join(
        '\n',
      )}\n`,
    );
    console.log(
      `✅ Variables ajoutées à .env : ${newEnvLines.length} nouvelle(s)`,
    );
  } else {
    console.log('ℹ️ Toutes les variables sont déjà présentes dans .env');
  }
})();
