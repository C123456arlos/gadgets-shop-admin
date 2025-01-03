'use client'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
type MonthlyOrderData = {
    name: string
    orders: number
}
type CategoryData = {
    name: string
    products: number
}
type LatestUser = {
    id: string
    email: string
    date: string | null
}
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
const PageComponent = ({
    monthlyOrders,
    categoryData,
    latestUsers
}: {
    monthlyOrders: MonthlyOrderData[]
    categoryData: CategoryData[]
    latestUsers: LatestUser[]
}) => {
    return (
        <div className='flex-1 p-8 overflow-auto'>
            <h1 className='text-3xl font-bold mb-6'>dashboard overview</h1>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <Card>
                    <CardTitle>
                        orders over time
                    </CardTitle>
                    <CardContent>
                        <ResponsiveContainer width='100%' height={300}>
                            <BarChart data={monthlyOrders}>
                                <CartesianGrid strokeDasharray='3 3'></CartesianGrid>
                                <XAxis dataKey='name'></XAxis>
                                <YAxis ></YAxis>
                                <Tooltip></Tooltip>
                                <Legend></Legend>
                                <Bar dataKey='orders' fill='#8884D8'></Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>products by category</CardTitle></CardHeader>
                    <CardContent>
                        {/* @ts-ignore */}
                        <ResponsiveContainer width='100%' height={300}>
                            <PieChart>
                                <Pie data={categoryData} dataKey='products' nameKey='name' cx='50%' cy='50%' outerRadius={100} fill='#8884d8' labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}`}>
                                    {categoryData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}></Cell>))}
                                </Pie>
                                <Tooltip></Tooltip>
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Products by category
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* @ts-ignore */}
                        <ResponsiveContainer width='100%' height={300}><BarChart data={categoryData}>
                            <CartesianGrid strokeDasharray='3 3'></CartesianGrid>
                            <XAxis dataKey='name'></XAxis>
                            <YAxis></YAxis>
                            <Tooltip></Tooltip>
                            <Legend></Legend>
                            <Bar dataKey='products' fill='#82CE19'></Bar>
                        </BarChart></ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>latest users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>email</TableHead>
                                    <TableHead>date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {latestUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.date}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
export default PageComponent