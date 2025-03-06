import { create } from 'zustand'

interface MammothState {
  excitement: number
  happiness: number
  setExcitement: (value: number) => void
  setHappiness: (value: number) => void
  feed: () => void
  play: () => void
  groom: () => void
}

export const useMammothStore = create<MammothState>((set) => ({
  excitement: 50,
  happiness: 50,
  setExcitement: (value) => set({ excitement: value }),
  setHappiness: (value) => set({ happiness: value }),
  feed: () => set((state) => ({ 
    happiness: Math.min(100, state.happiness + 10),
    excitement: Math.min(100, state.excitement + 5)
  })),
  play: () => set((state) => ({ 
    excitement: Math.min(100, state.excitement + 15),
    happiness: Math.min(100, state.happiness + 5)
  })),
  groom: () => set((state) => ({ 
    happiness: Math.min(100, state.happiness + 10),
    excitement: Math.min(100, state.excitement + 8)
  })),
}))
