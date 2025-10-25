import { create } from 'zustand'

interface IconItem {
  id: string
  icon: React.ReactNode
  label: string
  color: string
  iconUrl: string
}

type TabType = 'draw' | 'icons' | 'categories'

interface ToolbarState {
  activeTab: TabType
  activeTool: string | null
  selectedIcon: IconItem | null
  activeCategory: string | null
  isExpanded: boolean

  // Actions
  setActiveTab: (tab: TabType) => void
  setActiveTool: (tool: string | null) => void
  setSelectedIcon: (icon: IconItem | null) => void
  setActiveCategory: (category: string | null) => void
  setIsExpanded: (expanded: boolean) => void
  resetToolbar: () => void
}

export const useToolbarStore = create<ToolbarState>((set) => ({
  activeTab: 'draw',
  activeTool: null,
  selectedIcon: null,
  activeCategory: null,
  isExpanded: true,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setActiveTool: (tool) => set({ activeTool: tool }),
  setSelectedIcon: (icon) => set({ selectedIcon: icon }),
  setActiveCategory: (category) => set({ activeCategory: category }),
  setIsExpanded: (expanded) => set({ isExpanded: expanded }),

  resetToolbar: () => set({
    activeTool: null,
    selectedIcon: null,
    activeCategory: null,
  }),
}))
