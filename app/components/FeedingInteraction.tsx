import React, { useState, useRef, useEffect } from 'react';

const FeedingInteraction = ({ onFeedComplete, isFeeding, onFeedingEnd }) => {
  const [foodPosition, setFoodPosition] = useState({ y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const feedRef = useRef(null);

  useEffect(() => {
    if (!isFeeding) {
      setFoodPosition({ y: 0 });
      setIsDragging(false);
    }
  }, [isFeeding]);

  const handleTouchStart = (e) => {
    if (!isFeeding) return;
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const deltaY = startY - e.touches[0].clientY;
    if (deltaY > 0) { // Only allow upward movement
      setFoodPosition({ y: -deltaY });
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (foodPosition.y < -100) { // Threshold for successful feed
      onFeedComplete();
      // Animate food to mammoth
      setFoodPosition({ y: -window.innerHeight });
      setTimeout(() => {
        onFeedingEnd();
        setFoodPosition({ y: 0 });
      }, 500);
    } else {
      // Reset position if not thrown high enough
      setFoodPosition({ y: 0 });
    }
  };

  if (!isFeeding) return null;

  return (
    <div 
      className="fixed inset-0 z-50 pointer-events-auto"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      // For desktop testing
      onMouseDown={(e) => handleTouchStart({ touches: [e] })}
      onMouseMove={(e) => {
        if (isDragging) handleTouchMove({ touches: [e] });
      }}
      onMouseUp={handleTouchEnd}
    >
      <div 
        ref={feedRef}
        className="absolute left-1/2 -translate-x-1/2 bottom-16 transition-transform"
        style={{ 
          transform: `translate(-50%, ${foodPosition.y}px)`,
          transition: isDragging ? 'none' : 'transform 0.5s ease-out'
        }}
      >
        <div className={`text-4xl ${isDragging ? '' : 'animate-bounce'}`}>
          🍎
        </div>
        {!isDragging && (
          <div className="text-center text-sm text-gray-600 mt-2">
            Swipe up to feed
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedingInteraction;