'use server';

import { authenticatedFetch } from './authenticated-fetch';
import { Location, GeoBoundingBox, LocationSearchParams, LocationSearchResponse, Coordinates } from '@/models/location';

/**
 * Fetch location data for multiple ZIP codes
 * @param zipCodes Array of ZIP codes (max 100)
 * @returns Array of Location objects
 */
export async function fetchLocations(zipCodes: string[]): Promise<Location[]> {
    if (zipCodes.length > 100) {
        throw new Error('Maximum of 100 ZIP codes allowed per request');
    }
    
    if (!process.env.BASE_URL) {
        throw new Error('BASE_URL environment variable is not set');
    }

    const response = await authenticatedFetch(`${process.env.BASE_URL}/locations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(zipCodes)
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch locations: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Search for locations based on various criteria
 * @param params Search parameters including city, states, geoBoundingBox, size, and pagination
 * @returns LocationSearchResponse containing results and total count
 */
export async function searchLocations(params: LocationSearchParams): Promise<LocationSearchResponse> {
    // Validate geoBoundingBox if provided
    if (params.geoBoundingBox) {
        const box = params.geoBoundingBox;
        const hasCorners = box.bottom_left && box.top_right;
        const hasEdges = box.top && box.left && box.bottom && box.right;
        const hasAllCorners = box.bottom_left && box.top_right && box.bottom_right && box.top_left;
        
        if (!hasCorners && !hasEdges && !hasAllCorners) {
            throw new Error('Invalid geoBoundingBox parameters');
        }
    }

    // Validate states format if provided
    if (params.states?.some(state => state.length !== 2)) {
        throw new Error('States must be two-letter abbreviations');
    }

    if (!process.env.BASE_URL) {
        throw new Error('BASE_URL environment variable is not set');
    }

    const response = await authenticatedFetch(`${process.env.BASE_URL}/locations/search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...params,
            size: params.size || 25 // Default to 25 if not specified
        })
    });

    if (!response.ok) {
        throw new Error(`Failed to search locations: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Helper function to create a bounding box from coordinates
 */
export async function createBoundingBox(
    topLeft: Coordinates,
    bottomRight: Coordinates
): Promise<GeoBoundingBox> {
    return {
        top: topLeft.lat,
        left: topLeft.lon,
        bottom: bottomRight.lat,
        right: bottomRight.lon
    };
}

/**
 * Helper function to create a bounding box from center point and radius
 * @param center Center coordinates
 * @param radiusMiles Radius in miles
 */
export async function createBoundingBoxFromRadius(
    center: Coordinates,
    radiusMiles: number
): Promise<GeoBoundingBox> {
    const milesPerLat = 69;
    const milesPerLon = 55; // Approximate at mid-latitudes

    const latChange = radiusMiles / milesPerLat;
    const lonChange = radiusMiles / milesPerLon;

    return {
        top: center.lat + latChange,
        bottom: center.lat - latChange,
        left: center.lon - lonChange,
        right: center.lon + lonChange
    };
}
