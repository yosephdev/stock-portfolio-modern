'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity, AlertCircle } from 'lucide-react';
import { StockWithPrice } from '@/types/portfolio';

interface TopPerformersProps {
  stocks: StockWithPrice[];
}

export function TopPerformers({ stocks }: TopPerformersProps) {
  if (!stocks || stocks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
            Top Movers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <AlertCircle className="mb-2 h-8 w-8" />
            <p className="text-sm">No stocks to display</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const sortedByGain = [...stocks].sort((a, b) => b.gain_loss_percent - a.gain_loss_percent);
  const topGainers = sortedByGain.slice(0, 3);
  const topLosers = sortedByGain.slice(-3).reverse();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Top Gainers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <TrendingUp className="h-5 w-5" />
            Top Gainers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {topGainers.map((stock) => (
            <div key={stock.id} className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{stock.symbol}</p>
                <p className="text-sm text-muted-foreground">{stock.name}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-semibold text-green-600">
                  +{stock.gain_loss_percent.toFixed(2)}%
                </p>
                <p className="font-mono text-xs text-muted-foreground">
                  ${stock.unrealized_gain_loss.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Top Losers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <TrendingDown className="h-5 w-5" />
            Top Losers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {topLosers.map((stock) => (
            <div key={stock.id} className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{stock.symbol}</p>
                <p className="text-sm text-muted-foreground">{stock.name}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-semibold text-red-600">
                  {stock.gain_loss_percent.toFixed(2)}%
                </p>
                <p className="font-mono text-xs text-muted-foreground">
                  ${stock.unrealized_gain_loss.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
