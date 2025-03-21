'use server';

import { authenticatedFetch } from './authenticated-fetch';

export interface DogSearchParams {
    //User search 
    breeds?: string[];
    zipCodes?: string[];
    ageMin?: number;
    ageMax?: number;

    //Pagination params
    size ?: number; // Default 25
    from ?: number; // Start of pagination results
    sort ?: `${SortOn}:${SortOrder}`; 
    /*
    sort=field:[asc|desc].
        results can be sorted by the following fields:

        breed
        name
        age
        Ex: sort=breed:asc
    */
}
export type SortOn = 'breed' | 'name' | 'age';
export type SortOrder = 'asc' | 'desc';

export interface DogSearchResults {
    resultIds: string[];
    total: number;
    next: string | null;
    prev: string | null;
}

export interface Dog {
    id: string;
    img: string;
    name: string;
    age: number;
    zip_code: string;
    breed: string;
}

export async function fetchBreeds(): Promise<string[]> {
  try {
      const url = `${process.env.BASE_URL}/dogs/breeds`;
      const response = await authenticatedFetch(url, {
          method: 'GET',
          next: {
            revalidate: 3600,
            tags: ['breeds']
          }
      });

      if (!response.ok) {
          const errorText = await response.text();
          console.error('[fetchBreeds] API Error:', {
              status: response.status,
              statusText: response.statusText,
              responseBody: errorText,
          });
          throw new Error(`Failed to fetch breeds: ${response.status} ${response.statusText}\n${errorText}`);
      }

      return response.json();
  } catch (error) {
      console.error('[fetchBreeds] Error:', error);
      throw error;
  }
}

export async function searchDogs(params: DogSearchParams = {}): Promise<DogSearchResults> {
    try {
        const url = new URL(`${process.env.BASE_URL}/dogs/search`);
        
        // Add search parameters to URL if they exist
        if (params.breeds?.length) {
            params.breeds.forEach(breed => url.searchParams.append('breeds', breed));
        }
        if (params.zipCodes?.length) {
            params.zipCodes.forEach(zip => url.searchParams.append('zipCodes', zip));
        }
        if (params.ageMin !== undefined) {
            url.searchParams.set('ageMin', params.ageMin.toString());
        }
        if (params.ageMax !== undefined) {
            url.searchParams.set('ageMax', params.ageMax.toString());
        }
        
        // Add pagination and sorting parameters
        if (params.size !== undefined) {
            url.searchParams.set('size', params.size.toString());
        }
        if (params.from !== undefined) {
            url.searchParams.set('from', params.from.toString());
        }
        if (params.sort) {
            url.searchParams.set('sort', params.sort);
        }

        const response = await authenticatedFetch(url.toString(), {
            method: 'GET',
            next: {
              revalidate: 60,
              tags: ['dogs-search']
          }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[searchDogs] API Error:', {
                status: response.status,
                statusText: response.statusText,
                responseBody: errorText,
            });
            throw new Error(`Failed to search dogs: ${response.status} ${response.statusText}\n${errorText}`);
        }

        return response.json();
    } catch (error) {
        console.error('[searchDogs] Error:', error);
        throw error;
    }
}

export async function fetchDogsByIds(dogIds: string[]): Promise<Dog[]> {
    try {
        if (!dogIds.length) {
            return [];
        }

        if (dogIds.length > 100) {
            throw new Error('Cannot fetch more than 100 dogs at once');
        }

        const url = `${process.env.BASE_URL}/dogs`;
        const response = await authenticatedFetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dogIds),
            next: {
                revalidate: 60,
                tags: ['dogs-details']
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[fetchDogsByIds] API Error:', {
                status: response.status,
                statusText: response.statusText,
                responseBody: errorText,
            });
            throw new Error(`Failed to fetch dogs: ${response.status} ${response.statusText}\n${errorText}`);
        }

        return response.json();
    } catch (error) {
        console.error('[fetchDogsByIds] Error:', error);
        throw error;
    }
}

interface Match {
    match: string;
}

export async function matchDog(dogIds: string[]): Promise<Match> {
    try {
        if (!dogIds.length) {
            throw new Error('No dogs provided for matching');
        }

        const url = `${process.env.BASE_URL}/dogs/match`;
        const response = await authenticatedFetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dogIds),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[matchDog] API Error:', {
                status: response.status,
                statusText: response.statusText,
                responseBody: errorText,
            });
            throw new Error(`Failed to match dog: ${response.status} ${response.statusText}\n${errorText}`);
        }

        return response.json();
    } catch (error) {
        console.error('[matchDog] Error:', error);
        throw error;
    }
}
