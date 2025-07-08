# Contributing

Thank you for your interest in contributing!

## Prerequisites

- [Node.js](https://nodejs.org/) is required to run the project. This project was tested on `v22.13.0`.
- We use [pnpm](https://pnpm.io/) as our package manager. Please make sure you have it installed before you start.

## Development

### Setup

1. Clone the repository
2. Run `pnpm install` to install the dependencies
3. Create a `.env` file by copying the `.env.example` file and filling in the values
   ```bash
   cp .env.example .env
   ```
4. Run `pnpm db:push` to [push the database schema to the database](https://orm.drizzle.team/docs/drizzle-kit-push)
5. (Optional) Run `pnpm db:seed` to seed the database
6. Run `pnpm dev` to start the development server

### Linting and Formatting

We use [Biome](https://biomejs.dev/) for linting and formatting.

To run the linter and formatter, run `pnpm fix`.
