'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FriendshipTreeVisualization from '@/app/components/FriendshipTreeVisualization';
import FriendDetailModal from '@/app/components/FriendDetailModal';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Define types for our data structures
interface Friend {
    id: string;
    name: string;
    avatar: string;
    level: number;
    mammothName: string;
    friendshipLevel: number;
    lastActive: string;
}

export default function FriendshipTreePage() {
    const router = useRouter();
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

    // Sample data for demonstration
    const [friends] = useState<Friend[]>([
        {
            id: '1',
            name: 'Sarah',
            avatar: '👧',
            level: 15,
            mammothName: 'Fluffy',
            friendshipLevel: 3, // On a scale of 1-5
            lastActive: '2 min ago'
        },
        {
            id: '2',
            name: 'Mike',
            avatar: '👦',
            level: 12,
            mammothName: 'Thunder',
            friendshipLevel: 2,
            lastActive: '1 hour ago'
        },
        {
            id: '3',
            name: 'Emma',
            avatar: '👩',
            level: 18,
            mammothName: 'Snowball',
            friendshipLevel: 4,
            lastActive: 'Just now'
        },
        {
            id: '4',
            name: 'Alex',
            avatar: '🧑',
            level: 8,
            mammothName: 'Stompy',
            friendshipLevel: 1,
            lastActive: '1 day ago'
        },
        {
            id: '5',
            name: 'Luna',
            avatar: '👱‍♀️',
            level: 10,
            mammothName: 'Starlight',
            friendshipLevel: 5,
            lastActive: '4 hours ago'
        }
    ]);

    const handleInteraction = (interactionType: string) => {
        if (!selectedFriend) return;

        // Handle chat interaction differently - navigate to chat page
        if (interactionType === 'chat') {
            router.push(`/chat/${selectedFriend.id}`);
            return;
        }

        // Different messages based on interaction type
        const messages = {
            play: `Invited ${selectedFriend.name} to play a game!`,
            gift: `Sent a gift to ${selectedFriend.name}!`,
            dance: `Performed a friendship dance with ${selectedFriend.name}!`
        };

        setSuccessMessage(messages[interactionType as keyof typeof messages] || 'Interaction successful!');
        setShowSuccessAlert(true);
        setSelectedFriend(null);

        setTimeout(() => setShowSuccessAlert(false), 3000);
    };

    const getAvailableInteractions = (friendshipLevel: number) => {
        // Different levels unlock different interactions
        const interactions = [
            { type: 'chat', label: 'Chat', icon: '💬', requiredLevel: 1 },
            { type: 'gift', label: 'Send Gift', icon: '🎁', requiredLevel: 2 },
            { type: 'play', label: 'Play Game', icon: '🎮', requiredLevel: 3 },
            { type: 'dance', label: 'Dance Together', icon: '💃', requiredLevel: 5 },
        ];

        return interactions.filter(interaction => friendshipLevel >= interaction.requiredLevel);
    };

    return (
        <div className="min-h-screen pb-16">
            {/* Header */}
            <div className="bg-[#0D1425] shadow-lg border-b border-[#2A3A60]">
                <div className="max-w-md mx-auto p-4">
                    <div className="flex items-center mb-4">
                        <Link
                            href="/friends"
                            className="text-[#6ECBDC] hover:text-[#8FE5F5] transition-colors"
                        >
                            <svg className="w-6 h-6 drop-shadow-[0_0_3px_rgba(110,203,220,0.6)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <h1 
                            className="text-2xl font-bold text-center flex-1"
                            style={{
                                background: "linear-gradient(to bottom, rgb(110, 203, 220), rgb(56, 152, 184))",
                                WebkitBackgroundClip: "text",
                                backgroundClip: "text",
                                color: "transparent",
                                textShadow: "0 2px 4px rgba(40, 180, 220, 0.3)"
                            }}
                        >
                            Friendship Tree
                        </h1>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-md mx-auto p-4">
                <div className="bg-[#1A2845] rounded-lg p-4 shadow-lg mb-4 border border-[#2A3A60]">
                    <p className="text-center text-[#D6ECF0] mb-2">
                        Nurture your friendships to unlock special interactions!
                    </p>
                    <p className="text-center text-sm text-[#D6ECF0]/70">
                        Interact with your friends daily to grow stronger bonds.
                    </p>
                </div>

                {/* Tree Visualization */}
                <div className="bg-[#1A2845] rounded-lg p-4 shadow-lg mb-4 min-h-64 border border-[#2A3A60]">
                    <FriendshipTreeVisualization
                        friends={friends}
                        onSelectFriend={setSelectedFriend}
                    />
                </div>

                {/* Legend */}
                <div className="bg-[#1A2845] rounded-lg p-4 shadow-lg border border-[#2A3A60]">
                    <h3 className="font-medium mb-2 text-[#D6ECF0]">Friendship Levels</h3>
                    <div className="grid grid-cols-5 gap-2">
                        {[1, 2, 3, 4, 5].map(level => (
                            <div key={level} className="text-center">
                                <div className="mx-auto w-4 h-4 rounded-full bg-[#6ECBDC]" style={{ opacity: 0.2 + (level * 0.16) }}></div>
                                <div className="text-xs mt-1 text-[#D6ECF0]/70">Level {level}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Friend Detail Modal */}
            {selectedFriend && (
                <AlertDialog open={!!selectedFriend} onOpenChange={() => setSelectedFriend(null)}>
                    <AlertDialogContent className="bg-[#0D1425] border border-[#2A3A60] text-[#D6ECF0]">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2 text-[#6ECBDC]">
                                <span className="text-2xl">{selectedFriend.avatar}</span>
                                <span>{selectedFriend.name}</span>
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-[#D6ECF0]/70">
                                <div className="py-4">
                                    <div className="mb-4">
                                        <div className="text-sm text-[#D6ECF0]">
                                            Mammoth: {selectedFriend.mammothName} · Level {selectedFriend.level}
                                        </div>
                                        <div className="text-xs text-[#D6ECF0]/50">
                                            Active {selectedFriend.lastActive}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="text-sm font-medium mb-1 text-[#D6ECF0]">Friendship Level: {selectedFriend.friendshipLevel}/5</div>
                                        <div className="w-full bg-[#152238] rounded-full h-2">
                                            <div
                                                className="bg-[#6ECBDC] rounded-full h-2"
                                                style={{ width: `${(selectedFriend.friendshipLevel / 5) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <div className="text-sm font-medium mb-2 text-[#D6ECF0]">Available Interactions:</div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {getAvailableInteractions(selectedFriend.friendshipLevel).map(interaction => (
                                                <button
                                                    key={interaction.type}
                                                    onClick={() => handleInteraction(interaction.type)}
                                                    className="flex items-center justify-center gap-2 p-2 bg-[#1A2845] rounded-lg hover:bg-[#2A3A60] border border-[#2A3A60] transition-colors"
                                                >
                                                    <span className="text-xl">{interaction.icon}</span>
                                                    <span className="text-sm text-[#D6ECF0]">{interaction.label}</span>
                                                </button>
                                            ))}
                                        </div>

                                        {selectedFriend.friendshipLevel < 5 && (
                                            <div className="mt-4 text-sm text-[#D6ECF0]/50">
                                                Reach level {selectedFriend.friendshipLevel + 1} to unlock more interactions!
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction className="bg-[#6ECBDC] text-[#070F24] hover:bg-[#8FE5F5] transition-colors">Close</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}

            {/* Success Alert */}
            {showSuccessAlert && (
                <div className="fixed bottom-20 left-0 right-0 flex justify-center">
                    <div className="bg-[#1A2845] text-[#D6ECF0] px-4 py-2 rounded-lg shadow-lg border border-[#2A3A60] animate-bounce-small">
                        {successMessage}
                    </div>
                </div>
            )}

            {/* Night sky effect - match main app */}
            <div className="fixed inset-0 -z-50 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-t from-[#070F24]/80 to-transparent"></div>
            </div>

            {/* Navigation Bar */}
            <nav className="fixed bottom-0 left-0 w-full bg-[#101830] border-t border-[#2A3A60] z-50">
                <div className="flex justify-around items-center h-16">
                    <Link href="/" className="flex flex-col items-center text-[#6ECBDC] hover:text-[#8FE5F5] transition-colors">
                        <svg className="w-6 h-6 drop-shadow-[0_0_3px_rgba(110,203,220,0.6)]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
                        </svg>
                        <span className="text-xs mt-1">Home</span>
                    </Link>
                    <Link href="/friends" className="flex flex-col items-center text-[#6ECBDC] hover:text-[#8FE5F5] transition-colors">
                        <svg className="w-6 h-6 drop-shadow-[0_0_3px_rgba(110,203,220,0.6)]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16,13C15.71,13 15.38,13 15.03,13.05C16.19,13.89 17,15 17,16.5V19H23V16.5C23,14.17 18.33,13 16,13M8,13C5.67,13 1,14.17 1,16.5V19H15V16.5C15,14.17 10.33,13 8,13M8,11A3,3 0 0,0 11,8A3,3 0 0,0 8,5A3,3 0 0,0 5,8A3,3 0 0,0 8,11M16,11A3,3 0 0,0 19,8A3,3 0 0,0 16,5A3,3 0 0,0 13,8A3,3 0 0,0 16,11Z" />
                        </svg>
                        <span className="text-xs mt-1">Friends</span>
                    </Link>
                    <Link href="/minigames" className="flex flex-col items-center text-[#6ECBDC] hover:text-[#8FE5F5] transition-colors">
                        <svg className="w-6 h-6 drop-shadow-[0_0_3px_rgba(110,203,220,0.6)]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21,6H3A2,2 0 0,0 1,8V16A2,2 0 0,0 3,18H21A2,2 0 0,0 23,16V8A2,2 0 0,0 21,6M11,13H8V16H6V13H3V11H6V8H8V11H11M15.5,15A1.5,1.5 0 0,1 14,13.5A1.5,1.5 0 0,1 15.5,12A1.5,1.5 0 0,1 17,13.5A1.5,1.5 0 0,1 15.5,15M19.5,12A1.5,1.5 0 0,1 18,10.5A1.5,1.5 0 0,1 19.5,9A1.5,1.5 0 0,1 21,10.5A1.5,1.5 0 0,1 19.5,12Z" />
                        </svg>
                        <span className="text-xs mt-1">Games</span>
                    </Link>
                    <Link href="/shop" className="flex flex-col items-center text-[#6ECBDC] hover:text-[#8FE5F5] transition-colors">
                        <svg className="w-6 h-6 drop-shadow-[0_0_3px_rgba(110,203,220,0.6)]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17,18C15.89,18 15,18.89 15,20A2,2 0 0,0 17,22A2,2 0 0,0 19,20C19,18.89 18.1,18 17,18M1,2V4H3L6.6,11.59L5.24,14.04C5.09,14.32 5,14.65 5,15A2,2 0 0,0 7,17H19V15H7.42A0.25,0.25 0 0,1 7.17,14.75C7.17,14.7 7.18,14.66 7.2,14.63L8.1,13H15.55C16.3,13 16.96,12.58 17.3,11.97L20.88,5.5C20.95,5.34 21,5.17 21,5A1,1 0 0,0 20,4H5.21L4.27,2M7,18C5.89,18 5,18.89 5,20A2,2 0 0,0 7,22A2,2 0 0,0 9,20C9,18.89 8.1,18 7,18Z" />
                        </svg>
                        <span className="text-xs mt-1">Shop</span>
                    </Link>
                </div>
            </nav>
        </div>
    );
}