'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { Stock } from '@/types/portfolio';
import { useMultipleStockPrices } from '@/hooks/useStockPrice';
import { useDeleteStock } from '@/hooks/usePortfolio';
import { calculateGainLoss, formatCurrency, formatPercent } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  stocks: Stock[];
}

export function PortfolioTable({ stocks }: Props) {
  const symbols = stocks.map((s) => s.symbol);
  const { data: prices, isLoading } = useMultipleStockPrices(symbols);
  const deleteStockMutation = useDeleteStock();

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this stock?')) {
      await deleteStockMutation.mutateAsync(id);
    }
  };

  if (stocks.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center">
        <p className="text-muted-foreground">
          No stocks in your portfolio yet. Add your first stock to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Shares</TableHead>
            <TableHead className="text-right">Cost/Share</TableHead>
            <TableHead className="text-right">Current Price</TableHead>
            <TableHead className="text-right">Market Value</TableHead>
            <TableHead className="text-right">Gain/Loss</TableHead>
            <TableHead className="text-right">Return %</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stocks.map((stock) => {
            const currentPrice = prices?.[stock.symbol]?.current_price || 0;
            const calc = calculateGainLoss(
              currentPrice,
              stock.cost_per_share,
              stock.shares_owned
            );
            const isPositive = calc.gainLoss >= 0;

            return (
              <TableRow key={stock.id}>
                <TableCell className="font-medium">{stock.symbol}</TableCell>
                <TableCell>{stock.name}</TableCell>
                <TableCell className="text-right">
                  {stock.shares_owned.toFixed(4)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(stock.cost_per_share)}
                </TableCell>
                <TableCell className="text-right">
                  {isLoading ? (
                    <Skeleton className="h-4 w-16 ml-auto" />
                  ) : (
                    formatCurrency(currentPrice)
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {isLoading ? (
                    <Skeleton className="h-4 w-20 ml-auto" />
                  ) : (
                    formatCurrency(calc.marketValue)
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {isLoading ? (
                    <Skeleton className="h-4 w-20 ml-auto" />
                  ) : (
                    <span
                      className={
                        isPositive ? 'text-green-600' : 'text-red-600'
                      }
                    >
                      {isPositive && '+'}
                      {formatCurrency(calc.gainLoss)}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {isLoading ? (
                    <Skeleton className="h-4 w-16 ml-auto" />
                  ) : (
                    <div className="flex items-center justify-end gap-1">
                      {isPositive ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span
                        className={
                          isPositive ? 'text-green-600' : 'text-red-600'
                        }
                      >
                        {formatPercent(calc.gainLossPercent)}
                      </span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(stock.id)}
                    disabled={deleteStockMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
