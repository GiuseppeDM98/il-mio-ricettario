import * as z from 'zod';

export const RecipeSchema = z.object({
  title: z.string().min(3, { message: 'Il titolo deve avere almeno 3 caratteri' }),
  description: z.string().optional(),
  servings: z.number().min(1).optional(),
  prepTime: z.number().min(0).optional(),
  cookTime: z.number().min(0).optional(),
});