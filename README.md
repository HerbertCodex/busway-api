<!-- @format -->

# Busway API

This API provides data about transport lines and uses a pub/sub system to communicate with a Kotlin mobile app, allowing the app to update its local database.

## Prérequis

**Installer Encore :**

- **macOS :** `brew install encoredev/tap/encore`
- **Linux :** `curl -L https://encore.dev/install.sh | bash`
- **Windows :** `iwr https://encore.dev/install.ps1 | iex`

**Docker :**

1.  [Installer Docker](https://docker.com)
2.  Démarrer Docker

## Créer une application

Créer une application locale à partir de ce modèle :

```bash
encore app create my-app-name --example=ts/url-shortener
```

## Créer un module Encore

```bash
npm run gen:module
```

## Ajouter une variable d'environnement

```bash
npm run add:env
```

## Exécuter l'application localement

Avant d'exécuter votre application, assurez-vous que Docker est installé et en cours d'exécution. Ensuite, exécutez cette commande depuis le dossier racine de votre application :

```bash
encore run
```

## Utilisation de l'API

Voici quelques exemples d'utilisation de l'API :

### Récupérer une liste paginée de villes

```bash
curl "http://localhost:4000/cities?page=1&pageSize=10"
```

### Déclencher l'ingestion des données de transport (preview)

```bash
curl "http://localhost:4000/transport-ingest"
```

### Déclencher l'ingestion complète des données de transport

```bash
curl -X POST "http://localhost:4000/transport-ingest"
```

## Ouvrir le tableau de bord développeur

Pendant que `encore run` est en cours d'exécution, ouvrez [http://localhost:9400](http://localhost:9400) pour accéder au [tableau de bord développeur local](https://encore.dev/docs/ts/observability/dev-dash) d'Encore.

Vous pouvez y consulter la documentation de l'API, effectuer des requêtes dans l'explorateur d'API et afficher les traces des réponses.

## Se connecter aux bases de données

Vous pouvez vous connecter à vos bases de données via le shell psql :

```bash
encore db shell <nom-de-la-base-de-données> --env=local --superuser
```

Pour en savoir plus, consultez la [documentation CLI](https://encore.dev/docs/ts/cli/cli-reference#database-management).

## Déploiement

### Auto-hébergement

Consultez les [instructions d'auto-hébergement](https://encore.dev/docs/ts/self-host/build) pour savoir comment utiliser `encore build docker` afin de créer une image Docker et de la configurer.

### Plateforme Cloud Encore

Déployez votre application dans un environnement de staging gratuit dans le cloud de développement d'Encore en utilisant `git push encore` :

```bash
git add -A .
git commit -m 'Message de commit'
git push encore
```

Vous pouvez également ouvrir votre application dans le [Tableau de bord Cloud](https://app.encore.dev) pour l'intégrer à GitHub, ou connecter votre compte AWS/GCP, ce qui permet à Encore de gérer automatiquement les déploiements cloud pour vous.

## Lien vers GitHub

Suivez ces étapes pour lier votre application à GitHub :

1.  Créez un dépôt GitHub, committez et poussez l'application.
2.  Ouvrez votre application dans le [Tableau de bord Cloud](https://app.encore.dev).
3.  Allez dans **Paramètres ➔ GitHub** et cliquez sur **Lier l'application à GitHub** pour lier votre application à GitHub et sélectionnez le dépôt que vous venez de créer.
4.  Pour configurer Encore afin de déclencher automatiquement les déploiements lorsque vous poussez vers un nom de branche spécifique, allez dans la page **Aperçu** de votre environnement prévu. Cliquez sur **Paramètres**, puis dans la section **Branch Push**, configurez le **Nom de la branche** et cliquez sur **Enregistrer**.
5.  Committez et poussez une modification vers GitHub pour déclencher un déploiement.

[Pour en savoir plus, consultez la documentation](https://encore.dev/docs/platform/integrations/github)

## Tests

Pour exécuter les tests, configurez la commande `test` dans votre `package.json` avec le lanceur de tests de votre choix, puis utilisez la commande `encore test` depuis la CLI. La commande `encore test` met en place toute l'infrastructure nécessaire en mode test avant de passer la main au lanceur de tests. [Pour en savoir plus](https://encore.dev/docs/ts/develop/testing)

```bash
encore test
```

## Structure du Projet

- `drizzle`: Contains elements for the Drizzle ORM.
- `src`: Contains the project files.
- `scripts_encore`: Contains custom scripts.

## Dépendances Principales

- `Drizzle ORM`: Used for database queries.

## Pour les Développeurs

To contribute to this project, follow these steps:

1.  Install Encore and Docker (see "Prérequis" section).
2.  Create a local app from this template (see "Créer une application" section).
3.  Run `npm install` to install the project dependencies.
4.  Configure the environment variables (if needed).
5.  Run `encore run` to start the application locally.
6.  Make your changes and submit a pull request.

## Utilisation d'Encore.dev

Encore.dev is the framework used to build this application.
