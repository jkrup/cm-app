import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { happyMonkey } from '../fonts/fonts';

// Import the mammoth images
import eatingStartImg from '@/public/mammoth/eating_start.png';
import eatingImg from '@/public/mammoth/eating.png';

// Feeding interaction states
enum FeedingState {
  READY, // Initial state, food at bottom
  THROWING, // User is dragging the food
  REACHING, // Mammoth is reaching for food
  EATING, // Mammoth is eating
  FINISHED // After eating, before closing
}

interface FeedingInteractionProps {
  onFeedComplete: () => void;
  isFeeding: boolean;
  onFeedingEnd: () => void;
  onStateChange?: (state: 'READY' | 'THROWING' | 'REACHING' | 'EATING' | 'FINISHED') => void;
}

const FeedingInteraction: React.FC<FeedingInteractionProps> = ({ 
  onFeedComplete, 
  isFeeding, 
  onFeedingEnd,
  onStateChange
}) => {
  const [foodPosition, setFoodPosition] = useState({ y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [feedingState, setFeedingState] = useState(FeedingState.READY);
  const feedRef = useRef<HTMLDivElement>(null);

  // Update parent component whenever feeding state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(FeedingState[feedingState] as any);
    }
  }, [feedingState, onStateChange]);

  useEffect(() => {
    if (!isFeeding) {
      setFoodPosition({ y: 0 });
      setIsDragging(false);
      setFeedingState(FeedingState.READY);
    }
  }, [isFeeding]);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isFeeding || feedingState !== FeedingState.READY) return;
    setIsDragging(true);
    setFeedingState(FeedingState.THROWING);
    
    // Handle both touch and mouse events
    const clientY = 'touches' in e && e.touches[0] ? e.touches[0].clientY : 
                   'clientY' in e ? e.clientY : 0;
    setStartY(clientY);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    
    // Handle both touch and mouse events
    const clientY = 'touches' in e && e.touches[0] ? e.touches[0].clientY : 
                   'clientY' in e ? e.clientY : 0;
    const deltaY = startY - clientY;
    
    if (deltaY > 0) { // Only allow upward movement
      setFoodPosition({ y: -deltaY });
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (foodPosition.y < -100) { // Threshold for successful feed
      // Show reaching animation
      setFeedingState(FeedingState.REACHING);
      
      // Animate food to mammoth mouth position
      setFoodPosition({ y: -window.innerHeight / 2 + 50 });
      
      // After a delay, show eating animation
      setTimeout(() => {
        setFeedingState(FeedingState.EATING);
        
        // After eating, return to normal
        setTimeout(() => {
          // Call onFeedComplete first to update stats
          onFeedComplete();
          
          // Then set the FINISHED state after a small delay
          setTimeout(() => {
            setFeedingState(FeedingState.FINISHED);
            
            // Wait a bit and then call onFeedingEnd as the VERY LAST step
            // This ensures all our internal state is done changing
            setTimeout(() => {
              // Signal to parent that we're completely done with all state changes
              onFeedingEnd();
            }, 500);
          }, 200);
        }, 2000);
      }, 1000);
    } else {
      // Reset position if not thrown high enough
      setFoodPosition({ y: 0 });
      setFeedingState(FeedingState.READY);
    }
  };

  if (!isFeeding) return null;

  return (
    <div 
      className="fixed inset-0 z-50 pointer-events-auto flex flex-col items-center justify-center overflow-visible"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      // For desktop testing
      onMouseDown={handleTouchStart}
      onMouseMove={(e) => {
        if (isDragging) handleTouchMove(e);
      }}
      onMouseUp={handleTouchEnd}
    >
      {/* Mammoth container */}
      <div className="relative flex items-center justify-center" style={{ height: "80vh" }}>
        {feedingState === FeedingState.REACHING && (
          <Image 
            src={eatingStartImg} 
            alt="Mammoth reaching for food" 
            width={562} 
            height={562}
            className="blue-aura"
            style={{ 
              width: "auto", 
              height: "auto", 
              minWidth: "562px",
              minHeight: "562px",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)"
            }}
            priority
          />
        )}
        
        {feedingState === FeedingState.EATING && (
          <Image 
            src={eatingImg} 
            alt="Mammoth eating" 
            width={562} 
            height={562}
            className="blue-aura"
            style={{ 
              width: "auto", 
              height: "auto", 
              minWidth: "562px",
              minHeight: "562px",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)"
            }}
            priority
          />
        )}
        
        {/* Show placeholder div only when in appropriate states - removed for EATING state */}
        {(feedingState === FeedingState.READY || 
          feedingState === FeedingState.THROWING || 
          feedingState === FeedingState.FINISHED) && (
          <div style={{ width: "562px", height: "562px" }} className="flex items-center justify-center">
            {/* The regular mammoth will show through from behind */}
          </div>
        )}
      </div>

      {/* Food item */}
      {(feedingState === FeedingState.READY || 
        feedingState === FeedingState.THROWING) && (
        <div 
          ref={feedRef}
          className="absolute left-1/2 bottom-16 transition-transform"
          style={{ 
            transform: `translate(-50%, ${foodPosition.y}px)`,
            transition: isDragging ? 'none' : 'transform 0.5s ease-out'
          }}
        >
          <div className={`text-6xl ${isDragging ? '' : 'animate-bounce'}`}>
            🍎
          </div>
          {!isDragging && feedingState === FeedingState.READY && (
            <div className={`text-center text-sm text-[#D6ECF0] mt-2 font-medium ${happyMonkey.className}`}>
              Swipe up to feed
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedingInteraction;