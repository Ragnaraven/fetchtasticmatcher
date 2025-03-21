import DogSearch from "@/components/dog-search/DogSearch";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { WelcomeModal } from "@/components/welcome/WelcomeModal";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AppPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const cookieStore = await cookies();
  if (!cookieStore.get('fetch-access-token')) {
    redirect('/login');
  }

  const resolvedParams = await searchParams;
  
  return (
    <div className="w-full h-screen flex flex-col items-center bg-base-100">
      <FavoritesProvider>
        <div className="w-full py-3 px-4 flex items-center justify-center border-b border-base-200 flex-none">
          <h1 className="text-xl font-semibold text-base-content">🐾 Find Your Perfect Dog</h1>
        </div>
        <div className="w-full max-w-7xl flex-1 overflow-hidden">
          <DogSearch searchParams={resolvedParams} />
        </div>
        <WelcomeModal />
      </FavoritesProvider>
    </div>
  );
}