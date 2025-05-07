import React, { useState, useEffect } from 'react';
import { useNotificationStore } from '@/app/store/notificationStore';

interface NotificationBadgeProps {
  onClick: () => void;
  className?: string;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ onClick, className = '' }) => {
  const { getUnreadCount } = useNotificationStore();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Check for notifications periodically
  useEffect(() => {
    // Initialize on mount
    setUnreadCount(getUnreadCount());
    
    // Check every 30 seconds for new notifications
    const interval = setInterval(() => {
      const count = getUnreadCount();
      
      // If new notifications, animate the badge
      if (count > unreadCount) {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1000);
      }
      
      setUnreadCount(count);
    }, 30000);
    
    return () => clearInterval(interval);
  }, [getUnreadCount, unreadCount]);

  // If no unread notifications, show a simple icon
  if (unreadCount === 0) {
    return (
      <button 
        className={`relative p-2 text-gray-300 hover:text-white ${className}`}
        onClick={onClick}
        aria-label="Notifications"
      >
        <span role="img" aria-label="Bell" className="text-xl">
          🔔
        </span>
      </button>
    );
  }

  // Show badge with notification count
  return (
    <button 
      className={`relative p-2 text-white ${className}`}
      onClick={onClick}
      aria-label={`${unreadCount} Notifications`}
    >
      <span role="img" aria-label="Bell" className={`text-xl ${isAnimating ? 'animate-bounce' : ''}`}>
        🔔
      </span>
      <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1.5 min-w-[20px] h-5 flex items-center justify-center text-xs transform translate-x-1/4 -translate-y-1/4">
        {unreadCount > 99 ? '99+' : unreadCount}
      </span>
    </button>
  );
};

export default NotificationBadge; 