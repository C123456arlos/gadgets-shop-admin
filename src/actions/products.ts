'use server'
import slugify from 'slugify'
import { createClient } from '@/src/supabase/server'
import { ProductsWithCategoriesResponse, UpdateProductSchema } from '@/src/app/admin/products/products.types'
import { CreateProductSchemaServer } from '@/src/app/admin/products/schema'
export const getProductsWithCategories = async (): Promise<ProductsWithCategoriesResponse> => {
    const supabase = createClient()
    const { data, error } = await (await supabase).from('product').select('*, category:category(*)').returns<
        ProductsWithCategoriesResponse>()
    if (error) {
        throw new Error(`error fetching products with categories: ${error.message}`)
    }
    return data || []
}
export const createProduct = async ({
    category, heroImage, images, maxQuantity, price, title
}: CreateProductSchemaServer) => {
    const supabase = createClient()
    const slug = slugify(title, { lower: true })
    const { data, error } = await (await supabase).from('product').insert({
        category, heroImage, imagesUrl: images, maxQuantity, price, slug, title
    })
    if (error) { throw new Error(`error creating product: ${error.message}`) }
    return data
}
export const updateProduct = async ({
    category, heroImage, imagesUrl, maxQuantity, price, slug, title
}: UpdateProductSchema) => {
    const supabase = createClient()
    const { data, error } = await (await supabase).from('product').update({ category, heroImage, imagesUrl, maxQuantity, price, title }).match({ slug })
    if (error) { throw new Error(`error updating product: ${error.message}`) }
    return data
}
export const deleteProduct = async (slug: string) => {
    const supabase = createClient()
    const { error } = await (await supabase).from('product').delete().match({ slug })
    if (error) {
        throw new Error(`error deleting products: ${error.message}`)
    }
}
