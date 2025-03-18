import React from 'react';

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuModal({ isOpen, onClose }: MenuModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Menu modal content */}
      <div className="relative w-full max-w-xs mx-8 bg-[#1A2845] rounded-xl shadow-xl overflow-hidden z-10">
        {/* Header */}
        <div className="border-b border-blue-900/50 p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Menu</h2>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
        
        {/* Menu content - placeholder for now */}
        <div className="p-6">
          {/* Menu items will go here */}
        </div>
      </div>
    </div>
  );
} 