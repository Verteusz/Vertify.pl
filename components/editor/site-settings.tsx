
"use client";

import { useState } from "react";
import { useEditorStore } from "@/lib/stores/editor-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { X, Save } from "lucide-react";

interface SiteSettingsProps {
  onClose: () => void;
}

export function SiteSettings({ onClose }: SiteSettingsProps) {
  const { site, updateSiteSettings, saveDraft } = useEditorStore();
  const [settings, setSettings] = useState(site?.settings || {});
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    updateSiteSettings(settings);
    await saveDraft();
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="h-full flex flex-col bg-white border-l">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold text-lg">Site Settings</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">SEO & Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Site Title</Label>
              <Input
                id="title"
                value={settings.title || ""}
                onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                placeholder="Your Site Title"
              />
            </div>
            <div>
              <Label htmlFor="description">Meta Description</Label>
              <Textarea
                id="description"
                value={settings.description || ""}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                placeholder="A brief description of your site"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Branding</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                value={settings.logo || ""}
                onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div>
              <Label htmlFor="favicon">Favicon URL</Label>
              <Input
                id="favicon"
                value={settings.favicon || ""}
                onChange={(e) => setSettings({ ...settings, favicon: e.target.value })}
                placeholder="https://example.com/favicon.ico"
              />
            </div>
            <div>
              <Label htmlFor="primaryColor">Primary Color</Label>
              <Input
                id="primaryColor"
                type="color"
                value={settings.primaryColor || "#3b82f6"}
                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Domain</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="customDomain">Custom Domain</Label>
              <Input
                id="customDomain"
                value={settings.customDomain || ""}
                onChange={(e) => setSettings({ ...settings, customDomain: e.target.value })}
                placeholder="yourdomain.com"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Configure DNS to point to your Replit deployment
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-4 border-t">
        <Button 
          onClick={handleSave} 
          disabled={isLoading}
          className="w-full"
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
