'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Friend {
    id: string;
    name: string;
    code: string;
    avatar: string;
    lastActive: string;
    mammothName: string;
    level: number;
}

interface FriendRequest {
    id: string;
    name: string;
    code: string;
    avatar: string;
    mammothName: string;
    level: number;
}

export default function FriendsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('friends');
    const [friendCode, setFriendCode] = useState('');
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

    // Sample data
    const [friends] = useState<Friend[]>([
        {
            id: '1',
            name: 'Sarah',
            code: 'MAMM-1234',
            avatar: '👧',
            lastActive: '2 min ago',
            mammothName: 'Fluffy',
            level: 15
        },
        {
            id: '2',
            name: 'Mike',
            code: 'MAMM-5678',
            avatar: '👦',
            lastActive: '1 hour ago',
            mammothName: 'Thunder',
            level: 12
        },
        {
            id: '3',
            name: 'Emma',
            code: 'MAMM-9012',
            avatar: '👩',
            lastActive: 'Just now',
            mammothName: 'Snowball',
            level: 18
        }
    ]);

    const [friendRequests] = useState<FriendRequest[]>([
        {
            id: '4',
            name: 'Alex',
            code: 'MAMM-3456',
            avatar: '🧑',
            mammothName: 'Stompy',
            level: 8
        },
        {
            id: '5',
            name: 'Luna',
            code: 'MAMM-7890',
            avatar: '👱‍♀️',
            mammothName: 'Starlight',
            level: 10
        }
    ]);

    const myFriendCode = 'MAMM-2468';

    const handleAddFriend = () => {
        if (friendCode.trim()) {
            setShowSuccessAlert(true);
            setFriendCode('');
            setTimeout(() => setShowSuccessAlert(false), 3000);
        }
    };

    const handleAcceptRequest = (requestId: string) => {
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
    };

    const handleSendGift = (friend: Friend) => {
        setSelectedFriend(friend);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-md mx-auto p-4">
                    <div className="flex items-center mb-4">
                        <button
                            onClick={() => router.push('/')}
                            className="text-primary"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className="text-2xl font-bold text-center flex-1">Friends</h1>
                    </div>

                    {/* Friend Code Display */}
                    <div className="mt-4 bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600">Your Friend Code:</div>
                        <div className="flex justify-between items-center">
                            <div className="font-mono font-bold text-lg">{myFriendCode}</div>
                            <button
                                onClick={() => navigator.clipboard.writeText(myFriendCode)}
                                className="text-primary text-sm hover:underline"
                            >
                                Copy
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-md mx-auto p-4">
                <div className="flex space-x-2 mb-4">
                    <button
                        onClick={() => setActiveTab('friends')}
                        className={`px-4 py-2 rounded-lg ${activeTab === 'friends'
                                ? 'bg-primary text-white'
                                : 'bg-white text-gray-600'
                            }`}
                    >
                        Friends ({friends.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`px-4 py-2 rounded-lg ${activeTab === 'requests'
                                ? 'bg-primary text-white'
                                : 'bg-white text-gray-600'
                            } relative`}
                    >
                        Requests
                        {friendRequests.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                {friendRequests.length}
                            </span>
                        )}
                    </button>
                </div>

                {/* Add Friend Input */}
                <div className="bg-white rounded-lg p-4 shadow mb-4">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={friendCode}
                            onChange={(e) => setFriendCode(e.target.value.toUpperCase())}
                            placeholder="Enter friend code"
                            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button
                            onClick={handleAddFriend}
                            disabled={!friendCode.trim()}
                            className="bg-primary text-white px-4 py-2 rounded-lg disabled:opacity-50"
                        >
                            Add Friend
                        </button>
                    </div>
                </div>

                {/* Friends List */}
                {activeTab === 'friends' && (
                    <div className="space-y-4">
                        {friends.map((friend) => (
                            <div key={friend.id} className="bg-white rounded-lg p-4 shadow">
                                <div className="flex items-center space-x-4">
                                    <div className="text-4xl">{friend.avatar}</div>
                                    <div className="flex-1">
                                        <div className="font-bold">{friend.name}</div>
                                        <div className="text-sm text-gray-600">
                                            {friend.mammothName} · Level {friend.level}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Active {friend.lastActive}
                                        </div>
                                    </div>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <button className="text-gray-400 hover:text-gray-600">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                </svg>
                                            </button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Friend Options</AlertDialogTitle>
                                                <AlertDialogDescription className="space-y-4">
                                                    <button
                                                        onClick={() => handleSendGift(friend)}
                                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg mb-6"
                                                    >
                                                        🎁 Send Gift
                                                    </button>
                                                    <button
                                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg text-red-500"
                                                    >
                                                        ❌ Remove Friend
                                                    </button>
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogAction>Cancel</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Friend Requests */}
                {activeTab === 'requests' && (
                    <div className="space-y-4">
                        {friendRequests.map((request) => (
                            <div key={request.id} className="bg-white rounded-lg p-4 shadow">
                                <div className="flex items-center space-x-4">
                                    <div className="text-4xl">{request.avatar}</div>
                                    <div className="flex-1">
                                        <div className="font-bold">{request.name}</div>
                                        <div className="text-sm text-gray-600">
                                            {request.mammothName} · Level {request.level}
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleAcceptRequest(request.id)}
                                            className="bg-primary text-white px-4 py-2 rounded-lg text-sm"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm"
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Gift Sending Dialog */}
            {selectedFriend && (
                <AlertDialog open={!!selectedFriend} onOpenChange={() => setSelectedFriend(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Send Gift</AlertDialogTitle>
                            <AlertDialogDescription className="mb-6">
                                You are sending a gift to {selectedFriend.name}'s mammoth {selectedFriend.mammothName}.
                                They will receive a surprise gift in their mailbox!
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="gap-4">
                            <AlertDialogAction onClick={() => setSelectedFriend(null)}>
                                Cancel
                            </AlertDialogAction>
                            <AlertDialogAction
                                className="bg-primary hover:bg-primary/90"
                                onClick={() => {
                                    setShowSuccessAlert(true);
                                    setSelectedFriend(null);
                                    setTimeout(() => setShowSuccessAlert(false), 3000);
                                }}
                            >
                                Send Gift
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}

            {/* Success Alert */}
            {showSuccessAlert && (
                <div className="fixed bottom-20 left-0 right-0 mx-auto max-w-md px-4">
                    <Alert className="bg-green-100 border-green-200">
                        <AlertDescription>
                            🎉 {selectedFriend ? 'Gift sent successfully!' : 'Friend request sent successfully!'}
                        </AlertDescription>
                    </Alert>
                </div>
            )}
        </div>
    );
}