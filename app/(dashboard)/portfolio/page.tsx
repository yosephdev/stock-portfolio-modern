import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PortfolioDashboardClient } from '@/components/portfolio/PortfolioDashboardClient';

export default async function PortfolioPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  // Check if user has a portfolio, if not create one
  const { data: portfolios } = await supabase
    .from('portfolios')
    .select('id')
    .eq('user_id', user.id)
    .limit(1);

  if (!portfolios || portfolios.length === 0) {
    await supabase
      .from('portfolios')
      .insert({
        user_id: user.id,
        name: 'My Portfolio',
        description: 'Main investment portfolio',
      });
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Portfolio</h1>
        <p className="text-muted-foreground">
          Track and manage your stock investments
        </p>
      </div>
      <PortfolioDashboardClient />
    </div>
  );
}
