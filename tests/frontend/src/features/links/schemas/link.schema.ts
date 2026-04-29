import { z } from 'zod';

export const createLinkSchema = z.object({
  url: z
    .string()
    .min(1, 'URL é obrigatória')
    .url('Por favor, insira uma URL válida (ex: https://exemplo.com)'),
});

export type CreateLinkFormData = z.infer<typeof createLinkSchema>;
