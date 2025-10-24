export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      portfolios: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      stocks: {
        Row: {
          id: string
          portfolio_id: string
          symbol: string
          name: string
          shares_owned: number
          cost_per_share: number
          purchase_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          portfolio_id: string
          symbol: string
          name: string
          shares_owned: number
          cost_per_share: number
          purchase_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          portfolio_id?: string
          symbol?: string
          name?: string
          shares_owned?: number
          cost_per_share?: number
          purchase_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      stock_prices: {
        Row: {
          symbol: string
          current_price: number
          previous_close: number | null
          change_percent: number | null
          last_updated: string
        }
        Insert: {
          symbol: string
          current_price: number
          previous_close?: number | null
          change_percent?: number | null
          last_updated?: string
        }
        Update: {
          symbol?: string
          current_price?: number
          previous_close?: number | null
          change_percent?: number | null
          last_updated?: string
        }
      }
    }
  }
}
