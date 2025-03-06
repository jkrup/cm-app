'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Package {
    id: string;
    name: string;
    coins: number;
    price: number;
    description: string;
    items: string[];
}

interface CoinPackage {
    id: string;
    coins: number;
    price: number;
    bonus?: number;
}

const packages: Package[] = [
    {
        id: 'gold',
        name: 'Gold Package',
        coins: 1200,
        price: 9.99,
        description: 'Premium pack with exclusive items',
        items: [
            '⭐ Exclusive Golden Tusks',
            '🌈 Rainbow Hair Dye',
            '👑 Royal Crown',
            '✨ Sparkle Effect',
            '🎵 Premium Sound Pack'
        ]
    },
    {
        id: 'silver',
        name: 'Silver Package',
        coins: 580,
        price: 4.99,
        description: 'Great value starter pack',
        items: [
            '🦷 Silver Tusks',
            '🎨 Basic Hair Dyes',
            '🎭 Fun Accessories',
            '🌟 Basic Effects'
        ]
    }
];

const coinPackages: CoinPackage[] = [
    { id: 'coins1', coins: 100, price: 0.99 },
    { id: 'coins2', coins: 210, bonus: 10, price: 1.99 },
    { id: 'coins3', coins: 570, bonus: 70, price: 4.99 },
    { id: 'coins4', coins: 1100, bonus: 100, price: 9.99 },
];

const featuredItems = [
    { id: 'wings1', name: 'Angel Wings', price: 250, icon: '👼' },
    { id: 'hat1', name: 'Wizard Hat', price: 150, icon: '🎩' },
    { id: 'glasses1', name: 'Cool Shades', price: 100, icon: '😎' },
    { id: 'scarf1', name: 'Winter Scarf', price: 75, icon: '🧣' },
];

export default function ShopPage() {
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState('packages');
    const [showPurchaseAlert, setShowPurchaseAlert] = useState(false);

    const handlePurchase = () => {
        setShowPurchaseAlert(true);
        setTimeout(() => setShowPurchaseAlert(false), 3000);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            {/* Shop Header */}
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
                        <h1 className="text-2xl font-bold text-center flex-1">Shop</h1>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Your Coins: 💰 250</span>
                        <button
                            onClick={() => setSelectedTab('coins')}
                            className="text-primary text-sm hover:underline"
                        >
                            Get More Coins
                        </button>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="max-w-md mx-auto p-4">
                <div className="flex space-x-2 mb-4">
                    <button
                        onClick={() => setSelectedTab('items')}
                        className={`px-4 py-2 rounded-lg ${selectedTab === 'items'
                            ? 'bg-primary text-white'
                            : 'bg-white text-gray-600'
                            }`}
                    >
                        Items
                    </button>
                    <button
                        onClick={() => setSelectedTab('packages')}
                        className={`px-4 py-2 rounded-lg ${selectedTab === 'packages'
                                ? 'bg-primary text-white'
                                : 'bg-white text-gray-600'
                            }`}
                    >
                        Packages
                    </button>
                    <button
                        onClick={() => setSelectedTab('coins')}
                        className={`px-4 py-2 rounded-lg ${selectedTab === 'coins'
                                ? 'bg-primary text-white'
                                : 'bg-white text-gray-600'
                            }`}
                    >
                        Buy Coins
                    </button>

                </div>

                {/* Packages Tab */}
                {selectedTab === 'packages' && (
                    <div className="space-y-4">
                        {packages.map((pkg) => (
                            <div key={pkg.id} className="bg-white rounded-lg p-4 shadow">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg">{pkg.name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{pkg.description}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-primary">${pkg.price}</div>
                                        <div className="text-sm text-gray-600">💰 {pkg.coins} coins</div>
                                    </div>
                                </div>
                                <div className="mt-4 space-y-2">
                                    {pkg.items.map((item, i) => (
                                        <div key={i} className="text-sm">
                                            {item}
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={handlePurchase}
                                    className="w-full mt-4 bg-primary text-white py-2 rounded-lg hover:bg-primary/90"
                                >
                                    Purchase
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Coins Tab */}
                {selectedTab === 'coins' && (
                    <div className="grid grid-cols-2 gap-4">
                        {coinPackages.map((pkg) => (
                            <div key={pkg.id} className="bg-white rounded-lg p-4 shadow">
                                <div className="text-center h-full flex flex-col">
                                    <div className="flex-grow">
                                        <div className="text-2xl font-bold">💰 {pkg.coins}</div>
                                        <div className="text-sm text-green-600 h-6">
                                            {pkg.bonus && `+${pkg.bonus} bonus!`}
                                        </div>
                                        <div className="font-bold text-primary mt-2">${pkg.price}</div>
                                    </div>
                                    <button
                                        onClick={handlePurchase}
                                        className="w-full mt-4 bg-primary text-white py-2 rounded-lg hover:bg-primary/90"
                                    >
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Items Tab */}
                {selectedTab === 'items' && (
                    <div className="grid grid-cols-2 gap-4">
                        {featuredItems.map((item) => (
                            <div key={item.id} className="bg-white rounded-lg p-4 shadow">
                                <div className="text-center">
                                    <div className="text-4xl mb-2">{item.icon}</div>
                                    <div className="font-bold">{item.name}</div>
                                    <div className="text-sm text-gray-600">💰 {item.price}</div>
                                    <button
                                        onClick={handlePurchase}
                                        className="w-full mt-4 bg-primary text-white py-2 rounded-lg hover:bg-primary/90"
                                    >
                                        Buy
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Purchase Alert */}
            {showPurchaseAlert && (
                <div className="fixed bottom-20 left-0 right-0 mx-auto max-w-md px-4">
                    <Alert className="bg-green-100 border-green-200">
                        <AlertDescription>
                            🎉 Purchase successful! Thank you for your support!
                        </AlertDescription>
                    </Alert>
                </div>
            )}
        </div>
    );
}