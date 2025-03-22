import DogSearch from "@/components/dog-search/DogSearch";
import { WelcomeProvider } from "@/contexts/WelcomeContext";
import { WelcomeModal } from "@/components/welcome/WelcomeModal";
import { AppHeader } from "@/components/header/AppHeader";
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
      <WelcomeProvider>
        <AppHeader />
        <div className="w-full max-w-7xl flex-1 overflow-hidden">
          <DogSearch searchParams={resolvedParams} />
        </div>
        <WelcomeModal />
      </WelcomeProvider>
    </div>
  );
}