import { createClient } from "@/src/supabase/server";
import { QueryData } from "@supabase/supabase-js";
const supabase = createClient()
const ordersWithProductQuery = await (await supabase).from('order').select('*, order_items:order_item(*, product(*)), user(*)')
    .order('created_at', { ascending: false })
export type OrdersWithProducts = QueryData<typeof ordersWithProductQuery>