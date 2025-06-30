
"use client";

import { useEditorStore, Block } from "@/lib/stores/editor-store";
import { BlockWrapper } from "@/components/editor/blocks/block-wrapper";
import { HeaderBlock } from "@/components/editor/blocks/header-block";
import { TextBlock } from "@/components/editor/blocks/text-block";
import { ImageBlock } from "@/components/editor/image-block";
import { CTABlock } from "@/components/editor/cta-block";

interface BlockRendererProps {
  blocks?: Block[];
  isEditing?: boolean;
}

export function BlockRenderer({ blocks, isEditing = true }: BlockRendererProps) {
  const { 
    blocks: storeBlocks, 
    selectedBlockId, 
    updateBlock, 
    deleteBlock, 
    duplicateBlock,
    setSelectedBlock 
  } = useEditorStore();

  const blocksToRender = blocks || storeBlocks;

  const handleBlockUpdate = (blockId: string, updates: Partial<Block>) => {
    updateBlock(blockId, updates);
  };

  const handleBlockEdit = (blockId: string) => {
    setSelectedBlock(blockId === selectedBlockId ? null : blockId);
  };

  const handleBlockDelete = (blockId: string) => {
    deleteBlock(blockId);
  };

  const handleBlockDuplicate = (blockId: string) => {
    duplicateBlock(blockId);
  };

  const renderBlock = (block: Block) => {
    const isSelected = selectedBlockId === block.id;

    const blockContent = (() => {
      switch (block.type) {
        case "header":
          return (
            <HeaderBlock
              block={block}
              isEditing={isSelected}
              onUpdate={(updates) => handleBlockUpdate(block.id, updates)}
            />
          );
        case "text":
          return (
            <TextBlock
              block={block}
              isEditing={isSelected}
              onUpdate={(updates) => handleBlockUpdate(block.id, updates)}
            />
          );
        case "image":
          return (
            <ImageBlock
              block={block}
              isEditing={isSelected}
              onUpdate={(updates) => handleBlockUpdate(block.id, updates)}
            />
          );
        case "cta":
          return (
            <CTABlock
              block={block}
              isEditing={isSelected}
              onUpdate={(updates) => handleBlockUpdate(block.id, updates)}
            />
          );
        case "spacer":
          return <div className="py-8" />;
        default:
          return <div>Unknown block type: {block.type}</div>;
      }
    })();

    if (!isEditing) {
      return <div key={block.id}>{blockContent}</div>;
    }

    return (
      <BlockWrapper
        key={block.id}
        block={block}
        onEdit={() => handleBlockEdit(block.id)}
        onDelete={() => handleBlockDelete(block.id)}
        onDuplicate={() => handleBlockDuplicate(block.id)}
        isSelected={isSelected}
      >
        {blockContent}
      </BlockWrapper>
    );
  };

  if (blocksToRender.length === 0 && isEditing) {
    return (
      <div className="py-24 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No blocks yet
        </h3>
        <p className="text-gray-500">
          Add your first block to start building your website
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {blocksToRender
        .sort((a, b) => a.position - b.position)
        .map(renderBlock)}
    </div>
  );
}
