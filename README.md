
# Nuxt + Directus Docker Template

This template repository provides a boilerplate setup for building a web application using Nuxt 4 for the frontend and Directus 11 for the backend, all containerized with Docker Compose.
It is designed to help you quickly get started with a modern web stack that is easy to deploy and manage.

## Why use this template?
This template aims to provide a solid foundation for building applications with Nuxt and Directus by offering:
- Pre-configured Docker Compose setup for easy local development and deployment
- Environment variable management for both frontend and backend
- Github actions workflows for CI/CD with deployments, backup and restoration scripts
- Composables and utilities for integrating Nuxt with Directus
- Nuxt Midleware to cache API requests in Redis
- A way to get a codefirst approach with Directus using migrations and versionned schema
- A hook to handle the changes in live preview and visual editor urls.

And some tools I like to use when working with this stack.

This template is made by me, for me. Documentation may be sparse in places but feel free to open an issue or ask question and I will try to complete the documentation as needed.

This template uses the "Simple CMS" template from directus as a starting point, used in this [directus' tutorial series](https://directus.io/docs/tutorials/projects/create-a-cms-using-directus-and-nuxt)
You can use the tutrials to get started and understand some of the structure, but I felt that some features where missing like :
- The redirections created in Directus where not handled in the frontend
- The publishedAt field wasn't used to publish in the future.
- etc

This template also updates both directus and nuxt to their latest major versions

## Disclaimer
This template is provided as-is without any warranties. Use at your own risk.
I'm using it for personal and client projects, but it may not be suitable for all use cases.

I'm trying to update this template regularly when using it across projects, but there may be occasional lapses in maintenance.

## Tech Stack

- **Backend:** Directus 11 (Docker, PostgreSQL in production)
- **Frontend:** Nuxt 4 (Vue.js, JavaScript/Typescript, SCSS)
- **CI/CD:** GitHub Actions, Docker Compose

---

## Prerequisites

- [Docker & Docker Compose](https://docs.docker.com/get-docker/) (recommended)
- Node.js 22+ and npm 10+ (for local frontend dev)
- See [docs/deployment.md](docs/deployment.md) for server requirements

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Norbz/nuxt-directus-docker-template.git
cd nuxt-directus-docker-template
```


### 2. Configure environment variables

- Copy and edit `api/.env.example` → `api/.env` for backend
- Copy and edit `frontend/.env.example` → `frontend/.env` for frontend
- Generate a secure secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

> **Note:** The [environments/README.md](environments/README.md) describes tools for setting up remote/server deployment environments in GitHub, not for local development. You do not need it for local setup.

### 3. Start with Docker (recommended)

```bash
docker-compose up
```

- Directus Admin: http://localhost:8055/admin
- Frontend: http://localhost:3000

**Default admin:** `admin@example.com` / `admin`  
⚠️ Change these credentials after first login!

### 4. Admin setup
- Go to http://localhost:8055/admin
- Use default admin credentials
- Create an admin token
- Push the schema (see below)
- Refresh the admin, and create an homepage (permalink = "/")

And you should good to go!

---


## Local Development (without Docker Compose for Frontend)

You can run the backend services (Directus, PostgreSQL, Redis) using Docker Compose, and run the Nuxt frontend dev server separately on your host machine. This allows for hot-reloading and a faster frontend development workflow.

Simply run
```bash
npm run dev
```

The frontend will be available at http://localhost:3000 and will connect to the Directus API at http://localhost:8055.

Make sure your `frontend/.env` contains:

```
NUXT_PUBLIC_DIRECTUS_URL=http://localhost:8055
```

Under the hood, this command simply start all docker services except for the fronte,d and run nuxt dev server.

---

## Apply the schema
This template uses a code-first approach for managing the Directus schema using migrations and is provided with a sample schema very close to the "SimpleCMS" template from Directus.

To apply the schema, run the following command:

```bash
npm run directus:push
```

This requires to have an admin token specified in the `DIRECTUS_ADMIN_TOKEN` environment variable in `api/.env`.
You can create one with the default admin user in the admin, or specify a default one with the ADMIN_TOKEN variable.
I don't like using the ADMIN_TOKEN variable because I log into the admin to checkup the first run anyway.

Alternately, you can push the schema by logging in with the admin email and password by running:

```bash
docker compose exec -T directus npx --yes directus-sync push --directus-url http://localhost:8055 --directus-email admin@example.com --directus-password your-password
```

The schema will be applied on each deployment by the GitHub Actions workflow as well.

The `directus:push` command will create or update collections, fields, relations, settings, policies, preset, flows, operations etc, but not the content itself.

## Saving the schema
To save the current Directus schema to the migrations files, run:

```bash
npm run directus:pull
```

Same considerations applies regarding the admin token as for `directus:push`.

## Release Please

This template comes pre-configured with [Release Please](https://github.com/googleapis/release-please-action)
and will trigger failed action runs when pushing commits to the main branch.

Either add a RELEASE_PLEASE_TOKEN secret to your repository, or delete the action if you don't intend to use it.

## Environment Variables

- Backend: see `api/.env.example`
- Frontend: see `frontend/.env.example`

For remote/server deployment environments, see [environments/README.md](environments/README.md).


## Scripts & Automation

- **Backup/restore:** See [scripts/README.md](scripts/README.md)
- **Deployment:** See [docs/deployment.md](docs/deployment.md)
- **Remote Environments (for server deployment):** See [environments/README.md](environments/README.md)

---

## Troubleshooting

- **Database permissions:** Ensure `api/database` is writable: `chmod -R 755 api/database`
- **Port conflicts:** Change ports in `docker-compose.yml` if needed
- **Reset admin password:** `docker-compose exec directus npx directus users passwd <admin-email>`
- More: [docs/deployment.md](docs/deployment.md)

---


## Documentation & More

- [Deployment Guide](docs/deployment.md)
- [Setting up a reverse proxy on your host](docs/reverse-proxies.md)
- [Backup/Restore Scripts](scripts/README.md)
- [Remote Environments Setup (for server deployment)](environments/README.md)
- [Directus Docs](https://docs.directus.io)

---

## License

ISC

