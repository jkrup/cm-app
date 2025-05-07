import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { useConfigStore } from './configStore';
import { useMammothStore } from './mammothStore';

export type NotificationType = 
  | 'hunger'    // Mammoth is hungry
  | 'energy'    // Mammoth is tired
  | 'boredom'   // Mammoth is bored
  | 'affection' // Mammoth needs affection
  | 'feeding_reminder' // Time for scheduled feeding
  | 'general'   // General notification

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: number;
  read: boolean;
  actionRequired: boolean;
  iconEmoji: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  lastNotificationCheck: number;
  notificationSoundPlayed: Record<NotificationType, number>; // Timestamps for last played sounds
  
  // Methods
  addNotification: (type: NotificationType, message: string, actionRequired?: boolean, iconEmoji?: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: string) => void;
  dismissAllNotifications: () => void;
  checkForNotifications: () => number | void;
  getUnreadCount: () => number;
  shouldPlaySound: (type: NotificationType) => boolean;
}

// Helper to get appropriate emoji for notification types
const getIconForType = (type: NotificationType): string => {
  switch (type) {
    case 'hunger': return '🍗';
    case 'energy': return '⚡';
    case 'boredom': return '😴';
    case 'affection': return '❤️';
    case 'feeding_reminder': return '⏰';
    case 'general': return '🦣';
  }
};

// Minimum time between sound notifications of the same type (15 minutes)
const SOUND_COOLDOWN = 15 * 60 * 1000; // 15 minutes in milliseconds

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      lastNotificationCheck: Date.now(),
      notificationSoundPlayed: {
        hunger: 0,
        energy: 0,
        boredom: 0,
        affection: 0, 
        feeding_reminder: 0,
        general: 0
      },
      
      addNotification: (type, message, actionRequired = true, iconEmoji) => set((state) => {
        // Generate unique ID for the notification
        const newNotification: Notification = {
          id: uuidv4(),
          type,
          message,
          timestamp: Date.now(),
          read: false,
          actionRequired,
          iconEmoji: iconEmoji || getIconForType(type)
        };
        
        // Add to notifications list and increment unread count
        return {
          notifications: [newNotification, ...state.notifications.slice(0, 19)], // Keep only 20 most recent
          unreadCount: state.unreadCount + 1,
        };
      }),
      
      markAsRead: (id) => set((state) => {
        const updatedNotifications = state.notifications.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        );
        
        // Recalculate unread count
        const unreadCount = updatedNotifications.filter(n => !n.read).length;
        
        return {
          notifications: updatedNotifications,
          unreadCount
        };
      }),
      
      markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map(notif => ({ ...notif, read: true })),
        unreadCount: 0
      })),
      
      dismissNotification: (id) => set((state) => {
        const updatedNotifications = state.notifications.filter(notif => notif.id !== id);
        const unreadCount = updatedNotifications.filter(n => !n.read).length;
        
        return {
          notifications: updatedNotifications,
          unreadCount
        };
      }),
      
      dismissAllNotifications: () => set({
        notifications: [],
        unreadCount: 0
      }),
      
      checkForNotifications: () => {
        // Get the current state
        const state = get();
        const currentTime = Date.now();
        
        // Only check every minute to avoid excessive processing
        if (currentTime - state.lastNotificationCheck < 60000) return;
        
        // Get mammoth and config states
        const mammothState = useMammothStore.getState();
        const configState = useConfigStore.getState();
        
        // Update last check time
        set({ lastNotificationCheck: currentTime });
        
        // Check for hunger notification
        if (mammothState.hunger < configState.hungerThreshold) {
          // Only add if we don't already have a recent unread hunger notification
          const hasRecentHungerNotification = state.notifications.some(
            n => n.type === 'hunger' && !n.read && currentTime - n.timestamp < 3600000
          );
          
          if (!hasRecentHungerNotification) {
            get().addNotification(
              'hunger',
              'Your mammoth is hungry! Time for a meal.',
              true
            );
          }
        }
        
        // Check for energy notification
        if (mammothState.energy < configState.energyThreshold) {
          const hasRecentEnergyNotification = state.notifications.some(
            n => n.type === 'energy' && !n.read && currentTime - n.timestamp < 3600000
          );
          
          if (!hasRecentEnergyNotification) {
            get().addNotification(
              'energy',
              'Your mammoth is exhausted and needs some rest.',
              true
            );
          }
        }
        
        // Check for boredom notification
        if (mammothState.boredom > configState.boredomThreshold) {
          const hasRecentBoredomNotification = state.notifications.some(
            n => n.type === 'boredom' && !n.read && currentTime - n.timestamp < 3600000
          );
          
          if (!hasRecentBoredomNotification) {
            get().addNotification(
              'boredom',
              'Your mammoth is getting bored. Time to play!',
              true
            );
          }
        }
        
        // Check for affection notification
        if (mammothState.affection < configState.affectionThreshold) {
          const hasRecentAffectionNotification = state.notifications.some(
            n => n.type === 'affection' && !n.read && currentTime - n.timestamp < 3600000
          );
          
          if (!hasRecentAffectionNotification) {
            get().addNotification(
              'affection',
              'Your mammoth needs some love. Try grooming!',
              true
            );
          }
        }
        
        // Check for scheduled feeding reminders
        if (configState.notificationsEnabled) {
          const now = new Date();
          const currentHour = now.getHours();
          
          // For twice-daily or daily feeding reminders
          if (configState.feedingReminderFrequency !== 'custom') {
            const shouldRemind = configState.feedingReminderHours.includes(currentHour);
            
            if (shouldRemind) {
              // Check if we already sent reminder today at this hour
              const lastReminderDate = new Date(configState.lastFeedingReminder);
              const isToday = now.toDateString() === lastReminderDate.toDateString();
              const isSameHour = currentHour === lastReminderDate.getHours();
              
              if (!isToday || !isSameHour) {
                get().addNotification(
                  'feeding_reminder',
                  'Time to feed your mammoth!',
                  true
                );
                
                // Update the last reminder time
                useConfigStore.getState().updateLastFeedingReminder();
              }
            }
          }
        }
        
        // Return the updated unread count
        return get().unreadCount;
      },
      
      getUnreadCount: () => {
        // Make sure to check for new notifications first
        get().checkForNotifications();
        return get().unreadCount;
      },
      
      shouldPlaySound: (type: NotificationType) => {
        const state = get();
        const configState = useConfigStore.getState();
        const currentTime = Date.now();
        
        // Don't play sounds if disabled
        if (!configState.soundsEnabled) return false;
        
        // Check if enough time has passed since last sound for this type
        const lastPlayed = state.notificationSoundPlayed[type];
        const shouldPlay = currentTime - lastPlayed > SOUND_COOLDOWN;
        
        // Update the last played timestamp if we're going to play
        if (shouldPlay) {
          set({
            notificationSoundPlayed: {
              ...state.notificationSoundPlayed,
              [type]: currentTime
            }
          });
        }
        
        return shouldPlay;
      }
    }),
    {
      name: 'mammoth-notification-storage',
    }
  )
); 