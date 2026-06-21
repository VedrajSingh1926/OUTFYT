import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Outfit, type StyleMemory, type Weather } from '@/lib/api';

export interface StyleSyncState {

  memory: StyleMemory | null;
  weather: Weather | null;
  outfitHistory: Outfit[][];
  activeHistoryIndex: number;
  conversationalMemory: string[];
  lastOutfits: Outfit[];
  
  // Actions
  setMemory: (memory: StyleMemory | null) => void;
  setWeather: (weather: Weather | null) => void;
  addOutfitVersion: (outfits: Outfit[]) => void;
  setActiveHistoryIndex: (index: number) => void;
  setLastOutfits: (outfits: Outfit[]) => void;
  addConversationalRefinement: (refinement: string) => void;
  addLike: (item: string) => void;
  addDislike: (item: string) => void;
  clearSession: () => void;
}

export const useStyleSyncStore = create<StyleSyncState>()(
  persist(
    (set) => ({
      memory: null,
      weather: null,
      outfitHistory: [],
      activeHistoryIndex: 0,
      conversationalMemory: [],
      lastOutfits: [],
      
      setMemory: (memory) => set({ memory }),
      setWeather: (weather) => set({ weather }),
      addOutfitVersion: (outfits) => set((state) => {
        const nextHistory = [...state.outfitHistory, outfits];
        return { outfitHistory: nextHistory, activeHistoryIndex: nextHistory.length - 1, lastOutfits: outfits };
      }),
      setActiveHistoryIndex: (index) => set((state) => ({ 
        activeHistoryIndex: index,
        lastOutfits: state.outfitHistory[index] || []
      })),
      setLastOutfits: (outfits) => set({ lastOutfits: outfits }),
      addConversationalRefinement: (refinement) => set((state) => ({
        conversationalMemory: [...state.conversationalMemory, refinement]
      })),
      addLike: (item) => set((state) => ({
        memory: state.memory ? { ...state.memory, likes: [...new Set([...(state.memory.likes || []), item])] } : null
      })),
      addDislike: (item) => set((state) => ({
        memory: state.memory ? { ...state.memory, dislikes: [...new Set([...(state.memory.dislikes || []), item])] } : null
      })),
      clearSession: () => set({
        memory: null,
        outfitHistory: [],
        activeHistoryIndex: 0,
        conversationalMemory: [],
        lastOutfits: []
      })
    }),
    {
      name: 'stylesync-storage',
    }
  )
);
