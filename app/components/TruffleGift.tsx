"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { happyMonkey } from '../fonts/fonts';
import { MAMMOTH_NAME } from '../constants/mammoth';
import AnimatedText from './AnimatedText';

interface TruffleGiftProps {
  isVisible: boolean;
  onAccept: () => void;
  onAnimationComplete?: () => void;
}

export default function TruffleGift({ 
  isVisible, 
  onAccept, 
  onAnimationComplete 
}: TruffleGiftProps) {
  const [animateExit, setAnimateExit] = useState(false);
  const [showTruffle, setShowTruffle] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  
  // Happy messages for when the mammoth gives a truffle
  const happyMessages = [
    `${MAMMOTH_NAME} found a truffle and wants to share it with you!`,
    `${MAMMOTH_NAME} is feeling so happy she dug up a special truffle just for you!`,
    `Look what ${MAMMOTH_NAME} found! A rare truffle, just for you!`,
    `${MAMMOTH_NAME} is so grateful for your care, she's giving you this truffle!`
  ];
  
  // Generate a message when the component becomes visible
  useEffect(() => {
    if (isVisible && !message) {
      console.log("TruffleGift: Generating new message");
      const randomMessage = happyMessages[Math.floor(Math.random() * happyMessages.length)];
      console.log(`TruffleGift: Selected message - "${randomMessage}"`);
      setMessage(randomMessage);
    } else if (!isVisible && message) {
      // Reset message when component is hidden
      console.log("TruffleGift: Resetting message (not visible)");
      const timer = setTimeout(() => {
        setMessage(null);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, happyMessages, message]);
  
  useEffect(() => {
    if (isVisible) {
      console.log("TruffleGift: Component is visible, revealing truffle");
      // Delay showing the truffle to create a reveal effect
      const timer = setTimeout(() => {
        setShowTruffle(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      console.log("TruffleGift: Component is hidden, hiding truffle");
      setShowTruffle(false);
    }
  }, [isVisible]);
  
  const handleAccept = () => {
    console.log("TruffleGift: Accept button clicked");
    setAnimateExit(true);
    
    // Allow time for exit animation
    setTimeout(() => {
      setAnimateExit(false);
      onAccept();
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, 500);
  };
  
  // If not visible or no message yet, don't render
  if (!isVisible || !message) {
    console.log("TruffleGift: Not rendering - isVisible:", isVisible, "message:", !!message);
    return null;
  }
  
  console.log("TruffleGift: Rendering with message:", message?.substring(0, 20) + "...");
  
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${animateExit ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-0 bg-black/60" onClick={handleAccept}></div>
      
      <div className={`relative bg-[#1A2845] p-6 rounded-2xl border-2 border-[#6ECBDC] shadow-xl 
                     max-w-xs w-full transition-all duration-500 transform
                     ${animateExit ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
        
        <div className="text-center">
          <AnimatedText
            text={message}
            className={`text-lg text-[#D6ECF0] mb-4 ${happyMonkey.className}`}
            speed={40}
            delay={300}
            permanentDisplay={true}
          />
          
          <div className={`relative w-32 h-32 mx-auto my-4 transition-all duration-1000 transform
                        ${showTruffle ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
            {/* Truffle representation - using emoji for now */}
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#6E4C32] to-[#4A3319] flex items-center justify-center shadow-lg overflow-hidden">
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Could be replaced with an actual image in the future */}
                {/* <Image src="/mammoth/truffle.png" alt="Truffle" width={100} height={100} /> */}
                <span className="text-5xl filter drop-shadow-lg">🍄</span>
                
                {/* Add some texture */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiPjwvcmVjdD4KPGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wNyI+PC9jaXJjbGU+Cjwvc3ZnPg==')] opacity-40"></div>
              </div>
            </div>
            
            {/* Shimmer/glow effect */}
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <div className="shimmer-effect"></div>
            </div>
            
            {/* Additional glow effect */}
            <div className="absolute -inset-2 bg-yellow-400/20 rounded-full blur-md animate-pulse"></div>
          </div>
          
          <p className="text-[#D6ECF0]/70 text-sm mb-2">
            Add this truffle to your collection!
          </p>
          
          <button
            onClick={handleAccept}
            className="mt-2 bg-[#6ECBDC] text-[#070F24] px-5 py-2 rounded-full font-medium
                     hover:bg-[#8FE5F5] transition-colors w-full shadow-lg"
          >
            Accept Gift
          </button>
        </div>
      </div>
      
      <style jsx global>{`
        .shimmer-effect {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
} 