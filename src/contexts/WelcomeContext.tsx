'use client';

import { createContext, useContext, useState, useEffect } from 'react';

export const WelcomeContext = createContext<{
    hasSeenWelcome: boolean;
    setHasSeenWelcome: (value: boolean) => void;
    showWelcome: () => void;
}>({
    hasSeenWelcome: false,
    setHasSeenWelcome: () => {},
    showWelcome: () => {}
});

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
        <WelcomeContext.Provider value={{ 
            hasSeenWelcome, 
            setHasSeenWelcome,
            showWelcome
        }}>
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