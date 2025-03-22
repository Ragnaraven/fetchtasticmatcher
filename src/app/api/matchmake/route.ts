import { cookies } from 'next/headers';
import { matchDog, fetchDogsByIds } from '@/lib/actions/dogs';
import { fetchLocations } from '@/lib/actions/locations';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  if (!cookieStore.get('fetch-access-token')) {
    return Response.redirect(new URL('/login', request.url), 303);
  }

  const { favorites } = await request.json();
  if (!favorites?.length) {
    return Response.redirect(new URL('/app', request.url), 303);
  }

  const match = await matchDog(favorites);
  const dogs = await fetchDogsByIds([match.match]);
  const dog = dogs[0];
  const locations = await fetchLocations([dog.zip_code]);
  const location = locations[0];

  const url = new URL('/app/match', request.url);
  url.searchParams.set('dog', JSON.stringify(dog));
  url.searchParams.set('location', JSON.stringify(location));
  
  return Response.redirect(url, 303);
} 