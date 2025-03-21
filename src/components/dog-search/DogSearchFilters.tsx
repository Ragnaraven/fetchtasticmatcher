'use client';

import { useState, useEffect, useCallback } from 'react';
import { DogSearchParams, SortOn, SortOrder } from '@/lib/actions/dogs';
import { useDebounceUrl } from '@/hooks/useDebounceUrl';
import { queryStringToArray, arrayToQueryString } from '@/lib/utils/searchParams';

interface DogSearchFiltersProps {
    breeds: string[];
}

export function DogSearchFilters({ breeds }: DogSearchFiltersProps) {
    const { updateUrl, searchParams } = useDebounceUrl(300);
    
    const initialBreeds = queryStringToArray(searchParams.get('breeds'));
    const [selectedBreeds, setSelectedBreeds] = useState<string[]>(initialBreeds);
    
    const [ageMin, setAgeMin] = useState(searchParams.get('ageMin') || '');
    const [ageMax, setAgeMax] = useState(searchParams.get('ageMax') || '');
    
    useEffect(() => {
        const urlBreeds = queryStringToArray(searchParams.get('breeds'));
        setSelectedBreeds(urlBreeds);
    }, [searchParams]);

    const currentSort = searchParams.get('sort') || 'breed:asc';
    const [sortField, sortOrder] = currentSort.split(':') as [SortOn, SortOrder];

    const handleFilterChange = (key: string, value: string | string[] | number | undefined) => {
        const params = new URLSearchParams(searchParams.toString());
        
        // Reset pagination when any filter changes (except when changing page size)
        if (key !== 'size') {
            params.delete('from');
        }
        
        if (value === undefined || value === '') {
            params.delete(key);
        } else if (Array.isArray(value)) {
            if (value.length > 0) {
                params.set(key, arrayToQueryString(value));
            } else {
                params.delete(key);
            }
        } else {
            params.set(key, String(value));
        }

        updateUrl(params);
    };

    const handleBreedChange = (breed: string, checked: boolean) => {
        const newBreeds = checked 
            ? [...selectedBreeds, breed]
            : selectedBreeds.filter(b => b !== breed);
        
        setSelectedBreeds(newBreeds);
        handleFilterChange('breeds', newBreeds);
    };

    const handleClearBreeds = () => {
        setSelectedBreeds([]);
        handleFilterChange('breeds', []);
    };

    const handleClearAllFilters = () => {
        setSelectedBreeds([]);
        const params = new URLSearchParams();
        // Set default sort and size
        params.set('sort', 'breed:asc');
        params.set('size', '25');
        updateUrl(params);
    };

    // Create a debounced version of handleAgeChange
    const debouncedAgeChange = useCallback(
        debounce((key: 'ageMin' | 'ageMax', value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete('from');
            
            if (value === '') {
                params.delete(key);
            } else {
                params.set(key, value);
            }

            updateUrl(params);
        }, 500),
        [searchParams, updateUrl]
    );

    // Update local state immediately and trigger debounced URL update
    const handleAgeInputChange = (key: 'ageMin' | 'ageMax', value: string) => {
        const numValue = value === '' ? '' : Math.max(0, parseInt(value));
        
        if (key === 'ageMin') {
            setAgeMin(String(numValue));
            // If min is greater than max, update max
            if (numValue !== '' && ageMax !== '' && parseInt(ageMax) < numValue) {
                setAgeMax(String(numValue));
                debouncedAgeChange('ageMax', String(numValue));
            }
        } else {
            setAgeMax(String(numValue));
            // If max is less than min, update min
            if (numValue !== '' && ageMin !== '' && parseInt(ageMin) > numValue) {
                setAgeMin(String(numValue));
                debouncedAgeChange('ageMin', String(numValue));
            }
        }
        debouncedAgeChange(key, String(numValue));
    };

    const sortedBreeds = [...breeds].sort((a, b) => a.localeCompare(b));

    const isFiltersActive = selectedBreeds.length > 0 || 
        searchParams.get('ageMin') || 
        searchParams.get('ageMax') || 
        searchParams.get('sort') !== 'breed:asc' || 
        searchParams.get('size') !== '25';

    return (
        <div className="sticky top-0 bg-base-100 z-10 flex flex-col gap-4 w-full pb-2 border-b-1 border-base-content">
            <div className="flex flex-row items-center justify-between">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-primary min-w-24 text-nowrap">Select Breeds</label>
                    <div tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-64">
                        <div className="max-h-[60vh] overflow-y-auto">
                            <div className="sticky top-0 bg-base-100 border-b border-base-200 pb-2 mb-2 z-10">
                                <button
                                    className="btn btn-sm btn-block"
                                    onClick={handleClearBreeds}
                                >
                                    { 'Clear Selection' }
                                </button>
                            </div>

                            {sortedBreeds.map(breed => (
                                <div key={breed} className="form-control">
                                    <label className="label cursor-pointer hover:bg-base-200 rounded-lg py-2">
                                        <span className="label-text text-base-content">{breed}</span>
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-primary"
                                            checked={selectedBreeds.includes(breed)}
                                            onChange={(e) => handleBreedChange(breed, e.target.checked)}
                                        />
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>           
                </div>

                <ClearFiltersButton
                    onClick={handleClearAllFilters}
                    disabled={!isFiltersActive}
                    className="min-w-24"
                />
            </div>

            {selectedBreeds.length > 0 && (
                <div className="w-full h-[74px] overflow-y-auto text-base-content p-2 border-1 rounded-lg border-base-300 bg-base-200/50"> 
                    <div className="flex flex-wrap gap-2">
                        {selectedBreeds.map(breed => (
                            <div key={breed} className="badge badge-primary gap-2 shrink-0">
                                {breed}
                                <button
                                    className="btn btn-ghost btn-xs"
                                    onClick={() => handleBreedChange(breed, false)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex flex-wrap justify-between gap-4 items-center w-full">
                <div className="flex-none flex gap-2 items-center">
                    <input
                        type="number"
                        min="0"
                        placeholder="Min Age"
                        value={ageMin}
                        onChange={(e) => handleAgeInputChange('ageMin', e.target.value)}
                        onBlur={(e) => debouncedAgeChange.flush()}
                        className="input input-bordered w-24 text-base-content bg-base-100"
                    />
                    <span className="text-base-content">to</span>
                    <input
                        type="number"
                        min="0"
                        placeholder="Max Age"
                        value={ageMax}
                        onChange={(e) => handleAgeInputChange('ageMax', e.target.value)}
                        onBlur={(e) => debouncedAgeChange.flush()}
                        className="input input-bordered w-24 text-base-content bg-base-100"
                    />
                </div>

                <select
                    value={currentSort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="flex-1 min-w-[200px] max-w-[400px] select select-bordered text-base-content bg-base-100"
                >
                    <option value="breed:asc">Sort by: Breed (A-Z)</option>
                    <option value="breed:desc">Sort by: Breed (Z-A)</option>
                    <option value="age:asc">Sort by: Age (Youngest First)</option>
                    <option value="age:desc">Sort by: Age (Oldest First)</option>
                    <option value="name:asc">Sort by: Name (A-Z)</option>
                    <option value="name:desc">Sort by: Name (Z-A)</option>
                </select>

                <select
                    value={searchParams.get('size') || '25'}
                    onChange={(e) => handleFilterChange('size', e.target.value)}
                    className="flex-none w-40 select select-bordered text-base-content bg-base-100"
                >
                    {[10, 25, 50, 100].map(size => (
                        <option key={size} value={size.toString()}>
                            {size} per page
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

function ClearFiltersButton({ onClick, disabled, className = '' }: {
    onClick: () => void;
    disabled: boolean;
    className?: string;
}) {
    return (
      <button
        onClick={onClick}
        className={`btn btn-ghost text-error hover:bg-error hover:text-error-content ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        disabled={disabled}
      >
        Clear All Filters
      </button>
    );
}

export function parseSearchParams(params: { [key: string]: string | string[] | undefined }): Partial<DogSearchParams> {
    return {
        // Arrays are always CSV strings
        breeds: params.breeds ? queryStringToArray(params.breeds.toString()) : undefined,
        zipCodes: params.zipCodes ? queryStringToArray(params.zipCodes.toString()) : undefined,
        
        // Numbers
        ageMin: params.ageMin ? Number(params.ageMin) : undefined,
        ageMax: params.ageMax ? Number(params.ageMax) : undefined,
        size: params.size ? Number(params.size) : undefined,
        from: params.from ? Number(params.from) : undefined,
        
        // Sort
        sort: params.sort as `${SortOn}:${SortOrder}` | undefined,
    };
}

// Add this debounce utility function at the top of the file
function debounce<T extends (...args: any[]) => void>(
    func: T,
    wait: number
): T & { flush: () => void } {
    let timeout: NodeJS.Timeout | null = null;
    
    const debounced = (...args: Parameters<T>) => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            func(...args);
            timeout = null;
        }, wait);
    };

    debounced.flush = () => {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
    };

    return debounced as T & { flush: () => void };
}
