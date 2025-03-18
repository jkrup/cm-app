// Path: app/components/Mammoth.tsx
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import happyMammothImg from '@/public/mammoth/happy.png';
import mediumMammothImg from '@/public/mammoth/medium.png';
import lowMammothImg from '@/public/mammoth/low.png';
import sadMammothImg from '@/public/mammoth/sad.png';

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

// Define costume types
type CostumeType = null | 'angel' | 'devil' | 'magician' | 'bday-hat' | 'beach' | 
                  'bucket' | 'cowboy' | 'pirate' | 'sailor' | 'winter' | 
                  'wizard' | 'viking';

interface MammothProps {
    excitement: number;
    happiness: number;
    isGrooming: boolean;
    onGroomComplete: () => void;
    onLongPress: () => void;
}

export default function Mammoth({
    excitement,
    happiness,
    isGrooming,
    onGroomComplete,
    onLongPress
}: MammothProps) {
    const [groomingStrokes, setGroomingStrokes] = useState(0);
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);
    const requiredStrokes = 5;
    // Add state for costume cycling
    const [currentCostume, setCurrentCostume] = useState<CostumeType>(null);

    const getExpression = () => {
        const avgMood = (excitement + happiness) / 2;
        if (avgMood > 75) return happyMammothImg;
        if (avgMood > 50) return mediumMammothImg;
        if (avgMood > 25) return lowMammothImg;
        return sadMammothImg;
    };

    // Get costume image based on current state
    const getCostumeImage = () => {
        switch (currentCostume) {
            case 'angel':
                return angelCostumeImg;
            case 'devil':
                return devilCostumeImg;
            case 'magician':
                return magicianCostumeImg;
            case 'bday-hat':
                return bdayHatCostumeImg;
            case 'beach':
                return beachCostumeImg;
            case 'bucket':
                return bucketCostumeImg;
            case 'cowboy':
                return cowboyCostumeImg;
            case 'pirate':
                return pirateCostumeImg;
            case 'sailor':
                return sailorCostumeImg;
            case 'winter':
                return winterCostumeImg;
            case 'wizard':
                return wizardCostumeImg;
            case 'viking':
                return vikingCostumeImg;
            default:
                return angelCostumeImg; // Default fallback, but this shouldn't happen due to the conditional rendering
        }
    };

    // Determine bounce animation based on mood
    const getBounceAnimation = () => {
        if (isGrooming) return ''; // No bounce during grooming
        
        const avgMood = (excitement + happiness) / 2;
        if (avgMood > 75) return 'animate-bounce'; // Full bounce when happy
        if (avgMood > 50) return 'animate-bounce-small'; // Half bounce when content
        return ''; // No bounce for other moods
    };

    const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
        if (isGrooming) {
            // Log for debugging
            console.log('Grooming stroke detected!', isGrooming);
            
            // Prevent default behavior to avoid scrolling
            e.preventDefault();
            
            // Increment grooming strokes
            setGroomingStrokes(prev => {
                const newStrokes = prev + 1;
                console.log(`Grooming strokes: ${newStrokes}/${requiredStrokes}`);
                if (newStrokes >= requiredStrokes) {
                    console.log('Grooming complete!');
                    onGroomComplete();
                    return 0;
                }
                return newStrokes;
            });
        }
    };

    const handleTouchStart = () => {
        console.log('Touch start event');
        longPressTimer.current = setTimeout(() => {
            onLongPress();
        }, 500); // 500ms for long press
    };

    const handleTouchEnd = () => {
        console.log('Touch end event');
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }
    };

    // Handler for cycling through costumes
    const handleCycleClothes = (e: React.MouseEvent | React.TouchEvent) => {
        // Prevent this from triggering other behaviors like grooming
        e.stopPropagation();
        
        // Only allow cycling when not grooming
        if (!isGrooming) {
            setCurrentCostume(prev => {
                // Cycle through all costumes in sequence
                switch(prev) {
                    case null: return 'angel';
                    case 'angel': return 'devil';
                    case 'devil': return 'magician';
                    case 'magician': return 'bday-hat';
                    case 'bday-hat': return 'beach';
                    case 'beach': return 'bucket';
                    case 'bucket': return 'cowboy';
                    case 'cowboy': return 'pirate';
                    case 'pirate': return 'sailor';
                    case 'sailor': return 'winter';
                    case 'winter': return 'wizard';
                    case 'wizard': return 'viking';
                    case 'viking': return null; // Back to no costume
                    default: return null;
                }
            });
        }
    };

    return (
        <div 
            className={`absolute flex items-center justify-center ${isGrooming ? 'cursor-move' : 'cursor-pointer'}`}
            onTouchMove={handleTouchMove}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleTouchStart}
            onMouseUp={handleTouchEnd}
            onMouseLeave={handleTouchEnd}
            onMouseMove={(e) => {
                // Log mouse movement during grooming
                if (isGrooming) {
                    console.log('Mouse move during grooming');
                }
                if (e.buttons === 1 || isGrooming) {
                    handleTouchMove(e);
                }
            }}
            onClick={handleCycleClothes}
        >
            {/* Blue aura behind the mammoth */}
            {/* <div className="blue-aura absolute"></div> */}
            
            {/* Visual indicator for grooming mode */}
            {isGrooming && (
                <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-pulse z-10"></div>
            )}
            
            {/* Grooming progress indicator */}
            {isGrooming && (
                <div className="absolute top-0 left-0 right-0 h-2 bg-gray-200 rounded-full overflow-hidden z-20">
                    <div 
                        className="h-full bg-blue-500 transition-all duration-200"
                        style={{ width: `${(groomingStrokes / requiredStrokes) * 100}%` }}
                    ></div>
                </div>
            )}
            
            {/* Mammoth with conditional bouncing based on mood */}
            <div className={`relative z-10 ${getBounceAnimation()}`}>
                <Image 
                    src={getExpression()} 
                    alt="Your pet mammoth" 
                    // width={140} 
                    // height={140}
                    priority
                />
                
                {/* Costume overlay - render on top of the mammoth */}
                {currentCostume && (
                    <div className="absolute top-0 left-0 right-0 bottom-0 z-20">
                        <Image 
                            src={getCostumeImage()} 
                            alt={`${currentCostume} costume`}
                            priority
                            className="pointer-events-none"
                        />
                    </div>
                )}
            </div>
            
            {/* Grooming text indicator */}
            {isGrooming && (
                <div className="absolute bottom-0 text-center text-sm text-blue-200 font-medium">
                    Groom by moving your cursor/finger over the mammoth
                </div>
            )}
        </div>
    );
}