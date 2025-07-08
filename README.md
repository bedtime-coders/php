<div align="center">
<h1>
   PHPStack
</h1>

[Prisma](https://www.prisma.io/) + [Hono](https://hono.dev/) + [pnpm](https://pnpm.io/) <sup>Absolutely no relation to the other PHP</sup>

[![License](https://custom-icon-badges.demolab.com/github/license/bedtime-coders/phpstack?label=License&color=blue&logo=law&labelColor=0d1117&)](https://github.com/bedtime-coders/phpstack/blob/main/LICENSE)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Hono](https://custom-icon-badges.demolab.com/badge/Hono-1e1e20.svg?logo=honojs)](https://hono.dev/)
[![pnpm](https://custom-icon-badges.demolab.com/badge/pnpm-242526.svg?logo=pnpm)](https://pnpm.io/)
[![Biome](https://img.shields.io/badge/Biome-24272f?logo=biome&logoColor=f6f6f9)](https://biomejs.dev/)
[![Star](https://custom-icon-badges.demolab.com/github/stars/bedtime-coders/phpstack?logo=star&logoColor=373737&label=Star)](https://github.com/bedtime-coders/phpstack/stargazers/)

</div>

## Bedstack: Bun + ElysiaJS + Drizzle Stack

**Bedstack** is a collection of bleeding-edge technologies to build modern web applications.

Including:

- **B**: [Bun](https://bun.sh) - Runtime + package manager, [Biome](https://biomejs.dev) - Code quality
- **E**: [ElysiaJS](https://elysiajs.com) - HTTP Framework
- **D**: [Drizzle](https://orm.drizzle.team) - ORM

## Development

1. Install dependencies

   ```bash
   bun install
   ```

2. Copy `.env.example` to `.env` and fill in the values

   ```bash
   cp .env.example .env
   ```

3. Push the database schema to the database

   ```bash
   bun db:push
   ```

4. Start the server

   ```bash
   bun dev
   ```

5. (Optional) Start the [database studio](https://orm.drizzle.team/drizzle-studio/overview)
   ```bash
   bun db:studio
   ```

## Testing

```bash
bun run test # Not `bun test`!
```

## Building for production

> [!TIP]
> See more info in ElysiaJS's [building for production](https://elysiajs.com/tutorial.html#build-for-production) guide.

1. Build the app

   ```bash
   bun run build # not `bun build`!
   ```

2. Run the production server (preview)

   ```bash
   bun preview
   ```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for more information, including how to set up your development environment.
