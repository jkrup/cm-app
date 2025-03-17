// app/components/ChatBubble.tsx
import React from 'react';
import Link from 'next/link';

interface ChatBubbleProps {
    friendId: string;
    friendName: string;
    avatarEmoji: string;
    message: string;
    timestamp: string;
    unread?: boolean;
}

export default function ChatBubble({
    friendId,
    friendName,
    avatarEmoji,
    message,
    timestamp,
    unread = false
}: ChatBubbleProps) {
    return (
        <Link
            href={`/chat/${friendId}`}
            className="block w-full bg-white rounded-lg shadow p-4 hover:bg-gray-50 transition-colors"
        >
            <div className="flex items-start gap-3">
                <div className="text-2xl">{avatarEmoji}</div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                        <span className="font-bold">{friendName}</span>
                        <span className="text-xs text-gray-500">{timestamp}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-600 truncate">{message}</p>
                        {unread && (
                            <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}