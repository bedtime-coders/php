import { z } from "@hono/zod-openapi";

export const CreateArticle = z.object({
  article: z.object({
    title: z.string(),
    description: z.string(),
    body: z.string(),
    tagList: z.array(z.string()).optional(),
  }),
});

export const UpdateArticle = z.object({
  article: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    body: z.string().optional(),
  }),
});

export const FavoriteArticle = z.object({
  slug: z.string(),
});

export const UnfavoriteArticle = z.object({
  slug: z.string(),
});

export type CreateArticle = z.infer<typeof CreateArticle>;
export type UpdateArticle = z.infer<typeof UpdateArticle>;
export type FavoriteArticle = z.infer<typeof FavoriteArticle>;
export type UnfavoriteArticle = z.infer<typeof UnfavoriteArticle>;
