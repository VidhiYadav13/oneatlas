import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FilterState, Modality, Capability, ModelCategory, SortOption } from "../types";

export const initialFilters: FilterState = {
  search: "",
  labs: [],
  providers: [],
  category: "all",
  modalities: [],
  capabilities: [],
  isOpenWeightsOnly: false,
  isProprietaryOnly: false,
  maxInputPrice: 0,
  minContextWindow: 0,
  sortBy: "trending",
};

interface AppState {
  // Model Comparison
  compareSlugs: string[];
  addToCompare: (slug: string) => boolean;
  removeFromCompare: (slug: string) => void;
  clearCompare: () => void;
  isComparing: (slug: string) => boolean;

  // Favorites / Bookmarks
  favorites: string[];
  toggleFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;

  // View Mode
  viewMode: "grid" | "table";
  setViewMode: (mode: "grid" | "table") => void;

  // Search & Filtering
  filters: FilterState;
  setSearch: (search: string) => void;
  setCategory: (category: ModelCategory) => void;
  toggleLab: (labSlug: string) => void;
  toggleProvider: (providerSlug: string) => void;
  toggleModality: (modality: Modality) => void;
  toggleCapability: (capability: Capability) => void;
  setOpenWeightsOnly: (enabled: boolean) => void;
  setProprietaryOnly: (enabled: boolean) => void;
  setMaxInputPrice: (price: number) => void;
  setMinContextWindow: (tokens: number) => void;
  setSortBy: (sortBy: SortOption) => void;
  resetFilters: () => void;

  // Command Palette
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;

  // Quick Playground Modal
  playgroundSlug: string | null;
  openPlayground: (slug: string) => void;
  closePlayground: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      compareSlugs: ["claude-3-7-sonnet", "o1", "deepseek-r1"],
      addToCompare: (slug: string) => {
        const current = get().compareSlugs;
        if (current.includes(slug)) {
          set({ compareSlugs: current.filter((s) => s !== slug) });
          return false;
        }
        if (current.length >= 4) {
          // Limit to max 4 models for clean side-by-side comparison
          set({ compareSlugs: [...current.slice(1), slug] });
          return true;
        }
        set({ compareSlugs: [...current, slug] });
        return true;
      },
      removeFromCompare: (slug: string) => {
        set({ compareSlugs: get().compareSlugs.filter((s) => s !== slug) });
      },
      clearCompare: () => {
        set({ compareSlugs: [] });
      },
      isComparing: (slug: string) => {
        return get().compareSlugs.includes(slug);
      },

      favorites: [],
      toggleFavorite: (slug: string) => {
        const current = get().favorites;
        if (current.includes(slug)) {
          set({ favorites: current.filter((s) => s !== slug) });
        } else {
          set({ favorites: [...current, slug] });
        }
      },
      isFavorite: (slug: string) => {
        return get().favorites.includes(slug);
      },

      viewMode: "grid",
      setViewMode: (mode: "grid" | "table") => {
        set({ viewMode: mode });
      },

      filters: initialFilters,
      setSearch: (search: string) => {
        set((state) => ({ filters: { ...state.filters, search } }));
      },
      setCategory: (category: ModelCategory) => {
        set((state) => ({ filters: { ...state.filters, category } }));
      },
      toggleLab: (labSlug: string) => {
        set((state) => {
          const current = state.filters.labs;
          const next = current.includes(labSlug)
            ? current.filter((l) => l !== labSlug)
            : [...current, labSlug];
          return { filters: { ...state.filters, labs: next } };
        });
      },
      toggleProvider: (providerSlug: string) => {
        set((state) => {
          const current = state.filters.providers;
          const next = current.includes(providerSlug)
            ? current.filter((p) => p !== providerSlug)
            : [...current, providerSlug];
          return { filters: { ...state.filters, providers: next } };
        });
      },
      toggleModality: (modality: Modality) => {
        set((state) => {
          const current = state.filters.modalities;
          const next = current.includes(modality)
            ? current.filter((m) => m !== modality)
            : [...current, modality];
          return { filters: { ...state.filters, modalities: next } };
        });
      },
      toggleCapability: (capability: Capability) => {
        set((state) => {
          const current = state.filters.capabilities;
          const next = current.includes(capability)
            ? current.filter((c) => c !== capability)
            : [...current, capability];
          return { filters: { ...state.filters, capabilities: next } };
        });
      },
      setOpenWeightsOnly: (enabled: boolean) => {
        set((state) => ({
          filters: {
            ...state.filters,
            isOpenWeightsOnly: enabled,
            isProprietaryOnly: enabled ? false : state.filters.isProprietaryOnly,
          },
        }));
      },
      setProprietaryOnly: (enabled: boolean) => {
        set((state) => ({
          filters: {
            ...state.filters,
            isProprietaryOnly: enabled,
            isOpenWeightsOnly: enabled ? false : state.filters.isOpenWeightsOnly,
          },
        }));
      },
      setMaxInputPrice: (price: number) => {
        set((state) => ({ filters: { ...state.filters, maxInputPrice: price } }));
      },
      setMinContextWindow: (tokens: number) => {
        set((state) => ({ filters: { ...state.filters, minContextWindow: tokens } }));
      },
      setSortBy: (sortBy: SortOption) => {
        set((state) => ({ filters: { ...state.filters, sortBy } }));
      },
      resetFilters: () => {
        set({ filters: initialFilters });
      },

      commandPaletteOpen: false,
      setCommandPaletteOpen: (open: boolean) => {
        set({ commandPaletteOpen: open });
      },

      playgroundSlug: null,
      openPlayground: (slug: string) => {
        set({ playgroundSlug: slug });
      },
      closePlayground: () => {
        set({ playgroundSlug: null });
      },
    }),
    {
      name: "oneatlas-storage",
      partialize: (state) => ({
        compareSlugs: state.compareSlugs,
        favorites: state.favorites,
        viewMode: state.viewMode,
      }),
    }
  )
);
