'use client';

import { useSearchParams } from 'next/navigation';
import { MatchAnimation } from '@/components/match/MatchAnimation';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default function MatchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MatchContent />
    </Suspense>
  );
}

function MatchContent() {
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