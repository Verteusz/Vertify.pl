
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, X, Plus } from "lucide-react";
import { BLOCK_CATEGORIES, BLOCK_TYPES, getBlocksByCategory, type BlockType } from "@/lib/block-types";

interface AddBlockPanelProps {
  onClose: () => void;
  onAddBlock: (block: any) => void;
}

export function AddBlockPanel({ onClose, onAddBlock }: AddBlockPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("basic");

  const filteredBlocks = searchTerm 
    ? BLOCK_TYPES.filter(block => 
        block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        block.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : getBlocksByCategory(selectedCategory);

  const handleAddBlock = (blockType: BlockType) => {
    const newBlock = {
      id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: blockType.id,
      content: { ...blockType.defaultContent },
      settings: { ...blockType.settings }
    };

    onAddBlock(newBlock);
    onClose();
  };

  const categoryTabs = Object.values(BLOCK_CATEGORIES);

  return (
    <div className="h-full flex flex-col bg-white border-l">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Block
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search blocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Categories or Search Results */}
      <div className="flex-1 overflow-hidden">
        {searchTerm ? (
          <ScrollArea className="h-full p-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-muted-foreground">
                  {filteredBlocks.length} blocks found
                </span>
              </div>
              {filteredBlocks.map((blockType) => (
                <BlockItem
                  key={blockType.id}
                  blockType={blockType}
                  onAdd={handleAddBlock}
                />
              ))}
              {filteredBlocks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No blocks found</p>
                  <p className="text-sm">Try a different search term</p>
                </div>
              )}
            </div>
          </ScrollArea>
        ) : (
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="h-full flex flex-col">
            <div className="px-4 pt-2">
              <TabsList className="grid w-full grid-cols-3 gap-1 h-auto p-1">
                {categoryTabs.slice(0, 3).map((category) => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="text-xs py-2 px-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <span className="mr-1">{category.icon}</span>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsList className="grid w-full grid-cols-2 gap-1 h-auto p-1 mt-1">
                {categoryTabs.slice(3).map((category) => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="text-xs py-2 px-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <span className="mr-1">{category.icon}</span>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {categoryTabs.map((category) => (
              <TabsContent key={category.id} value={category.id} className="flex-1 mt-4">
                <ScrollArea className="h-full px-4">
                  <div className="space-y-2 pb-4">
                    {getBlocksByCategory(category.id).map((blockType) => (
                      <BlockItem
                        key={blockType.id}
                        blockType={blockType}
                        onAdd={handleAddBlock}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
}

interface BlockItemProps {
  blockType: BlockType;
  onAdd: (blockType: BlockType) => void;
}

function BlockItem({ blockType, onAdd }: BlockItemProps) {
  return (
    <button
      onClick={() => onAdd(blockType)}
      className="w-full p-3 text-left border rounded-lg hover:bg-muted/50 hover:border-primary/50 transition-all duration-200 group"
    >
      <div className="flex items-start space-x-3">
        <div className="text-2xl group-hover:scale-110 transition-transform">
          {blockType.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
              {blockType.name}
            </h4>
            <Badge variant="secondary" className="text-xs">
              {BLOCK_CATEGORIES[blockType.category.toUpperCase() as keyof typeof BLOCK_CATEGORIES]?.name}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {blockType.description}
          </p>
        </div>
      </div>
    </button>
  );
}
