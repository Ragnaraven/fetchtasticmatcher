'use client';

import { logout as serverLogout } from '@/lib/actions/auth';

export async function clientLogout() {
  // Clear favorites
  localStorage.removeItem('dog-favorites');
  
  // Call server logout
  const result = await serverLogout();
  
  // Return result for handling redirect
  return result;
} 