"use client"

import React, { useEffect, useState, useRef } from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  speed?: number; // Base speed in ms per character
  delay?: number; // initial delay before starting
  holdTime?: number; // how long to display the text before fading out
  permanentDisplay?: boolean; // If true, text will stay visible indefinitely
}

export default function AnimatedText({ 
  text, 
  className = '', 
  speed = 55, // Base speed in ms per character
  delay = 600,  // Initial delay
  holdTime = 12000, // Hold time AFTER typing completes
  permanentDisplay = false // Default to fading out after holdTime
}: AnimatedTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [visible, setVisible] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [remainingHoldTime, setRemainingHoldTime] = useState(holdTime);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  
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
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };
  
  // Function to get typing delay with slight randomization
  const getTypingDelay = () => {
    return speed * (0.9 + Math.random() * 0.3);
  };
  
  // Reset animation state when component first mounts or text changes
  useEffect(() => {
    console.log(`AnimatedText: Initializing with text "${text?.substring(0, 20)}..."`);
    
    // Skip if no text
    if (!text) return;
    
    // Clean up any running timers
    cleanupTimers();
    
    // Reset animation state
    setAnimationComplete(false);
    setRemainingHoldTime(holdTime);
    setVisible(true);
    setDisplayText('');
    
    // Start animation after delay
    console.log(`AnimatedText: Starting animation after ${delay}ms delay`);
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
          // Animation complete - clear typing timer
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }
          
          console.log(`AnimatedText: Typing complete, staying ${permanentDisplay ? 'permanently visible' : 'visible for ' + holdTime + 'ms'}`);
          
          // Set animation complete flag
          setAnimationComplete(true);
          
          // Only set up countdown and fade timers if not permanent display
          if (!permanentDisplay) {
            // Start countdown timer for debugging
            setRemainingHoldTime(holdTime);
            holdTimerRef.current = setInterval(() => {
              setRemainingHoldTime(prev => {
                const newValue = Math.max(0, prev - 1000);
                if (newValue <= 0 && holdTimerRef.current) {
                  clearInterval(holdTimerRef.current);
                  holdTimerRef.current = null;
                }
                return newValue;
              });
            }, 1000);
            
            // Set a timer to fade out AFTER the hold time
            fadeTimerRef.current = setTimeout(() => {
              console.log(`AnimatedText: Hold time complete, fading out`);
              setVisible(false);
            }, holdTime);
          }
        }
      };
      
      // Begin typing
      typeNextChar();
    }, delay);
    
    // Cleanup on unmount or text change
    return () => {
      console.log(`AnimatedText: Cleaning up timers due to text change or unmount`);
      cleanupTimers();
    };
  }, [text, speed, delay, holdTime, permanentDisplay]);
  
  return (
    <div className={className}>
      <p className={`relative whitespace-pre-line transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        {displayText || '\u00A0'}
        {/* Debug timer indicator */}
        {process.env.NODE_ENV === 'development' && (
          <span className="absolute -top-4 right-0 text-xs opacity-50 whitespace-nowrap">
            {animationComplete 
              ? permanentDisplay 
                ? "Permanent" 
                : `Hold: ${Math.ceil(remainingHoldTime/1000)}s`
              : `Type: ${Math.round((displayText.length / (text?.length || 1)) * 100)}%`}
          </span>
        )}
      </p>
    </div>
  );
} 