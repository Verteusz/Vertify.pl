
"use client";

import { useRouter } from "next/navigation";
import { Site, Template } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Edit, Globe } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

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
  const [isPublishing, setIsPublishing] = useState(false);

  const handleEdit = () => {
    router.push(`/dashboard/sites/${site.id}/edit`);
  };

  const handlePublish = async () => {
    if (!site.content) {
      toast.error("No content to publish. Please edit your site first.");
      return;
    }

    setIsPublishing(true);
    try {
      const response = await fetch(`/api/sites/${site.id}/publish`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to publish site");
      }

      toast.success("Site published successfully!");
      router.refresh();
    } catch (error) {
      toast.error("Failed to publish site. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleViewSite = () => {
    if (site.published) {
      window.open(`/sites/${site.slug}`, "_blank");
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="line-clamp-1">{site.name}</CardTitle>
            {site.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {site.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {site.published ? (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <Globe className="w-3 h-3 mr-1" />
                Published
              </Badge>
            ) : (
              <Badge variant="secondary">Draft</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Created {formatDate(site.createdAt)}</span>
            {site.template && (
              <span className="text-xs bg-muted px-2 py-1 rounded">
                {site.template.name}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="flex-1"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            
            {site.published ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewSite}
                className="flex-1"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handlePublish}
                disabled={isPublishing || !site.content}
                className="flex-1"
              >
                {isPublishing ? "Publishing..." : "Publish"}
              </Button>
            )}
          </div>
          
          {site.published && (
            <div className="text-xs text-muted-foreground">
              <span className="font-mono bg-muted px-2 py-1 rounded">
                /sites/{site.slug}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
