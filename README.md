# Vault Adoption Dashboard

A small dashboard that visualises Vault usage through a series of API calls. It provides a gamified way to track the adoption of recommended Vault features.

## Prerequisites

* **Node.js >= 18** – required to run the development server and build steps.
* **npm** – comes bundled with Node.js.

Verify that your environment meets these requirements:

```bash
npm run prereqs
```

The script checks that Node.js is installed and that the major version is at least 18.

## Setup

Clone the repository and create a local environment file based on the provided example:

```bash
git clone <repo-url>
cd vault-dashboard
npm install
cp .env.example .env    # edit with your VAULT_ADDR and VAULT_TOKEN
```

## Development

Start a local dev server with hot module reload:

```bash
npm run dev
```

## Build

Create an optimised production build:

```bash
npm run build
```

Deploy the contents of the `dist` directory to the static host of your choice (for example Vercel or GitHub Pages).

## New Visualisations

The dashboard now includes several charts to illustrate adoption progress and operational metrics:

- **Category Progress Bars** – show completion of each feature group.
- **Adoption Over Time** – simple line graph driven by `data/adoptionHistory.json`.
- **Secrets Engine and Auth Method Donuts** – basic donut charts summarising enabled mounts and auth methods.
- **Leader Information** – displays the current Vault leader address.

API calls are made to `/v1/sys/mounts`, `/v1/sys/auth` and `/v1/sys/leader` via the new `vaultMetricsClient.ts` helper.

## Docker

A `Dockerfile` is included for containerised builds. To create the image and start the dashboard:

```bash
docker build -t vault-dashboard .
docker run --env-file .env -p 4173:4173 vault-dashboard
```

The site will be available at `http://localhost:4173`.

## Docker Compose

A `docker-compose.yml` file is provided to run the dashboard container. It reads
`VAULT_ADDR`, `VAULT_TOKEN` and `PROMETHEUS_ADDR` from your `.env` file so the
app can connect to an existing Vault instance.

Start the container with:

```bash
docker-compose up --build
```

Environment variables from `.env` are passed to the container at runtime.
