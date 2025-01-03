'use client'
import { FC, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { PlusCircle, PlusIcon } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuid } from 'uuid';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { CategoryTableRow } from '@/components/ui/category';
import {
    createCategorySchema,
    CreateCategorySchema,
} from '@/src/app/admin/categories/create-category.schema';
import { CategoriesWithProductsResponse } from '@/src/app/admin/categories/categories.types'
import { CategoryForm } from '@/src/app/admin/categories/category-form';
import { Category } from '@/src/app/admin/categories/categories.types';
// import {
//     createCategory,
//     deleteCategory,
//     imageUploadHandler,
//     updateCategory,
// } from '@/actions/categories';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createCategory, deleteCategory, imageUploadHandler, updateCategory } from '@/src/actions/categories';
import { ProductsWithCategoriesResponse } from './products.types';
import { CreateOrUpdateProductSchema, createOrUpdateProductsSchema } from './schema';
import { createProduct, deleteProduct, updateProduct } from '@/src/actions/products';
import { ProductTableRow } from './product-table-row';
import { ProductForm } from "./product-form";
type Props = {
    categories: Category[]
    productsWithCategories: ProductsWithCategoriesResponse
}
export const ProductPageComponent: FC<Props> = ({ }) => {
    const [currentProduct, setCurrentProduct] = useState<CreateOrUpdateProductSchema | null>(null)
    const [isProductModalOpen, setIsProductModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const form = useForm<CreateOrUpdateProductSchema>({
        resolver: zodResolver(createOrUpdateProductsSchema),
        defaultValues: {
            title: '',
            category: undefined,
            price: undefined,
            maxQuantity: undefined,
            heroImage: undefined,
            images: [],
            intent: 'create'
        }
    })
    const router = useRouter()
    const productCreateUpdateHandler = async (data: CreateOrUpdateProductSchema) => {
        const {
            category, images, maxQuantity, price, title, heroImage, slug, intent = 'create'
        } = data
        const uploadFile = async (file: File) => {
            const uniqueId = uuid()
            const fileName = `product/product-${uniqueId}-${file.name}`
            const formData = new FormData()
            formData.append('file', file, fileName)
            return imageUploadHandler(formData)
        }
        let heroImageUrl: string | undefined
        let imageUrls: string[] = []
        if (heroImage) {
            const imagePromise = Array.from(heroImage).map(file => uploadFile(file as File))
            try {
                [heroImageUrl] = await Promise.all(imagePromise)
            } catch (error) {
                console.error('error uploading image:', error)
                toast.error('error uploading image')
                return
            }
        }
        if (images.length > 0) {
            const imagesPreomises = Array.from(images).map(file => uploadFile(file))
            try {
                imageUrls = (await Promise.all(imagesPreomises)) as string[]
            } catch (error) {
                console.error('error uploading images:', error)
                toast.error('error uploading images')
                return
            }
        }
        switch (intent) {
            case 'create': {
                if (heroImageUrl && heroImageUrl.length > 0) {
                    await createProduct({
                        category: Number(category), images: imageUrls, heroImage: heroImageUrl, maxQuantity: Number(maxQuantity), price: Number(price), title
                    })
                    form.reset()
                    router.refresh()
                    setIsProductModalOpen(false)
                    toast.success('product created successfully')
                }
                break;
            }
            case 'update': {
                if (heroImageUrl && imageUrls.length > 0 && slug) {
                    await updateProduct({
                        category: Number(category),
                        heroImage: heroImageUrl,
                        imagesUrl: imageUrls,
                        maxQuantity: Number(maxQuantity),
                        price: Number(price),
                        title,
                        slug
                    })
                    form.reset()
                    router.refresh()
                    setIsProductModalOpen(false)
                    toast.success('product updated successfully')
                }
                break
            }
            default:
                console.error('invalid intent')
        }
    }

    const deleteProductHandler = async () => {
        if (currentProduct?.slug) {
            await deleteProduct(currentProduct.slug)
            router.refresh()
            toast.success('product deleted successfully')
            setIsDeleteModalOpen(false)
            setCurrentProduct(null)
        }
    }
    return (
        <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
            <div className='container mx-auto p-4'>
                <div className='flex justify-between items-center mb-4 '>
                    <h1 className='text-2xl font-bold'>
                        Product Managment
                    </h1>
                    <Button onClick={() => {
                        setCurrentProduct(null); setIsProductModalOpen(true)
                    }}><PlusIcon className='mr-2 h-4 w-4'></PlusIcon>Add product
                    </Button>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>title</TableHead>
                            <TableHead>category</TableHead>
                            <TableHead>price</TableHead>
                            <TableHead>max quantity</TableHead>
                            <TableHead>hero image</TableHead>
                            <TableHead>product images</TableHead>
                            <TableHead>actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* @ts-ignore */}
                        {productsWithCategories.map(product => (
                            <ProductTableRow setIsProductModalOpen={setIsProductModalOpen} key={product.id} product={product}
                                setCurrentProduct={setCurrentProduct} setIsDeleteModalOpen={setIsDeleteModalOpen}></ProductTableRow>
                        ))}
                    </TableBody>
                </Table>
                {/* @ts-ignore */}
                <ProductForm form={form} onSubmit={productCreateUpdateHandler} categories={categories} isProductModalOpen={isProductModalOpen}
                    setIsProductModalOpen={setIsProductModalOpen} defaultValues={currentProduct}></ProductForm>
                <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                    <DialogContent><DialogHeader><DialogTitle>Delete Product</DialogTitle></DialogHeader>Are you sure you want to delete {currentProduct?.title}
                        <DialogFooter>
                            <Button variant={'destructive'} onClick={deleteProductHandler}>Delete</Button>
                        </DialogFooter></DialogContent>
                </Dialog>
            </div>
        </main>
    )
}
