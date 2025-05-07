import React from 'react';
import { format } from 'date-fns';
import { useMammothStore } from '@/app/store/mammothStore';
import { MammothMemoryEntry } from '@/app/store/mammothStore';
import { getMemoryDescription } from '@/app/utils/mammothMemory';

interface CareLogPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const CareLogPanel: React.FC<CareLogPanelProps> = ({ isOpen, onClose }) => {
  const { memoryLog } = useMammothStore();
  
  // Format the timestamp to a friendly format
  const formatTime = (timestamp: Date) => {
    const date = new Date(timestamp);
    
    // If today, just show time
    if (new Date().toDateString() === date.toDateString()) {
      return format(date, 'h:mm a');
    }
    
    // If within the last 7 days, show day and time
    const daysDiff = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff < 7) {
      return format(date, 'E, h:mm a');
    }
    
    // Otherwise show date and time
    return format(date, 'MMM d, h:mm a');
  };

  // Get icon and color for activity type
  const getActivityStyle = (activity: string): { icon: string, colorClass: string } => {
    switch (activity) {
      case 'feed':
        return { icon: '🍗', colorClass: 'bg-orange-200 text-orange-900' };
      case 'play':
        return { icon: '😄', colorClass: 'bg-purple-200 text-purple-900' };
      case 'groom':
        return { icon: '❤️', colorClass: 'bg-pink-200 text-pink-900' };
      case 'truffle':
        return { icon: '🍄', colorClass: 'bg-yellow-200 text-yellow-900' };
      default:
        return { icon: '🦣', colorClass: 'bg-gray-200 text-gray-900' };
    }
  };

  // If the panel is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-600">Care Log</h3>
          <div className="flex gap-2">
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        </div>
        
        {/* Care log entries */}
        <div className="flex-1 overflow-y-auto">
          {memoryLog.length === 0 ? (
            <div className="p-8 text-center text-gray-700">
              <p className="font-medium">No care activities recorded yet</p>
              <p className="text-sm mt-2">Feed, play with, or groom your mammoth to see entries here.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {[...memoryLog].reverse().map((entry, index) => {
                const { icon, colorClass } = getActivityStyle(entry.activity);
                return (
                  <li 
                    key={index} 
                    className="p-4 transition-colors duration-200 hover:bg-gray-50"
                  >
                    <div className="flex items-start">
                      <div className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center mr-3`}>
                        <span className="text-lg">{icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{getMemoryDescription(entry)}</p>
                        <p className="text-xs text-gray-700 mt-1">{formatTime(entry.timestamp)}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareLogPanel; 