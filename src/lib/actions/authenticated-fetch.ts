'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { refreshAuth } from './auth';

export async function authenticatedFetch(
    url: string, 
    options: RequestInit = {}
): Promise<Response> {
    if (!process.env.BASE_URL) {
        throw new Error('BASE_URL environment variable is not set. Please create a .env.local file with BASE_URL=https://frontend-take-home-service.fetch.com');
    }

    const cookieStore = await cookies();
    let authCookie = cookieStore.get('fetch-access-token');
    
    if (!authCookie) {
        // Try to refresh the token
        const refreshed = await refreshAuth();
        if (!refreshed) {
            redirect('/login');
        }
        authCookie = cookieStore.get('fetch-access-token');
    }

    const headers = new Headers(options.headers);
    headers.set('Cookie', `fetch-access-token=${authCookie!.value}`);

    try {
        const response = await fetch(url, {
            ...options,
            headers: headers,
        });

        if (response.status === 401) {
            // Token expired, try to refresh
            const refreshed = await refreshAuth();
            if (!refreshed) {
                redirect('/login');
            }
            
            // Retry the original request with new token
            authCookie = cookieStore.get('fetch-access-token');
            headers.set('Cookie', `fetch-access-token=${authCookie!.value}`);
            return fetch(url, {
                ...options,
                headers: headers,
            });
        }

        return response;
    } catch (error) {
        console.error('[authenticatedFetch] Error:', error);
        redirect('/login');
    }
}