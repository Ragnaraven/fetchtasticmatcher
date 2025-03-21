'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface WelcomeContextType {
    showWelcome: () => void;
}

const WelcomeContext = createContext<WelcomeContextType | undefined>(undefined);

export function WelcomeProvider({ children }: { children: React.ReactNode }) {
    const [hasSeenWelcome, setHasSeenWelcome] = useState(false);

    useEffect(() => {
        const hasSeenWelcomeThisVisit = localStorage.getItem('hasSeenWelcome');
        if (!hasSeenWelcomeThisVisit) {
            const modal = document.getElementById('welcome_modal') as HTMLDialogElement;
            if (modal) {
                modal.showModal();
                localStorage.setItem('hasSeenWelcome', 'true');
            }
        }
    }, []);

    const showWelcome = () => {
        const modal = document.getElementById('welcome_modal') as HTMLDialogElement;
        if (modal) modal.showModal();
    };

    return (
        <WelcomeContext.Provider value={{ showWelcome }}>
            {children}
        </WelcomeContext.Provider>
    );
}

export const useWelcome = () => {
    const context = useContext(WelcomeContext);
    if (!context) {
        throw new Error('useWelcome must be used within a WelcomeProvider');
    }
    return context;
}; 