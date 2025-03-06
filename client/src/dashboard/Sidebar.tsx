import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle, CardHeader, CardFooter } from "@/components/ui/card"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { TrendingDown, TrendingUp, ChevronDown } from "lucide-react"

import { useEffect, useState } from "react"
import { fetchDashboardData, fetchCommunityFeedback, fetchTopProducts, fetchPerformanceScore, fetchComparisonData, fetchCustomerComparison } from "@/services/api"
import type { TopProduct, PerformanceScore, ComparisonData, CustomerComparison } from "@/services/api"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, CartesianGrid, XAxis, Line, LineChart, YAxis } from "recharts"

export default function Page() {
    const chartConfig = {
        this_year: {
            label: "This year",
            color: "hsl(var(--chart-1))",
        },
        last_year: {
            label: "Last year",
            color: "hsl(var(--chart-2))",
        },
    } satisfies ChartConfig
    const customerChartConfig = {
        this_year: {
            label: "Web Sales",
            color: "hsl(var(--chart-1))",
        },
        last_year: {
            label: "Offline Sales",
            color: "hsl(var(--chart-2))",
        },
    } satisfies ChartConfig

    const [dashboardData, setDashboardData] = useState({
        purchases: { value: 0, percentage: 0 },
        revenue: { value: 0, percentage: 0 },
        refunds: { value: 0, percentage: 0 }
    });
    const [communityData, setCommunityData] = useState({
        negative: 0,
        positive: 0,
        neutral: 0
    });
    const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [performanceScore, setPerformanceScore] = useState<PerformanceScore>({ score: 0, title: "", message: "" });
    const [comparisonData, setComparisonData] = useState<ComparisonData[]>([]);
    const [customerData, setCustomerData] = useState<CustomerComparison[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [dashboard, community, products, performance, comparison, customer] = await Promise.all([
                    fetchDashboardData(),
                    fetchCommunityFeedback(),
                    fetchTopProducts(),
                    fetchPerformanceScore(),
                    fetchComparisonData(),
                    fetchCustomerComparison()
                ]);
                setDashboardData(dashboard);
                setCommunityData(community);
                setTopProducts(products);
                setPerformanceScore(performance);
                setComparisonData(comparison);
                setCustomerData(customer);
            } catch (err) {
                setError('Failed to load data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const formatCurrency = (value: string | number) => {
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(numValue);
    };

    // Calculate total and percentages for the feedback bar
    const totalFeedback = communityData.negative + communityData.neutral + communityData.positive;
    const negativePercentage = (communityData.negative / totalFeedback) * 100;
    const neutralPercentage = (communityData.neutral / totalFeedback) * 100;
    const positivePercentage = (communityData.positive / totalFeedback) * 100;

    // Determine overall sentiment
    const getSentiment = () => {
        if (communityData.positive > communityData.negative && communityData.positive > communityData.neutral) {
            return "Mostly positive";
        } else if (communityData.negative > communityData.positive && communityData.negative > communityData.neutral) {
            return "Mostly negative";
        } else {
            return "Mostly neutral";
        }
    };

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="bg-white">
                <div className="flex flex-col h-full">
                    <div className="flex flex-col lg:flex-row h-full">
                        <div className="w-full lg:w-2/3 p-6">
                            <header className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-semibold">Dashboard</h1>
                                <div className="flex items-center gap-3">
                                    <div className="text-sm">Compare to</div>
                                    <Button variant="outline" size="sm" className="h-9 rounded-full">
                                        Last year <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </header>

                            <div className="grid grid-cols-3 gap-6 mb-6">
                                {loading ? (
                                    <>
                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="animate-pulse h-20 bg-gray-100 rounded"></div>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="animate-pulse h-20 bg-gray-100 rounded"></div>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="animate-pulse h-20 bg-gray-100 rounded"></div>
                                            </CardContent>
                                        </Card>
                                    </>
                                ) : error ? (
                                    <div className="col-span-3 text-red-500">{error}</div>
                                ) : (
                                    <>
                                        <Card className="p-0">
                                            <CardContent className="p-4">
                                                <div className="text-sm text-muted-foreground mb-2">Purchases</div>
                                                <div className="flex items-baseline gap-2">
                                                    <div className="text-2xl font-semibold">{dashboardData.purchases.value.toLocaleString()}</div>
                                                    <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${dashboardData.purchases.percentage >= 0
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : "bg-red-100 text-red-700"
                                                        }`}>
                                                        {dashboardData.purchases.percentage >= 0 ? "+" : ""}
                                                        {dashboardData.purchases.percentage}%
                                                        {dashboardData.purchases.percentage >= 0
                                                            ? <TrendingUp className="inline h-3 w-3" />
                                                            : <TrendingDown className="inline h-3 w-3" />
                                                        }
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card className="p-0">
                                            <CardContent className="p-4">
                                                <div className="text-sm text-muted-foreground mb-2">Revenue</div>
                                                <div className="flex items-baseline gap-2">
                                                    <div className="text-2xl font-semibold">{formatCurrency(dashboardData.revenue.value)}</div>
                                                    <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${dashboardData.revenue.percentage >= 0
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : "bg-red-100 text-red-700"
                                                        }`}>
                                                        {dashboardData.revenue.percentage >= 0 ? "+" : ""}
                                                        {dashboardData.revenue.percentage}%
                                                        {dashboardData.revenue.percentage >= 0
                                                            ? <TrendingUp className="inline h-3 w-3" />
                                                            : <TrendingDown className="inline h-3 w-3" />
                                                        }
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card className="p-0">
                                            <CardContent className="p-4">
                                                <div className="text-sm text-muted-foreground mb-2">Refunds</div>
                                                <div className="flex items-baseline gap-2">
                                                    <div className="text-2xl font-semibold">{formatCurrency(dashboardData.refunds.value)}</div>
                                                    <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${dashboardData.refunds.percentage >= 0
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : "bg-red-100 text-red-700"
                                                        }`}>
                                                        {dashboardData.refunds.percentage >= 0 ? "+" : ""}
                                                        {dashboardData.refunds.percentage}%
                                                        {dashboardData.refunds.percentage >= 0
                                                            ? <TrendingUp className="inline h-3 w-3" />
                                                            : <TrendingDown className="inline h-3 w-3" />
                                                        }
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </>
                                )}
                            </div>
                            <Card className="mb-6 border-0 shadow-none">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-base font-medium">Comparison</CardTitle>
                                    <Button variant="outline" size="sm" className="rounded-full">
                                        6 months <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <ChartContainer config={chartConfig}>
                                        <BarChart data={comparisonData} height={300}>
                                            <CartesianGrid vertical={false} />
                                            <XAxis
                                                dataKey="month"
                                                tickLine={false}
                                                tickMargin={10}
                                                axisLine={false}
                                            />
                                            <YAxis
                                                tickLine={false}
                                                axisLine={false}
                                                tickMargin={8}
                                            />
                                            <ChartTooltip
                                                cursor={false}
                                                content={<ChartTooltipContent indicator="dashed" />}
                                            />
                                            <Bar dataKey="this_year" fill="var(--color-this_year)" radius={4} />
                                            <Bar dataKey="last_year" fill="var(--color-last_year)" radius={4} />
                                        </BarChart>
                                    </ChartContainer>
                                </CardContent>
                                <CardFooter className="flex items-center gap-2 text-sm w-full">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-[hsl(var(--chart-1))] rounded-sm"></div>
                                        <span className="text-xs">This year</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-[hsl(var(--chart-2))] rounded-sm"></div>
                                        <span className="text-xs">Last year</span>
                                    </div>
                                </CardFooter>
                            </Card>

                            <Card className="border-0 shadow-none">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-base font-medium">Top Products</CardTitle>
                                    <Button variant="outline" size="sm" className="rounded-full">
                                        Full results
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="relative overflow-x-auto">
                                        {loading ? (
                                            <div className="space-y-4">
                                                {[...Array(4)].map((_, i) => (
                                                    <div key={i} className="h-12 bg-slate-100 animate-pulse rounded" />
                                                ))}
                                            </div>
                                        ) : error ? (
                                            <div className="text-red-500">{error}</div>
                                        ) : (
                                            <table className="w-full text-sm text-left">
                                                <thead className="text-xs text-muted-foreground">
                                                    <tr>
                                                        <th className="px-4 py-2 font-medium">Product</th>
                                                        <th className="px-4 py-2 font-medium">Sold amount</th>
                                                        <th className="px-4 py-2 font-medium">Unit price</th>
                                                        <th className="px-4 py-2 font-medium">Revenue</th>
                                                        <th className="px-4 py-2 font-medium">Rating</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {topProducts.map((product) => (
                                                        <tr key={product.id}>
                                                            <td className="px-4 py-3 flex items-center gap-3">
                                                                <div className="w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center text-white text-xs">
                                                                    {product.product.charAt(0)}
                                                                </div>
                                                                <span>{product.product}</span>
                                                            </td>
                                                            <td className="px-4 py-3">{product.sold_amount.toLocaleString()}</td>
                                                            <td className="px-4 py-3">{formatCurrency(product.unit_price)}</td>
                                                            <td className="px-4 py-3">{formatCurrency(product.revenue)}</td>
                                                            <td className="px-4 py-3 flex items-center">
                                                                <span className="text-amber-500">★</span> {product.rating.toFixed(2)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="w-full lg:w-1/3 p-6 space-y-6">
                            <Card className="flex flex-col">
                                <CardContent className="flex flex-col items-center gap-6">
                                    {loading ? (
                                        <div className="w-[250px] h-[250px] animate-pulse bg-slate-100 rounded-full" />
                                    ) : error ? (
                                        <div className="text-red-500">{error}</div>
                                    ) : (
                                        <>
                                            <div className="relative w-[250px]">
                                                <svg className="w-full h-full" viewBox="0 0 100 50">
                                                    <path
                                                        className="text-slate-100"
                                                        strokeWidth="5"
                                                        stroke="currentColor"
                                                        fill="transparent"
                                                        d="M10,45 A40,40 0 0,1 90,45"
                                                    />
                                                    <path
                                                        className="text-blue-500"
                                                        strokeWidth="5"
                                                        strokeLinecap="round"
                                                        stroke="currentColor"
                                                        fill="transparent"
                                                        d="M10,45 A40,40 0 0,1 90,45"
                                                        strokeDasharray="125.6"
                                                        strokeDashoffset={125.6 - (125.6 * performanceScore.score) / 100}
                                                    />
                                                    <text
                                                        x="50"
                                                        y="30"
                                                        textAnchor="middle"
                                                        className="text-md font-bold fill-current"
                                                    >
                                                        {performanceScore.score}
                                                    </text>
                                                    <text
                                                        x="50"
                                                        y="42"
                                                        textAnchor="middle"
                                                        className="fill-muted-foreground"
                                                        style={{ fontSize: '6px' }}
                                                    >
                                                        of 100 points
                                                    </text>
                                                </svg>
                                            </div>
                                            <div className="text-center space-y-2">
                                                <div className="text-left font-medium text-lg">
                                                    {performanceScore.title}
                                                </div>
                                                <div className="text-left text-sm text-muted-foreground">
                                                    {performanceScore.message}
                                                </div>
                                                <Button variant="outline" size="sm" className="mt-4">
                                                    Improve your score
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base font-medium">Customers by device</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ChartContainer config={customerChartConfig}>
                                        <LineChart
                                            data={customerData}
                                            height={200}
                                            margin={{
                                                left: 0,
                                                right: 12,
                                                top: 10,
                                                bottom: 20
                                            }}
                                        >
                                            <CartesianGrid vertical={false} />
                                            <XAxis
                                                dataKey="date"
                                                tickLine={false}
                                                axisLine={false}
                                                tickMargin={8}
                                                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
                                            />
                                            <YAxis
                                                tickLine={false}
                                                axisLine={false}
                                                tickMargin={8}
                                                tickFormatter={(value) => value === 0 ? '0' : `${(value / 1000).toFixed(0)}K`}
                                            />
                                            <ChartTooltip
                                                cursor={false}
                                                content={
                                                    <ChartTooltipContent
                                                        formatter={(value) => value.toLocaleString()}
                                                        labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    />
                                                }
                                            />
                                            <Line
                                                dataKey="web_sales"
                                                type="monotone"
                                                stroke="var(--color-this_year)"
                                                strokeWidth={2}
                                                dot={false}
                                            />
                                            <Line
                                                dataKey="offline_sales"
                                                type="monotone"
                                                stroke="var(--color-last_year)"
                                                strokeWidth={2}
                                                dot={false}
                                            />
                                        </LineChart>
                                    </ChartContainer>
                                </CardContent>
                                <CardFooter>
                                    <div className="flex justify-between w-full">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-[hsl(var(--chart-1))] rounded-sm"></div>
                                            <div>
                                                <div className="text-xs">Web sales</div>
                                                <div className="text-sm font-medium">{customerData[customerData.length - 1]?.web_sales.toLocaleString()}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-[hsl(var(--chart-2))] rounded-sm"></div>
                                            <div>
                                                <div className="text-xs">Offline selling</div>
                                                <div className="text-sm font-medium">{customerData[customerData.length - 1]?.offline_sales.toLocaleString()}</div>
                                            </div>
                                        </div>
                                    </div>
                                </CardFooter>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <div className="text-xs text-muted-foreground">Community feedback</div>
                                    <CardTitle className="text-base font-medium">
                                        {loading ? "Loading..." : getSentiment()}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {loading ? (
                                        <div className="space-y-4">
                                            <div className="h-2 w-full bg-slate-100 animate-pulse rounded-full" />
                                            <div className="flex justify-between">
                                                <div className="h-8 w-16 bg-slate-100 animate-pulse rounded" />
                                                <div className="h-8 w-16 bg-slate-100 animate-pulse rounded" />
                                                <div className="h-8 w-16 bg-slate-100 animate-pulse rounded" />
                                            </div>
                                        </div>
                                    ) : error ? (
                                        <div className="text-red-500">{error}</div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div className="flex h-full">
                                                    <div
                                                        className="bg-red-400 h-full"
                                                        style={{ width: `${negativePercentage}%` }}
                                                    />
                                                    <div
                                                        className="bg-amber-400 h-full"
                                                        style={{ width: `${neutralPercentage}%` }}
                                                    />
                                                    <div
                                                        className="bg-green-400 h-full"
                                                        style={{ width: `${positivePercentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <div>
                                                    <div>Negative</div>
                                                    <div className="font-medium">{communityData.negative}</div>
                                                </div>
                                                <div>
                                                    <div>Neutral</div>
                                                    <div className="font-medium">{communityData.neutral}</div>
                                                </div>
                                                <div>
                                                    <div>Positive</div>
                                                    <div className="font-medium">{communityData.positive}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
