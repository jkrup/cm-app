"use client"

import { useEffect, useState, useRef } from 'react';
import StatusBar from './StatusBar';
import NavigationBar from './NavigationBar';
import CircularStats from './CircularStats';
import FeedingInteraction from './FeedingInteraction';
import CustomizeModal from './CustomizeModal';
import ClosetModal from './ClosetModal';
import { useMammothStore } from '../store/mammothStore';
import { MAMMOTH_NAME } from '../constants/mammoth';
import { happyMonkey } from '../fonts/fonts';
import Image from 'next/image';
import happyMammothImg from '@/public/mammoth/happy.png';
import mediumMammothImg from '@/public/mammoth/medium.png';
import lowMammothImg from '@/public/mammoth/low.png';
import sadMammothImg from '@/public/mammoth/sad.png';
import { getMammothMood } from '@/app/utils/getMood';
import Mammoth from './Mammoth';
import AnimatedText from './AnimatedText';
import TruffleGift from './TruffleGift';
import { useNotificationStore } from '@/app/store/notificationStore';
import { useConfigStore } from '@/app/store/configStore';

// Define costume types
type CostumeType = null | 'angel' | 'devil' | 'magician' | 'bday-hat' | 'beach' | 
                  'bucket' | 'cowboy' | 'pirate' | 'sailor' | 'winter' | 
                  'wizard' | 'viking';

