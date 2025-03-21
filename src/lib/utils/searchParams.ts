import { DogSearchParams, SortOn, SortOrder } from "@/lib/actions/dogs";

/**
 * Converts an array to a comma-separated string
 */
export const arrayToQueryString = (arr: string[]): string => {
    return arr.map(item => encodeURIComponent(item)).join(',');
};

/**
 * Converts a comma-separated string to an array
 * Returns empty array if input is null or empty
 */
export const queryStringToArray = (str: string | null): string[] => {
    if (!str) return [];
    return str.split(',')
        .map(item => decodeURIComponent(item.trim()))
        .filter(Boolean);
};

/**
 * Parses raw URL search params into typed DogSearchParams
 * Handles arrays as CSV strings, numbers, and sort parameters
 */
export const parseSearchParams = (params: { [key: string]: string | string[] | undefined } = {}): Partial<DogSearchParams> => {
    const getValue = (key: string): string | undefined => {
        const value = params[key];
        if (!value) return undefined;
        return Array.isArray(value) 
            ? decodeURIComponent(value[0]) 
            : decodeURIComponent(value);
    };

    const getArrayValue = (key: string): string[] | undefined => {
        const value = params[key];
        if (!value) return undefined;
        
        if (Array.isArray(value)) {
            return value.map(v => decodeURIComponent(v));
        }
        
        const decodedValue = decodeURIComponent(value);
        return decodedValue.split(',').filter(Boolean);
    };

    const parsed = {
        breeds: getArrayValue('breeds'),
        zipCodes: getArrayValue('zipCodes'),
        
        // Numbers - only convert if value exists and is valid
        ageMin: getValue('ageMin') ? Number(getValue('ageMin')) : undefined,
        ageMax: getValue('ageMax') ? Number(getValue('ageMax')) : undefined,
        size: getValue('size') ? Number(getValue('size')) : undefined,
        from: getValue('from') ? Number(getValue('from')) : undefined,
        
        // Sort
        sort: getValue('sort') as `${SortOn}:${SortOrder}` | undefined,
    };

    return parsed;
};

/**
 * Creates URLSearchParams from DogSearchParams
 * Inverse of parseSearchParams
 */
export const createSearchParams = (params: Partial<DogSearchParams>): URLSearchParams => {
    const searchParams = new URLSearchParams();

    // Arrays
    if (params.breeds?.length) {
        searchParams.set('breeds', arrayToQueryString(params.breeds));
    }
    if (params.zipCodes?.length) {
        searchParams.set('zipCodes', arrayToQueryString(params.zipCodes));
    }

    // Numbers
    if (params.ageMin) searchParams.set('ageMin', params.ageMin.toString());
    if (params.ageMax) searchParams.set('ageMax', params.ageMax.toString());
    if (params.size) searchParams.set('size', params.size.toString());
    if (params.from) searchParams.set('from', params.from.toString());

    // Sort
    if (params.sort) searchParams.set('sort', params.sort);

    return searchParams;
}; 