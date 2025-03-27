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
  
  // Truffle gift mechanic
  canGiveTruffle: boolean    // Whether conditions are met for the mammoth to give a truffle
  isShowingTruffle: boolean  // Whether the truffle gift is currently being shown
  lastTruffleTime: number    // Timestamp of when the last truffle was given (to limit frequency)
  
  // Computed metrics getter functions
  getExcitement: () => number
  getHappiness: () => number
  
  // Actions that interact with the stats
  feed: () => void
  play: () => void
  groom: () => void
  
  // Time-based stat decay function
  decreaseStats: () => void
  
  // Truffle related functions
  checkTruffleConditions: () => void  // Check if the mammoth should give a truffle
  acceptTruffle: () => void           // Handle when the user accepts a truffle
  setIsShowingTruffle: (isShowing: boolean) => void // Control the truffle gift UI
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
  
  // Truffle gift mechanic
  canGiveTruffle: false,
  isShowingTruffle: false,
  lastTruffleTime: 0,
  
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
    // Feeding increases hunger (fullness)
    const newHunger = Math.min(100, state.hunger + 40);
    
    // Feeding increases happiness modestly
    const hungerBonus = Math.min(15, (newHunger - state.hunger) / 3);
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
      _happiness: newHappiness,
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
    
    // Return the updated state
    const updatedState = { 
      boredom: newBoredom, 
      energy: newEnergy, 
      _excitement: newExcitement, 
      _happiness: newHappiness, 
      hunger: newHunger, 
      memoryLog: newMemoryLog 
    };
    
    // Check truffle conditions after updating state
    setTimeout(() => get().checkTruffleConditions(), 0);
    
    return updatedState;
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
    
    // Return the updated state
    const updatedState = { 
      affection: newAffection, 
      boredom: newBoredom, 
      _excitement: newExcitement, 
      _happiness: newHappiness, 
      memoryLog: newMemoryLog 
    };
    
    // Check truffle conditions after updating state
    setTimeout(() => get().checkTruffleConditions(), 0);
    
    return updatedState;
  }),
  
  decreaseStats: () => set((state) => {
    // Gradually decrease stats over time
    // This creates the need for regular interaction
    
    // Only decrease if we're not showing the truffle
    if (state.isShowingTruffle) return {};
    
    // Hunger decreases slowly
    const newHunger = Math.max(0, state.hunger - 0.5);
    
    // Energy and excitement regenerate slowly if very low, otherwise decrease slightly
    let newEnergy = state.energy;
    if (state.energy < 10) newEnergy += 0.3;
    else newEnergy = Math.max(0, state.energy - 0.3);
    
    let newExcitement = state._excitement;
    if (state._excitement < 10) newExcitement += 0.2;
    else newExcitement = Math.max(0, state._excitement - 0.2);
    
    // Boredom increases over time
    const newBoredom = Math.min(100, state.boredom + 0.5);
    
    // Affection decreases slowly
    const newAffection = Math.max(0, state.affection - 0.2);
    
    // Happiness decreases slowly
    const newHappiness = Math.max(0, state._happiness - 0.2);
    
    // Random chance to check truffle conditions
    if (Math.random() < 0.1) { // 10% chance
      setTimeout(() => get().checkTruffleConditions(), 0);
    }
    
    return { 
      hunger: newHunger, 
      energy: newEnergy,
      _excitement: newExcitement,
      boredom: newBoredom,
      affection: newAffection,
      _happiness: newHappiness
    };
  }),
  
  // Check if the mammoth should give a truffle
  checkTruffleConditions: () => set((state) => {
    // Early exit if already showing or giving a truffle
    if (state.isShowingTruffle || state.canGiveTruffle) return {};
    
    // Get current values
    const happiness = get().getHappiness();
    const excitement = get().getExcitement();
    const currentTime = Date.now();
    
    // Don't give truffles too frequently (minimum 10 minutes apart)
    const truffleTimeThreshold = 10 * 60 * 1000; // 10 minutes in milliseconds
    if (currentTime - state.lastTruffleTime < truffleTimeThreshold) return {};
    
    // Calculate the chance of giving a truffle based on how happy the mammoth is
    // Higher happiness = higher chance
    let truffleChance = 0;
    
    // The mammoth must be both happy and excited to give a truffle
    if (happiness > 85 && excitement > 80) {
      truffleChance = 0.6; // 60% chance when very happy
    } else if (happiness > 75 && excitement > 70) {
      truffleChance = 0.3; // 30% chance when pretty happy
    } else if (happiness > 65 && excitement > 60) {
      truffleChance = 0.1; // 10% chance when somewhat happy
    }
    
    // Slightly increase chance based on affection level
    truffleChance += (state.affection / 500); // Adds up to 0.2 (20%) at max affection
    
    // Random roll to see if we should give a truffle
    const shouldGiveTruffle = Math.random() < truffleChance;
    
    if (shouldGiveTruffle) {
      return { canGiveTruffle: true };
    }
    
    return {};
  }),
  
  // Handle accepting the truffle gift
  acceptTruffle: () => set((state) => {
    // Reset truffle states
    return {
      canGiveTruffle: false,
      isShowingTruffle: false,
      lastTruffleTime: Date.now(),
      // Give a little happiness boost as a reward
      _happiness: Math.min(100, state._happiness + 5)
    };
  }),
  
  // Control the truffle UI visibility
  setIsShowingTruffle: (isShowing) => set({ isShowingTruffle: isShowing })
}));
