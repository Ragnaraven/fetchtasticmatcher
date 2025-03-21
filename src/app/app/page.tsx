import DogSearch from "@/components/dog-search/DogSearch";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AppPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // Check authentication first
  const cookieStore = await cookies();
  if (!cookieStore.get('fetch-access-token')) {
    redirect('/login');
  }

  const resolvedParams = await searchParams;
  
  return (
    <div className="w-full h-screen flex flex-col items-center bg-base-100">
      <FavoritesProvider>
        <h1 className="text-2xl lg:text-4xl font-bold p-4 text-base-content px-4 flex-none">Find Your Perfect Dog</h1>
        <DogSearch searchParams={resolvedParams} />
      </FavoritesProvider>
    </div>
  );
}
