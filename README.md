# EBuddy Turborepo
Monorepo Web application managed by turborepo build system

## Installation
Make sure to install JDK version 11 or above to run the firebase emulator.

1. Install required libraries and packages from the project root
    ```
    npm install
    ```

2. Run the firebase emulator from the monorepo root
    ```
    npm run emulators:start
    ```
3. Run the backend service and nextjs web app locally
    ```
    npm run dev
    ```

## App Packages

- `backend-repo`: a backend service using express.js framework
- `frontend-repo`: Nextjs 15 web app  using app router

## Shared Packages

- `@repo/ui`: a stub React component library
- `@repo/entities`: shared collection of entities
- `@repo/helpers`: a shared collection of helper functions
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

## Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting