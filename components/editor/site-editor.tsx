
"use client";

import { useState, useEffect } from "react";
import { Site } from "@prisma/client";
import { useEditorStore } from "@/lib/stores/editor-store";
import { BlockRenderer } from "./block-renderer";
import { AddBlockPanel } from "./add-block-panel";
import { SiteSettings } from "./site-settings";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Settings, 
  Save, 
  Eye, 
  Globe,
  Smartphone,
  Monitor
} from "lucide-react";

interface SiteEditorProps {
  site: Site & { blocks?: any[] };
}

export function SiteEditor({ site }: SiteEditorProps) {
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  
  const { 
    setSite, 
    isDirty, 
    isPublishing, 
    lastSaved, 
    saveDraft, 
    publishSite 
  } = useEditorStore();

  useEffect(() => {
    setSite({
      id: site.id,
      name: site.name,
      slug: site.id, // Using id as slug for now
      settings: typeof site.settings === 'object' ? site.settings as any : {},
      blocks: site.blocks || [],
    });
  }, [site, setSite]);

  const handleAutoSave = async () => {
    if (isDirty) {
      await saveDraft();
    }
  };

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(handleAutoSave, 30000);
    return () => clearInterval(interval);
  }, [isDirty]);

  const getViewportClass = () => {
    switch (viewMode) {
      case "mobile":
        return "max-w-sm mx-auto";
      case "tablet":
        return "max-w-2xl mx-auto";
      default:
        return "w-full";
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Top toolbar */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">{site.name}</h1>
          {isDirty && <Badge variant="secondary">Unsaved changes</Badge>}
          {lastSaved && (
            <span className="text-xs text-muted-foreground">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Viewport toggles */}
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "desktop" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("desktop")}
              className="rounded-r-none"
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "tablet" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("tablet")}
              className="rounded-none border-x"
            >
              <Smartphone className="h-4 w-4 rotate-90" />
            </Button>
            <Button
              variant={viewMode === "mobile" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("mobile")}
              className="rounded-l-none"
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddPanel(!showAddPanel)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Block
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={saveDraft}
            disabled={!isDirty}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>

          <Button
            size="sm"
            onClick={publishSite}
            disabled={isPublishing}
          >
            <Globe className="h-4 w-4 mr-2" />
            {isPublishing ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 overflow-auto bg-gray-50 p-8">
          <div className={`transition-all duration-300 ${getViewportClass()}`}>
            <div className="bg-white min-h-screen shadow-lg">
              <BlockRenderer />
            </div>
          </div>
        </div>

        {/* Side panels */}
        {showAddPanel && (
          <div className="w-80">
            <AddBlockPanel onClose={() => setShowAddPanel(false)} />
          </div>
        )}

        {showSettings && (
          <div className="w-80">
            <SiteSettings onClose={() => setShowSettings(false)} />
          </div>
        )}
      </div>
    </div>
  );
}
