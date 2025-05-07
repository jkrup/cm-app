import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ConfigState {
  // Decay rate multipliers (1.0 = normal)
  hungerDecayRate: number;    // How quickly hunger decreases
  energyDecayRate: number;    // How quickly energy decreases
  boredomDecayRate: number;   // How quickly boredom increases
  affectionDecayRate: number; // How quickly affection decreases
  
  // Critical thresholds for triggering notifications
  hungerThreshold: number;    // Below this value, hunger is critical
  energyThreshold: number;    // Below this value, energy is critical
  boredomThreshold: number;   // Above this value, boredom is critical
  affectionThreshold: number; // Below this value, affection is critical
  
  // Notification settings
  notificationsEnabled: boolean;
  soundsEnabled: boolean;
  feedingReminderFrequency: 'twice-daily' | 'daily' | 'custom';
  feedingReminderHours: number[];  // Hours to remind (in 24h format)
  lastFeedingReminder: number;     // Timestamp of last feeding reminder
  
  // Time settings
  lastInteractionTime: number;     // Timestamp of last user interaction
  
  // Methods to update settings
  setDecayRates: (rates: {
    hunger?: number;
    energy?: number;
    boredom?: number;
    affection?: number;
  }) => void;
  
  setThresholds: (thresholds: {
    hunger?: number;
    energy?: number;
    boredom?: number;
    affection?: number;
  }) => void;
  
  setNotificationSettings: (settings: {
    enabled?: boolean;
    sounds?: boolean;
    feedingFrequency?: 'twice-daily' | 'daily' | 'custom';
    feedingHours?: number[];
  }) => void;
  
  updateLastInteractionTime: () => void;
  updateLastFeedingReminder: () => void;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      // Default decay rates
      hungerDecayRate: 1.0,
      energyDecayRate: 1.0,
      boredomDecayRate: 1.0,
      affectionDecayRate: 1.0,
      
      // Default thresholds
      hungerThreshold: 20,
      energyThreshold: 15,
      boredomThreshold: 80,
      affectionThreshold: 20,
      
      // Default notification settings
      notificationsEnabled: true,
      soundsEnabled: true,
      feedingReminderFrequency: 'twice-daily',
      feedingReminderHours: [8, 20],  // 8 AM and 8 PM by default
      lastFeedingReminder: 0,
      
      // Time tracking
      lastInteractionTime: Date.now(),
      
      // Methods
      setDecayRates: (rates) => set((state) => ({
        hungerDecayRate: rates.hunger !== undefined ? rates.hunger : state.hungerDecayRate,
        energyDecayRate: rates.energy !== undefined ? rates.energy : state.energyDecayRate,
        boredomDecayRate: rates.boredom !== undefined ? rates.boredom : state.boredomDecayRate,
        affectionDecayRate: rates.affection !== undefined ? rates.affection : state.affectionDecayRate,
      })),
      
      setThresholds: (thresholds) => set((state) => ({
        hungerThreshold: thresholds.hunger !== undefined ? thresholds.hunger : state.hungerThreshold,
        energyThreshold: thresholds.energy !== undefined ? thresholds.energy : state.energyThreshold,
        boredomThreshold: thresholds.boredom !== undefined ? thresholds.boredom : state.boredomThreshold,
        affectionThreshold: thresholds.affection !== undefined ? thresholds.affection : state.affectionThreshold,
      })),
      
      setNotificationSettings: (settings) => set((state) => ({
        notificationsEnabled: settings.enabled !== undefined ? settings.enabled : state.notificationsEnabled,
        soundsEnabled: settings.sounds !== undefined ? settings.sounds : state.soundsEnabled,
        feedingReminderFrequency: settings.feedingFrequency || state.feedingReminderFrequency,
        feedingReminderHours: settings.feedingHours || state.feedingReminderHours,
      })),
      
      updateLastInteractionTime: () => set({ lastInteractionTime: Date.now() }),
      updateLastFeedingReminder: () => set({ lastFeedingReminder: Date.now() }),
    }),
    {
      name: 'mammoth-config-storage',
    }
  )
); 