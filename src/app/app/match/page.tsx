import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { MatchAnimation } from '@/components/match/MatchAnimation';
import { matchDog, fetchDogsByIds } from '@/lib/actions/dogs';
import { fetchLocations } from '@/lib/actions/locations';
import Link from 'next/link';

export default async function MatchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const cookieStore = await cookies();
  
  if (!cookieStore.get('fetch-access-token')) {
    redirect('/login');
  }

  const resolvedParams = await searchParams;
  const favoritesParam = resolvedParams.favorites;
  if (!favoritesParam || typeof favoritesParam !== 'string') {
    redirect('/app');
  }

  const favoriteIds = favoritesParam.split(',').filter(Boolean);
  if (favoriteIds.length === 0) {
    redirect('/app');
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

    return <MatchAnimation 
      key={favoritesParam}
      matchedDog={dog} 
      location={location} 
      favorites={favoritesParam}
    />;
  } catch (error) {
    console.error('Error in MatchPage:', error);
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-base-100 p-4">
        <div className="text-center space-y-4">
          <p className="text-error text-lg">Unable to find a match at this time. Please try again.</p>
          <Link href="/app" className="btn btn-primary text-base-content border-base-content">
            Back to Search
          </Link>
        </div>
      </div>
    );
  }
}