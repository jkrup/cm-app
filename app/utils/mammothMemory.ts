import { MammothMemoryEntry, useMammothStore } from "../store/mammothStore";

/**
 * Utility function to format the timestamp in a more readable way
 * @param timestamp The timestamp to format
 * @returns A formatted date string
 */
export function formatMemoryTimestamp(timestamp: Date): string {
  return new Date(timestamp).toLocaleString();
}

/**
 * Get a descriptive text for a memory entry
 * @param entry The memory entry
 * @returns A descriptive string of the activity
 */
export function getMemoryDescription(entry: MammothMemoryEntry): string {
  const { activity, previousState } = entry;
  
  switch (activity) {
    case 'feed':
      return `Fed the mammoth when it was ${previousState.hunger < 30 ? 'very hungry' : 
        previousState.hunger < 60 ? 'hungry' : 'not very hungry'}`;
    
    case 'play':
      return `Played with the mammoth when it was ${previousState.boredom > 70 ? 'very bored' : 
        previousState.boredom > 40 ? 'bored' : 'not very bored'}`;
    
    case 'groom':
      return `Groomed the mammoth when its affection was ${previousState.affection < 30 ? 'low' : 
        previousState.affection < 60 ? 'moderate' : 'high'}`;
    
    default:
      return `Interacted with the mammoth`;
  }
}

/**
 * Get a list of all memory entries ordered by timestamp (most recent first)
 * @returns Array of memory entries
 */
export function getOrderedMemoryEntries(): MammothMemoryEntry[] {
  const memoryLog = useMammothStore.getState().memoryLog;
  return [...memoryLog].sort((a: MammothMemoryEntry, b: MammothMemoryEntry) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

/**
 * Get memory entries filtered by activity type
 * @param activityType The type of activity to filter by
 * @returns Filtered array of memory entries
 */
export function getMemoriesByActivity(activityType: 'feed' | 'play' | 'groom'): MammothMemoryEntry[] {
  const memoryLog = useMammothStore.getState().memoryLog;
  return memoryLog.filter((entry: MammothMemoryEntry) => entry.activity === activityType)
    .sort((a: MammothMemoryEntry, b: MammothMemoryEntry) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

/**
 * Get memory entries from a specific time period
 * @param startDate The start date
 * @param endDate The end date (defaults to now)
 * @returns Filtered array of memory entries
 */
export function getMemoriesInTimeRange(startDate: Date, endDate: Date = new Date()): MammothMemoryEntry[] {
  const memoryLog = useMammothStore.getState().memoryLog;
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();
  
  return memoryLog.filter((entry: MammothMemoryEntry) => {
    const entryTime = new Date(entry.timestamp).getTime();
    return entryTime >= startTime && entryTime <= endTime;
  }).sort((a: MammothMemoryEntry, b: MammothMemoryEntry) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
} 