'use server';

import { DogSearchParams, searchDogs, fetchDogsByIds } from "@/lib/actions/dogs";
import { DogTable } from "./DogTable";

export async function DogResults({
    searchParams
}: {
    searchParams: Partial<DogSearchParams>
}) {
    const searchResults = await searchDogs(searchParams);
    const dogs = await fetchDogsByIds(searchResults.resultIds);

    return (
        <div className="flex-1 overflow-hidden">
            <DogTable 
                dogs={dogs}
                total={searchResults.total}
                next={searchResults.next}
                prev={searchResults.prev}
            />
        </div>
    );
} 