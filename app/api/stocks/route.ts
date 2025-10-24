import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const stockSchema = z.object({
  portfolio_id: z.string().uuid(),
  symbol: z.string().min(1).max(10).toUpperCase(),
  name: z.string().min(1),
  shares_owned: z.number().positive(),
  cost_per_share: z.number().positive(),
  purchase_date: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = stockSchema.parse(body);

    // Verify user owns the portfolio
    const { data: portfolio, error: portfolioError } = await supabase
      .from('portfolios')
      .select('user_id')
      .eq('id', validatedData.portfolio_id)
      .single();

    if (portfolioError || !portfolio || (portfolio as { user_id: string }).user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('stocks')
      .insert(validatedData as never)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
