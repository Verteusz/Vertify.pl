
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SiteNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Site Not Found</h1>
          <p className="text-muted-foreground">
            The site you're looking for doesn't exist or hasn't been published yet.
          </p>
        </div>
        
        <div className="flex items-center justify-center gap-4">
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
