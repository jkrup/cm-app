import React, { useEffect, useRef } from 'react';

interface Friend {
    id: string;
    name: string;
    avatar: string;
    level: number;
    mammothName: string;
    friendshipLevel: number;
    lastActive: string;
}

interface FriendshipTreeVisualizationProps {
    friends: Friend[];
    onSelectFriend: (friend: Friend) => void;
}

export default function FriendshipTreeVisualization({
    friends,
    onSelectFriend
}: FriendshipTreeVisualizationProps) {
    // Calculate positions for the tree visualization
    const centerX = 150;
    const centerY = 150;
    const radius = 120;

    // Helper functions to place friends in a circle around the center
    const calculatePosition = (index: number, total: number) => {
        // Distribute evenly in a circle, but start from the top (-Math.PI/2)
        const angle = -Math.PI / 2 + (index / total) * 2 * Math.PI;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        return { x, y, angle };
    };

    // Calculate branch thickness based on friendship level (1-5)
    const getBranchThickness = (level: number) => {
        return 1 + level;
    };

    // Calculate branch color based on friendship level
    const getBranchColor = (level: number) => {
        // From lighter to darker shade as level increases
        const opacity = 0.4 + (level * 0.12);
        return `rgba(74, 144, 226, ${opacity})`;
    };

    return (
        <div className="w-full aspect-square max-w-md mx-auto">
            <svg viewBox="0 0 300 300" className="w-full h-full">
                {/* Tree trunk */}
                <path
                    d="M145,300 Q150,240 150,200 T155,150"
                    fill="none"
                    stroke="#8B4513"
                    strokeWidth="10"
                    strokeLinecap="round"
                />

                {/* Center of the tree (your mammoth) */}
                <circle
                    cx={centerX}
                    cy={centerY}
                    r={20}
                    fill="#FFFFFF"
                    stroke="#4A90E2"
                    strokeWidth="2"
                />

                {/* Your mammoth emoji */}
                <text
                    x={centerX}
                    y={centerY + 7}
                    textAnchor="middle"
                    fontSize="24"
                >
                    🦣
                </text>

                {/* Friendship branches */}
                {friends.map((friend, index) => {
                    const { x, y, angle } = calculatePosition(index, friends.length);
                    const branchThickness = getBranchThickness(friend.friendshipLevel);
                    const branchColor = getBranchColor(friend.friendshipLevel);

                    // Control points for the curved branches
                    const cpX = centerX + (x - centerX) * 0.4;
                    const cpY = centerY + (y - centerY) * 0.4;

                    return (
                        <g key={friend.id} onClick={() => onSelectFriend(friend)} className="cursor-pointer">
                            {/* Branch */}
                            <path
                                d={`M${centerX},${centerY} Q${cpX},${cpY} ${x},${y}`}
                                fill="none"
                                stroke={branchColor}
                                strokeWidth={branchThickness * 2}
                                strokeLinecap="round"
                            />

                            {/* Friend circle */}
                            <circle
                                cx={x}
                                cy={y}
                                r={18}
                                fill="#FFFFFF"
                                stroke={branchColor}
                                strokeWidth="2"
                            />

                            {/* Friend avatar */}
                            <text
                                x={x}
                                y={y + 7}
                                textAnchor="middle"
                                fontSize="22"
                            >
                                {friend.avatar}
                            </text>

                            {/* Friend name */}
                            <text
                                x={x}
                                y={y + 35}
                                textAnchor="middle"
                                fontSize="10"
                                fill="#333333"
                                fontWeight="bold"
                            >
                                {friend.name}
                            </text>

                            {/* Friendship level indicator */}
                            <text
                                x={x}
                                y={y - 25}
                                textAnchor="middle"
                                fontSize="10"
                                fill="#4A90E2"
                            >
                                Level {friend.friendshipLevel}
                            </text>
                        </g>
                    );
                })}

                {/* Leaves or decorations on the tree */}
                <circle cx={140} cy={140} r={8} fill="#90EE90" />
                <circle cx={160} cy={160} r={6} fill="#90EE90" />
                <circle cx={170} cy={135} r={7} fill="#90EE90" />
                <circle cx={130} cy={170} r={5} fill="#90EE90" />
            </svg>
        </div>
    );
}