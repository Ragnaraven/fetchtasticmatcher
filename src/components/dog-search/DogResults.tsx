'use server';

import { DogSearchParams, searchDogs, fetchDogsByIds } from "@/lib/actions/dogs";
import { fetchLocations } from "@/lib/actions/locations";
import { DogTable } from "./DogTable";

export async function DogResults({
    searchParams
}: {
    searchParams: Partial<DogSearchParams>
}) {
    const searchResults = await searchDogs(searchParams);
    const dogs = await fetchDogsByIds(searchResults.resultIds);
    
    // Fetch location data for all dogs
    const locations = await fetchLocations(dogs.map(dog => dog.zip_code));
    
    // Filter out any null locations and create the map
    const locationMap = new Map(
        locations
            .filter(loc => loc != null)
            .map(loc => [loc.zip_code, loc])
    );
    
    // Enhance dogs with their location data, providing a fallback for missing locations
    const enhancedDogs = dogs.map(dog => ({
        dog,
        location: locationMap.get(dog.zip_code) || {
            zip_code: dog.zip_code,
            city: 'Unknown',
            state: 'Unknown',
            county: 'Unknown',
            latitude: 0,
            longitude: 0
        }
    }));

    return (
        <div className="flex-1 overflow-hidden">
            <DogTable 
                dogs={enhancedDogs}
                total={searchResults.total}
                next={searchResults.next}
                prev={searchResults.prev}
            />
        </div>
    );
} 