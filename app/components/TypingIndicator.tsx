// app/components/TypingIndicator.tsx
import React from 'react';

export default function TypingIndicator() {
    return (
        <div className="flex justify-start mb-4">
            <div className="bg-[#1A2845] text-[#D6ECF0] rounded-lg p-3 shadow-lg rounded-bl-none border border-[#2A3A60]">
                <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-[#6ECBDC] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="h-2 w-2 bg-[#6ECBDC] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="h-2 w-2 bg-[#6ECBDC] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
            </div>
        </div>
    );
}