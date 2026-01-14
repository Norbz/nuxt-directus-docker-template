# Changelog

## [0.1.0](https://github.com/Norbz/nuxt-directus-docker-template/compare/nuxt-directus-docker-template-v0.0.1...nuxt-directus-docker-template-v0.1.0) (2026-01-14)


### 🚀 New Features

* Added a tool that scaffolds "blocks" components based on the direcgtus types ([2b53466](https://github.com/Norbz/nuxt-directus-docker-template/commit/2b53466cea9e151fbe3b0115fb9cb1a2561acee9))
* Added Directus type generation ([2b53466](https://github.com/Norbz/nuxt-directus-docker-template/commit/2b53466cea9e151fbe3b0115fb9cb1a2561acee9))
* Added useNavigation and useGlobals composable ([2b53466](https://github.com/Norbz/nuxt-directus-docker-template/commit/2b53466cea9e151fbe3b0115fb9cb1a2561acee9))
* Adding a hook on schema pull/push to handle visual editor and live preview URLs changes between environments ([aacee5f](https://github.com/Norbz/nuxt-directus-docker-template/commit/aacee5fed97279de52f45e2e4117623e6882156f))
* Adding a page middleware to handle redirect and cache response in redis for 15min (see in nuxt.config.js) ([aacee5f](https://github.com/Norbz/nuxt-directus-docker-template/commit/aacee5fed97279de52f45e2e4117623e6882156f))
* Adding backup, restore and other tool scripts as well as GH Actions ([aacee5f](https://github.com/Norbz/nuxt-directus-docker-template/commit/aacee5fed97279de52f45e2e4117623e6882156f))
* Adding redirect handler ([aacee5f](https://github.com/Norbz/nuxt-directus-docker-template/commit/aacee5fed97279de52f45e2e4117623e6882156f))
* Adding several composable to work with directus ([aacee5f](https://github.com/Norbz/nuxt-directus-docker-template/commit/aacee5fed97279de52f45e2e4117623e6882156f))


### 🔥 Bug Fixes

* **api:** Removed the condition on publishedDate on pages for public role as it is now handled by flows ([19cead3](https://github.com/Norbz/nuxt-directus-docker-template/commit/19cead36f8b196549908fdce8a681af12fbe8ff8))
* Fixed an error in the returned JSON on the healthcheck route ([999f1fc](https://github.com/Norbz/nuxt-directus-docker-template/commit/999f1fcf0161b99c1e85c3ffe3d1018507e99053))
* Improved error handling ([a635306](https://github.com/Norbz/nuxt-directus-docker-template/commit/a6353062a2f05953b9a6c6aca007a4af810001cc))
* Running docker and dev server with concurrently to allow killing the docker processes when exiting terminal ([bd52eb2](https://github.com/Norbz/nuxt-directus-docker-template/commit/bd52eb2f771231ccc29eb26d776cf7d9ffe62432))


### 📚 Documentation

* Added a paragraph about release please and necessary token ([77e90b5](https://github.com/Norbz/nuxt-directus-docker-template/commit/77e90b5ed9bf7b4f53b7bd4d55234af8a877cf5d))
* Sumed up the readme a bit, added more info on how to get started ([19cead3](https://github.com/Norbz/nuxt-directus-docker-template/commit/19cead36f8b196549908fdce8a681af12fbe8ff8))


### ⚙️ Chores

* Configured nuxt-img to use directus ([2b53466](https://github.com/Norbz/nuxt-directus-docker-template/commit/2b53466cea9e151fbe3b0115fb9cb1a2561acee9))
* Importing Directus and Nuxt scaffolded project ([aacee5f](https://github.com/Norbz/nuxt-directus-docker-template/commit/aacee5fed97279de52f45e2e4117623e6882156f))
