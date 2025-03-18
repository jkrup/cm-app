// app/chat/[friendId]/page.tsx
'use client'

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { chatService, Message, Friend } from '@/app/services/chatService';
import TypingIndicator from '@/app/components/TypingIndicator';

export default function ChatPage() {
    const router = useRouter();
    const params = useParams();
    const friendId = params.friendId as string;
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Get friend data from the service
    const [friend, setFriend] = useState<Friend | undefined>(undefined);

    // Fetch friend data
    useEffect(() => {
        const friendData = chatService.getFriendById(friendId);
        if (friendData) {
            setFriend(friendData);
        } else {
            // Fallback or handle error
            router.push('/friends');
        }
    }, [friendId, router]);

    // Initial greeting message
    useEffect(() => {
        if (friend) {
            // Get a greeting from the service
            const greeting = chatService.getInitialGreeting(friend.id);

            setTimeout(() => {
                setMessages([
                    {
                        id: '1',
                        content: greeting,
                        isFromMe: false,
                        timestamp: new Date()
                    }
                ]);
            }, 500);
        }
    }, [friend]);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => {
        if (message.trim() === '') return;

        // Add user message
        const newMessage: Message = {
            id: Date.now().toString(),
            content: message,
            isFromMe: true,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newMessage]);
        setMessage('');

        // Simulate friend response
        simulateFriendResponse();
    };

    const simulateFriendResponse = () => {
        if (!friend) return;

        // Show typing indicator
        setIsTyping(true);

        // Get a personalized response from the service
        const randomResponse = chatService.getRandomResponse(friend.id);

        // Random response time between 1-3 seconds
        const responseTime = 1000 + Math.random() * 2000;

        // Add a delay to make it feel more natural
        setTimeout(() => {
            setIsTyping(false);

            const responseMessage: Message = {
                id: Date.now().toString(),
                content: randomResponse,
                isFromMe: false,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, responseMessage]);
        }, responseTime);
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="min-h-screen flex flex-col relative chat-container">
            {/* Header */}
            <div className="bg-[#0D1425] shadow-lg border-b border-[#2A3A60]">
                <div className="max-w-md mx-auto p-4">
                    <div className="flex items-center">
                        <Link
                            href="/friends"
                            className="text-[#6ECBDC] hover:text-[#8FE5F5] transition-colors"
                        >
                            <svg className="w-6 h-6 drop-shadow-[0_0_3px_rgba(110,203,220,0.6)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <div className="flex items-center ml-4">
                            <span className="text-2xl mr-2">{friend?.avatar || '👤'}</span>
                            <div>
                                <div className="font-bold text-[#D6ECF0]">{friend?.name || 'Friend'}</div>
                                <div className="text-xs text-[#D6ECF0]/60">{friend?.mammothName || 'Mammoth'}'s owner</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 pb-24">
                <div className="max-w-md mx-auto space-y-4">
                    {messages.length === 0 && !isTyping ? (
                        <div className="text-center py-10">
                            <div className="text-4xl mb-4">💬</div>
                            <h3 className="text-lg font-medium text-[#D6ECF0]">No messages yet</h3>
                            <p className="mt-1 text-sm text-[#D6ECF0]/70">
                                Say hello to start the conversation!
                            </p>
                        </div>
                    ) : (
                        <>
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.isFromMe ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-xs p-3 rounded-lg ${msg.isFromMe
                                                ? 'bg-[#6ECBDC] text-[#070F24] rounded-br-none'
                                                : 'bg-[#1A2845] text-[#D6ECF0] rounded-bl-none shadow-lg border border-[#2A3A60]'
                                            }`}
                                    >
                                        <div>{msg.content}</div>
                                        <div
                                            className={`text-xs mt-1 ${msg.isFromMe ? 'text-[#070F24]/70' : 'text-[#D6ECF0]/60'
                                                }`}
                                        >
                                            {formatTime(msg.timestamp)}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Typing indicator */}
                            {isTyping && <TypingIndicator />}
                        </>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Message Input - Fixed at bottom, won't shift content */}
            <div className="bg-[#0D1425] border-t border-[#2A3A60] p-4 absolute bottom-0 left-0 right-0 w-full">
                <div className="max-w-md mx-auto flex items-center gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 p-3 border border-[#2A3A60] rounded-full focus:outline-none focus:ring-2 focus:ring-[#6ECBDC] bg-[#15213A] text-[#D6ECF0]"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className="bg-[#6ECBDC] text-[#070F24] p-3 rounded-full disabled:opacity-50 hover:bg-[#8FE5F5] transition-colors"
                    >
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                        </svg>
                    </button>
                </div>
            </div>
            
            {/* Night sky effect - match main app */}
            <div className="fixed inset-0 -z-50 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-t from-[#070F24]/80 to-transparent"></div>
            </div>
        </div>
    );
}