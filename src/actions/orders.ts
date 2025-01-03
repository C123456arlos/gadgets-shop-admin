'use server'
import { createClient } from '@/src/supabase/server'
import { revalidatePath } from 'next/cache'
import { sendNotification } from './notifications'
export const getOrdersWithProducts = async () => {
    const supabase = createClient()
    const { data, error } = await (await supabase).from('order').select('*, order_items:order_item(*, product(*)), user(*)').order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data
}
export const updateOrderStatus = async (orderId: number, status: string) => {
    const supabase = createClient()
    const { error } = await (await supabase).from('order').update({ status }).eq('id', orderId)
    if (error) throw new Error(error.message)
    // @ts-ignore
    const { data: { session } } = (await supabase).auth.getSession()
    const { userId } = session?.user.id!
    // @ts-ignore
    await sendNotification(userId, status + ' 🚀')
    revalidatePath('/admin/orders')
}
export const getMonthlyOrders = async () => {
    const supabase = createClient()
    const { data, error } = await (await supabase).from('order').select('created_at')
    if (error) throw new Error(error.message)
    const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
    const ordersByMonth = data.reduce(
        // @ts-ignore
        (acc: Record<string, number>, order: { created_at: string }) => {
            const date = new Date(order.created_at)
            const month = monthNames[date.getUTCMonth()]
            // @ts-ignore
            if (!acc[month]) acc[month] = 0
            // @ts-ignore
            acc[month]++
            // @ts-ignore
            return acc
        },
        {}
    )
    return Object.keys(ordersByMonth).map(month => ({
        // @ts-ignore
        name: month, orders: ordersByMonth(month)
    }))
}