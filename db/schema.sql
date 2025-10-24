-- Database schema for stock-portfolio-modern (Supabase)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolios table
CREATE TABLE IF NOT EXISTS portfolios (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL DEFAULT 'My Portfolio',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stocks table
CREATE TABLE IF NOT EXISTS stocks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE NOT NULL,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  shares_owned DECIMAL(15, 4) NOT NULL CHECK (shares_owned >= 0),
  cost_per_share DECIMAL(15, 4) NOT NULL CHECK (cost_per_share >= 0),
  purchase_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stock prices cache
CREATE TABLE IF NOT EXISTS stock_prices (
  symbol TEXT PRIMARY KEY,
  current_price DECIMAL(15, 4) NOT NULL,
  previous_close DECIMAL(15, 4),
  change_percent DECIMAL(8, 4),
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE stocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_prices ENABLE ROW LEVEL SECURITY;

-- RLS Policies (minimal set)
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own portfolios" ON portfolios;
DROP POLICY IF EXISTS "Users can create own portfolios" ON portfolios;
DROP POLICY IF EXISTS "Users can update own portfolios" ON portfolios;
DROP POLICY IF EXISTS "Users can delete own portfolios" ON portfolios;
DROP POLICY IF EXISTS "Users can view own stocks" ON stocks;
DROP POLICY IF EXISTS "Users can create stocks in own portfolios" ON stocks;
DROP POLICY IF EXISTS "Users can update own stocks" ON stocks;
DROP POLICY IF EXISTS "Users can delete own stocks" ON stocks;
DROP POLICY IF EXISTS "Anyone can view stock prices" ON stock_prices;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own portfolios" ON portfolios
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own portfolios" ON portfolios
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own portfolios" ON portfolios
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own portfolios" ON portfolios
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own stocks" ON stocks
  FOR SELECT USING (
    portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create stocks in own portfolios" ON stocks
  FOR INSERT WITH CHECK (
    portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update own stocks" ON stocks
  FOR UPDATE USING (
    portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete own stocks" ON stocks
  FOR DELETE USING (
    portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid())
  );

CREATE POLICY "Anyone can view stock prices" ON stock_prices
  FOR SELECT TO PUBLIC USING (true);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name',''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS set_portfolios_updated_at ON portfolios;
CREATE TRIGGER set_portfolios_updated_at
  BEFORE UPDATE ON portfolios
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS set_stocks_updated_at ON stocks;
CREATE TRIGGER set_stocks_updated_at
  BEFORE UPDATE ON stocks
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_stocks_portfolio_id ON stocks(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_stocks_symbol ON stocks(symbol);
