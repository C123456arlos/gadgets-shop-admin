import { getMonthlyOrders } from "@/src/actions/orders"
import PageComponent from "./page-component"
import { getCategoryData } from "@/src/actions/categories"
import { getLatestUsers } from "@/src/actions/auth"

const adminDashboard = async () => {
    const monthlyOrders = await getMonthlyOrders()
    const categoryData = await getCategoryData()
    const latestUsers = await getLatestUsers()
    console.log(latestUsers)
    return <PageComponent latestUsers={latestUsers} monthlyOrders={monthlyOrders} categoryData={categoryData}></PageComponent>
}
export default adminDashboard
