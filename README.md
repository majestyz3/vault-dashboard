# Vault Adoption Dashboard

A small dashboard that visualises Vault usage through a series of API calls. It provides a gamified way to track the adoption of recommended Vault features.

The interface is built with React and Vite. Lightweight SVG charts live under
`src/components/charts` and HTTP helpers in `src/api` retrieve data from Vault
and Prometheus.

## Prerequisites

* **Node.js >= 18** – required to run the development server and build steps.
* **npm** – comes bundled with Node.js.

Verify that your environment meets these requirements:

```bash
npm run prereqs
```

The script checks that Node.js is installed and that the major version is at least 18.

## Setup

Clone the repository and run the provided scripts:

```bash
git clone <repo-url>
cd vault-dashboard
npm run prereqs    # verifies Node.js version
bash scripts/stack.sh
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

Running `bash scripts/stack.sh` will perform these steps automatically before
starting the containerised stack.

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

A `docker-compose.yml` file is provided to run Vault, Prometheus and the
dashboard together. The stack exposes Vault on `8200`, Prometheus on `9090`
and the dashboard on `4173`.

`stack.sh` automatically installs dependencies, builds the dashboard and runs
`docker-compose` for you. If you prefer to start the stack manually, run:

```bash
docker-compose up --build
```

Environment variables from `.env` are passed to the dashboard at build time.

When you're finished, remove everything with:

```bash
bash scripts/unstack.sh
```

This stops the containers, removes the images and deletes local build
artifacts like `node_modules`, `dist` and `package-lock.json`.
