// Path: app/components/Mammoth.tsx
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import happyMammothImg from '@/public/mammoth/happy.png';
import mediumMammothImg from '@/public/mammoth/medium.png';
import lowMammothImg from '@/public/mammoth/low.png';
import sadMammothImg from '@/public/mammoth/sad.png';

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

    const getExpression = () => {
        const avgMood = (excitement + happiness) / 2;
        if (avgMood > 75) return happyMammothImg;
        if (avgMood > 50) return mediumMammothImg;
        if (avgMood > 25) return lowMammothImg;
        return sadMammothImg;
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

    return (
        <div 
            className={`absolute flex items-center justify-center ${isGrooming ? 'cursor-move' : ''}`}
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