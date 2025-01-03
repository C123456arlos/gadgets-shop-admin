'use server'
import { CategoriesWithProductsResponse } from "../app/admin/categories/categories.types";
import { createClient } from '@/src/supabase/server'
import slugify from 'slugify'
import { createCategorySchemaServer, updateCategorySchema } from "../app/admin/categories/create-category.schema";
export const getCategoriesWithProducts = async (): Promise<CategoriesWithProductsResponse> => {
    const supabase = createClient()
    const { data, error } = await (await supabase)
        .from('category').select('*, products:product(*)').returns<CategoriesWithProductsResponse>()
    if (error) throw new Error(`Error fetching categories: ${error.message}`)
    return data || []
}
export const imageUploadHandler = async (formData: FormData) => {
    const supabase = createClient()
    if (!formData) return
    const fileEntry = formData.get('file')
    if (!(fileEntry instanceof File)) throw new Error('expected a file')
    const fileName = fileEntry.name
    try {
        const { data, error } = await (await supabase).storage.from('app-images').upload(fileName, fileEntry, { cacheControl: '3600', upsert: false, })
        if (error) {
            console.error('error uploading image', error)
            throw new Error('error uploading image')
        }
        const { data: { publicUrl }, } = await (await supabase).storage.from('app-images').getPublicUrl(data.path)
        return publicUrl
    } catch (error) {
        console.error('error uploading image:', error)
        throw new Error('error uploading image')
    }
}
export const createCategory = async ({
    imageUrl,
    name
}: createCategorySchemaServer) => {
    const supabase = createClient()
    const slug = slugify(name, { lower: true })
    const { data, error } = await (await supabase).from('category').insert({
        name,
        imageUrl,
        slug
    })
    if (error) throw new Error(`error creating category: ${error.message}`)
    return data
}
export const updateCategory = async ({
    imageUrl, name, slug,
}: updateCategorySchema) => {
    const supabase = createClient()
    const { data, error } = await (await supabase).from('category').update({ name, imageUrl }).match({ slug })
    if (error) throw new Error(`error updating category: ${error.message}`)
}
export const deleteCategory = async (id: number) => {
    const supabase = createClient()
    const { error } = await (await supabase).from('category').delete().match({ id })
    if (error) throw new Error(`error deleting category: ${error.message}`)
}
export const getCategoryData = async () => {
    // @ts-ignore
    const { data, error } = (await supabase).from('category').select('name, products:product(id)')
    if (error) throw new Error(`error fetching category data: ${error.message}`)
    const categoryData = data.map((category: { name: string; products: { id: number }[] }) => ({
        name: category.name, products: category.products.length
    }))
    return categoryData
}