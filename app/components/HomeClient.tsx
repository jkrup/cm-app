"use client"

import { useEffect, useState } from 'react';
import StatusBar from './StatusBar';
import NavigationBar from './NavigationBar';
import CircularStats from './CircularStats';
import FeedingInteraction from './FeedingInteraction';
import CustomizeModal from './CustomizeModal';
import { useMammothStore } from '../store/mammothStore';
import { MAMMOTH_NAME } from '../constants/mammoth';
import { happyMonkey } from '../fonts/fonts';
import Image from 'next/image';

export default function HomeClient() {
    const { excitement, happiness, feed, play, groom } = useMammothStore();
    const [isGrooming, setIsGrooming] = useState(false);
    const [isFeeding, setIsFeeding] = useState(false);
    const [hideMammothDuringFeeding, setHideMammothDuringFeeding] = useState(false);
    const [showCustomize, setShowCustomize] = useState(false);

    // Decrease stats over time
    useEffect(() => {
        const timer = setInterval(() => {
            useMammothStore.setState((state) => ({
                excitement: Math.max(0, state.excitement - 0.5),
                happiness: Math.max(0, state.happiness - 0.5),
            }));
            // }, 10000);
        }, 10000);

        return () => clearInterval(timer);
    }, []);

    const handleStartGroom = () => {
        console.log('Starting grooming session');
        setIsGrooming(true);
    };

    const handleGroomComplete = () => {
        console.log('Grooming complete, updating stats');
        groom();
        setIsGrooming(false);
    };

    const handleStartFeed = () => {
        // Temporarily increase excitement to show anticipation
        useMammothStore.setState((state) => ({
            excitement: Math.min(100, state.excitement + 10)
        }));
        setIsFeeding(true);
    };

    const handleFeedComplete = () => {
        feed();
    };

    const handleFeedingEnd = () => {
        setIsFeeding(false);
    };

    const handleFeedingStateChange = (state: 'REACHING' | 'EATING' | 'READY' | 'THROWING' | 'FINISHED') => {
        // Hide mammoth during REACHING and EATING states
        setHideMammothDuringFeeding(state === 'REACHING' || state === 'EATING');
    };

    const handleMammothLongPress = () => {
        setShowCustomize(true);
    };

    // Helper to determine mood text
    const getMoodText = () => {
        const avgMood = (excitement + happiness) / 2;

        if (isFeeding) return `${MAMMOTH_NAME} is excited for food!`;
        if (avgMood > 75) return `${MAMMOTH_NAME} is very happy!`;
        if (avgMood > 50) return `${MAMMOTH_NAME} is content.`;
        if (avgMood > 25) return `${MAMMOTH_NAME} is a bit bored.`;
        return `${MAMMOTH_NAME} needs attention!`

    };

    return (
        <div className="flex flex-col min-h-screen relative pb-16">
            <StatusBar />

            {/* Mood text at bottom */}
            <div className="w-full py-3 text-center">
                <p className={`text-md text-[#D6ECF0] ${happyMonkey.className}`}>
                    {getMoodText()}
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
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#070F24]/80">
                        <FeedingInteraction
                            isFeeding={isFeeding}
                            onFeedComplete={handleFeedComplete}
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

            {showCustomize && (
                <CustomizeModal
                    isOpen={showCustomize}
                    onClose={() => setShowCustomize(false)}
                />
            )}

            {/* Hide the NavigationBar */}
            <div className="hidden">
                <NavigationBar />
            </div>
        </div>
    );
}