/**
 * Minimal Finnhub wrapper for fetching current quote data.
 * Uses NEXT_PUBLIC_FINNHUB_API_KEY from env.
 */

const FINNHUB_BASE = 'https://finnhub.io/api/v1';
const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || '';

if (!apiKey && process.env.NODE_ENV === 'development') {
  console.warn('Missing NEXT_PUBLIC_FINNHUB_API_KEY in environment');
}

export async function fetchQuote(symbol: string) {
  const res = await fetch(`${FINNHUB_BASE}/quote?symbol=${encodeURIComponent(symbol)}&token=${apiKey}`);
  if (!res.ok) {
    throw new Error(`Finnhub error (${res.status}): ${await res.text()}`);
  }
  const data = await res.json();
  return data;
}

export default fetchQuote;
