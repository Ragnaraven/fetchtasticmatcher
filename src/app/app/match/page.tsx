'use client';

import { useSearchParams } from 'next/navigation';
import { MatchAnimation } from '@/components/match/MatchAnimation';
import { redirect } from 'next/navigation';

export default function MatchPage() {
  const searchParams = useSearchParams();
  const dogParam = searchParams.get('dog');
  const locationParam = searchParams.get('location');

  if (!dogParam || !locationParam) {
    redirect('/app');
  }

  const dog = JSON.parse(decodeURIComponent(dogParam));
  const location = JSON.parse(decodeURIComponent(locationParam));

  return <MatchAnimation matchedDog={dog} location={location} />;
}