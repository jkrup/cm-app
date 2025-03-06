interface ActionButtonsProps {
    onFeed: () => void;
    onStartGroom: () => void;
    onPlay: () => void;
    onCustomize: () => void;
    isGrooming: boolean;
    isFeeding: boolean;
}

export default function ActionButtons({
    onFeed,
    onStartGroom,
    onPlay,
    onCustomize,
    isGrooming,
    isFeeding
}: ActionButtonsProps) {
    return (
        <div className="grid grid-cols-4 gap-4 px-4 py-2">
            <button
                onClick={onFeed}
                className={`flex flex-col items-center justify-center p-2 bg-white rounded-lg shadow hover:bg-gray-50 active:bg-gray-100 transition-colors ${isFeeding ? 'bg-primary/10' : ''
                    }`}
                disabled={isGrooming || isFeeding}
            >
                <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.5,21L14,8H16.23L15.1,3.46L16.84,3L18.09,8H22L20.5,21H15.5M5,11H10A3,3 0 0,1 13,14H2A3,3 0 0,1 5,11M13,18V21H2V18H13M3,15H12V17H3V15Z" />
                </svg>
                <span className="text-xs mt-1">
                    {isFeeding ? 'Feeding...' : 'Feed'}
                </span>
            </button>

            <button
                onClick={onStartGroom}
                className={`flex flex-col items-center justify-center p-2 bg-white rounded-lg shadow hover:bg-gray-50 active:bg-gray-100 transition-colors ${isGrooming ? 'bg-primary/10' : ''
                    }`}
                disabled={isGrooming || isFeeding}
            >
                <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,14C17.89,14 17,13.1 17,12A2,2 0 0,1 19,10A2,2 0 0,1 21,12C21,13.1 20.1,14 19,14M19,8A4,4 0 0,0 15,12A4,4 0 0,0 19,16A4,4 0 0,0 23,12A4,4 0 0,0 19,8M9,11H5V9H9V11M9,14H5V12H9V14M9,8H5V6H9V8M3,14A1,1 0 0,1 2,13V7A1,1 0 0,1 3,6H11A1,1 0 0,1 12,7V13A1,1 0 0,1 11,14H3Z" />
                </svg>
                <span className="text-xs mt-1">
                    {isGrooming ? 'Grooming...' : 'Groom'}
                </span>
            </button>

            <button
                onClick={onPlay}
                className="flex flex-col items-center justify-center p-2 bg-white rounded-lg shadow hover:bg-gray-50 active:bg-gray-100 transition-colors"
                disabled={isGrooming || isFeeding}
            >
                <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21,6H3A2,2 0 0,0 1,8V16A2,2 0 0,0 3,18H21A2,2 0 0,0 23,16V8A2,2 0 0,0 21,6M11,13H8V16H6V13H3V11H6V8H8V11H11M15.5,15A1.5,1.5 0 0,1 14,13.5A1.5,1.5 0 0,1 15.5,12A1.5,1.5 0 0,1 17,13.5A1.5,1.5 0 0,1 15.5,15M19.5,12A1.5,1.5 0 0,1 18,10.5A1.5,1.5 0 0,1 19.5,9A1.5,1.5 0 0,1 21,10.5A1.5,1.5 0 0,1 19.5,12Z" />
                </svg>
                <span className="text-xs mt-1">Play</span>
            </button>

            <button
                onClick={onCustomize}
                className="flex flex-col items-center justify-center p-2 bg-white rounded-lg shadow hover:bg-gray-50 active:bg-gray-100 transition-colors"
                disabled={isGrooming || isFeeding}
            >
                <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z" />
                </svg>
                <span className="text-xs mt-1">Customize</span>
            </button>
        </div>
    );
}