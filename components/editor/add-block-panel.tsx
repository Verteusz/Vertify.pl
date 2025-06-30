
"use client";

import { X, Type, Image, Video, Layout, MousePointer, Minus } from "lucide-react";
import { useEditorStore } from "@/lib/stores/editor-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AddBlockPanelProps {
  onClose: () => void;
}

const blockTypes = [
  {
    type: "header",
    name: "Header",
    description: "Add a header with title and subtitle",
    icon: Layout,
    defaultContent: {
      title: "Your Amazing Title",
      subtitle: "A compelling subtitle that draws attention",
      alignment: "center",
    },
  },
  {
    type: "text",
    name: "Text Block",
    description: "Add a paragraph of text content",
    icon: Type,
    defaultContent: {
      text: "Add your text content here. You can write paragraphs, lists, or any other text-based content.",
      alignment: "left",
    },
  },
  {
    type: "image",
    name: "Image",
    description: "Add an image with caption",
    icon: Image,
    defaultContent: {
      src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
      alt: "Example image",
      caption: "Add a caption for your image",
    },
  },
  {
    type: "cta",
    name: "Call to Action",
    description: "Add a call-to-action section",
    icon: MousePointer,
    defaultContent: {
      title: "Ready to get started?",
      description: "Join thousands of satisfied customers today.",
      buttonText: "Get Started",
      buttonUrl: "#",
    },
  },
  {
    type: "video",
    name: "Video",
    description: "Embed a video from YouTube or Vimeo",
    icon: Video,
    defaultContent: {
      src: "",
      title: "Video Title",
      description: "Video description",
    },
  },
  {
    type: "spacer",
    name: "Spacer",
    description: "Add spacing between sections",
    icon: Minus,
    defaultContent: {
      height: "medium",
    },
  },
];

export function AddBlockPanel({ onClose }: AddBlockPanelProps) {
  const { addBlock } = useEditorStore();

  const handleAddBlock = (blockType: typeof blockTypes[0]) => {
    addBlock({
      type: blockType.type as any,
      content: blockType.defaultContent,
    });
    onClose();
  };

  return (
    <div className="h-full flex flex-col bg-white border-l">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold text-lg">Add Block</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-3">
          {blockTypes.map((blockType) => {
            const Icon = blockType.icon;
            return (
              <Card
                key={blockType.type}
                className="cursor-pointer hover:bg-accent transition-colors hover:shadow-md"
                onClick={() => handleAddBlock(blockType)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <CardTitle className="text-sm font-medium">
                      {blockType.name}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground">
                    {blockType.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
