'use server';

import { matchDog, fetchDogsByIds } from './dogs';
import { fetchLocations } from './locations';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function findMatch(favoriteIds: string[]) {
  const cookieStore = await cookies();
  
  if (!cookieStore.get('fetch-access-token')) {
    redirect('/login');
  }

  if (!favoriteIds?.length) {
    throw new Error('No favorites selected');
  }

  try {
    // Get the match from the API
    const match = await matchDog(favoriteIds);
    
    // Fetch the matched dog's details
    const dogs = await fetchDogsByIds([match.match]);
    const dog = dogs[0];
    
    // Fetch location details
    const locations = await fetchLocations([dog.zip_code]);
    const location = locations[0];

    return {
      dog,
      location
    };
  } catch (error) {
    console.error('Error in findMatch:', error);
    throw new Error('Unable to generate match');
  }
}