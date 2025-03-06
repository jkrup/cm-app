import React, { useState, useRef, useEffect } from 'react';

const CATEGORIES = [
    { id: 'color', label: 'Color', icon: '🎨' },
    { id: 'outfit', label: 'Outfit', icon: '👔' },
    { id: 'hat', label: 'Hat', icon: '🎩' },
    { id: 'pose', label: 'Pose', icon: '💃' },
];

// Sample wardrobe data
const WARDROBE = {
    color: [
        { id: 'brown', label: 'Brown', icon: '🟫' },
        { id: 'orange', label: 'Orange', icon: '🟧' },
        { id: 'white', label: 'White', icon: '⚪' },
        { id: 'green', label: 'Green', icon: '🟩' },
        { id: 'blue', label: 'Blue', icon: '🟦' },
    ],
    outfit: [
        { id: 'scarf', label: 'Winter Scarf', icon: '🧣' },
        { id: 'sweater', label: 'Cozy Sweater', icon: '🧥' },
    ],
    hat: [
        { id: 'santa', label: 'Santa Hat', icon: '🎅' },
        { id: 'cap', label: 'Baseball Cap', icon: '🧢' },
    ],
    pose: [
        { id: 'dance', label: 'Dancing', icon: '💃' },
        { id: 'sleep', label: 'Sleeping', icon: '😴' },
        { id: 'wave', label: 'Waving', icon: '👋' },
    ],
};

export default function CustomizeModal({ isOpen, onClose }) {
    const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
    const [selectedItems, setSelectedItems] = useState({
        color: 'brown',
        outfit: null,
        hat: null,
        pose: null,
    });

    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const contentRef = useRef(null);
    const isDragging = useRef(false);
    const startTime = useRef(0);

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
        startTime.current = Date.now();
        isDragging.current = true;
    };

    const handleTouchMove = (e) => {
        if (!isDragging.current) return;

        touchEndX.current = e.touches[0].clientX;
        const diff = touchEndX.current - touchStartX.current;

        // Add a subtle transform while dragging
        if (contentRef.current) {
            contentRef.current.style.transform = `translateX(${diff * 0.5}px)`;
        }
    };

    const handleTouchEnd = () => {
        if (!isDragging.current) return;
        isDragging.current = false;

        const diff = touchEndX.current - touchStartX.current;
        const duration = Date.now() - startTime.current;
        const velocity = Math.abs(diff) / duration;

        // Reset transform
        if (contentRef.current) {
            contentRef.current.style.transform = '';
        }

        // Determine if swipe was intentional based on distance and velocity
        if (Math.abs(diff) > 50 || velocity > 0.5) {
            const currentIndex = CATEGORIES.findIndex(c => c.id === activeCategory);
            let nextIndex;

            if (diff > 0 && currentIndex > 0) {
                // Swipe right -> previous category
                nextIndex = currentIndex - 1;
            } else if (diff < 0 && currentIndex < CATEGORIES.length - 1) {
                // Swipe left -> next category
                nextIndex = currentIndex + 1;
            }

            if (nextIndex !== undefined) {
                setActiveCategory(CATEGORIES[nextIndex].id);
            }
        }
    };

    const handleSelect = (category, itemId) => {
        setSelectedItems(prev => ({
            ...prev,
            [category]: prev[category] === itemId ? null : itemId
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-md">
                {/* Header */}
                <div className="border-b p-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold">Customize Mammoth</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Category Navigation */}
                <div
                    ref={contentRef}
                    className="transition-transform"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    // For desktop testing
                    onMouseDown={(e) => {
                        handleTouchStart({ touches: [{ clientX: e.clientX }] });
                    }}
                    onMouseMove={(e) => {
                        if (isDragging.current) {
                            handleTouchMove({ touches: [{ clientX: e.clientX }] });
                        }
                    }}
                    onMouseUp={handleTouchEnd}
                    onMouseLeave={handleTouchEnd}
                >
                    <div className="flex items-center justify-center p-4">
                        <div className="flex-1 text-center">
                            <span className="text-xl mr-2">
                                {CATEGORIES.find(c => c.id === activeCategory).icon}
                            </span>
                            <span className="font-medium">
                                {CATEGORIES.find(c => c.id === activeCategory).label}
                            </span>
                        </div>
                    </div>

                    {/* Items Grid */}
                    <div className="p-4 grid grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                        {WARDROBE[activeCategory].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleSelect(activeCategory, item.id)}
                                className={`p-4 rounded-lg flex flex-col items-center justify-center space-y-2 
                  ${selectedItems[activeCategory] === item.id
                                        ? 'bg-primary/10 border-2 border-primary'
                                        : 'bg-gray-50 hover:bg-gray-100'
                                    }`}
                            >
                                <span className="text-2xl">{item.icon}</span>
                                <span className="text-sm text-center">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Category Dots */}
                <div className="flex justify-center gap-2 p-4">
                    {CATEGORIES.map((category) => (
                        <div
                            key={category.id}
                            className={`w-2 h-2 rounded-full transition-colors
                ${category.id === activeCategory ? 'bg-primary' : 'bg-gray-300'}`}
                        />
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="border-t p-4 flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}