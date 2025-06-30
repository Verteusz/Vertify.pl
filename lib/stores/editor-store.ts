
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Block {
  id: string;
  type: "header" | "text" | "image" | "video" | "cta" | "spacer";
  content: Record<string, any>;
  position: number;
  settings?: Record<string, any>;
}

export interface Site {
  id: string;
  name: string;
  slug: string;
  settings: {
    title?: string;
    description?: string;
    favicon?: string;
    logo?: string;
    primaryColor?: string;
    customDomain?: string;
  };
  blocks: Block[];
}

interface EditorState {
  site: Site | null;
  blocks: Block[];
  selectedBlockId: string | null;
  isDirty: boolean;
  isPublishing: boolean;
  lastSaved: Date | null;
  draggedBlock: Block | null;

  // Actions
  setSite: (site: Site) => void;
  setBlocks: (blocks: Block[]) => void;
  addBlock: (block: Omit<Block, "id" | "position">) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  reorderBlocks: (startIndex: number, endIndex: number) => void;
  duplicateBlock: (id: string) => void;
  setSelectedBlock: (id: string | null) => void;
  setDraggedBlock: (block: Block | null) => void;
  updateSiteSettings: (settings: Partial<Site["settings"]>) => void;
  saveDraft: () => Promise<void>;
  publishSite: () => Promise<void>;
  markDirty: () => void;
  markClean: () => void;
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      site: null,
      blocks: [],
      selectedBlockId: null,
      isDirty: false,
      isPublishing: false,
      lastSaved: null,
      draggedBlock: null,

      setSite: (site) => set({ site, blocks: site.blocks }),

      setBlocks: (blocks) => set({ blocks }),

      addBlock: (blockData) => {
        const { blocks } = get();
        const newBlock: Block = {
          ...blockData,
          id: crypto.randomUUID(),
          position: blocks.length,
        };
        set({ 
          blocks: [...blocks, newBlock], 
          isDirty: true,
          selectedBlockId: newBlock.id 
        });
      },

      updateBlock: (id, updates) => {
        const { blocks } = get();
        const updatedBlocks = blocks.map((block) =>
          block.id === id ? { ...block, ...updates } : block
        );
        set({ blocks: updatedBlocks, isDirty: true });
      },

      deleteBlock: (id) => {
        const { blocks, selectedBlockId } = get();
        const filteredBlocks = blocks
          .filter((block) => block.id !== id)
          .map((block, index) => ({ ...block, position: index }));
        
        set({ 
          blocks: filteredBlocks, 
          isDirty: true,
          selectedBlockId: selectedBlockId === id ? null : selectedBlockId
        });
      },

      reorderBlocks: (startIndex, endIndex) => {
        const { blocks } = get();
        const result = Array.from(blocks);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        
        const reorderedBlocks = result.map((block, index) => ({
          ...block,
          position: index,
        }));
        
        set({ blocks: reorderedBlocks, isDirty: true });
      },

      duplicateBlock: (id) => {
        const { blocks } = get();
        const blockToDuplicate = blocks.find((block) => block.id === id);
        if (!blockToDuplicate) return;

        const duplicatedBlock: Block = {
          ...blockToDuplicate,
          id: crypto.randomUUID(),
          position: blockToDuplicate.position + 1,
        };

        const updatedBlocks = [
          ...blocks.slice(0, duplicatedBlock.position),
          duplicatedBlock,
          ...blocks.slice(duplicatedBlock.position).map((block) => ({
            ...block,
            position: block.position + 1,
          })),
        ];

        set({ blocks: updatedBlocks, isDirty: true });
      },

      setSelectedBlock: (id) => set({ selectedBlockId: id }),

      setDraggedBlock: (block) => set({ draggedBlock: block }),

      updateSiteSettings: (settings) => {
        const { site } = get();
        if (!site) return;
        
        const updatedSite = {
          ...site,
          settings: { ...site.settings, ...settings },
        };
        set({ site: updatedSite, isDirty: true });
      },

      saveDraft: async () => {
        const { site, blocks } = get();
        if (!site) return;

        try {
          const response = await fetch(`/api/sites/${site.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ blocks, settings: site.settings }),
          });

          if (response.ok) {
            set({ isDirty: false, lastSaved: new Date() });
          }
        } catch (error) {
          console.error("Failed to save draft:", error);
        }
      },

      publishSite: async () => {
        const { site, blocks } = get();
        if (!site) return;

        set({ isPublishing: true });
        try {
          const response = await fetch(`/api/sites/${site.id}/publish`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ blocks, settings: site.settings }),
          });

          if (response.ok) {
            set({ 
              isDirty: false, 
              lastSaved: new Date(),
              site: { ...site, published: true }
            });
          }
        } catch (error) {
          console.error("Failed to publish site:", error);
        } finally {
          set({ isPublishing: false });
        }
      },

      markDirty: () => set({ isDirty: true }),
      markClean: () => set({ isDirty: false }),
    }),
    {
      name: "editor-store",
      partialize: (state) => ({
        site: state.site,
        blocks: state.blocks,
        selectedBlockId: state.selectedBlockId,
      }),
    }
  )
);
