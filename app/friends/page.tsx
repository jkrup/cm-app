'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

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
    const [successMessage, setSuccessMessage] = useState('');
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
            setSuccessMessage('Friend request sent successfully!');
            setShowSuccessAlert(true);
            setFriendCode('');
            setTimeout(() => setShowSuccessAlert(false), 3000);
        }
    };

    const handleAcceptRequest = (requestId: string) => {
        setSuccessMessage('Friend request accepted!');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
    };

    const handleSendGift = (friend: Friend) => {
        setSelectedFriend(friend);
    };

    return (
        <div className="min-h-screen pb-16">
            {/* Header */}
            <div className="bg-[#0D1425] shadow-lg border-b border-[#2A3A60]">
                <div className="max-w-md mx-auto p-4">
                    <div className="flex items-center mb-4">
                        <Link
                            href="/"
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
                            Friends
                        </h1>
                    </div>

                    {/* Friend Code Display */}
                    <div className="mt-4 bg-[#1A2845] p-3 rounded-lg shadow-inner border border-[#2A3A60]">
                        <div className="text-sm text-[#D6ECF0]/70">Your Friend Code:</div>
                        <div className="flex justify-between items-center">
                            <div className="font-mono font-bold text-lg text-[#D6ECF0]">{myFriendCode}</div>
                            <button
                                onClick={() => navigator.clipboard.writeText(myFriendCode)}
                                className="text-[#6ECBDC] hover:text-[#8FE5F5] text-sm hover:underline transition-colors"
                            >
                                Copy
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-md mx-auto p-4 overflow-y-auto max-h-[70vh]">
                <div className="flex space-x-2 mb-4">
                    <button
                        onClick={() => setActiveTab('friends')}
                        className={`px-4 py-2 rounded-lg ${activeTab === 'friends'
                            ? 'bg-[#6ECBDC] text-[#070F24]'
                            : 'bg-[#1A2845] text-[#D6ECF0] border border-[#2A3A60]'
                            } transition-colors`}
                    >
                        Friends ({friends.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`px-4 py-2 rounded-lg ${activeTab === 'requests'
                            ? 'bg-[#6ECBDC] text-[#070F24]'
                            : 'bg-[#1A2845] text-[#D6ECF0] border border-[#2A3A60]'
                            } transition-colors relative`}
                    >
                        Requests
                        {friendRequests.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                {friendRequests.length}
                            </span>
                        )}
                    </button>
                </div>

                {/* Friendship Tree Button */}
                <div className="bg-[#1A2845] rounded-lg p-4 shadow-lg mb-4 border border-[#2A3A60]">
                    <button
                        onClick={() => router.push('/friendship-tree')}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-[#15213A] text-[#6ECBDC] rounded-lg hover:bg-[#1F3258] transition-colors drop-shadow-[0_0_3px_rgba(110,203,220,0.3)]"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span>View Friendship Tree</span>
                    </button>
                </div>

                {/* Add Friend Input */}
                <div className="bg-[#1A2845] rounded-lg p-4 shadow-lg mb-4 border border-[#2A3A60]">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={friendCode}
                            onChange={(e) => setFriendCode(e.target.value.toUpperCase())}
                            placeholder="Enter friend code"
                            className="flex-1 p-2 border border-[#2A3A60] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6ECBDC] bg-[#15213A] text-[#D6ECF0]"
                        />
                        <button
                            onClick={handleAddFriend}
                            disabled={!friendCode.trim()}
                            className="bg-[#6ECBDC] text-[#070F24] px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-[#8FE5F5] transition-colors"
                        >
                            Add Friend
                        </button>
                    </div>
                </div>

                {/* Friends List */}
                {activeTab === 'friends' && (
                    <div className="space-y-4">
                        {friends.map((friend) => (
                            <div key={friend.id} className="bg-[#1A2845] rounded-lg p-4 shadow-lg border border-[#2A3A60]">
                                <div className="flex items-center space-x-4">
                                    <div className="text-4xl">{friend.avatar}</div>
                                    <div className="flex-1">
                                        <div className="font-bold text-[#D6ECF0]">{friend.name}</div>
                                        <div className="text-sm text-[#D6ECF0]/70">
                                            {friend.mammothName} · Level {friend.level}
                                        </div>
                                        <div className="text-xs text-[#D6ECF0]/50">
                                            Active {friend.lastActive}
                                        </div>
                                    </div>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <button className="text-[#D6ECF0]/70 hover:text-[#D6ECF0]">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                </svg>
                                            </button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="bg-[#0D1425] border border-[#2A3A60] text-[#D6ECF0]">
                                            <AlertDialogHeader>
                                                <AlertDialogTitle className="text-[#6ECBDC]">Friend Options</AlertDialogTitle>
                                                <AlertDialogDescription className="space-y-4 text-[#D6ECF0]/70">
                                                    <button
                                                        onClick={() => handleSendGift(friend)}
                                                        className="w-full text-left px-4 py-2 hover:bg-[#1A2845] rounded-lg mb-2 text-[#D6ECF0]"
                                                    >
                                                        🎁 Send Gift
                                                    </button>
                                                    <button
                                                        onClick={() => router.push('/friendship-tree')}
                                                        className="w-full text-left px-4 py-2 hover:bg-[#1A2845] rounded-lg mb-6 text-[#D6ECF0]"
                                                    >
                                                        🌳 View in Friendship Tree
                                                    </button>
                                                    <button
                                                        className="w-full text-left px-4 py-2 hover:bg-[#1A2845] rounded-lg text-red-400"
                                                    >
                                                        ❌ Remove Friend
                                                    </button>
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogAction className="bg-[#6ECBDC] text-[#070F24] hover:bg-[#8FE5F5]">Cancel</AlertDialogAction>
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
                            <div key={request.id} className="bg-[#1A2845] rounded-lg p-4 shadow-lg border border-[#2A3A60]">
                                <div className="flex items-center space-x-4">
                                    <div className="text-4xl">{request.avatar}</div>
                                    <div className="flex-1">
                                        <div className="font-bold text-[#D6ECF0]">{request.name}</div>
                                        <div className="text-sm text-[#D6ECF0]/70">
                                            {request.mammothName} · Level {request.level}
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleAcceptRequest(request.id)}
                                            className="bg-[#6ECBDC] text-[#070F24] px-4 py-2 rounded-lg text-sm hover:bg-[#8FE5F5] transition-colors"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            className="bg-[#1A2845] text-[#D6ECF0] px-4 py-2 rounded-lg text-sm hover:bg-[#2A3A60] transition-colors"
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
                    <AlertDialogContent className="bg-[#0D1425] border border-[#2A3A60] text-[#D6ECF0]">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-[#6ECBDC]">Send Gift to {selectedFriend?.name}</AlertDialogTitle>
                            <AlertDialogDescription className="text-[#D6ECF0]/70">
                                Choose a gift to send to {selectedFriend?.name}'s mammoth, {selectedFriend?.mammothName}.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="grid grid-cols-3 gap-3 my-4">
                            <button className="aspect-square flex items-center justify-center text-3xl bg-[#1A2845] rounded-lg hover:bg-[#2A3A60] transition-colors border border-[#2A3A60]">
                                🍎
                            </button>
                            <button className="aspect-square flex items-center justify-center text-3xl bg-[#1A2845] rounded-lg hover:bg-[#2A3A60] transition-colors border border-[#2A3A60]">
                                🦴
                            </button>
                            <button className="aspect-square flex items-center justify-center text-3xl bg-[#1A2845] rounded-lg hover:bg-[#2A3A60] transition-colors border border-[#2A3A60]">
                                🧸
                            </button>
                            <button className="aspect-square flex items-center justify-center text-3xl bg-[#1A2845] rounded-lg hover:bg-[#2A3A60] transition-colors border border-[#2A3A60]">
                                🎈
                            </button>
                            <button className="aspect-square flex items-center justify-center text-3xl bg-[#1A2845] rounded-lg hover:bg-[#2A3A60] transition-colors border border-[#2A3A60]">
                                🎁
                            </button>
                            <button className="aspect-square flex items-center justify-center text-3xl bg-[#1A2845] rounded-lg hover:bg-[#2A3A60] transition-colors border border-[#2A3A60]">
                                🍦
                            </button>
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogAction 
                                className="bg-[#1A2845] text-[#D6ECF0] hover:bg-[#2A3A60] transition-colors" 
                                onClick={() => setSelectedFriend(null)}
                            >
                                Cancel
                            </AlertDialogAction>
                            <AlertDialogAction
                                className="bg-[#6ECBDC] hover:bg-[#8FE5F5] text-[#070F24] transition-colors"
                                onClick={() => {
                                    setSuccessMessage('Gift sent successfully!');
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
                    <Link href="/friends" className="flex flex-col items-center text-[#8FE5F5] transition-colors">
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