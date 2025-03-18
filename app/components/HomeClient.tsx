"use client"

import { useEffect, useState } from 'react';
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
        getExcitement,
        getHappiness 
    } = useMammothStore();
    
    // Get the calculated excitement and happiness
    const excitement = getExcitement();
    const happiness = getHappiness();

    // Force component update when stats change to ensure we always display current values
    const [, forceUpdate] = useState({});
    
    // Ensure we update UI whenever any store values change
    useEffect(() => {
        const unsubscribe = useMammothStore.subscribe(() => {
            forceUpdate({});
        });
        
        return () => unsubscribe();
    }, []);

    // Set up interval for stat decay over time
    useEffect(() => {
        const interval = setInterval(() => {
            decreaseStats();
        }, 2000); // Run decay every 2 seconds
        
        return () => clearInterval(interval);
    }, [decreaseStats]);

    // Handle starting the feeding interaction
    const handleStartFeed = () => {
        setIsFeeding(true);
        // Initially show the mammoth during feeding, will hide when animation starts
        setHideMammothDuringFeeding(false);
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
    };

    // Handle completion of grooming
    const handleGroomComplete = () => {
        setIsGrooming(false);
        groom();
    };

    // Handle long press on mammoth
    const handleMammothLongPress = () => {
        setShowModal(true);
    };

    // Handle opening the closet
    const handleOpenCloset = () => {
        setShowCloset(true);
    };

    // Handle costume selection
    const handleSelectCostume = (costume: CostumeType) => {
        setCostumeSelection(costume);
    };

    // Get mammoth expression based on current state
    const getMammothExpression = () => {
        return getMammothMood({
            excitement,
            happiness,
            hunger,
            energy,
            boredom,
            affection
        }).expression;
    };

    return (
        <div className="flex flex-col min-h-screen relative pb-16">
            <StatusBar onOpenCloset={handleOpenCloset} />
 
                {/* Detailed mood stats - shown in a subtle way */}
                <div className="flex justify-center gap-3 my-2 pt-2">
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
                <p className={`px-2 text-md text-[#D6ECF0] ${happyMonkey.className} h-16`}>
                    {getMammothMood({
                        excitement,
                        happiness,
                        hunger,
                        energy,
                        boredom,
                        affection,
                        isFeeding
                    }).text}
                </p>
               
            </div>
            <main className="flex-1 flex flex-col">
                <div className="flex-1 flex flex-col justify-center">
                    <CircularStats 
                        excitement={excitement} 
                        happiness={happiness}
                        isGrooming={isGrooming}
                        onGroomComplete={handleGroomComplete}
                        onFeedClick={handleStartFeed}
                        onGroomClick={handleStartGroom}
                        onPlayClick={play}
                        isFeeding={isFeeding}
                        hideMammothDuringFeeding={hideMammothDuringFeeding}
                        onMammothLongPress={handleMammothLongPress}
                        showMoodText={false}
                        currentCostume={costumeSelection}
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
                            filter: 'brightness(0.5) contrast(0.5) blur(0.5px)'
                        }}
                        priority
                    />
                </div>

                {isFeeding && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#070F24]/80 to-transparent" style={{ backgroundSize: '100% 166.67%' }}></div>
                        <FeedingInteraction
                            isFeeding={isFeeding}
                            onFeedComplete={feed}
                            onFeedingEnd={handleFeedingEnd}
                            onStateChange={handleFeedingStateChange}
                        />
                    </div>
                )}
            </main>

            {/* Action buttons fixed at the bottom of the page */}
            <div className={`fixed bottom-0 left-0 right-0 flex justify-center gap-8 py-4 z-30 ${isFeeding ? 'opacity-30' : ''}`}>
                {/* Groom button */}
                <button
                    onClick={() => handleStartGroom()}
                    disabled={isGrooming || isFeeding}
                    style={{ transform: 'translate(245px, -125px)'}}
                    className={`w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center
                        drop-shadow-[0_0_3px_rgba(110,203,220,0.6)]
                        ${isGrooming ? 'bg-primary/10' : 'hover:bg-gray-50 active:bg-gray-100 hover:scale-110 transition-transform'}`}
                >
                    <span className="text-xl">🪮</span>
                </button>

                {/* Feed button */}
                <button
                    onClick={handleStartFeed}
                    disabled={isGrooming || isFeeding}
                    className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center
                        drop-shadow-[0_0_3px_rgba(110,203,220,0.6)]
                        hover:bg-gray-50 active:bg-gray-100 hover:scale-110 transition-transform"
                >
                    <span className="text-2xl">🍎</span>
                </button>

                {/* Play button */}
                <button
                    onClick={play}
                    disabled={isGrooming || isFeeding}
                    style={{ transform: 'translate(-7px, -80px)'}}
                    className={`w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center
                        drop-shadow-[0_0_3px_rgba(110,203,220,0.6)]
                        hover:bg-gray-50 active:bg-gray-100 hover:scale-110 transition-transform`}
                >
                    <span className="text-xl">🎮</span>
                </button>
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
        </div>
    );
}