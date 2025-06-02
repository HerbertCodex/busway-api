/** @format */

import { existsSync, mkdirSync, writeFileSync } from 'fs';
import inquirer from 'inquirer';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

(async () => {
  const { moduleName, withClient, withSchedule, withDatabase } =
    await inquirer.prompt([
      {
        type: 'input',
        name: 'moduleName',
        message: '🧱 Nom du module Encore (ex: transport-ingest):',
        validate: input =>
          input.trim() !== '' || 'Le nom ne peut pas être vide.',
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
      {
        type: 'confirm',
        name: 'withDatabase',
        message: '💾 Ajouter des modèles de base de données (Drizzle) ?',
        default: false,
      },
    ]);

  const moduleDir = join(__dirname, '..', moduleName);

  if (existsSync(moduleDir)) {
    console.error('❌ Ce dossier de module existe déjà !');
    process.exit(1);
  }

  mkdirSync(moduleDir, { recursive: true });

  const baseFiles = {
    'encore.service.ts': `import { Service } from "encore.dev/service";

export default new Service("${moduleName}", {
  internal: false,
});
`,

    [`${moduleName}.api.ts`]: `import { encore } from "@encore.dev";
import { ${toTitleCase(moduleName)}Service } from "./${moduleName}.service";
import type { ${toTitleCase(moduleName)}Response } from "./${moduleName}.type";

const service = new ${toTitleCase(moduleName)}Service();

export const getStatus = encore.endpoint<void, ${toTitleCase(
      moduleName,
    )}Response>(
  {
    method: "GET",
    path: "/${moduleName}/status",
  },
  async () => {
    return service.getStatus();
  }
);`,

    [`${moduleName}.service.ts`]: `import type { ${toTitleCase(
      moduleName,
    )}Response } from "./${moduleName}.type";

export class ${toTitleCase(moduleName)}Service {
  async getStatus(): Promise<${toTitleCase(moduleName)}Response> {
    return {
      status: "ok",
      message: "Service ${moduleName} prêt ✅",
      timestamp: new Date().toISOString(),
    };
  }
}`,

    [`${moduleName}.type.ts`]: `// Types du module ${moduleName}
export interface ${toTitleCase(moduleName)}Response {
  status: "ok" | "error";
  message: string;
  timestamp: string;
}`,

    [`${moduleName}.test.ts`]: `import { describe, test, expect } from "vitest";
import { ${toTitleCase(moduleName)}Service } from "./${moduleName}.service";

describe("${moduleName} service", () => {
  const service = new ${toTitleCase(moduleName)}Service();

  test("getStatus renvoie un statut valide", async () => {
    const res = await service.getStatus();
    expect(res.status).toBe("ok");
    expect(res.message).toContain("${moduleName}");
    expect(res.timestamp).toBeDefined();
  });
});`,
  };

  const optionalFiles: Record<string, string> = {};

  if (withClient) {
    optionalFiles[`${moduleName}.client.ts`] = `import axios from "axios";
import { config } from "../common/config";

export class ${toTitleCase(moduleName)}Client {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = config.apiBaseUrl ?? "https://api.example.com";
  }

  async fetchData<T>(endpoint: string): Promise<T> {
    const { data } = await axios.get<T>(\`\${this.baseUrl}\${endpoint}\`);
    return data;
  }
}`;
  }

  if (withSchedule) {
    optionalFiles[
      `${moduleName}.schedule.ts`
    ] = `import { encore } from "@encore.dev";
import { ${toTitleCase(moduleName)}Service } from "./${moduleName}.service";

const service = new ${toTitleCase(moduleName)}Service();

export const ${moduleName.replace(/-/g, '')}DailyTask = encore.schedule(
  {
    cron: "@daily",
  },
  async () => {
    const result = await service.getStatus();
    console.log("[CRON] ${toTitleCase(moduleName)} status:", result);
  }
);`;
  }

  if (withDatabase) {
    optionalFiles[
      `${moduleName}.schema.ts`
    ] = `import { pgTable, uuid, timestamp, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const ${moduleName}Table = pgTable("${moduleName}", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  description: text(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

export const ${moduleName}Relations = relations(${moduleName}Table, ({ many }) => ({
  // Définir les relations ici
}));`;

    optionalFiles[
      `${moduleName}.repository.ts`
    ] = `import { eq } from "drizzle-orm";
import { drizzleDb } from "../../drizzle/orm";
import { ${moduleName}Table } from "./${moduleName}.schema";

export class ${toTitleCase(moduleName)}Repository {
  async findById(id: string) {
    return await drizzleDb
      .select()
      .from(${moduleName}Table)
      .where(eq(${moduleName}Table.id, id))
      .limit(1);
  }

  async create(data: Omit<typeof ${moduleName}Table.$inferInsert, "id" | "created_at" | "updated_at">) {
    return await drizzleDb
      .insert(${moduleName}Table)
      .values(data)
      .returning();
  }
}`;
  }

  const allFiles = { ...baseFiles, ...optionalFiles };

  Object.entries(allFiles).forEach(([filename, content]) => {
    const fullPath = join(moduleDir, filename);
    writeFileSync(fullPath, content);
  });

  console.log(
    `✅ Module "${moduleName}" créé avec succès dans ./${moduleName}`,
  );

  if (withDatabase) {
    console.log(
      "\n⚠️ N'oubliez pas de :\n" +
        '1. Ajouter vos tables dans drizzle/schema.ts\n' +
        '2. Créer une migration avec : npm run db:generate\n' +
        '3. Appliquer la migration avec : npm run db:migrate',
    );
  }
})();

// Helper pour mettre en Title Case
function toTitleCase(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}
