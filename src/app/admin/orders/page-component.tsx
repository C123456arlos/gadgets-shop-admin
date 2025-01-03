'use client'
import { useState } from "react"
import { format } from 'date-fns'
import Image from "next/image"
import { Button } from '@/components/ui/button'
import { OrdersWithProducts } from "@/src/app/admin/orders/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { updateOrderStatus } from "@/src/actions/orders"
type Props = {
    ordersWithProducts: OrdersWithProducts
}
const statusOptions = ['pending', 'shipped', 'inTransit', 'completed']
type OrderedProducts = {
    order_id: number
    product: number & {
        category: number
        created_at: string
        heroImage: string
        id: number
        imagesUrl: string[]
        maxQuantity: number
        price: number
        slug: string
        title: string
    }
}[]
export default function PageComponent({ ordersWithProducts }: Props) {
    const [selectedProducts, setSelectedProducts] = useState<OrderedProducts>([])
    const openProductsModal = (products: OrderedProducts) => () => setSelectedProducts(products)
    // @ts-ignore
    const orderedProducts = ordersWithProducts.flatMap[order => order.order_items.map(item => (
        order
    ))]
    const handleStatusChange = async (orderId: number, status: string) => {
        await updateOrderStatus(orderId, status)
    }
    return <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Orders Managment Dashboard</h1>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Created at</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Total Price</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {/* @ts-ignore */}
                {ordersWithProducts.map(order => (
                    <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{format(new Date(order.created_at), 'MMM dd, yyyy')}</TableCell>
                        {/* @ts-ignore */}
                        <TableCell> <Select onValueChange={value => handleStatusChange = (order.id, value)} defaultValue={order.status}>
                            <SelectTrigger className="2-[120px]">
                                <SelectValue>{order.status}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>{statusOptions.map((status) => (<SelectItem key={status} value={status}>{status}</SelectItem>))}</SelectContent>
                        </Select></TableCell>
                        <TableCell>{order.description || 'no description'}</TableCell>
                        <TableCell>{order.user.email}</TableCell>
                        <TableCell>{order.slug}</TableCell>
                        <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                        <TableCell>{order.order_items.length} item{order.order_items.length > 1 ? 's' : ""}</TableCell>
                        <TableCell><Dialog>
                            <DialogTrigger asChild>
                                {/* @ts-ignore */}
                                <Button variant='outline' size='sm' onClick={openProductsModal()}>

                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Order Products</DialogTitle>
                                </DialogHeader>
                                <div className="mt-4">
                                    {selectedProducts.map(({ product }, index) => (
                                        <div key={index} className="mr-2 mb-2 flex items-center space-x-2"></div>))}
                                    {/* @ts-ignore */}
                                    <Image className="w-64 h-16 object-cover rounded" src={product.heroImage} alt={product.title} width={64} height={64}></Image>
                                </div>
                                <div className="flex flex-col">
                                    {/* @ts-ignore */}
                                    <span className="font-semibold">{product.title}</span>
                                    {/* @ts-ignore */}
                                    <span className="text-gray-600">${product.price.toFIxed(2)}</span>
                                    {/* @ts-ignore */}
                                    <span className="text-sm text-gray-599">Available quantity: {product.maxQuantity}</span>
                                </div>
                            </DialogContent>
                        </Dialog></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>

}
