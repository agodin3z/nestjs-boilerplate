<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A NestJS API boilerplate using DDD + CQRS + Docker.</p>
    <p align="center">
<a href="https://nodejs.org/dist/v20.18.0/" target="_blank"><img src="https://img.shields.io/badge/node.js-20.18.0-6DA55F" alt="Node Version" /></a>
<a href="https://conventionalcommits.org" target="_blank"><img src="https://img.shields.io/badge/Conventional_Commits-1.0.0-yellow.svg" alt="Conventional Commits" /></a>
<a href="https://github.com/biomejs/biome" target="_blank"><img src="https://img.shields.io/badge/linted_with-biomejs-60a5fa.svg" alt="Linted with Biome" /></a>
<a href="https://github.com/prettier/prettier" target="_blank"><img src="https://img.shields.io/badge/styled_with-prettier-ff69b4.svg" alt="Styled with Prettier" /></a>
</p>

## Tech Stack

|                                                 Name | Description                                                                                             |
| ---------------------------------------------------: | :------------------------------------------------------------------------------------------------------ |
|                        [NestJS](https://nestjs.com/) | A progressive Node.js framework for building efficient, reliable and scalable server-side applications. |
|                    [Docker](https://www.docker.com/) | A platform designed to help developers build, share, and run modern applications.                       |
|           [Husky](https://typicode.github.io/husky/) | Git hooks made easy dog woof!                                                                           |
|                        [Biome](https://biomejs.dev/) | Format, lint, and more in a fraction of a second. code.                                                 |
|                     [Prettier](https://prettier.io/) | An opinionated code formatter.                                                                          |
| [Lint Staged](https://github.com/okonet/lint-staged) | Run linters on git staged files.                                                                        |

<!-- |                           [Jest](https://jestjs.io/) | Delightful JavaScript Testing Framework with a focus on simplicity.                                     | -->
<!-- |     [Automock](https://github.com/automock/automock) | Standalone Library for Automated Mocking of Class Dependencies.                                         | -->

## Prerequisites

- [Volta](https://volta.sh/)\* - a node/npm version manager
- [Docker](https://docs.docker.com/desktop/)\*\* - An one-click-install application that enables you to build and share containerized applications and microservices.
  - [Docker Compose](https://docs.docker.com/compose/install/) - Plugin for running multi-container Docker applications

> \* _Alternatives to Volta: [n](https://github.com/tj/n) or [nvm](https://github.com/nvm-sh/nvm)_

> \*\* _"Alternative" to Docker: [orbstack](https://github.com/orbstack/orbstack)_

## Getting Started

### Enviroment config

Create a copy of `.env.example` with the name `.env` and placed it at the root of the project

```bash
  cp .env.example .env
```

Replace its values with your own credentials.

### Install Dependencies

Run the following commands to install all dependencies:

```bash
  volta install node
  volta install npm@bundled
  npm i
```

## Development server

Run `npm run start:dev` to start a development server that watch for changes. For a debug server use: `npm run start:debug`

## Build for production

Run `npm run build` to compile for production. Then run `npm run start:prod` to start a production server.

> Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

## Using Dockerfile

Run `make dev` to build and start development docker containers from `docker-compose-dev.yml`, or run `make deploy` to build and start production docker containers from `docker-compose.yml`.

## Project Folder Structure

```
.
└── nestjs-cqrs-boilerplate     # Project root
    ├── .husky/                 # Git hooks
    ├── .vscode/                # VSCode settings & recommended extensions
    ├── dist/                   # API compilation
    ├── node_modules/           # NPM Packages
    ├── src/                    # Source: DDD + Clean Arch + CQRS
    │   ├── application/        # Application Layer: Commands, Queries & Events
    │   ├── domain/             # Domain Layer: Services, Entities, etc
    │   ├── infraestructure/    # Infraestructure Layer: Server Config, Envs, Adapters, etc
    │   └── interface/          # Interface Layer: Interfaces, Controllers, Dtos, etc
    └── test/                   # Test files
```

## Scripts API Reference

### Server

| Script                | Description                    |
| :-------------------- | :----------------------------- |
| `npm run start`       | Start server (without watch)   |
| `npm run start:dev`   | Start development server       |
| `npm run start:debug` | Start debug development server |
| `npm run start:prod`  | Start production server        |

### Build

| Script          | Description   |
| :-------------- | :------------ |
| `npm run build` | Build project |

### Lint & Format

| Script             | Description                             |
| :----------------- | :-------------------------------------- |
| `npm run format`   | Format files with Prettier              |
| `npm run check`    | Lint, format and apply fixes with Biome |
| `npm run lint`     | Lint files with Biome                   |
| `npm run lint:fix` | Lint & fix files with Biome             |
| `npm run lint:ts`  | Check typescript files                  |

### Misc

| Script            | Description                                  |
| :---------------- | :------------------------------------------- |
| `npm run prepare` | Install Husky git hooks                      |
| `make dev`        | Build & start development server with docker |
| `make deploy`     | Build & start production server with docker  |

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
