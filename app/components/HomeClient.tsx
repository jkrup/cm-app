"use client"

import { useEffect, useState } from 'react';
import StatusBar from './StatusBar';
import NavigationBar from './NavigationBar';
import CircularStats from './CircularStats';
import FeedingInteraction from './FeedingInteraction';
import CustomizeModal from './CustomizeModal';
import { useMammothStore } from '../store/mammothStore';

export default function HomeClient() {
    const { excitement, happiness, feed, play, groom } = useMammothStore();
    const [isGrooming, setIsGrooming] = useState(false);
    const [isFeeding, setIsFeeding] = useState(false);
    const [showCustomize, setShowCustomize] = useState(false);
    
    // Decrease stats over time
    useEffect(() => {
        const timer = setInterval(() => {
            useMammothStore.setState((state) => ({
                excitement: Math.max(0, state.excitement - 0.5),
                happiness: Math.max(0, state.happiness - 0.5),
            }));
        }, 10000);

        return () => clearInterval(timer);
    }, []);

    const handleStartGroom = () => {
        setIsGrooming(true);
    };

    const handleGroomComplete = () => {
        groom();
        setIsGrooming(false);
    };

    const handleStartFeed = () => {
        setIsFeeding(true);
    };

    const handleFeedComplete = () => {
        feed();
    };

    const handleFeedingEnd = () => {
        setIsFeeding(false);
    };

    const handleMammothLongPress = () => {
        setShowCustomize(true);
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center">
            <StatusBar />
            <div className="flex-1 w-full max-w-md px-4 py-2 flex items-center justify-center">
                <CircularStats
                    excitement={excitement}
                    happiness={happiness}
                    isGrooming={isGrooming}
                    onGroomComplete={handleGroomComplete}
                    onFeedClick={handleStartFeed}
                    onGroomClick={handleStartGroom}
                    onPlayClick={play}
                    isFeeding={isFeeding}
                    onMammothLongPress={handleMammothLongPress}
                />
            </div>

            <FeedingInteraction
                isFeeding={isFeeding}
                onFeedComplete={handleFeedComplete}
                onFeedingEnd={handleFeedingEnd}
            />

            <CustomizeModal
                isOpen={showCustomize}
                onClose={() => setShowCustomize(false)}
            />

            <NavigationBar />
        </main>
    );
}