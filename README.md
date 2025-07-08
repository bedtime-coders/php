<div align="center">
   <img src="./static/android-chrome-192x192.png" alt="PHp*" width="192" height="192">
<h1>
   PHp*
</h1>

[Prisma](https://www.prisma.io/) + [Hono](https://hono.dev/) + [pnpm](https://pnpm.io/) 

[![License](https://custom-icon-badges.demolab.com/github/license/bedtime-coders/phpstack?label=License&color=blue&logo=law&labelColor=0d1117&)](https://github.com/bedtime-coders/phpstack/blob/main/LICENSE)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Hono](https://custom-icon-badges.demolab.com/badge/Hono-1e1e20.svg?logo=honojs)](https://hono.dev/)
[![pnpm](https://custom-icon-badges.demolab.com/badge/pnpm-242526.svg?logo=pnpm)](https://pnpm.io/)
[![Biome](https://img.shields.io/badge/Biome-24272f?logo=biome&logoColor=f6f6f9)](https://biomejs.dev/)
[![Star](https://custom-icon-badges.demolab.com/github/stars/bedtime-coders/phpstack?logo=star&logoColor=373737&label=Star)](https://github.com/bedtime-coders/phpstack/stargazers/)

</div>

## PHp*: Prisma + Hono + pnpm

**PHp*** is a collection of bleeding-edge technologies to build modern web applications.

Including:

- **P**: [Prisma](https://www.prisma.io) - ORM
- **H**: [Hono](https://hono.dev) - HTTP Framework
- **p**: [pnpm](https://pnpm.io) - Package manager

## Development

1. Install dependencies

   ```bash
   pnpm install
   ```

2. Copy `.env.example` to `.env` and fill in the values

   ```bash
   cp .env.example .env
   ```

3. Push the database schema to the database

   ```bash
   pnpm db:push
   ```

4. Start the server

   ```bash
   pnpm dev
   ```

5. (Optional) Start the [database studio](https://www.prisma.io/studio)
   ```bash
   pnpm db:studio
   ```

## Testing

```bash
pnpm test
```

## Building for production

1. Build the app

   ```bash
   pnpm build
   ```

2. Run the production server (preview)

   ```bash
   pnpm preview
   ```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for more information, including how to set up your development environment.

---

<sup>*no relation to [PHP](https://www.php.net), the scripting language</sup>
