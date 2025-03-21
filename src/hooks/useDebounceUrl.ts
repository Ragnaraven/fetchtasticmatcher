'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function useDebounceUrl(delay: number = 500) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [debouncedUpdate, setDebouncedUpdate] = useState<NodeJS.Timeout>();

  const updateUrl = useCallback((params: URLSearchParams) => {
    // Clear any existing timeout
    if (debouncedUpdate) {
      clearTimeout(debouncedUpdate);
    }

    // Set new timeout
    const timeout = setTimeout(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    }, delay);

    setDebouncedUpdate(timeout);
  }, [router, delay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debouncedUpdate) {
        clearTimeout(debouncedUpdate);
      }
    };
  }, [debouncedUpdate]);

  return {
    updateUrl,
    searchParams
  };
} 