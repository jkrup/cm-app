// Path: app/components/Mammoth.tsx
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import happyMammothImg from '@/public/mammoth/happy.png';
import mediumMammothImg from '@/public/mammoth/medium.png';
import lowMammothImg from '@/public/mammoth/low.png';
import sadMammothImg from '@/public/mammoth/sad.png';
import sleepingMammothImg from '@/public/mammoth/sleeping.png';
import playingMammothImg from '@/public/mammoth/playing.png';
// Import mood images
import angryMammothImg from '@/public/mammoth/moods/angry.png';
import friendlyMammothImg from '@/public/mammoth/moods/friendly.png';
import grumpyMammothImg from '@/public/mammoth/moods/grumpy.png';
import playfulMammothImg from '@/public/mammoth/moods/playful.png';
import { getMammothMood } from '@/app/utils/getMood';
import { useMammothStore } from '@/app/store/mammothStore';

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
    happiness?: number;
    isGrooming: boolean;
    onGroomComplete: () => void;
    onLongPress: () => void;
    currentCostume?: CostumeType;
    isFeeding?: boolean;
}

export default function Mammoth({
    isGrooming,
    onGroomComplete,
    onLongPress,
    currentCostume = null,
    isFeeding = false
}: MammothProps) {
    const [groomingStrokes, setGroomingStrokes] = useState(0);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [isBrushActive, setIsBrushActive] = useState(false);
    const [isBrushOverMammoth, setIsBrushOverMammoth] = useState(false);
    const [showCursorBrush, setShowCursorBrush] = useState(false);
    const mammothRef = useRef<HTMLDivElement>(null);
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);
    const requiredStrokes = 5;
    
    // Force re-render on store changes
    const [, forceUpdate] = useState({});

    // Get all mood metrics from the store
    const { hunger, energy, boredom, affection, getHappiness, getEmotionalState } = useMammothStore(state => ({
        hunger: state.hunger,
        energy: state.energy,
        boredom: state.boredom,
        affection: state.affection,
        getHappiness: state.getHappiness,
        getEmotionalState: state.getEmotionalState
    }));

    // Get the calculated happiness value and emotional state
    const happiness = getHappiness();
    const emotionalState = getEmotionalState();

    // Subscribe to store changes to keep UI in sync
    useEffect(() => {
        const unsubscribe = useMammothStore.subscribe(() => {
            forceUpdate({});
        });
        
        return () => unsubscribe();
    }, []);

    // Set up mouse move event listener for cursor brush
    useEffect(() => {
        if (isGrooming) {
            setShowCursorBrush(false);
            const handleMouseMove = (e: MouseEvent) => {
                setCursorPosition({ x: e.clientX, y: e.clientY });
                setShowCursorBrush(true);
            };
            
            const handleTouchMove = (e: TouchEvent) => {
                if (e.touches.length > 0) {
                    setCursorPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
                    setShowCursorBrush(true);
                }
            };
            
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('touchmove', handleTouchMove);
            
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('touchmove', handleTouchMove);
            };
        } else {
            setShowCursorBrush(false);
            setGroomingStrokes(0);
            setIsBrushActive(false);
            setIsBrushOverMammoth(false);
        }
    }, [isGrooming]);

    // Effect to add a CSS class to the body when grooming is active
    useEffect(() => {
        if (isGrooming) {
            document.body.classList.add('cursor-none');
        } else {
            document.body.classList.remove('cursor-none');
        }
        
        return () => {
            document.body.classList.remove('cursor-none');
        };
    }, [isGrooming]);

    const mood = getMammothMood({
        energy, 
        happiness, 
        hunger,
        boredom,
        affection,
        isFeeding,
        emotionalState
    });

    const getExpression = () => {
        return mood.expression;
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
        return mood.bounceAnimation;
    };

    // Check if brush cursor is over mammoth
    const checkBrushOverMammoth = () => {
        if (!mammothRef.current) return false;
        
        const mammothRect = mammothRef.current.getBoundingClientRect();
        
        // Check if cursor position overlaps with mammoth
        return (
            cursorPosition.x >= mammothRect.left && 
            cursorPosition.x <= mammothRect.right && 
            cursorPosition.y >= mammothRect.top && 
            cursorPosition.y <= mammothRect.bottom
        );
    };

    const handleBrushStart = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isGrooming) {
            // Handle long press if not in grooming mode
            longPressTimer.current = setTimeout(() => {
                onLongPress();
            }, 500);
            return;
        }
        
        // Prevent default behavior
        e.preventDefault();
        
        // Set brush as active (being clicked/pressed)
        setIsBrushActive(true);
        
        // Check if brush is over mammoth
        const isOver = checkBrushOverMammoth();
        setIsBrushOverMammoth(isOver);
        
        // If brush is over mammoth, increment stroke count
        if (isOver) {
            setGroomingStrokes(prev => {
                const newStrokes = prev + 1;
                console.log(`Grooming strokes: ${newStrokes}/${requiredStrokes}`);
                if (newStrokes >= requiredStrokes) {
                    console.log('Grooming complete!');
                    setTimeout(() => {
                        onGroomComplete();
                    }, 300);
                    return 0;
                }
                return newStrokes;
            });
        }
    };

    const handleBrushMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isGrooming || !isBrushActive) return;
        
        e.preventDefault();
        
        // Check if brush is over mammoth
        const isOver = checkBrushOverMammoth();
        
        // If brush just moved over mammoth, increment stroke count
        if (isOver && !isBrushOverMammoth) {
            setGroomingStrokes(prev => {
                const newStrokes = prev + 1;
                console.log(`Grooming strokes: ${newStrokes}/${requiredStrokes}`);
                if (newStrokes >= requiredStrokes) {
                    console.log('Grooming complete!');
                    setTimeout(() => {
                        onGroomComplete();
                    }, 300);
                    return 0;
                }
                return newStrokes;
            });
        }
        
        // Update brush over mammoth state
        setIsBrushOverMammoth(isOver);
    };

    const handleBrushEnd = () => {
        setIsBrushActive(false);
        setIsBrushOverMammoth(false);
        
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }
    };
    
    // Helper to determine mood class based on emotional state
    const getMoodClass = () => {
        if (isFeeding) return 'mood-hungry';
        if (energy < 15) return 'mood-sleepy';
        
        switch (emotionalState) {
            case 'playful': return 'mood-playful';
            case 'agitated': return 'mood-agitated';
            case 'content': return 'mood-content';
            case 'lethargic': return 'mood-lethargic';
            default: return '';
        }
    };

    return (
        <div 
            className={`absolute flex items-center justify-center ${getMoodClass()}`}
            onMouseDown={handleBrushStart}
            onMouseUp={handleBrushEnd}
            onMouseLeave={handleBrushEnd}
            onMouseMove={handleBrushMove}
            onTouchStart={handleBrushStart}
            onTouchEnd={handleBrushEnd}
            onTouchMove={handleBrushMove}
            ref={mammothRef}
        >
            {/* Aura behind the mammoth based on mood */}
            <div className="absolute inset-0 rounded-full mood-aura"></div>
            
            {/* Visual indicator for grooming mode */}
            {isGrooming && (
                <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-pulse z-10"></div>
            )}
            
            {/* Grooming progress indicator */}
            {isGrooming && (
                <div className="absolute top-2 left-10 right-10 h-1 bg-gray-200/50 rounded-full overflow-hidden z-20">
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
            
            {/* Cursor brush for grooming */}
            {isGrooming && showCursorBrush && (
                <div 
                    className="fixed z-50 pointer-events-none"
                    style={{
                        left: `${cursorPosition.x}px`,
                        top: `${cursorPosition.y}px`,
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    <div 
                        className={`w-40 h-40 flex items-center justify-center 
                            ${isBrushActive ? 'scale-90' : 'scale-100'} 
                            ${isBrushOverMammoth && isBrushActive ? 'text-amber-500' : 'text-white'} 
                            transition-all duration-100`}
                    >
                        <span className="text-5xl drop-shadow-lg" style={{ transform: 'rotate(-45deg)' }}>🧹</span>
                    </div>
                </div>
            )}
            
            {/* Grooming text indicator */}
            {isGrooming && (
                <div className="fixed bottom-28 left-0 right-0 text-center text-sm text-blue-200 font-medium">
                    Click and drag the brush over the mammoth to groom
                </div>
            )}
            
            {/* Debug info for development */}
            {/* <div className="absolute top-0 left-0 bg-black/70 text-white text-xs p-2 rounded-md">
                Energy: {energy.toFixed(0)} | Happiness: {happiness.toFixed(0)}<br/>
                State: {emotionalState}
            </div> */}
            
            {/* Add global style for hiding cursor */}
            <style jsx global>{`
                .cursor-none {
                    cursor: none !important;
                }
                
                .cursor-none * {
                    cursor: none !important;
                }
                
                /* Mood-specific auras */
                .mood-playful .mood-aura {
                    background: radial-gradient(circle, rgba(255,215,0,0.1) 0%, rgba(255,255,255,0) 70%);
                    animation: pulse-playful 4s ease-in-out infinite;
                }
                
                .mood-agitated .mood-aura {
                    background: radial-gradient(circle, rgba(255,0,0,0.1) 0%, rgba(255,255,255,0) 70%);
                    animation: pulse-agitated 2s ease-in-out infinite;
                }
                
                .mood-content .mood-aura {
                    background: radial-gradient(circle, rgba(152,251,152,0.15) 0%, rgba(255,255,255,0) 70%);
                    animation: pulse-content 6s ease-in-out infinite;
                }
                
                .mood-lethargic .mood-aura {
                    background: radial-gradient(circle, rgba(128,128,128,0.1) 0%, rgba(255,255,255,0) 70%);
                    animation: pulse-lethargic 8s ease-in-out infinite;
                }
                
                .mood-hungry .mood-aura {
                    background: radial-gradient(circle, rgba(255,165,0,0.1) 0%, rgba(255,255,255,0) 70%);
                    animation: pulse-hungry 3s ease-in-out infinite;
                }
                
                .mood-sleepy .mood-aura {
                    background: radial-gradient(circle, rgba(138,43,226,0.05) 0%, rgba(255,255,255,0) 70%);
                    animation: pulse-sleepy 10s ease-in-out infinite;
                }
                
                /* Aura animation keyframes */
                @keyframes pulse-playful {
                    0%, 100% { opacity: 0.7; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.1); }
                }
                
                @keyframes pulse-agitated {
                    0%, 100% { opacity: 0.7; transform: scale(1); }
                    50% { opacity: 0.9; transform: scale(1.08); }
                }
                
                @keyframes pulse-content {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.05); }
                }
                
                @keyframes pulse-lethargic {
                    0%, 100% { opacity: 0.4; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.02); }
                }
                
                @keyframes pulse-hungry {
                    0%, 100% { opacity: 0.6; transform: scale(1); }
                    50% { opacity: 0.9; transform: scale(1.07); }
                }
                
                @keyframes pulse-sleepy {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.4; transform: scale(1.01); }
                }
            `}</style>
        </div>
    );
}