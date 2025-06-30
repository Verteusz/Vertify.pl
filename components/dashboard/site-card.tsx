
"use client";

import { useRouter } from "next/navigation";
import { Site, Template } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SiteWithTemplate extends Site {
  template: {
    name: string;
  } | null;
}

interface SiteCardProps {
  site: SiteWithTemplate;
}

export function SiteCard({ site }: SiteCardProps) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/dashboard/sites/${site.id}/edit`);
  };

  const handleSettings = () => {
    router.push(`/dashboard/sites/${site.id}/settings`);
  };

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{site.name}</CardTitle>
          <Badge variant={site.published ? "default" : "secondary"}>
            {site.published ? "Published" : "Draft"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {site.description || "No description"}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Template: {site.template?.name || "None"}</span>
            <span>{site.createdAt.toLocaleDateString()}</span>
          </div>
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleEdit}
            >
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSettings}
            >
              Settings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
