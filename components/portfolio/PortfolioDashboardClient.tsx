'use client';

import { usePortfolios } from '@/hooks/usePortfolio';
import { PortfolioSummary } from './PortfolioSummary';
import { PortfolioTable } from './PortfolioTable';
import { AddStockDialog } from './AddStockDialog';
import { useMultipleStockPrices } from '@/hooks/useStockPrice';
import { calculateGainLoss } from '@/lib/utils';
import { useMemo } from 'react';
import { StockWithPrice, PortfolioSummary as PortfolioSummaryType } from '@/types/portfolio';
import { Skeleton } from '@/components/ui/skeleton';

export function PortfolioDashboardClient() {
  const { data: portfolios, isLoading: portfoliosLoading } = usePortfolios();
  
  // Get all stocks from all portfolios
  const allStocks = useMemo(() => {
    if (!portfolios) return [];
    return portfolios.flatMap((p) => p.stocks || []);
  }, [portfolios]);

  const symbols = useMemo(() => allStocks.map((s) => s.symbol), [allStocks]);
  const { data: prices } = useMultipleStockPrices(symbols);

  // Calculate portfolio summary
  const summary = useMemo((): PortfolioSummaryType => {
    if (!prices || allStocks.length === 0) {
      return {
        total_market_value: 0,
        total_cost_basis: 0,
        total_gain_loss: 0,
        total_gain_loss_percent: 0,
      };
    }

    const stocksWithPrices: StockWithPrice[] = allStocks.map((stock) => {
      const currentPrice = prices[stock.symbol]?.current_price || 0;
      const calc = calculateGainLoss(currentPrice, stock.cost_per_share, stock.shares_owned);

      return {
        ...stock,
        current_price: currentPrice,
        previous_close: prices[stock.symbol]?.previous_close,
        change_percent: prices[stock.symbol]?.change_percent,
        market_value: calc.marketValue,
        unrealized_gain_loss: calc.gainLoss,
        gain_loss_percent: calc.gainLossPercent,
      };
    });

    const totalMarketValue = stocksWithPrices.reduce((sum, s) => sum + s.market_value, 0);
    const totalCostBasis = stocksWithPrices.reduce(
      (sum, s) => sum + s.cost_per_share * s.shares_owned,
      0
    );
    const totalGainLoss = totalMarketValue - totalCostBasis;
    const totalGainLossPercent = totalCostBasis > 0 ? (totalGainLoss / totalCostBasis) * 100 : 0;

    const bestPerformer = stocksWithPrices.reduce((best, current) =>
      current.gain_loss_percent > (best?.gain_loss_percent || -Infinity) ? current : best
    , stocksWithPrices[0]);

    const worstPerformer = stocksWithPrices.reduce((worst, current) =>
      current.gain_loss_percent < (worst?.gain_loss_percent || Infinity) ? current : worst
    , stocksWithPrices[0]);

    return {
      total_market_value: totalMarketValue,
      total_cost_basis: totalCostBasis,
      total_gain_loss: totalGainLoss,
      total_gain_loss_percent: totalGainLossPercent,
      best_performer: bestPerformer,
      worst_performer: worstPerformer,
    };
  }, [prices, allStocks]);

  if (portfoliosLoading) {
    return (
      <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  const portfolio = portfolios?.[0];
  const stocks = portfolio?.stocks || [];

  return (
    <div className="space-y-8">
      <PortfolioSummary summary={summary} />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Holdings</h2>
          <p className="text-sm text-muted-foreground">
            {stocks.length} {stocks.length === 1 ? 'stock' : 'stocks'} in your portfolio
          </p>
        </div>
        {portfolio && <AddStockDialog portfolioId={portfolio.id} />}
      </div>

      <PortfolioTable stocks={stocks} />
    </div>
  );
}
