import { create } from 'zustand'
import { useConfigStore } from './configStore';

export interface MammothMemoryEntry {
  activity: 'feed' | 'play' | 'groom' | 'truffle';
  timestamp: Date;
  previousState: {
    hunger: number;
    energy: number;
    boredom: number;
    affection: number;
  };
}

// The four emotional states based on energy-happiness grid
export type EmotionalState = 
  | 'playful'    // High Energy + High Happiness
  | 'agitated'   // High Energy + Low Happiness
  | 'content'    // Low Energy + High Happiness
  | 'lethargic'  // Low Energy + Low Happiness

interface MammothState {
  // Core mood metrics (centralized as the main organizing principle)
  energy: number       // 0 = exhausted, 100 = energetic (X-axis)
  _happiness: number   // Internal base happiness value before calculation
  
  // Advanced mood metrics (these affect the core metrics)
  hunger: number       // Low hunger increases happiness
  boredom: number      // Low boredom increases happiness
  affection: number    // High affection increases happiness
  
  // Time tracking for day/night cycle effects
  lastUpdateTime: number  // Timestamp of last update (for time-based decay)
  
  // Memory log to track activities
  memoryLog: MammothMemoryEntry[]
  
  // Truffle gift mechanic
  canGiveTruffle: boolean    // Whether conditions are met for the mammoth to give a truffle
  isShowingTruffle: boolean  // Whether the truffle gift is currently being shown
  lastTruffleTime: number    // Timestamp of when the last truffle was given (to limit frequency)
  
  // Computed metrics getter functions
  getEmotionalState: () => EmotionalState    // Get the current emotional state quadrant
  getHappiness: () => number                 // Get calculated happiness value
  
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
  // Initialize core metrics
  energy: 50,        // 0 = exhausted, 100 = energetic (X-axis)
  _happiness: 50,    // Internal base value
  
  // Initialize advanced metrics
  hunger: 50,       // 0 = starving, 100 = full
  boredom: 50,      // 0 = entertained, 100 = very bored
  affection: 50,    // 0 = ignored, 100 = loved
  
  // Time tracking
  lastUpdateTime: Date.now(),
  
  // Memory log to track activities
  memoryLog: [],
  
  // Truffle gift mechanic
  canGiveTruffle: false,
  isShowingTruffle: false,
  lastTruffleTime: 0,
  
  // Get the current emotional state based on energy and happiness
  getEmotionalState: () => {
    const state = get();
    const happiness = state.getHappiness();
    
    // Determine quadrant based on energy and happiness
    if (state.energy >= 50 && happiness >= 50) {
      return 'playful';    // High Energy + High Happiness
    } else if (state.energy >= 50 && happiness < 50) {
      return 'agitated';   // High Energy + Low Happiness
    } else if (state.energy < 50 && happiness >= 50) {
      return 'content';    // Low Energy + High Happiness
    } else {
      return 'lethargic';  // Low Energy + Low Happiness
    }
  },
  
  // Compute happiness based on all underlying factors
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
    
