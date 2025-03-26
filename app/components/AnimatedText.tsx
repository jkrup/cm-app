"use client"

import React, { useEffect, useState, useRef } from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  speed?: number; // Base speed in ms per character
  delay?: number; // initial delay before starting
  holdTime?: number; // how long to display the text before fading out
}

export default function AnimatedText({ 
  text, 
  className = '', 
  speed = 55, // Increased base speed (higher = slower typing)
  delay = 600,  // Moderate initial delay
  holdTime = 12000 // Increased hold time to 8 seconds
}: AnimatedTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [visible, setVisible] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);
  const textRef = useRef('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clean up function for all timers
  const cleanupTimers = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (fadeTimerRef.current) {
      clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
  };
  
  // Function to get typing delay with slight randomization
  const getTypingDelay = () => {
    // Narrower randomization range (90% to 120% of base speed)
    // This prevents the typing from getting too fast
    return speed * (0.9 + Math.random() * 0.3);
  };
  
  // Main animation effect
  useEffect(() => {
    // Skip if no text
    if (!text) return;
    
    // If new text has arrived
    if (text !== textRef.current) {
      // Update ref
      textRef.current = text;
      
      // Clean up any running timers
      cleanupTimers();
      
      // Reset animation state
      setAnimationComplete(false);
      
      // Make visible
      setVisible(true);
      
      // Reset text
      setDisplayText('');
      
      // Start animation after delay
      timerRef.current = setTimeout(() => {
        let index = 0;
        
        const typeNextChar = () => {
          if (index < text.length) {
            // Show text up to current index
            setDisplayText(text.substring(0, index + 1));
            index++;
            
            // Calculate delay for next character
            let nextDelay = getTypingDelay();
            
            // Add pause after punctuation (longer pause)
            if (text[index - 1] === '.' || text[index - 1] === '!' || 
                text[index - 1] === '?' || text[index - 1] === ',') {
              nextDelay += speed * 5; // Increased pause after punctuation
            }
            
            // Schedule next character typing
            timerRef.current = setTimeout(typeNextChar, nextDelay);
          } else {
            // Animation complete
            setAnimationComplete(true);
            
            // Set a longer fade timer
            if (fadeTimerRef.current) {
              clearTimeout(fadeTimerRef.current);
            }
            fadeTimerRef.current = setTimeout(() => {
              setVisible(false);
            }, holdTime);
          }
        };
        
        // Begin typing
        typeNextChar();
      }, delay);
    }
    
    // Cleanup on unmount or text change
    return cleanupTimers;
  }, [text, speed, delay, holdTime]);
  
  // Make sure that when animation is complete, we maintain the hold time
  useEffect(() => {
    if (animationComplete && visible) {
      // Ensure the fade timer is set correctly
      if (fadeTimerRef.current) {
        clearTimeout(fadeTimerRef.current);
      }
      fadeTimerRef.current = setTimeout(() => {
        setVisible(false);
      }, holdTime);
    }
    
    return () => {
      if (fadeTimerRef.current) {
        clearTimeout(fadeTimerRef.current);
      }
    };
  }, [animationComplete, holdTime]);
  
  return (
    <div className={className}>
      <p className={`relative whitespace-pre-line transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        {displayText || '\u00A0'}
      </p>
    </div>
  );
} 