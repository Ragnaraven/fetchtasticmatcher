'use server';

import { Suspense } from 'react';
import { DogSearchFilters } from "./DogSearchFilters";
import { fetchBreeds } from "@/lib/actions/dogs";
import { DogResults } from "./DogResults";
import { parseSearchParams } from '@/lib/utils/searchParams';

function SearchingDogs() {
    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-4 h-full flex-grow">
            <div className="loading loading-ring loading-lg text-primary"></div>
            <div className="flex items-center space-x-2">
                <span className="text-lg font-medium animate-pulse">
                    Searching for your perfect companion
                </span>
                <span className="animate-bounce delay-100">🐕</span>
            </div>
            <p className="text-base-content/60 text-sm italic">
                Sniffing through our database...
            </p>
        </div>
    );
}

export default async function DogSearch({
    searchParams = {}
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const breeds = await fetchBreeds();
    const typedSearchParams = parseSearchParams(searchParams);

    return (
        <div className="max-w-7xl w-full flex-1 h-full px-4 py-4 flex flex-col">
            <DogSearchFilters breeds={breeds} />
            <Suspense key={JSON.stringify(searchParams)} fallback={<SearchingDogs />}>
                <DogResults searchParams={typedSearchParams} />
            </Suspense>
        </div>
    );
}