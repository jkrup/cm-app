import React, { useState, useEffect, useRef } from 'react';

interface AnimatedTextProps {
  text: string | null;
  className?: string;
  isAIText?: boolean;
  delay?: number; // Delay before starting animation in ms
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ 
  text, 
  className = '',
  isAIText = false,
  delay = 0
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [characters, setCharacters] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(0);
  const [isAnimationComplete, setIsAnimationComplete] = useState<boolean>(false);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Speed control - higher values mean slower text
  const typingSpeed = isAIText ? 100 : 50; // Even slower typing for better readability
  const postTypingDelay = 4000; // 4 seconds to view the text after typing completes
  const displayDuration = isAIText ? 20000 : 10000; // Longer display times to ensure reading
  
  // Clean up all timeouts and intervals when component unmounts
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, []);
  
  // Reset animation state when text changes
  useEffect(() => {
    // Clear any existing timers first
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
    
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
      animationIntervalRef.current = null;
    }
    
    if (!text) {
      setIsVisible(false);
      setCharacters([]);
      setVisibleCount(0);
      setIsAnimationComplete(false);
      return;
    }
    
    // Reset state for new text
    setIsVisible(true);
    setCharacters(text.split(''));
    setVisibleCount(0);
    setIsAnimationComplete(false);
    
    // Start character reveal animation after delay
    const initialDelayTimeout = setTimeout(() => {
      let count = 0;
      
      // Use interval for typing animation
      animationIntervalRef.current = setInterval(() => {
        if (count < text.length) {
          count++;
          setVisibleCount(count);
        } else {
          // Animation is complete - clear interval
          if (animationIntervalRef.current) {
            clearInterval(animationIntervalRef.current);
            animationIntervalRef.current = null;
          }
          
          setIsAnimationComplete(true);
          
          // For AI text, set a timeout to hide after the full display duration
          if (isAIText) {
            console.log('Setting timeout to hide AI text after', displayDuration + postTypingDelay, 'ms');
            
            animationTimeoutRef.current = setTimeout(() => {
              console.log('Hiding AI text now');
              setIsVisible(false);
            }, displayDuration + postTypingDelay); // Add the post-typing delay to the display duration
          } else {
            // For regular text, only set a timeout if we want to hide it (which we usually don't)
            // But we'll add the post-typing delay to ensure it's visible for a few seconds at least
            animationTimeoutRef.current = setTimeout(() => {
              // No need to hide regular text
              console.log('Regular text will remain visible');
              // If we wanted to hide it:
              // setIsVisible(false);
            }, postTypingDelay);
          }
        }
      }, typingSpeed);
    }, delay);
    
    return () => {
      clearTimeout(initialDelayTimeout);
    };
  }, [text, isAIText, typingSpeed, displayDuration, delay, postTypingDelay]);
  
  // If the component would render nothing, just return null
  if (!text || !isVisible) {
    return null;
  }
  
  return (
    <div className={`${className} ${isAIText ? 'ai-text-container' : ''}`}>
      {characters.map((char, index) => {
        // Handle space characters specially
        if (char === ' ') {
          return (
            <span
              key={index}
              className={index < visibleCount ? '' : 'opacity-0'}
              style={{ whiteSpace: 'pre' }}
            >
              {' '}
            </span>
          );
        }
        
        return (
          <span
            key={index}
            className={index < visibleCount ? 'character-reveal' : 'opacity-0'}
            style={{ 
              animationDelay: `${index * 0.05}s`,
              display: 'inline-block',
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};

export default AnimatedText; 