export default function HomeClient() {
    const [showModal, setShowModal] = useState(false);
    const [showCloset, setShowCloset] = useState(false);
    const [isFeeding, setIsFeeding] = useState(false);
    const [costumeSelection, setCostumeSelection] = useState<CostumeType>(null);
    const [isGrooming, setIsGrooming] = useState(false);
    const [hideMammothDuringFeeding, setHideMammothDuringFeeding] = useState(false);
    const [showCustomize, setShowCustomize] = useState(false);
    
    // Use state instead of ref for mood text to ensure proper rendering
    const [currentMoodText, setCurrentMoodText] = useState<string>('');
    const [moodTextKey, setMoodTextKey] = useState<number>(0);
    
    // Get config and notification store functions
    const checkNotifications = useNotificationStore(state => state.checkForNotifications);
    const updateLastInteractionTime = useConfigStore(state => state.updateLastInteractionTime);
    
    // Subscribe to the mammoth store to get the stats
    const { 
        hunger, 
        energy, 
        boredom, 
        affection, 
        feed, 
        play, 
        groom, 
        decreaseStats,
        getHappiness,
        getEmotionalState,
        canGiveTruffle,
        isShowingTruffle,
        checkTruffleConditions,
        acceptTruffle,
        setIsShowingTruffle
    } = useMammothStore();
    
    // Get the calculated happiness and emotional state
    const happiness = getHappiness();
    const emotionalState = getEmotionalState();

    // Force component update when stats change to ensure we always display current values
    const [, forceUpdate] = useState({});
    
    // Initialize with component mount (first load)
    useEffect(() => {
        // Initial notification check
        checkNotifications();
        
        // Set up interval to check for notifications
        const interval = setInterval(() => {
            checkNotifications();
        }, 60000); // Check every minute
        
        return () => clearInterval(interval);
    }, [checkNotifications]);
    
    // Ensure we update UI whenever any store values change
    useEffect(() => {
        const unsubscribe = useMammothStore.subscribe(() => {
            forceUpdate({});
        });
        
        return () => unsubscribe();
    }, []);

    // Control when the mood text should update
    useEffect(() => {
        // Only update the mood text occasionally to prevent it from changing too frequently
        // This prevents the AnimatedText from constantly restarting
        const updateMoodTextInterval = setInterval(() => {
            const newMoodText = getMammothMood({
                energy,
                happiness,
                hunger,
                boredom,
                affection,
                emotionalState,
                isFeeding
            }).text;
            
            // Only update if the mood text has changed significantly
            if (newMoodText !== currentMoodText) {
                console.log(`HomeClient: Updating mood text to "${newMoodText}"`);
                setCurrentMoodText(newMoodText);
                // Increment key to trigger a new AnimatedText instance
                setMoodTextKey(prevKey => prevKey + 1);
            }
        }, 15000); // Check for mood text updates every 15 seconds
        
        // Initialize the mood text on first render
        if (!currentMoodText) {
            const initialMoodText = getMammothMood({
                energy,
                happiness,
                hunger,
                boredom,
                affection,
                emotionalState,
                isFeeding
            }).text;
            console.log(`HomeClient: Initial mood text set to "${initialMoodText}"`);
            setCurrentMoodText(initialMoodText);
            setMoodTextKey(1);
        }
        
        return () => clearInterval(updateMoodTextInterval);
    }, [energy, happiness, hunger, boredom, affection, emotionalState, isFeeding, currentMoodText]);
    
    // Update mood text immediately after feeding or other significant interactions
    const updateMoodTextNow = () => {
        const newMoodText = getMammothMood({
            energy,
            happiness,
            hunger,
            boredom,
            affection,
            emotionalState,
            isFeeding
        }).text;
        
        if (newMoodText !== currentMoodText) {
            console.log(`HomeClient: Forcing mood text update to "${newMoodText}"`);
            setCurrentMoodText(newMoodText);
            setMoodTextKey(prevKey => prevKey + 1);
        }
    };

    // Set up interval for stat decay over time
    useEffect(() => {
        const interval = setInterval(() => {
            decreaseStats();
            // The store now handles truffle checks internally
        }, 2000); // Run decay every 2 seconds
        
        return () => clearInterval(interval);
    }, [decreaseStats]);
    
    // Effect to check for truffle gift conditions after interactions
    useEffect(() => {
        // Check if conditions are met for truffle
        if (canGiveTruffle && !isShowingTruffle && !isFeeding && !isGrooming) {
            // Show the truffle with a random delay to make it feel natural
            const randomDelay = 1000 + Math.random() * 3000; // 1 to 4 seconds delay
            const timer = setTimeout(() => {
                setIsShowingTruffle(true);
            }, randomDelay);
            
            return () => clearTimeout(timer);
        }
    }, [canGiveTruffle, isShowingTruffle, isFeeding, isGrooming, setIsShowingTruffle]);

    // Handle starting the feeding interaction
    const handleStartFeed = () => {
        setIsFeeding(true);
        // Initially show the mammoth during feeding, will hide when animation starts
        setHideMammothDuringFeeding(false);
        // Update interaction time
        updateLastInteractionTime();
    };

    // Handle feeding animation states
    const handleFeedingStateChange = (state: 'READY' | 'THROWING' | 'REACHING' | 'EATING' | 'FINISHED') => {
        if (state === 'REACHING' || state === 'EATING') {
            // Hide mammoth during both reaching and eating animations
            setHideMammothDuringFeeding(true);
        } else if (state === 'FINISHED') {
            // Show mammoth again when done
            setHideMammothDuringFeeding(false);
        }
    };

    // Handle the completion of feeding
    const handleFeedingEnd = () => {
        setIsFeeding(false);
        setHideMammothDuringFeeding(false);
    };

    // Handle starting grooming
    const handleStartGroom = () => {
        setIsGrooming(true);
        // Update interaction time
        updateLastInteractionTime();
    };

    // Handle completion of grooming
    const handleGroomComplete = () => {
        setIsGrooming(false);
        groom();
    };

    // Handle long press on mammoth
    const handleMammothLongPress = () => {
        setShowModal(true);
        // Update interaction time
        updateLastInteractionTime();
    };

    // Handle opening the closet
    const handleOpenCloset = () => {
        setShowCloset(true);
        // Update interaction time
        updateLastInteractionTime();
    };

    // Handle costume selection
    const handleSelectCostume = (costume: CostumeType) => {
        setCostumeSelection(costume);
    };

    // Get mammoth expression based on current state
    const getMammothExpression = () => {
        return getMammothMood({
            energy,
            happiness,
            hunger,
            boredom,
            affection,
            emotionalState
        }).expression;
    };

    // Handle when the user accepts the truffle gift
    const handleAcceptTruffle = () => {
        acceptTruffle();
        // Update mood text after accepting the truffle
        updateMoodTextNow();
        // Update interaction time
        updateLastInteractionTime();
    };

    // Get emoji for the current emotional state
    const getEmotionalStateEmoji = () => {
        switch (emotionalState) {
            case 'playful': return '🎮';
            case 'agitated': return '😤';
            case 'content': return '😌';
            case 'lethargic': return '😔';
            default: return '🦣';
        }
    };

    return (
        <div className="flex flex-col min-h-screen relative pb-16">
            {/* Wrap StatusBar in a div with padding-top */}
            <div className="pt-6">
              <StatusBar onOpenCloset={handleOpenCloset} />
            </div>
 
            {/* Detailed mood stats - shown in a subtle way */}
            <div className="flex justify-center gap-3 my-2 pt-2 hidden">
                <div className="text-xs text-[#D6ECF0]/70 flex items-center">
                    <span className="mr-1">🍗</span>{Math.round(hunger)}%
                </div>
                <div className="text-xs text-[#D6ECF0]/70 flex items-center">
                    <span className="mr-1">⚡</span>{Math.round(energy)}%
                </div>
                <div className="text-xs text-[#D6ECF0]/70 flex items-center">
                    <span className="mr-1">😴</span>{Math.round(boredom)}%
                </div>
                <div className="text-xs text-[#D6ECF0]/70 flex items-center">
                    <span className="mr-1">❤️</span>{Math.round(affection)}%
                </div>
            </div>
                
            {/* Mood text at bottom */}
            <div className="w-full py-3 text-center">
                <AnimatedText 
                    key={`mood-text-${moodTextKey}`} // Adding a key to control when AnimatedText resets
                    text={currentMoodText}
                    className={`px-2 text-md text-[#D6ECF0] ${happyMonkey.className} h-16`}
                    holdTime={20000}
                />
            </div>
            <main className="flex-1 flex flex-col">
                <div className="flex-1 flex flex-col justify-center">
                    <CircularStats 
                        isGrooming={isGrooming}
                        onGroomComplete={() => {
                            setIsGrooming(false);
                            groom();
                            // Store now checks for truffle opportunity internally
                        }}
                        onFeedClick={handleStartFeed}
                        onGroomClick={() => setIsGrooming(true)}
                        onPlayClick={() => {
                            play();
                            // Update interaction time
                            updateLastInteractionTime();
                            // Store now checks for truffle opportunity internally
                        }}
                        onMammothLongPress={() => setShowCustomize(true)}
                        isFeeding={isFeeding}
                        hideMammothDuringFeeding={hideMammothDuringFeeding}
                        currentCostume={costumeSelection}
                        showMoodText={false}
                    />
                </div>
                
                {/* Glacier background image */}
                <div className="absolute bottom-0 left-0 w-full pointer-events-none z-0 overflow-hidden">
                    <Image 
                        src="/glacier_resized.png"
                        alt="Glacier"
                        width={1800}
                        height={1200}
                        className="w-full h-auto object-cover"
                        style={{
                            color: 'transparent',
                            transform: 'scale(1.75) translateY(-135px) translateX(-6px)',
                            zIndex: -200,
                            filter: 'sepia(0.4) brightness(1.1) saturate(1.2) hue-rotate(-20deg)'
                        }}
                        priority
                    />
                </div>

                {isFeeding && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#070F24]/80 to-transparent" style={{ backgroundSize: '100% 166.67%' }}></div>
                        <FeedingInteraction
                            isFeeding={isFeeding}
                            onFeedComplete={() => {
                                feed();
                                // Store now checks for truffle opportunity internally
                                // Update mood text after feeding
                                setTimeout(updateMoodTextNow, 1000);
                            }}
                            onFeedingEnd={() => {
                                setIsFeeding(false);
                                setHideMammothDuringFeeding(false);
                            }}
                            onStateChange={(state) => {
                                // Hide mammoth during certain feeding animation states
                                if (state === 'REACHING' || state === 'EATING') {
                                    setHideMammothDuringFeeding(true);
                                } else {
                                    setHideMammothDuringFeeding(false);
                                }
                            }}
                        />
                    </div>
                )}
            </main>

            {/* New Action buttons fixed at the bottom of the page */}
            <div className={`fixed bottom-0 left-0 right-0 p-2 z-30 ${isFeeding ? 'opacity-30 pointer-events-none' : ''}`}>
                {/* Dark container bar - Updated styling */}
                <div 
                  className="flex justify-around items-center rounded-lg p-2 shadow-md max-w-sm mx-auto"
                  style={{
                    backgroundColor: 'rgba(var(--ui-bg-medium), 0.85)', // Use slightly darker UI bg with transparency
                    border: `1px solid rgba(var(--ui-border), 0.6)` // Use slightly darker UI border
                  }}
                >
                    {/* Feed Button - Updated styling */}
                    <button
                        onClick={handleStartFeed}
                        disabled={isFeeding}
                        className="flex items-center justify-center w-14 h-14 rounded-lg shadow transition-colors"
                        style={{
                          backgroundColor: 'rgba(var(--ui-bg-light), 0.8)',
                          border: `1px solid rgba(var(--ui-border), 0.4)`
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(var(--ui-bg-light), 1)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(var(--ui-bg-light), 0.8)'; }}
                        onMouseDown={(e) => { e.currentTarget.style.backgroundColor = 'rgba(var(--ui-border), 0.5)'; }}
                        onMouseUp={(e) => { e.currentTarget.style.backgroundColor = 'rgba(var(--ui-bg-light), 1)'; }}
                    >
                        <span className="text-2xl">🥕</span>
                    </button>

                    {/* Play Button - Updated styling */}
                    <button
                        onClick={() => {
                            play();
                            updateLastInteractionTime();
                        }}
                        disabled={isGrooming || isFeeding}
                        className="flex items-center justify-center w-14 h-14 bg-zinc-600 rounded-lg shadow hover:bg-zinc-500 active:bg-zinc-700 transition-colors"
                    >
                        <span className="text-2xl">🕹️</span>
                    </button>

                    {/* Groom Button - Updated styling */}
                    <button
                        onClick={handleStartGroom}
                        disabled={isGrooming || isFeeding}
                        className={`flex items-center justify-center w-14 h-14 rounded-lg shadow transition-colors ${isGrooming ? 'opacity-50' : ''}`} // Simplified disabled state
                        style={{
                          backgroundColor: isGrooming ? 'rgba(var(--ui-border), 0.5)' : 'rgba(var(--ui-bg-light), 0.8)', // Different bg when grooming
                          border: `1px solid rgba(var(--ui-border), 0.4)`
                        }}
                        onMouseOver={(e) => { if (!isGrooming) e.currentTarget.style.backgroundColor = 'rgba(var(--ui-bg-light), 1)'; }}
                        onMouseOut={(e) => { if (!isGrooming) e.currentTarget.style.backgroundColor = 'rgba(var(--ui-bg-light), 0.8)'; }}
                        onMouseDown={(e) => { if (!isGrooming) e.currentTarget.style.backgroundColor = 'rgba(var(--ui-border), 0.5)'; }}
                        onMouseUp={(e) => { if (!isGrooming) e.currentTarget.style.backgroundColor = 'rgba(var(--ui-bg-light), 1)'; }}
                   >
                        <span className="text-2xl">🖌️</span>
                    </button>
                    
                    {/* Closet/T-shirt Button - Updated styling */}
                    <button
                        onClick={handleOpenCloset}
                        disabled={isFeeding}
                        className="flex items-center justify-center w-14 h-14 rounded-lg shadow transition-colors"
                        style={{
                          backgroundColor: 'rgba(var(--ui-bg-light), 0.8)',
                          border: `1px solid rgba(var(--ui-border), 0.4)`
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(var(--ui-bg-light), 1)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(var(--ui-bg-light), 0.8)'; }}
                        onMouseDown={(e) => { e.currentTarget.style.backgroundColor = 'rgba(var(--ui-border), 0.5)'; }}
                        onMouseUp={(e) => { e.currentTarget.style.backgroundColor = 'rgba(var(--ui-bg-light), 1)'; }}
                    >
                        <span className="text-2xl">👕</span>
                    </button>
                </div>
            </div>
            
            {showModal && (
                <CustomizeModal 
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                />
            )}
            
            {showCloset && (
                <ClosetModal 
                    isOpen={showCloset}
                    onClose={() => setShowCloset(false)}
                    currentCostume={costumeSelection}
                    onSelectCostume={handleSelectCostume}
                    mammothExpression={getMammothExpression()}
                />
            )}

            {/* Hide the NavigationBar */}
            <div className="hidden">
                <NavigationBar />
            </div>

            {/* Truffle Gift Modal */}
            <TruffleGift 
                key={`truffle-gift-${isShowingTruffle ? 'visible' : 'hidden'}`}
                isVisible={isShowingTruffle}
                onAccept={handleAcceptTruffle}
            />
        </div>
    );
}