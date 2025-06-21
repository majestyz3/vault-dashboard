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
