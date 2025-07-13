
"use client";

import { useState, useEffect } from "react";
import { Site } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Save, 
  Globe, 
  Settings, 
  Plus, 
  Monitor, 
  Tablet, 
  Smartphone,
  Eye
} from "lucide-react";
import { AddBlockPanel } from "./add-block-panel";
import { SiteSettings } from "./site-settings";
import { BlockRenderer } from "./block-renderer";
import { useRouter } from "next/navigation";

interface SiteEditorProps {
  site: Site & {
    template?: {
      name: string;
    } | null;
  };
}

type ViewportSize = "desktop" | "tablet" | "mobile";

export function SiteEditor({ site }: SiteEditorProps) {
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [viewport, setViewport] = useState<ViewportSize>("desktop");
  const [isDirty, setIsDirty] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [blocks, setBlocks] = useState([]);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (site.content) {
      try {
        const parsedContent = JSON.parse(site.content);
        setBlocks(parsedContent.blocks || []);
      } catch (error) {
        console.error("Error parsing site content:", error);
        setBlocks([]);
      }
    }
  }, [site.content]);

  const saveDraft = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    setIsEditingMode(true);
    
    try {
      const response = await fetch(`/api/sites/${site.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: JSON.stringify({ blocks }),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save draft");
      }

      setIsDirty(false);
      toast.success("Draft saved successfully!");
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Failed to save draft");
    } finally {
      setIsSaving(false);
      setIsEditingMode(false);
    }
  };

  const publishSite = async () => {
    if (isPublishing) return;
    
    setIsPublishing(true);
    
    try {
      // First save the current content
      await saveDraft();
      
      // Then publish
      const response = await fetch(`/api/sites/${site.id}/publish`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to publish site");
      }

      toast.success("Site published successfully!");
      router.refresh();
    } catch (error) {
      console.error("Error publishing site:", error);
      toast.error("Failed to publish site");
    } finally {
      setIsPublishing(false);
    }
  };

  const previewSite = () => {
    if (site.published && site.slug) {
      window.open(`/sites/${site.slug}`, '_blank');
    } else {
      toast.error("Site must be published to preview");
    }
  };

  const getViewportClass = () => {
    switch (viewport) {
      case "tablet":
        return "max-w-[768px] mx-auto";
      case "mobile":
        return "max-w-[375px] mx-auto";
      default:
        return "w-full";
    }
  };

  const handleContentChange = () => {
    if (!isEditingMode) {
      setIsDirty(true);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-black">
      {/* Header */}
      <div className="border-b bg-background p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">{site.name}</h1>
            {site.published && (
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Published</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Viewport controls */}
            <div className="flex items-center border rounded-md">
              <Button
                variant={viewport === "desktop" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewport("desktop")}
                className="rounded-none"
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant={viewport === "tablet" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewport("tablet")}
                className="rounded-none"
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant={viewport === "mobile" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewport("mobile")}
                className="rounded-none"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddPanel(!showAddPanel)}
              disabled={isEditingMode}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Block
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              disabled={isEditingMode}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={saveDraft}
              disabled={!isDirty || isSaving || isEditingMode}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Draft"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={previewSite}
              disabled={!site.published}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>

            <Button
              size="sm"
              onClick={publishSite}
              disabled={isPublishing || isEditingMode}
            >
              <Globe className="h-4 w-4 mr-2" />
              {isPublishing ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden bg-black">
        {/* Canvas */}
        <div className="flex-1 overflow-auto bg-black p-8">
          <div className={`transition-all duration-300 ${getViewportClass()}`}>
            <div className="bg-white min-h-screen shadow-lg">
              <BlockRenderer 
                blocks={blocks} 
                onBlocksChange={setBlocks}
                onContentChange={handleContentChange}
                isEditingDisabled={isEditingMode}
              />
            </div>
          </div>
        </div>

        {/* Side panels */}
        {showAddPanel && !isEditingMode && (
          <div className="w-80 bg-background border-l">
            <AddBlockPanel 
              onClose={() => setShowAddPanel(false)}
              onAddBlock={(block) => {
                setBlocks([...blocks, block]);
                handleContentChange();
              }}
            />
          </div>
        )}

        {showSettings && !isEditingMode && (
          <div className="w-80 bg-background border-l">
            <SiteSettings 
              site={site}
              onClose={() => setShowSettings(false)} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
