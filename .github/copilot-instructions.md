# nuxt + Directus Docker Template

This document provides guidelines and instructions for contributing to the Nuxt + Directus Docker Template project. It outlines the tech stack in use, project structure, best practices, and resources available to developers.

## Tech stack in use

Javascript will be used for both the backend and the frontend.

### Backend
- The backend will use Directus 11.x
- Data is stored in sqlite for development and postgresql in production
- There will be two environments: staging and production
- The backend will be deployed on a VPS using docker-compose
- Only the REST API will be used, no GraphQL
- Directus Schema will be managed using migrations and versionned
- Collection that are named "blocks_*" are components used in M2A relations to build pages, they have a corresponding component in the frontend

### Frontend
- The frontend will use Nuxt 4.x
- The frontend will be deployed on on a VPS using docker-compose
- the Blocks components matches the blocks_* collections in Directus, theyneed to be imported and registered in the blockToComponent function

### CI/CD
- Github Actions will be used for CI/CD
- The CI/CD will build and push the docker images to a container registry (github packages or docker hub)
- The CI/CD will also deploy the new images to the VPS using ssh and docker-compose
- Version control will be done using release-please

## Project structure
Be aware that this project contains both the backend and the frontend code.

- api/: contains the backend code (Directus extensions)
- frontend/: contains the frontend code (Nuxt app)
- frontend/package.json: contains the frontend dependencies
- .github/: contains the github actions workflows and copilot instructions


## Best practices
- Use meaningful commit messages following the conventional commits specification
- Write clean and maintainable code
- Write JSDoc comments for all functions and classes
- Unit tests are required, and are required to pass before PR
  - Unit tests should focus on core functionality
- End-to-end tests are required
  - End-to-end tests should focus on core functionality
  - End-to-end tests should validate accessibility
- Always follow good security practices
- Follow RESTful API design principles

## Resources

### MCP server
- You can interact with the backend with the "directus" mcp server listed in .vscode/mcp.json
- You can interact with the frontend with the "nuxt" mcp server listed in .vscode/mcp.json