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
  speed = 30, 
  delay = 1200,  // Increased delay before starting
  holdTime = 5000 // Display for 5 seconds before fading
}: AnimatedTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [visible, setVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevTextRef = useRef('');
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);
  const animationCompleteRef = useRef(false);
  
  // Function to get slightly randomized typing speed
  const getTypingDelay = () => {
    // Add randomness to make it feel more natural (between 0.8x and 1.3x base speed)
    const randomFactor = 0.8 + Math.random() * 0.5;
    return speed * randomFactor;
  };
  
  // Clean up all timers
  const cleanupTimers = () => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    if (fadeTimerRef.current) {
      clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
  };

  // Complete current animation immediately
  const completeCurrentAnimation = () => {
    if (isAnimating && !animationCompleteRef.current && text) {
      // Set the full text immediately
      setDisplayText(text);
      animationCompleteRef.current = true;
      setIsAnimating(false);
    }
  };
  
  // Effect for text animation
  useEffect(() => {
    // If there's a text change, immediately complete any in-progress animation
    if (text !== prevTextRef.current && isAnimating) {
      completeCurrentAnimation();
      cleanupTimers();
    }

    // Only animate on first render if text is provided
    if (isFirstRender.current && text) {
      isFirstRender.current = false;
      prevTextRef.current = text;
      animationCompleteRef.current = false;
      
      // Reset visibility
      setVisible(true);
      
      // Start animation for initial text
      setIsAnimating(true);
      animationRef.current = setTimeout(() => {
        let index = 0;
        
        const typeNextChar = () => {
          if (index < text.length) {
            setDisplayText(text.substring(0, index + 1));
            index++;
            
            let nextDelay = getTypingDelay();
            if (text[index - 1] === '.' || text[index - 1] === '!' || text[index - 1] === '?' || text[index - 1] === ',') {
              nextDelay += speed * 4;
            }
            
            animationRef.current = setTimeout(typeNextChar, nextDelay);
          } else {
            // Animation complete
            setIsAnimating(false);
            animationCompleteRef.current = true;
            
            // Start the hold timer (keep text visible for holdTime)
            fadeTimerRef.current = setTimeout(() => {
              if (prevTextRef.current === text) { // Only fade if text hasn't changed
                setVisible(false);
              }
            }, holdTime);
          }
        };
        
        typeNextChar();
      }, delay);
      
      return cleanupTimers;
    }
    
    // Check if the text has actually changed and is not empty
    if (text !== prevTextRef.current && text) {
      // Clean up any existing timers
      cleanupTimers();
      
      // Reset animation state
      animationCompleteRef.current = false;
      
      // Reset visibility for new text
      setVisible(true);
      
      // Start animation when text changes
      setIsAnimating(true);
      setDisplayText(''); // Clear current text
      
      // Save current text as previous for next comparison
      prevTextRef.current = text;
      
      // Initial delay before starting to type
      animationRef.current = setTimeout(() => {
        let index = 0;
        
        // Function to type next character with variable timing
        const typeNextChar = () => {
          if (index < text.length) {
            // Add the next character
            setDisplayText(text.substring(0, index + 1));
            index++;
            
            // Determine delay for next character
            let nextDelay = getTypingDelay();
            
            // Add extra pause after punctuation
            if (text[index - 1] === '.' || text[index - 1] === '!' || text[index - 1] === '?' || text[index - 1] === ',') {
              nextDelay += speed * 4;
            }
            
            // Schedule the next character
            animationRef.current = setTimeout(typeNextChar, nextDelay);
          } else {
            // Animation complete
            setIsAnimating(false);
            animationCompleteRef.current = true;
            
            // Start the hold timer (keep text visible for holdTime)
            fadeTimerRef.current = setTimeout(() => {
              if (prevTextRef.current === text) { // Only fade if text hasn't changed
                setVisible(false);
              }
            }, holdTime);
          }
        };
        
        // Start the typing animation
        typeNextChar();
        
      }, delay);
    } else if (text === prevTextRef.current && !visible) {
      // If the same text should be shown again, make it visible
      setVisible(true);
    }
    
    // Clean up on unmount or text change
    return cleanupTimers;
  }, [text, speed, delay, holdTime, isAnimating]);
  
  return (
    <div className={className}>
      <p className={`relative whitespace-pre-line transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        {displayText}
      </p>
    </div>
  );
} 