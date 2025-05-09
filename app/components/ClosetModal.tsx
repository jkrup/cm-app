import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

// Import the mediumMammothImg
import mediumMammothImg from '@/public/mammoth/medium.png';

// Define type for costumes
type CostumeType = null | 'angel' | 'devil' | 'magician' | 'bday-hat' | 'beach' | 
                  'bucket' | 'cowboy' | 'pirate' | 'sailor' | 'winter' | 
                  'wizard' | 'viking';

// Import costume images 
import angelCostumeImg from '@/public/mammoth/costumes/angel.png';
import devilCostumeImg from '@/public/mammoth/costumes/devil.png';
import magicianCostumeImg from '@/public/mammoth/costumes/magician.png';
import bdayHatCostumeImg from '@/public/mammoth/costumes/bday-hat.png';
import beachCostumeImg from '@/public/mammoth/costumes/beach.png';
import bucketCostumeImg from '@/public/mammoth/costumes/bucket.png';
import cowboyCostumeImg from '@/public/mammoth/costumes/cowboy.png';
import pirateCostumeImg from '@/public/mammoth/costumes/pirate.png';
import sailorCostumeImg from '@/public/mammoth/costumes/sailor.png';
import winterCostumeImg from '@/public/mammoth/costumes/winter.png';
import wizardCostumeImg from '@/public/mammoth/costumes/wizard.png';
import vikingCostumeImg from '@/public/mammoth/costumes/viking.png';

// Define costume items for the carousel
const COSTUMES = [
  { id: null as CostumeType, label: 'None', image: null },
  { id: 'angel' as CostumeType, label: 'Angel', image: angelCostumeImg },
  { id: 'devil' as CostumeType, label: 'Devil', image: devilCostumeImg },
  { id: 'magician' as CostumeType, label: 'Magician', image: magicianCostumeImg },
  { id: 'bday-hat' as CostumeType, label: 'Birthday Hat', image: bdayHatCostumeImg },
  { id: 'beach' as CostumeType, label: 'Beach', image: beachCostumeImg },
  { id: 'bucket' as CostumeType, label: 'Bucket', image: bucketCostumeImg },
  { id: 'cowboy' as CostumeType, label: 'Cowboy', image: cowboyCostumeImg },
  { id: 'pirate' as CostumeType, label: 'Pirate', image: pirateCostumeImg },
  { id: 'sailor' as CostumeType, label: 'Sailor', image: sailorCostumeImg },
  { id: 'winter' as CostumeType, label: 'Winter', image: winterCostumeImg },
  { id: 'wizard' as CostumeType, label: 'Wizard', image: wizardCostumeImg },
  { id: 'viking' as CostumeType, label: 'Viking', image: vikingCostumeImg },
];

interface ClosetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCostume: CostumeType;
  onSelectCostume: (costume: CostumeType) => void;
}

