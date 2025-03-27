/** @format */

import { existsSync, mkdirSync, writeFileSync } from 'fs';
import inquirer from 'inquirer';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

(async () => {
  const { moduleName, withClient, withSchedule } = await inquirer.prompt([
    {
      type: 'input',
      name: 'moduleName',
      message: '🧱 Nom du module Encore (ex: transport-ingest):',
      validate: input => input.trim() !== '' || 'Le nom ne peut pas être vide.',
    },
    {
      type: 'confirm',
      name: 'withClient',
      message: '📡 Ajouter un fichier client.ts (pour appels API externes) ?',
      default: false,
    },
    {
      type: 'confirm',
      name: 'withSchedule',
      message: '⏰ Ajouter un fichier schedule.ts (tâche planifiée) ?',
      default: false,
    },
  ]);

  // 📁 Créer le dossier directement à la racine
  const moduleDir = join(__dirname, '..', moduleName);

  if (existsSync(moduleDir)) {
    console.error('❌ Ce dossier de module existe déjà !');
    process.exit(1);
  }

  mkdirSync(moduleDir, { recursive: true });

  const baseFiles = {
    'encore.service.ts': `import { Service } from "encore.dev/service";

export default new Service("${moduleName}");
`,

    [`${moduleName}.api.ts`]: `import { encore } from "@encore.dev";
import { exampleService } from "./${moduleName}.service";

export const exampleEndpoint = encore.endpoint(
  {
    method: "GET",
    path: "/${moduleName}/ping",
  },
  async () => {
    return exampleService();
  }
);`,

    [`${moduleName}.service.ts`]: `export function exampleService() {
  return { message: "Service ${moduleName} prêt ✅" };
}`,

    [`${moduleName}.type.ts`]: `// Types du module ${moduleName}
export interface ExampleType {
  id: string;
  name: string;
}`,

    [`${moduleName}.test.ts`]: `import { test, expect } from "vitest";
import { exampleService } from "./${moduleName}.service";

test("exampleService renvoie un message", () => {
  const res = exampleService();
  expect(res.message).toContain("${moduleName}");
});`,
  };

  const optionalFiles: Record<string, string> = {};

  if (withClient) {
    optionalFiles[
      `${moduleName}.client.ts`
    ] = `// Appels API externes pour ${moduleName}
import axios from "axios";

export async function exampleFetch() {
  const { data } = await axios.get("https://api.example.com");
  return data;
}`;
  }

  if (withSchedule) {
    optionalFiles[
      `${moduleName}.schedule.ts`
    ] = `import { encore } from "@encore.dev";
import { exampleService } from "./${moduleName}.service";

export const ${moduleName.replace(/-/g, '')}Cron = encore.schedule(
  {
    cron: "@daily",
  },
  async () => {
    const result = exampleService();
    console.log("[CRON] Résultat :", result);
  }
);`;
  }

  const allFiles = { ...baseFiles, ...optionalFiles };

  Object.entries(allFiles).forEach(([filename, content]) => {
    const fullPath = join(moduleDir, filename);
    writeFileSync(fullPath, content);
  });

  console.log(
    `✅ Module "${moduleName}" créé avec succès dans ./${moduleName}`,
  );
})();

// Helper pour mettre en Title Case
function toTitleCase(str: string): string {
  return str.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}
