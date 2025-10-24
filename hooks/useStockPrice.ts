'use client';

import { useQuery } from '@tanstack/react-query';

export function useStockPrice(symbol: string) {
  return useQuery({
    queryKey: ['stock-price', symbol],
    queryFn: async () => {
      const response = await fetch(`/api/stock-prices?symbols=${symbol}`);
      if (!response.ok) {
        throw new Error('Failed to fetch stock price');
      }
      const data = await response.json();
      return data[symbol];
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
    enabled: !!symbol,
  });
}

export function useMultipleStockPrices(symbols: string[]) {
  return useQuery({
    queryKey: ['stock-prices', symbols.sort().join(',')],
    queryFn: async () => {
      if (symbols.length === 0) return {};
      const response = await fetch(`/api/stock-prices?symbols=${symbols.join(',')}`);
      if (!response.ok) {
        throw new Error('Failed to fetch stock prices');
      }
      return response.json();
    },
    staleTime: 30000,
    refetchInterval: 60000,
    enabled: symbols.length > 0,
  });
}