    // Return bounded value
    return Math.max(0, Math.min(100, happiness));
  },
  
  feed: () => set((state) => {
    // Feeding increases hunger (fullness)
    const newHunger = Math.min(100, state.hunger + 40);
    
    // Feeding increases happiness modestly
    const hungerBonus = Math.min(15, (newHunger - state.hunger) / 3);
    const newHappiness = Math.min(100, state._happiness + hungerBonus);
    
    // Feeding affects energy based on current state
    // If very hungry, getting food gives energy, otherwise minimal effect
    let energyChange = state.hunger < 30 ? 15 : 5;
    const newEnergy = Math.min(100, state.energy + energyChange);
    
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
    
    // Update interaction time in config store
    useConfigStore.getState().updateLastInteractionTime();
    
    return { 
      hunger: newHunger, 
      _happiness: newHappiness,
      energy: newEnergy,
      lastUpdateTime: Date.now(),
      memoryLog: newMemoryLog
    };
  }),
  
  play: () => set((state) => {
    // Playing reduces boredom and increases energy and excitement
    const newBoredom = Math.max(0, state.boredom - 30);
    
    // Energy increases or decreases based on current energy level
    // High energy = fun but tiring; Low energy = rejuvenating but limited
    let energyChange = state.energy > 75 ? -5 : (state.energy > 25 ? 10 : 20);
    const newEnergy = Math.max(0, Math.min(100, state.energy + energyChange));
    
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
    
    // Update interaction time in config store
    useConfigStore.getState().updateLastInteractionTime();
    
    // Return the updated state
    const updatedState = { 
      boredom: newBoredom, 
      energy: newEnergy,
      _happiness: newHappiness, 
      hunger: newHunger,
      lastUpdateTime: Date.now(),
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
    
    // Grooming affects energy based on current state
    // Calming when high energy, stimulating when low energy
    let energyChange = 0;
    if (state.energy > 75) energyChange = -10; // Calming
    else if (state.energy < 25) energyChange = 10; // Stimulating
    else energyChange = 0; // Neutral
    
    const newEnergy = Math.max(0, Math.min(100, state.energy + energyChange));
    
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
    
    // Update interaction time in config store
    useConfigStore.getState().updateLastInteractionTime();
    
    // Return the updated state
    const updatedState = { 
      affection: newAffection, 
      boredom: newBoredom,
      energy: newEnergy,
      _happiness: newHappiness,
      lastUpdateTime: Date.now(),
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
    
    const currentTime = Date.now();
    const timeDiff = (currentTime - state.lastUpdateTime) / 1000; // Convert to seconds
    
    // Skip if last update was very recent
    if (timeDiff < 1) return {};
    
    // Get decay rate configuration from configStore
    const configState = useConfigStore.getState();
    
    // Calculate time of day (0-23 hours)
    const date = new Date();
    const currentHour = date.getHours();
    
    // Night time energy decay is slower (between 10 PM and 6 AM)
    const isNightTime = currentHour >= 22 || currentHour < 6;
    
    // Apply configured decay rates to each stat
    
    // Hunger decreases at configurable rate
    const newHunger = Math.max(0, state.hunger - 0.5 * timeDiff * configState.hungerDecayRate);
    
    // Energy decay with day/night cycle and configurable rate
    let energyDecay = 0.3 * timeDiff * configState.energyDecayRate;
    
    // Reduce energy decay at night - mammals conserve energy while sleeping
    if (isNightTime) {
      energyDecay *= 0.4; // 60% slower decay at night
    }
    
    // Energy regenerates if very low, otherwise decreases
    let newEnergy = state.energy;
    if (state.energy < 10) {
      newEnergy += 0.3 * timeDiff; // Rest helps recover energy when extremely low
    } else {
      newEnergy = Math.max(0, state.energy - energyDecay);
    }
    
    // Boredom increases with configurable rate
    const newBoredom = Math.min(100, state.boredom + 0.5 * timeDiff * configState.boredomDecayRate);
    
    // Affection decreases with configurable rate
    const newAffection = Math.max(0, state.affection - 0.2 * timeDiff * configState.affectionDecayRate);
    
    // Happiness decreases slowly
    const newHappiness = Math.max(0, state._happiness - 0.2 * timeDiff);
    
    // Random chance to check truffle conditions
    if (Math.random() < 0.1) { // 10% chance
      setTimeout(() => get().checkTruffleConditions(), 0);
    }
    
    return { 
      hunger: newHunger, 
      energy: newEnergy,
      boredom: newBoredom,
      affection: newAffection,
      _happiness: newHappiness,
      lastUpdateTime: currentTime
    };
  }),
  
  // Check if the mammoth should give a truffle
  checkTruffleConditions: () => set((state) => {
    // Early exit if already showing or giving a truffle
    if (state.isShowingTruffle || state.canGiveTruffle) return {};
    
    // Get current values
    const happiness = get().getHappiness();
    const emotionalState = get().getEmotionalState();
    const currentTime = Date.now();
    
    // Don't give truffles too frequently (minimum 10 minutes apart)
    const truffleTimeThreshold = 10 * 60 * 1000; // 10 minutes in milliseconds
    if (currentTime - state.lastTruffleTime < truffleTimeThreshold) return {};
    
    // Calculate the chance of giving a truffle based on emotional state
    let truffleChance = 0;
    
    // Only playful and content mammals give gifts readily
    if (emotionalState === 'playful' && happiness > 85) {
      truffleChance = 0.6; // 60% chance when very happy and energetic
    } else if (emotionalState === 'content' && happiness > 75) {
      truffleChance = 0.3; // 30% chance when happy but more relaxed
    } else if (emotionalState === 'playful' && happiness > 70) {
      truffleChance = 0.1; // 10% chance when somewhat happy and energetic
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
    // Create a memory entry for the truffle
    const newMemoryEntry: MammothMemoryEntry = {
      activity: 'truffle',
      timestamp: new Date(),
      previousState: {
        hunger: state.hunger,
        energy: state.energy,
        boredom: state.boredom,
        affection: state.affection
      }
    };
    const newMemoryLog = [...state.memoryLog, newMemoryEntry];
    
    // Reset truffle states
    return {
      canGiveTruffle: false,
      isShowingTruffle: false,
      lastTruffleTime: Date.now(),
      memoryLog: newMemoryLog,
      // Give a little happiness boost as a reward
      _happiness: Math.min(100, state._happiness + 5)
    };
  }),
  
  // Control the truffle UI visibility
  setIsShowingTruffle: (isShowing) => set({ isShowingTruffle: isShowing })
}));
