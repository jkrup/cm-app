// Path: app/components/StatusBar.tsx
export default function StatusBar() {
  const mammothName = "Fluffy";
  const level = 5;
  const coins = 250;

  return (
    <div className="w-full bg-white shadow">
      <div className="flex justify-between items-center px-4 py-2">
        <div className="flex flex-col">
          <h1 className="text-lg font-medium">{mammothName}</h1>
          <div className="text-sm text-gray-500">Level {level}</div>
        </div>
        <div className="flex items-center gap-1">
          <span>💰</span>
          <span className="font-medium">{coins}</span>
        </div>
      </div>
    </div>
  );
}