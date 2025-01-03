import { getCategoriesWithProducts } from "@/src/actions/categories"
import CategoryPageComponent from "@/src/app/admin/categories/page-component"
export default async function Categories() {
    const categories = await getCategoriesWithProducts()
    return <CategoryPageComponent categories={categories}></CategoryPageComponent>
}
