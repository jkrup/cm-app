import React from 'react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogAction
} from '@/components/ui/alert-dialog';

interface Friend {
    id: string;
    name: string;
    avatar: string;
    level: number;
    mammothName: string;
    friendshipLevel: number;
    lastActive: string;
}

interface FriendDetailModalProps {
    friend: Friend | null;
    onClose: () => void;
    onInteraction: (type: string) => void;
}

export default function FriendDetailModal({
    friend,
    onClose,
    onInteraction
}: FriendDetailModalProps) {
    if (!friend) return null;

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
        <AlertDialog open={!!friend} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <span className="text-2xl">{friend.avatar}</span>
                        <span>{friend.name}</span>
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <div className="py-4">
                            <div className="mb-4">
                                <div className="text-sm text-gray-600">
                                    Mammoth: {friend.mammothName} · Level {friend.level}
                                </div>
                                <div className="text-xs text-gray-500">
                                    Active {friend.lastActive}
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="text-sm font-medium mb-1">Friendship Level: {friend.friendshipLevel}/5</div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-primary rounded-full h-2"
                                        style={{ width: `${(friend.friendshipLevel / 5) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <div className="text-sm font-medium mb-2">Available Interactions:</div>
                                <div className="grid grid-cols-2 gap-2">
                                    {getAvailableInteractions(friend.friendshipLevel).map(interaction => (
                                        <button
                                            key={interaction.type}
                                            onClick={() => onInteraction(interaction.type)}
                                            className="flex items-center justify-center gap-2 p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                                        >
                                            <span className="text-xl">{interaction.icon}</span>
                                            <span className="text-sm">{interaction.label}</span>
                                        </button>
                                    ))}
                                </div>

                                {friend.friendshipLevel < 5 && (
                                    <div className="mt-4 text-sm text-gray-500">
                                        Reach level {friend.friendshipLevel + 1} to unlock more interactions!
                                    </div>
                                )}
                            </div>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={onClose}>Close</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}