export default function ClosetModal({ 
  isOpen, 
  onClose, 
  currentCostume, 
  onSelectCostume,
}: ClosetModalProps) {
  // Current selected index in the carousel
  const [activeIndex, setActiveIndex] = useState(() => {
    const currentIndex = COSTUMES.findIndex(costume => costume.id === currentCostume);
    return currentIndex === -1 ? 0 : currentIndex;
  });

  // Gesture handling for the carousel
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef<boolean>(false);
  
  // Handle swipe gestures
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if ('touches' in e) {
      touchStartX.current = e.touches[0].clientX;
    } else {
      touchStartX.current = e.clientX;
    }
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging.current) return;

    if ('touches' in e) {
      touchEndX.current = e.touches[0].clientX;
    } else {
      touchEndX.current = e.clientX;
    }
    
    const diff = touchEndX.current - touchStartX.current;

    // Add a smooth drag effect
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(${diff * 0.5}px)`;
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const diff = touchEndX.current - touchStartX.current;

    // Reset transform
    if (carouselRef.current) {
      carouselRef.current.style.transform = '';
    }

    // Determine swipe direction based on distance
    if (Math.abs(diff) > 50) {
      if (diff > 0 && activeIndex > 0) {
        // Swipe right -> previous costume
        setActiveIndex(activeIndex - 1);
      } else if (diff < 0 && activeIndex < COSTUMES.length - 1) {
        // Swipe left -> next costume
        setActiveIndex(activeIndex + 1);
      }
    }
  };

  // Navigation functions
  const goToPrevious = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const goToNext = () => {
    if (activeIndex < COSTUMES.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  // Apply the selected costume
  const handleSelectCostume = () => {
    onSelectCostume(COSTUMES[activeIndex].id);
    onClose();
  };

  // Update the active index when currentCostume changes
  useEffect(() => {
    const currentIndex = COSTUMES.findIndex(costume => costume.id === currentCostume);
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
    }
  }, [currentCostume]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-[#070F24]/90" onClick={onClose}></div>
      
      {/* Closet modal content */}
      <div className="relative w-full max-w-md bg-[#1A2845] rounded-xl shadow-xl overflow-hidden z-10">
        {/* Header */}
        <div className="border-b border-blue-900/50 p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Mammoth Closet</h2>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
        
        {/* Closet background - simple SVG for now */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 400 400">
            <rect x="50" y="50" width="300" height="300" rx="10" fill="#6ECBDC" />
            <rect x="80" y="70" width="100" height="10" rx="5" fill="#3898B8" />
            <rect x="220" y="70" width="100" height="10" rx="5" fill="#3898B8" />
            <rect x="150" y="100" width="100" height="200" rx="5" fill="#3898B8" opacity="0.5" />
          </svg>
        </div>
        
        {/* Mammoth preview with costume */}
        <div className="p-6 flex justify-center items-center relative z-10">
          <div className="relative">
            {/* Base mammoth */}
            <Image 
              src={mediumMammothImg}
              alt="Your pet mammoth" 
              priority
              className="w-32 h-32 object-contain"
            />
            
            {/* Costume overlay */}
            {COSTUMES[activeIndex].image && (
              <div className="absolute top-0 left-0 right-0 bottom-0">
                <Image 
                  src={COSTUMES[activeIndex].image} 
                  alt={`${COSTUMES[activeIndex].label} costume`}
                  priority
                  className="w-32 h-32 object-contain pointer-events-none"
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Carousel */}
        <div 
          ref={carouselRef}
          className="p-4 transition-transform"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseMove={(e) => {
            if (isDragging.current) {
              handleTouchMove(e);
            }
          }}
          onMouseUp={handleTouchEnd}
          onMouseLeave={handleTouchEnd}
        >
          <div className="relative flex items-center justify-center">
            {/* Previous button */}
            <button 
              onClick={goToPrevious}
              disabled={activeIndex === 0}
              className={`absolute left-0 z-20 w-10 h-10 rounded-full flex items-center justify-center
                ${activeIndex === 0 ? 'text-gray-500' : 'text-white bg-[#3898B8]/50 hover:bg-[#3898B8]'}`}
            >
              ←
            </button>
            
            {/* Costume name */}
            <div className="text-center text-white font-medium py-2">
              {COSTUMES[activeIndex].label}
            </div>
            
            {/* Next button */}
            <button 
              onClick={goToNext}
              disabled={activeIndex === COSTUMES.length - 1}
              className={`absolute right-0 z-20 w-10 h-10 rounded-full flex items-center justify-center
                ${activeIndex === COSTUMES.length - 1 ? 'text-gray-500' : 'text-white bg-[#3898B8]/50 hover:bg-[#3898B8]'}`}
            >
              →
            </button>
          </div>
          
          {/* Carousel indicator dots */}
          <div className="flex justify-center gap-1 mt-4">
            {COSTUMES.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors duration-200
                  ${index === activeIndex ? 'bg-[#6ECBDC]' : 'bg-gray-600'}`}
              />
            ))}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="border-t border-blue-900/50 p-4 flex justify-center">
          <button
            onClick={handleSelectCostume}
            className="px-6 py-2 rounded-lg bg-[#6ECBDC] text-[#070F24] font-medium hover:bg-[#3898B8] transition-colors"
          >
            Wear
          </button>
        </div>
      </div>
    </div>
  );
} 