// app/components/TypingIndicator.tsx
import React from 'react';

export default function TypingIndicator() {
    return (
        <div className="flex justify-start mb-4">
            <div className="bg-white text-gray-800 rounded-lg p-3 shadow rounded-bl-none">
                <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
            </div>
        </div>
    );
}