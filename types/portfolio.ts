import { Database } from './database';

export type Stock = Database['public']['Tables']['stocks']['Row'];
export type Portfolio = Database['public']['Tables']['portfolios']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];

export interface StockWithPrice extends Stock {
  current_price: number;
  previous_close?: number;
  change_percent?: number;
  market_value: number;
  unrealized_gain_loss: number;
  gain_loss_percent: number;
}

export interface PortfolioWithStocks extends Portfolio {
  stocks: Stock[];
}

export interface PortfolioSummary {
  total_market_value: number;
  total_cost_basis: number;
  total_gain_loss: number;
  total_gain_loss_percent: number;
  best_performer?: StockWithPrice;
  worst_performer?: StockWithPrice;
}
