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
  THROWN, // Food is in the air following a trajectory
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
  const [foodPosition, setFoodPosition] = useState({ x: 0, y: 0 });
  const [foodVelocity, setFoodVelocity] = useState({ x: 0, y: 0 });
  const [foodScale, setFoodScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startX, setStartX] = useState(0);
  const [feedingState, setFeedingState] = useState(FeedingState.READY);
  const feedRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number | null>(null);

  // Update parent component whenever feeding state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(FeedingState[feedingState] as any);
    }
  }, [feedingState, onStateChange]);

  useEffect(() => {
    if (!isFeeding) {
      setFoodPosition({ x: 0, y: 0 });
      setFoodVelocity({ x: 0, y: 0 });
      setFoodScale(1);
      setIsDragging(false);
      setFeedingState(FeedingState.READY);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  }, [isFeeding]);

  // Physics animation for the thrown apple
  useEffect(() => {
    if (feedingState !== FeedingState.THROWN) return;

    const GRAVITY = 800; // Reduced gravity to make throwing easier
    
    const animate = (timestamp: number) => {
      if (!lastFrameTimeRef.current) {
        lastFrameTimeRef.current = timestamp;
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = (timestamp - lastFrameTimeRef.current) / 1000; // in seconds
      lastFrameTimeRef.current = timestamp;

      // Update velocity with gravity
      const newVelocity = {
        x: foodVelocity.x,
        y: foodVelocity.y + GRAVITY * deltaTime
      };

      // Update position based on velocity
      const newPosition = {
        x: foodPosition.x + newVelocity.x * deltaTime,
        y: foodPosition.y + newVelocity.y * deltaTime
      };

      setFoodVelocity(newVelocity);
      setFoodPosition(newPosition);

      // Only reset if apple falls back down or goes too far to the sides
      // AND we're not in the process of transitioning to REACHING (which is handled by setTimeout)
      if ((newPosition.y > 100 || Math.abs(newPosition.x) > window.innerWidth / 1.5) && 
          feedingState === FeedingState.THROWN) {
        // Reset position if apple falls way back down or goes way off-screen
        setFoodPosition({ x: 0, y: 0 });
        setFoodVelocity({ x: 0, y: 0 });
        setFoodScale(1);
        setFeedingState(FeedingState.READY);
      } 
      else {
        // Continue animation
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [feedingState, foodPosition, foodVelocity]);

  // Check if touch/click is on or near the apple
  const isClickOnApple = (clientX: number, clientY: number) => {
    if (!feedRef.current) return false;
    
    const rect = feedRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Add some padding (60px) to make it easier to grab
    const distance = Math.sqrt(
      Math.pow(clientX - centerX, 2) + 
      Math.pow(clientY - centerY, 2)
    );
    
    return distance < 60; // 60px radius around apple
  };

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isFeeding) return;
    
    // Handle both touch and mouse events
    const clientX = 'touches' in e && e.touches[0] ? e.touches[0].clientX : 
                   'clientX' in e ? e.clientX : 0;
    const clientY = 'touches' in e && e.touches[0] ? e.touches[0].clientY : 
                   'clientY' in e ? e.clientY : 0;
    
    if (feedingState === FeedingState.READY) {
      // Check if clicking on apple
      if (isClickOnApple(clientX, clientY)) {
        setIsDragging(true);
        setFeedingState(FeedingState.THROWING);
        setStartX(clientX);
        setStartY(clientY);
      } else {
        // User clicked outside the apple in READY state, exit feeding mode
        onFeedingEnd();
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    
    // Handle both touch and mouse events
    const clientX = 'touches' in e && e.touches[0] ? e.touches[0].clientX : 
                   'clientX' in e ? e.clientX : 0;
    const clientY = 'touches' in e && e.touches[0] ? e.touches[0].clientY : 
                   'clientY' in e ? e.clientY : 0;
    
    const deltaX = clientX - startX;
    const deltaY = startY - clientY;
    
    if (deltaY > 0) { // Only allow upward movement
      setFoodPosition({ x: deltaX, y: -deltaY });
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    // Calculate velocity based on position and throw
    const throwForceMultiplier = 1.8; // Reduced force for easier control
    const throwVelocity = {
      x: foodPosition.x * throwForceMultiplier,
      y: foodPosition.y * throwForceMultiplier * -1 // Negative because our position is already negative
    };
    
    // Calculate throw speed for scaling
    const throwSpeed = Math.sqrt(
      Math.pow(throwVelocity.x, 2) + 
      Math.pow(throwVelocity.y, 2)
    );
    
    // Scale based on throw speed (faster throw = smaller apple)
    // Limit scale to between 0.6 and 0.9 based on throw speed
    const throwScale = Math.max(0.6, Math.min(0.9, 1 - (throwSpeed / 3500)));
    
    setIsDragging(false);
    
    // Simple feeding check: if apple is between 25% and 75% of screen height
    const screenHeight = window.innerHeight;
    const appleY = -foodPosition.y; // Convert to screen coordinates (negative y is up)
    const normalizedY = appleY / screenHeight; // Convert to 0-1 range
    
    if (normalizedY > 0.25 && normalizedY < 0.75) {
      // Apple is in the middle 50% of the screen - SUCCESSFUL FEED
      console.log("SUCCESSFUL FEED: Apple in middle region", normalizedY);
      
      // Start the throw animation first
      setFoodVelocity(throwVelocity);
      setFeedingState(FeedingState.THROWN);
      setFoodScale(throwScale);
      lastFrameTimeRef.current = null; // Reset the animation timer
      
      // After a delay, transition to reaching state
      setTimeout(() => {
        // Set the reaching state
        setFeedingState(FeedingState.REACHING);
        setFoodPosition({ x: 0, y: -window.innerHeight / 2 + 50 });
        
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
              setTimeout(() => {
                // Signal to parent that we're completely done with all state changes
                onFeedingEnd();
              }, 500);
            }, 200);
          }, 2000);
        }, 1000);
      }, 200); // Wait 800ms to see the apple fly before showing mammoth reaching
    } else {
      // Not in target zone - animate the throw
      setFoodVelocity(throwVelocity);
      setFeedingState(FeedingState.THROWN);
      setFoodScale(throwScale);
      lastFrameTimeRef.current = null; // Reset the animation timer
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
          feedingState === FeedingState.THROWN || 
          feedingState === FeedingState.FINISHED) && (
          <div style={{ width: "562px", height: "562px" }} className="flex items-center justify-center">
            {/* The regular mammoth will show through from behind */}
          </div>
        )}
      </div>

      {/* Food item */}
      {(feedingState === FeedingState.READY || 
        feedingState === FeedingState.THROWING ||
        feedingState === FeedingState.THROWN) && (
        <div 
          ref={feedRef}
          className="absolute left-1/2 bottom-16 transition-transform text-center"
          style={{ 
            transform: `translate(-50%, ${foodPosition.y}px) translateX(${foodPosition.x}px) scale(${foodScale})`,
            transition: isDragging || feedingState === FeedingState.THROWN ? 'none' : 'transform 0.5s ease-out'
          }}
        >
          <div className={`text-6xl ${(!isDragging && feedingState === FeedingState.READY) ? 'animate-bounce' : ''}`}>
            🍎
          </div>
          {!isDragging && feedingState === FeedingState.READY && (
            <div className={`text-center text-sm text-[#D6ECF0] mt-2 font-medium ${happyMonkey.className}`}>
              Click & throw to feed
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedingInteraction;