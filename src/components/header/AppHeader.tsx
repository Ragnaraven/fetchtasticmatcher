'use client';

import { useWelcome } from '@/contexts/WelcomeContext';

export function AppHeader() {
  const { showWelcome } = useWelcome();

  return (
    <div className="w-full py-3 px-4 flex items-center justify-center border-b border-base-200 flex-none">
      <button 
        onClick={showWelcome}
        className="text-xl font-semibold text-base-content flex items-center gap-2 cursor-pointer bg-transparent border-0 font-title"
      >
        <span className="text-2xl">🐾</span>
        Find Your Perfect Dog
      </button>
    </div>
  );
} 