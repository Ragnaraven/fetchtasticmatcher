'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface FavoritesContextType {
    favorites: Set<string>;
    toggleFavorite: (dogId: string) => void;
    getFavorites: () => string[];
    generateMatch: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Only run this effect on the /app route
        if (pathname === '/app') {
            const favoritesParam = searchParams.get('favorites');
            if (favoritesParam) {
                // Restore favorites from URL
                const favoriteIds = favoritesParam.split(',').filter(Boolean);
                setFavorites(new Set(favoriteIds));

                // Clear favorites from URL by removing the parameter
                const newUrl = new URL(window.location.href);
                newUrl.searchParams.delete('favorites');
                window.history.replaceState({}, '', newUrl);
            }
        }
    }, [pathname, searchParams]);

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

    const generateMatch = () => {
        const favoriteIds = Array.from(favorites);
        if (favoriteIds.length === 0) {
            throw new Error('Please select at least one favorite dog');
        }
        router.push(`/app/match?favorites=${favoriteIds.join(',')}`);
    };

    return (
        <FavoritesContext.Provider value={{ 
            favorites, 
            toggleFavorite, 
            getFavorites,
            generateMatch 
        }}>
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