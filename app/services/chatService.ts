// app/services/chatService.ts

export interface Friend {
    id: string;
    name: string;
    avatar: string;
    level: number;
    mammothName: string;
    friendshipLevel: number;
    lastActive: string;
}

export interface Message {
    id: string;
    content: string;
    isFromMe: boolean;
    timestamp: Date;
}

// Mock data - in a real app, this would come from an API or database
const mockFriends: Friend[] = [
    {
        id: '1',
        name: 'Sarah',
        avatar: '👧',
        level: 15,
        mammothName: 'Fluffy',
        friendshipLevel: 3,
        lastActive: '2 min ago'
    },
    {
        id: '2',
        name: 'Mike',
        avatar: '👦',
        level: 12,
        mammothName: 'Thunder',
        friendshipLevel: 2,
        lastActive: '1 hour ago'
    },
    {
        id: '3',
        name: 'Emma',
        avatar: '👩',
        level: 18,
        mammothName: 'Snowball',
        friendshipLevel: 4,
        lastActive: 'Just now'
    },
    {
        id: '4',
        name: 'Alex',
        avatar: '🧑',
        level: 8,
        mammothName: 'Stompy',
        friendshipLevel: 1,
        lastActive: '1 day ago'
    },
    {
        id: '5',
        name: 'Luna',
        avatar: '👱‍♀️',
        level: 10,
        mammothName: 'Starlight',
        friendshipLevel: 5,
        lastActive: '4 hours ago'
    }
];

// Sample responses for each friend
const friendResponses: Record<string, string[]> = {
    '1': [
        "My Fluffy loves playing in the snow!",
        "Did you see the new winter items in the shop?",
        "Fluffy learned a new trick yesterday, so proud!",
        "How's your mammoth doing today?",
        "Want to meet up at the virtual park later?"
    ],
    '2': [
        "Thunder has been a bit grumpy lately.",
        "I need to find more food for Thunder.",
        "Have you tried the new games?",
        "Thunder misses playing with your mammoth!",
        "What's your mammoth's favorite food?"
    ],
    '3': [
        "Snowball got a new hairdo, it looks so cute!",
        "I'm saving up for the premium accessories.",
        "Did you complete today's quests yet?",
        "Snowball wants to have a playdate soon!",
        "Have you been to the winter festival event?"
    ],
    '4': [
        "Stompy is still learning basic tricks.",
        "I'm new to this, any tips for a beginner?",
        "How do I earn more coins?",
        "Stompy is growing so fast!",
        "What's your favorite feature of the app?"
    ],
    '5': [
        "Starlight and I have been playing for ages!",
        "I just unlocked the legendary accessories!",
        "Did you know there's a secret area in the winter zone?",
        "Starlight misses your mammoth, we should play soon!",
        "I'm hosting a mammoth party this weekend!"
    ]
};

// Generic responses for any friend
const genericResponses = [
    "That's awesome!",
    "I never thought of that!",
    "My mammoth would love that!",
    "Haha, that's so cute!",
    "Oh really? Tell me more!",
    "I was just thinking the same thing!",
    "Have you tried the new customization items?",
    "Did you complete today's quests yet?",
    "I just got a rare winter scarf for my mammoth!"
];

export const chatService = {
    getFriendById: (id: string): Friend | undefined => {
        return mockFriends.find(friend => friend.id === id);
    },

    getRandomResponse: (friendId: string): string => {
        // Get friend-specific responses if available, otherwise use generic
        const responses = friendId in friendResponses
            ? [...friendResponses[friendId], ...genericResponses]
            : genericResponses;

        return responses[Math.floor(Math.random() * responses.length)];
    },

    getInitialGreeting: (friendId: string): string => {
        const friend = mockFriends.find(f => f.id === friendId);
        const mammothName = friend?.mammothName || "my mammoth";

        const greetings = [
            "Hey there! How's your mammoth doing today?",
            "Hello! I was just thinking about you and your cute mammoth!",
            `${mammothName} and I were just playing in the snow!`,
            "Hi! What's new with you?",
            "Hey friend! Want to see my mammoth's new outfit?"
        ];

        return greetings[Math.floor(Math.random() * greetings.length)];
    }
};