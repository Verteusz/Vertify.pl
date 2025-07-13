"use client";

import { useState } from "react";
import { Site } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { X, Save, Globe, Palette, Settings2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SiteSettingsProps {
  site: Site;
  onClose: () => void;
}

export function SiteSettings({ site, onClose }: SiteSettingsProps) {
  const [name, setName] = useState(site.name);
  const [description, setDescription] = useState(site.description || "");
  const [slug, setSlug] = useState(site.slug || "");
  const [seoTitle, setSeoTitle] = useState(site.name);
  const [seoDescription, setSeoDescription] = useState(site.description || "");
  const [primaryColor, setPrimaryColor] = useState("#3b82f6");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (isSaving) return;

    setIsSaving(true);

    try {
      const response = await fetch(`/api/sites/${site.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          slug: slug || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update site settings");
      }

      toast.success("Site settings updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating site settings:", error);
      toast.error("Failed to update site settings");
    } finally {
      setIsSaving(false);
    }
  };

  const generateSlug = () => {
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(baseSlug);
  };

  return (
    <div className="h-full flex flex-col bg-white border-l">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <Settings2 className="h-5 w-5" />
          Site Settings
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="site-name">Site Name</Label>
                  <Input
                    id="site-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter site name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="site-description">Description</Label>
                  <Textarea
                    id="site-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter site description"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="site-slug">URL Slug</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="site-slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="site-url-slug"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generateSlug}
                      disabled={!name}
                    >
                      Generate
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your site will be available at: /sites/{slug || "your-slug"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  SEO & Metadata
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seo-title">Meta Title</Label>
                  <Input
                    id="seo-title"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="Your Site Title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seo-description">Meta Description</Label>
                  <Textarea
                    id="seo-description"
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="A brief description of your site"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="design" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Design & Branding
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="p-4 border-t">
        <Button 
          onClick={handleSave} 
          disabled={!name || isSaving}
          className="w-full"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}