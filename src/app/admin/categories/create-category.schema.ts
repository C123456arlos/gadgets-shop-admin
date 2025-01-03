import { z } from 'zod'
export const createCategorySchema = z.object({
    image: z.any().refine(file => file.length === 1, 'image is required'),
    name: z.string().min(2, { message: 'name must be at least 2 characacters long' }),
    intent: z.enum(['create', 'update'], { message: 'intent must be create or update' }).optional(),
    slug: z.string().optional()
})
export type CreateCategorySchema = z.infer<typeof createCategorySchema>
export const createCategorySchemaServer = z.object({
    imageUrl: z.string().min(1, { message: 'image is required' }),
    name: z.string().min(2, { message: 'name must be at least 2 characacters long' }),
})
export type createCategorySchemaServer = z.infer<typeof createCategorySchemaServer>
export const updateCategorySchema = z.object({
    imageUrl: z.string().min(1, { message: 'image is required' }),
    name: z.string().min(2, { message: 'name must be at least 2 characters left' }),
    intent: z.enum(['create', 'update'], {
        message: 'intent must be either create or update',
    }),
    slug: z.string().min(1, { message: 'slug is required' })
})
export type updateCategorySchema = z.infer<typeof updateCategorySchema>
