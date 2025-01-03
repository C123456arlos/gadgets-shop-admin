import { getOrdersWithProducts } from "@/src/actions/orders"
import PageComponent from "@/src/app/admin/orders/page-component"

const orders = async () => {
    const ordersWithProducts = await getOrdersWithProducts()
    if (!ordersWithProducts) return <div className="text-center font-bold text-2xl">no orders found</div>
    return (
        // @ts-ignore
        <div><PageComponent ordersWithProducts={ordersWithProducts}></PageComponent></div>
    )
}
export default orders