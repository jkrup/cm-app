'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
        <div className="min-h-screen bg-gray-50 pb-16">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-md mx-auto p-4">
                    <div className="flex items-center mb-4">
                        <button
                            onClick={() => router.push('/friends')}
                            className="text-primary"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className="text-2xl font-bold text-center flex-1">Friendship Tree</h1>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-md mx-auto p-4">
                <div className="bg-white rounded-lg p-4 shadow mb-4">
                    <p className="text-center text-gray-600 mb-2">
                        Nurture your friendships to unlock special interactions!
                    </p>
                    <p className="text-center text-sm text-gray-500">
                        Interact with your friends daily to grow stronger bonds.
                    </p>
                </div>

                {/* Tree Visualization */}
                <div className="bg-white rounded-lg p-4 shadow mb-4 min-h-64">
                    <FriendshipTreeVisualization
                        friends={friends}
                        onSelectFriend={setSelectedFriend}
                    />
                </div>

                {/* Legend */}
                <div className="bg-white rounded-lg p-4 shadow">
                    <h3 className="font-medium mb-2">Friendship Levels</h3>
                    <div className="grid grid-cols-5 gap-2">
                        {[1, 2, 3, 4, 5].map(level => (
                            <div key={level} className="text-center">
                                <div className={`mx-auto w-4 h-4 rounded-full bg-primary opacity-${level * 20}`}></div>
                                <div className="text-xs mt-1">Level {level}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Friend Detail Modal */}
            {selectedFriend && (
                <AlertDialog open={!!selectedFriend} onOpenChange={() => setSelectedFriend(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                                <span className="text-2xl">{selectedFriend.avatar}</span>
                                <span>{selectedFriend.name}</span>
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                <div className="py-4">
                                    <div className="mb-4">
                                        <div className="text-sm text-gray-600">
                                            Mammoth: {selectedFriend.mammothName} · Level {selectedFriend.level}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Active {selectedFriend.lastActive}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="text-sm font-medium mb-1">Friendship Level: {selectedFriend.friendshipLevel}/5</div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-primary rounded-full h-2"
                                                style={{ width: `${(selectedFriend.friendshipLevel / 5) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <div className="text-sm font-medium mb-2">Available Interactions:</div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {getAvailableInteractions(selectedFriend.friendshipLevel).map(interaction => (
                                                <button
                                                    key={interaction.type}
                                                    onClick={() => handleInteraction(interaction.type)}
                                                    className="flex items-center justify-center gap-2 p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                                                >
                                                    <span className="text-xl">{interaction.icon}</span>
                                                    <span className="text-sm">{interaction.label}</span>
                                                </button>
                                            ))}
                                        </div>

                                        {selectedFriend.friendshipLevel < 5 && (
                                            <div className="mt-4 text-sm text-gray-500">
                                                Reach level {selectedFriend.friendshipLevel + 1} to unlock more interactions!
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction>Close</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}

            {/* Success Alert */}
            {showSuccessAlert && (
                <div className="fixed bottom-20 left-0 right-0 mx-auto max-w-md px-4">
                    <Alert className="bg-green-100 border-green-200">
                        <AlertDescription>
                            🎉 {successMessage}
                        </AlertDescription>
                    </Alert>
                </div>
            )}
        </div>
    );
}