import { create } from 'zustand'

export interface MammothMemoryEntry {
  activity: 'feed' | 'play' | 'groom';
  timestamp: Date;
  previousState: {
    hunger: number;
    energy: number;
    boredom: number;
    affection: number;
  };
}

interface MammothState {
  // Core mood metrics (these are derived from advanced metrics)
  
  // Advanced mood metrics (these affect the core metrics)
  hunger: number       // Low hunger increases happiness
  energy: number       // High energy increases excitement
  boredom: number      // Low boredom increases happiness
  affection: number    // High affection increases happiness
  
  // Internal metrics (not directly shown to users)
  _excitement: number  // Base excitement value before calculation
  _happiness: number   // Base happiness value before calculation
  
  // Memory log to track activities
  memoryLog: MammothMemoryEntry[]
  
  // Computed metrics getter functions
  getExcitement: () => number
  getHappiness: () => number
  
  // Actions that interact with the stats
  feed: () => void
  play: () => void
  groom: () => void
  
  // Time-based stat decay function
  decreaseStats: () => void
}

export const useMammothStore = create<MammothState>((set, get) => ({
  // Initialize advanced metrics
  hunger: 50,       // 0 = starving, 100 = full
  energy: 24,       // 0 = exhausted, 100 = energetic
  boredom: 50,      // 0 = entertained, 100 = very bored
  affection: 50,    // 0 = ignored, 100 = loved
  
  // Initialize internal base metrics
  _excitement: 50,
  _happiness: 50,
  
  // Memory log to track activities
  memoryLog: [],
  
  // Compute actual display metrics based on all underlying factors
  getExcitement: () => {
    const state = get();
    
    // Calculate excitement based on underlying metrics
    let excitement = state._excitement;
    
    // Energy greatly affects excitement
    if (state.energy < 20) excitement -= 15;
    else if (state.energy > 80) excitement += 15;
    else excitement += (state.energy - 50) * 0.2;
    
    // Boredom affects excitement
    if (state.boredom > 80) excitement -= 10;
    else if (state.boredom < 20) excitement += 10;
    
    // Affection moderately affects excitement
    excitement += (state.affection - 50) * 0.1;
    
    // Return bounded value
    return Math.max(0, Math.min(100, excitement));
  },
  
  getHappiness: () => {
    const state = get();
    
    // Calculate happiness based on underlying metrics
    let happiness = state._happiness;
    
    // Hunger greatly affects happiness
    if (state.hunger < 20) happiness -= 20;
    else if (state.hunger > 80) happiness += 10;
    else happiness += (state.hunger - 50) * 0.1;
    
    // Boredom affects happiness
    if (state.boredom > 80) happiness -= 15;
    else if (state.boredom < 20) happiness += 10;
    
    // Affection greatly affects happiness
    happiness += (state.affection - 50) * 0.3;
    
    // Energy moderately affects happiness
    if (state.energy < 20) happiness -= 5;
    else if (state.energy > 80) happiness += 5;
    
    // Return bounded value
    return Math.max(0, Math.min(100, happiness));
  },
  
  feed: () => set((state) => {
    // Feeding reduces hunger and slightly increases happiness
    const newHunger = Math.max(0, Math.min(100, state.hunger + 30));
    
    // Feeding can affect energy differently based on current energy levels
    // If energy is low, food gives a boost; if already high, makes a bit sleepy
    const energyChange = state.energy < 40 ? 10 : -5;
    const newEnergy = Math.max(0, Math.min(100, state.energy + energyChange));
    
    // Calculate how this action affects the base metrics
    // More excited if was very hungry
    const excitementBoost = state.hunger < 20 ? 15 : 5;
    const newExcitement = Math.min(100, state._excitement + excitementBoost);
    
    // Happiness boost depends on how hungry the mammoth was
    const hungerBonus = Math.min(10, (newHunger - state.hunger) / 3);
    const newHappiness = Math.min(100, state._happiness + hungerBonus);
    
    // Update memory log
    const newMemoryEntry: MammothMemoryEntry = {
      activity: 'feed',
      timestamp: new Date(),
      previousState: {
        hunger: state.hunger,
        energy: state.energy,
        boredom: state.boredom,
        affection: state.affection
      }
    };
    const newMemoryLog = [...state.memoryLog, newMemoryEntry];
    
    return { 
      hunger: newHunger,
      energy: newEnergy,
      _happiness: newHappiness,
      _excitement: newExcitement,
      memoryLog: newMemoryLog
    };
  }),
  
  play: () => set((state) => {
    // Playing reduces boredom and increases energy and excitement
    const newBoredom = Math.max(0, state.boredom - 30);
    // Energy may decrease if already low (tired from playing)
    const energyChange = state.energy > 25 ? 10 : -5;
    const newEnergy = Math.max(0, Math.min(100, state.energy + energyChange));
    
    // Playing increases excitement significantly
    const newExcitement = Math.min(100, state._excitement + 15);
    
    // Playing increases happiness modestly
    const boredomBonus = Math.min(10, (state.boredom - newBoredom) / 3);
    const newHappiness = Math.min(100, state._happiness + 5 + boredomBonus);
    
    // Playing might increase hunger (using energy)
    const newHunger = Math.max(0, state.hunger - 5);
    
    // Update memory log
    const newMemoryEntry: MammothMemoryEntry = {
      activity: 'play',
      timestamp: new Date(),
      previousState: {
        hunger: state.hunger,
        energy: state.energy,
        boredom: state.boredom,
        affection: state.affection
      }
    };
    const newMemoryLog = [...state.memoryLog, newMemoryEntry];
    
    return { 
      boredom: newBoredom,
      energy: newEnergy,
      _excitement: newExcitement,
      _happiness: newHappiness,
      hunger: newHunger,
      memoryLog: newMemoryLog
    };
  }),
  
  groom: () => set((state) => {
    // Grooming increases affection and slightly reduces boredom
    const newAffection = Math.min(100, state.affection + 25);
    const newBoredom = Math.max(0, state.boredom - 10);
    
    // Grooming makes the mammoth calmer (reduces excitement if high, increases if low)
    let excitementChange = 0;
    if (state._excitement > 75) excitementChange = -5; // Calms down
    else if (state._excitement < 25) excitementChange = 15; // Perks up
    else excitementChange = 8; // Moderate increase
    
    const newExcitement = Math.max(0, Math.min(100, state._excitement + excitementChange));
    
    // Affection increases happiness significantly
    const affectionBonus = (newAffection - state.affection) / 2.5;
    const newHappiness = Math.min(100, state._happiness + affectionBonus);
    
    // Update memory log
    const newMemoryEntry: MammothMemoryEntry = {
      activity: 'groom',
      timestamp: new Date(),
      previousState: {
        hunger: state.hunger,
        energy: state.energy,
        boredom: state.boredom,
        affection: state.affection
      }
    };
    const newMemoryLog = [...state.memoryLog, newMemoryEntry];
    
    return { 
      affection: newAffection,
      boredom: newBoredom,
      _excitement: newExcitement,
      _happiness: newHappiness,
      memoryLog: newMemoryLog
    };
  }),
  
  // Time-based stat decay
  decreaseStats: () => set((state) => {
    // Each stat decays at a different rate
    const newHunger = Math.max(0, state.hunger - 0.8);        // Gets hungry faster
    const newEnergy = Math.max(0, state.energy - 0.4);        // Loses energy slowly
    const newBoredom = Math.min(100, state.boredom + 1.0);    // Gets bored faster
    const newAffection = Math.max(0, state.affection - 0.3);  // Affection fades slowly
    
    // Apply base decay to internal metrics
    const newBaseExcitement = Math.max(0, state._excitement - 0.5);
    const newBaseHappiness = Math.max(0, state._happiness - 0.5);
    
    return {
      hunger: newHunger,
      energy: newEnergy,
      boredom: newBoredom,
      affection: newAffection,
      _happiness: newBaseHappiness,
      _excitement: newBaseExcitement
    };
  }),
}))
