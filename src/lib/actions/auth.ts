'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { authenticatedFetch } from './authenticated-fetch';

// Add storage for last successful login credentials
let lastLoginCredentials: { name: string; email: string } | null = null;

export async function login(formData: FormData) {
  const name = formData.get('name');
  const email = formData.get('email');

  if (!email || !name) {
    throw new Error('Missing required fields');
  }

  let authed: boolean = false;
  try {
    const response = await fetch(`${process.env.BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name.toString(),
            email: email.toString(),
        })
    });

    if (!response.ok) {
        throw new Error('Authentication failed');
    }
    
    // Store successful credentials for potential refresh
    lastLoginCredentials = {
        name: name.toString(),
        email: email.toString()
    };
    
    const cookieStore = await cookies();
    const setCookieHeader = response.headers.get('set-cookie');
    
    if (setCookieHeader) {
        const cookieParams = setCookieHeader.split(';').reduce((acc: any, param) => {
            const [key, value] = param.trim().split('=');
            acc[key.toLowerCase()] = value || true;
            return acc;
        }, {});
        
        const cookieValue = cookieParams['fetch-access-token'];
        
        cookieStore.set('fetch-access-token', cookieValue, {
            secure: cookieParams['secure'] !== undefined,
            httpOnly: cookieParams['httponly'] !== undefined,
            sameSite: (cookieParams['samesite'] || 'lax') as 'lax' | 'strict' | 'none',
            path: cookieParams['path'] || '/',
            expires: cookieParams['expires'] ? new Date(cookieParams['expires']) : undefined
        });
    }

    authed = true;
  } catch (error) {
    authed = false;
  }

  if (authed) {
    redirect('/app');
  } else {
    redirect('/');
  }
}

export async function refreshAuth(): Promise<boolean> {
    if (!lastLoginCredentials) {
        return false;
    }

    try {
        const response = await fetch(`${process.env.BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(lastLoginCredentials)
        });

        if (!response.ok) {
            return false;
        }

        const cookieStore = await cookies();
        const setCookieHeader = response.headers.get('set-cookie');
        
        if (setCookieHeader) {
            const cookieParams = setCookieHeader.split(';').reduce((acc: any, param) => {
                const [key, value] = param.trim().split('=');
                acc[key.toLowerCase()] = value || true;
                return acc;
            }, {});
            
            const cookieValue = cookieParams['fetch-access-token'];
            
            cookieStore.set('fetch-access-token', cookieValue, {
                secure: cookieParams['secure'] !== undefined,
                httpOnly: cookieParams['httponly'] !== undefined,
                sameSite: (cookieParams['samesite'] || 'lax') as 'lax' | 'strict' | 'none',
                path: cookieParams['path'] || '/',
                expires: cookieParams['expires'] ? new Date(cookieParams['expires']) : undefined
            });
        }

        return true;
    } catch (error) {
        console.error('[refreshAuth] Error:', error);
        return false;
    }
}

export async function logout() {
  'use server';

  const cookieStore = await cookies();
  
  try {
    const response = await authenticatedFetch(`${process.env.BASE_URL}/auth/logout`, {
      method: 'POST'
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    cookieStore.delete('fetch-access-token');
    
    redirect('/');
  } catch (error) {
    console.error('[logout] Error:', error);
    throw error;
  }
}
