import { create } from "zustand"
import { persist } from "zustand/middleware"

type SidebarState = {
  open: boolean
  openMobile: boolean
  isMobile: boolean
  setOpen: (open: boolean) => void
  setOpenMobile: (open: boolean) => void
  toggleSidebar: () => void
  setIsMobile: (isMobile: boolean) => void

  // Chapter open/closed state
  openChapters: Record<string, boolean>
  toggleChapter: (chapterId: string) => void
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      open: true,
      openMobile: false,
      isMobile: false,
      openChapters: {}, // Default all chapters to closed

      setOpen: (open) => set({ open }),
      setOpenMobile: (openMobile) => set({ openMobile }),
      toggleSidebar: () =>
        set((state) => ({
          open: state.isMobile ? state.open : !state.open,
          openMobile: state.isMobile ? !state.openMobile : state.openMobile,
        })),
      setIsMobile: (isMobile) => set({ isMobile }),

      // Toggle chapter open/closed state
      toggleChapter: (chapterId) =>
        set((state) => ({
          openChapters: {
            ...state.openChapters,
            [chapterId]: !state.openChapters[chapterId],
          },
        })),
    }),
    {
      name: "sidebar-storage", // Name for the localStorage item
      partialize: (state) => ({
        open: state.open,
        openChapters: state.openChapters,
      }), // Only persist these fields
    },
  ),
)
