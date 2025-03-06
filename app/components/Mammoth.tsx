// Path: app/components/Mammoth.tsx
import React, { useState, useRef } from 'react';

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
        if (avgMood > 75) return '😊';
        if (avgMood > 50) return '🙂';
        if (avgMood > 25) return '😐';
        return '😢';
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (isGrooming) {
            setGroomingStrokes(prev => {
                const newStrokes = prev + 1;
                if (newStrokes >= requiredStrokes) {
                    onGroomComplete();
                    return 0;
                }
                return newStrokes;
            });
        }
    };

    const handleTouchStart = () => {
        longPressTimer.current = setTimeout(() => {
            onLongPress();
        }, 500); // 500ms for long press
    };

    const handleTouchEnd = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }
    };

    return (
        <div
            className="flex flex-col items-center justify-center p-4 relative"
            onTouchMove={handleTouchMove}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleTouchStart}
            onMouseUp={handleTouchEnd}
            onMouseLeave={handleTouchEnd}
            onMouseMove={(e) => {
                if (e.buttons === 1) {
                    handleTouchMove(e as any);
                }
            }}
        >
            <div className={`text-8xl ${isGrooming ? 'cursor-pointer' : 'animate-bounce'}`}>
                {getExpression()}
            </div>
        </div>
    );
}