import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle>Authentication Error</CardTitle>
          <CardDescription>
            There was a problem confirming your email address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
            <p className="font-medium mb-2">Possible reasons:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>The confirmation link has expired</li>
              <li>The link has already been used</li>
              <li>There was an error processing your request</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Please try signing up again or contact support if the problem persists.
            </p>
          </div>

          <div className="flex gap-2">
            <Button asChild variant="outline" className="flex-1">
              <Link href="/login">
                Go to Login
              </Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href="/signup">
                Sign Up Again
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
