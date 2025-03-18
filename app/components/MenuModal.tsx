import React from 'react';
import Link from 'next/link';

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuModal({ isOpen, onClose }: MenuModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Menu modal content */}
      <div className="relative w-full max-w-xs mx-8 bg-[#1A2845] rounded-xl shadow-xl overflow-hidden z-10 border border-[#2A3A60]">
        {/* Header */}
        <div className="border-b border-[#2A3A60] p-4">
          <div className="flex justify-between items-center">
            <h2 
              className="text-xl font-bold"
              style={{
                background: "linear-gradient(to bottom, rgb(110, 203, 220), rgb(56, 152, 184))",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                textShadow: "0 2px 4px rgba(40, 180, 220, 0.3)"
              }}
            >
              Menu
            </h2>
            <button
              onClick={onClose}
              className="text-[#D6ECF0]/70 hover:text-[#D6ECF0] transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
        
        {/* Menu content */}
        <div className="p-6 space-y-4">
          {/* Friends Card */}
          <Link 
            href="/friends" 
            onClick={onClose}
            className="block"
          >
            <div className="bg-[#15213A] hover:bg-[#1F3258] transition-all rounded-xl p-4 shadow-lg transform hover:scale-105 border border-[#2A3A60] group">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-[#213559] rounded-full flex items-center justify-center overflow-hidden group-hover:animate-pulse">
                  <div className="relative">
                    <span className="text-3xl">👥</span>
                    <span className="absolute -top-1 -right-1 bg-[#6ECBDC] text-[#070F24] text-xs px-1 rounded-full animate-bounce">
                      3
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-[#D6ECF0] font-bold text-lg">Friends</h3>
                  <p className="text-[#D6ECF0]/70 text-sm">Connect with mammoth buddies</p>
                </div>
                <div className="text-[#6ECBDC]">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Other menu items can be added here */}
        </div>
      </div>
    </div>
  );
} 