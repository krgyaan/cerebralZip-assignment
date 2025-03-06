const API_BASE_URL = 'http://3.111.196.92:8020/api/v1';
const AUTH_CREDENTIALS = btoa('trial:assignment123');

interface ApiResponse {
    purchases: number;
    revenue: number;
    refunds: number;
}

interface CommunityFeedback {
    negative: number;
    positive: number;
    neutral: number;
}

export interface TopProduct {
    id: number;
    product: string;
    sold_amount: number;
    unit_price: string;
    revenue: string;
    rating: number;
}

interface DashboardData {
    purchases: {
        value: number;
        percentage: number;
    };
    revenue: {
        value: number;
        percentage: number;
    };
    refunds: {
        value: number;
        percentage: number;
    };
}

export interface PerformanceScore {
    score: number;
    title: string;
    message: string;
}

export interface ComparisonData {
    id: number;
    month: string;
    last_year: number;
    this_year: number;
}

export interface CustomerComparison {
    id: number;
    date: Date;
    web_sales: number;
    offline_sales: number;
}

// Calculate percentage change (mock data for now)
const calculatePercentage = (current: number, metric: 'purchases' | 'revenue' | 'refunds'): number => {
    // These would ideally come from historical data comparison
    const mockPercentages = {
        purchases: 32,
        revenue: 49,
        refunds: -7
    };
    return mockPercentages[metric];
};

export async function fetchDashboardData(): Promise<DashboardData> {
    try {
        const response = await fetch(`${API_BASE_URL}/sample_assignment_api_1/`, {
            headers: {
                'Authorization': `Basic ${AUTH_CREDENTIALS}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch dashboard data');
        }

        const rawData: ApiResponse = await response.json();

        // Transform the raw data into the expected format
        const transformedData: DashboardData = {
            purchases: {
                value: rawData.purchases,
                percentage: calculatePercentage(rawData.purchases, 'purchases')
            },
            revenue: {
                value: rawData.revenue,
                percentage: calculatePercentage(rawData.revenue, 'revenue')
            },
            refunds: {
                value: rawData.refunds,
                percentage: calculatePercentage(rawData.refunds, 'refunds')
            }
        };

        return transformedData;
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw error;
    }
}

export async function fetchCommunityFeedback(): Promise<CommunityFeedback> {
    try {
        const response = await fetch(`${API_BASE_URL}/sample_assignment_api_5/`, {
            headers: {
                'Authorization': `Basic ${AUTH_CREDENTIALS}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch community feedback');
        }

        const data: CommunityFeedback = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching community feedback:', error);
        throw error;
    }
}

export async function fetchTopProducts(): Promise<TopProduct[]> {
    try {
        const response = await fetch('http://localhost:5000/api/component_6');

        if (!response.ok) {
            throw new Error('Failed to fetch top products');
        }

        const data: TopProduct[] = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching top products:', error);
        throw error;
    }
}

export async function fetchPerformanceScore(): Promise<PerformanceScore> {
    try {
        const response = await fetch(`${API_BASE_URL}/sample_assignment_api_3/`, {
            headers: {
                'Authorization': `Basic ${AUTH_CREDENTIALS}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch performance score');
        }

        const data: PerformanceScore = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching performance score:', error);
        throw error;
    }
}

export async function fetchComparisonData(): Promise<ComparisonData[]> {
    try {
        const response = await fetch('http://localhost:5000/api/component_2');

        if (!response.ok) {
            throw new Error('Failed to fetch comparison data');
        }

        const data: ComparisonData[] = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching comparison data:', error);
        throw error;
    }
}

export async function fetchCustomerComparison(): Promise<CustomerComparison[]> {
    try {
        const response = await fetch('http://localhost:5000/api/component_4');

        if (!response.ok) {
            throw new Error('Failed to fetch custom comparison');
        }

        const data: CustomerComparison[] = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching comparison data:', error);
        throw error;
    }
}
