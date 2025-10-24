'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { StockWithPrice } from '@/types/portfolio';

interface PortfolioChartProps {
  stocks: StockWithPrice[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      fullName: string;
    };
  }>;
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-3 shadow-lg">
        <p className="font-semibold">{payload[0].payload.fullName}</p>
        <p className="text-sm text-muted-foreground">{payload[0].name}</p>
        <p className="font-mono text-sm">
          ${payload[0].value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    );
  }
  return null;
}

export function PortfolioChart({ stocks }: PortfolioChartProps) {
  if (!stocks || stocks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Allocation</CardTitle>
          <CardDescription>Distribution of your investments by market value</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            No stocks to display. Add some stocks to see your portfolio allocation.
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = stocks.map((stock) => ({
    name: stock.symbol,
    value: stock.market_value,
    fullName: stock.name,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Allocation</CardTitle>
        <CardDescription>Distribution of your investments by market value</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(props?: { name?: string; percent?: number }) => {
                const { name = '', percent = 0 } = props || {};
                return `${name} ${(percent * 100).toFixed(0)}%`;
              }}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
