export interface Dog {
    id: string
    img: string
    name: string
    age: number
    zip_code: string
    breed: string
}

export type SortOn = 'breed' | 'name' | 'age';
export type SortOrder = 'asc' | 'desc';

export interface DogSearchParams {
    breeds?: string[];
    zipCodes?: string[];
    ageMin?: number;
    ageMax?: number;
    size?: number;
    from?: number;
    sort?: `${SortOn}:${SortOrder}`;
}

export interface DogSearchResults {
    resultIds: string[];
    total: number;
    next: string | null;
    prev: string | null;
}