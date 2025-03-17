// app/chats/page.tsx
'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import ChatBubble from '../components/ChatBubble';

interface ChatPreview {
    friendId: string;
    friendName: string;
    avatar: string;
    lastMessage: string;
    timestamp: string;
    unread: boolean;
}

export default function ChatsPage() {
    const router = useRouter();

    // Mock data - in a production app, this would come from an API
    const chats: ChatPreview[] = [
        {
            friendId: '1',
            friendName: 'Sarah',
            avatar: '👧',
            lastMessage: "My Fluffy loves playing in the snow!",
            timestamp: '2m ago',
            unread: true
        },
        {
            friendId: '2',
            friendName: 'Mike',
            avatar: '👦',
            lastMessage: "Have you tried the new games yet?",
            timestamp: '1h ago',
            unread: false
        },
        {
            friendId: '3',
            friendName: 'Emma',
            avatar: '👩',
            lastMessage: "Snowball got a new hairdo, it looks so cute!",
            timestamp: 'Just now',
            unread: true
        },
        {
            friendId: '5',
            friendName: 'Luna',
            avatar: '👱‍♀️',
            lastMessage: "I just unlocked the legendary accessories!",
            timestamp: '4h ago',
            unread: false
        }
    ];

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
                        <h1 className="text-2xl font-bold text-center flex-1">Chats</h1>
                    </div>
                </div>
            </div>

            {/* Chats List */}
            <div className="max-w-md mx-auto p-4">
                {chats.length > 0 ? (
                    <div className="space-y-3">
                        {chats.map((chat) => (
                            <ChatBubble
                                key={chat.friendId}
                                friendId={chat.friendId}
                                friendName={chat.friendName}
                                avatarEmoji={chat.avatar}
                                message={chat.lastMessage}
                                timestamp={chat.timestamp}
                                unread={chat.unread}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <div className="text-4xl mb-4">💬</div>
                        <h3 className="text-lg font-medium text-gray-900">No chats yet</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Start a conversation from your friends list.
                        </p>
                        <div className="mt-6">
                            <button
                                onClick={() => router.push('/friends')}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90"
                            >
                                Go to Friends
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}