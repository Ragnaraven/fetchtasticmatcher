'use client';

import { createContext, useContext, useState } from 'react';

interface FavoritesContextType {
    favorites: Set<string>;
    toggleFavorite: (dogId: string) => void;
    getFavorites: () => string[];
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    const toggleFavorite = (dogId: string) => {
        setFavorites(prev => {
            const next = new Set(prev);
            if (next.has(dogId)) {
                next.delete(dogId);
            } else {
                next.add(dogId);
            }
            return next;
        });
    };

    const getFavorites = () => Array.from(favorites);

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, getFavorites }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
}; 