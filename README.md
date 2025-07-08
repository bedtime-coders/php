<div align="center">
  <h1>
      Project Title
  </h1>
  <a href="https://bun.sh/"><img src="https://img.shields.io/badge/Bun-14151a?logo=bun&logoColor=fbf0df" alt="bun" /></a>
  <a href="https://elysiajs.com/"><img src="https://custom-icon-badges.demolab.com/badge/ElysiaJS-0f172b.svg?logo=elysia" alt="elysia" /></a>
  <a href="https://drizzle.team/"><img src="https://img.shields.io/badge/Drizzle-C5F74F?logo=drizzle&logoColor=000" alt="drizzle" /></a>
  <a href="https://biomejs.dev/"><img src="https://img.shields.io/badge/Biome-24272f?logo=biome&logoColor=f6f6f9" alt="biome" /></a>
  <a href="https://scalar.com/"><img src="https://img.shields.io/badge/Scalar-080808?logo=scalar&logoColor=e7e7e7" alt="scalar" /></a>
  <!-- Badges instructions: -->     
  <!-- 1. uncomment the commented <a /> tag below -->
  <!-- 2. remove the duplicated LICENSE badge, only keeping yours -->
  <!-- 3. delete these instructions -->
  <a href="https://github.com/bedtime-coders/bedstack-start/blob/main/LICENSE"><img src="https://custom-icon-badges.demolab.com/github/license/bedtime-coders/bedstack-stripped?label=License&color=blue&logo=law&labelColor=0d1117" alt="license" /></a>
  <!--     <a href="https://github.com/repo-author/repo-name/blob/main/LICENSE"><img src="https://custom-icon-badges.demolab.com/github/license/repo-author/repo-name?label=License&color=blue&logo=law" alt="license" /></a> -->
  <br/><img src="./public/logo-mini.png" alt="bun" width="200"/>
  <p>A <a href="https://github.com/bedtime-coders/bedstack">Bedstack</a> application</p>
</div>

## Getting Started

1. Clone the repository / Click "Use this template"
2. Find-and-replace "repo-author" with the repository author (can be a username or an organization) 
3. Find-and-replace "repo-name" with the repository name 
4. Find-and-replace "project-name" with your project name
5. Find-and-replace "Project Title" with your project title
6. Follow `<!-- Badges instructions: -->` above (see raw code)
7. Edit `LICENSE` and add name + year
8. Remove this section

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
