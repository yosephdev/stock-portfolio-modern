import { NextResponse } from 'next/server';
import { fetchQuote } from '@/lib/finnhub';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbolsParam = searchParams.get('symbols');

  if (!symbolsParam) {
    return NextResponse.json({ error: 'Missing symbols parameter' }, { status: 400 });
  }

  const symbols = symbolsParam.split(',').map(s => s.trim().toUpperCase());

  try {
    const pricePromises = symbols.map(async (symbol) => {
      try {
        const quote = await fetchQuote(symbol);
        return {
          symbol,
          current_price: quote.c || 0,
          previous_close: quote.pc || 0,
          change_percent: quote.dp || 0,
        };
      } catch {
        // Return null price if fetch fails for a symbol
        return {
          symbol,
          current_price: 0,
          previous_close: 0,
          change_percent: 0,
        };
      }
    });

    const prices = await Promise.all(pricePromises);

    // Convert array to object keyed by symbol
    const pricesObj = prices.reduce((acc, price) => {
      acc[price.symbol] = price;
      return acc;
    }, {} as Record<string, { symbol: string; current_price: number; previous_close: number; change_percent: number }>);

    return NextResponse.json(pricesObj);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch stock prices' },
      { status: 500 }
    );
  }
}
