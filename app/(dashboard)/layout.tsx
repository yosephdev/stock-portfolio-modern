import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-bold">Stock Portfolio</h2>
            <div className="hidden md:flex gap-4">
              <a href="/portfolio" className="text-sm font-medium hover:text-primary">
                Portfolio
              </a>
              <a href="/settings" className="text-sm font-medium text-muted-foreground hover:text-primary">
                Settings
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="text-sm font-medium text-muted-foreground hover:text-primary"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
