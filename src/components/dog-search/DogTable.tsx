'use client';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { EnhancedDog } from '@/models/enhanced-dog';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface DogTableProps {
  dogs: EnhancedDog[];
  total: number;
  next: string | null;
  prev: string | null;
}

const STORAGE_KEY = 'dog-favorites';
const MAX_FAVORITES = 100;

export function DogTable({ dogs, total, next, prev }: DogTableProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const router = useRouter();

  // Load favorites from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setFavorites(new Set(JSON.parse(stored)));
    }
  }, []);

  const toggleFavorite = (dogId: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(dogId)) {
        next.delete(dogId);
      } else if (next.size >= MAX_FAVORITES) {
        alert(`Maximum of ${MAX_FAVORITES} favorites reached`);
        return prev;
      } else {
        next.add(dogId);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const handleMatch = async () => {
    const favoriteIds = Array.from(favorites);
    if (favoriteIds.length === 0) {
      alert('Please select at least one favorite dog');
      return;
    }
    
    try {
      const response = await fetch('/api/matchmake', {
        method: 'POST',
        body: JSON.stringify({ favorites: favoriteIds }),
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow', // Ensure we follow redirects
      });
      
      // The browser will automatically follow the redirect
      window.location.href = response.url;
    } catch (error) {
      console.error('Error generating match:', error);
      alert('Unable to generate match. Please try again.');
    }
  };

  const columnHelper = createColumnHelper<EnhancedDog>();

  const columns = [
    columnHelper.accessor(row => row.dog.id, {
      id: 'favorite',
      header: 'Fav',
      cell: (info) => (
        <div className="w-12 flex justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent row click
              toggleFavorite(info.getValue());
            }}
            className={`btn btn-circle btn-sm text-base-content ${
              favorites.has(info.getValue())
                ? 'btn-primary text-lg'
                : 'btn-ghost text-lg hover:text-primary'
            }`}
          >
            ♥
          </button>
        </div>
      ),
    }),
    columnHelper.accessor(row => row.dog.img, {
      header: 'Photo',
      cell: (info) => (
        <div className="w-32 p-2">
          <img 
            src={info.getValue()} 
            alt="Dog" 
            className="w-28 h-28 object-cover rounded"
          />
        </div>
      ),
    }),
    columnHelper.accessor(row => row.dog.name, {
      header: 'Name',
      cell: (info) => <span className="text-base-content">{info.getValue()}</span>,
    }),
    columnHelper.accessor(row => row.dog.breed, {
      header: 'Breed',
      cell: (info) => <span className="text-base-content">{info.getValue()}</span>,
    }),
    columnHelper.accessor(row => row.dog.age, {
      header: 'Age',
      cell: (info) => <span className="text-base-content">{info.getValue()}</span>,
    }),
    columnHelper.accessor(row => row.location, {
      header: 'Location',
      cell: (info) => {
        const location = info.getValue();
        return (
          <div className="flex flex-col gap-1">
            <span className="text-base-content font-medium">
              {location.city}, {location.state}
            </span>
            <span className="text-base-content/60 text-sm">
              {location.county} County
            </span>
            <span className="text-base-content/60 text-sm">
              {location.zip_code}
            </span>
          </div>
        );
      },
    })
  ];

  const table = useReactTable({
    data: dogs,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handlePageChange = (url: string | null) => {
    if (!url) return;
    
    const queryString = url.split('?')[1];
    if (queryString) {
      router.push(`?${queryString}`, { scroll: false });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col"
    >
      <div className="flex-none">
        <Pagination 
          prev={prev} 
          next={next} 
          handlePageChange={handlePageChange} 
          dogs={dogs} 
          total={total} 
          favorites={favorites}
        />
      </div>

      <div className="mt-4 flex-1 overflow-y-auto overflow-x-auto text-base-content">
        <table className="table bg-base-100 w-full">
          <thead className="bg-base-200 sticky top-0">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <th
                    key={header.id}
                    className={`text-xs font-medium uppercase tracking-wider text-base-content py-4 font-title
                      ${index === 0 ? 'w-12 px-0 sm:static sticky left-0 bg-base-200 z-30 text-center' : 'text-left px-6'}
                      ${index === 1 ? 'w-32' : ''}`}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <AnimatePresence mode="popLayout">
            <motion.tbody 
              className="divide-y divide-base-200"
              layout
            >
              {table.getRowModel().rows.map((row, index) => (
                <motion.tr 
                  key={row.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    duration: 0.3,
                    delay: index * 0.05 // Stagger effect
                  }}
                  onClick={() => toggleFavorite(row.original.dog.id)}
                  className="group hover:bg-base-200 cursor-pointer"
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <td 
                      key={cell.id} 
                      className={`whitespace-nowrap
                        ${index === 0 
                          ? 'w-12 p-0 sm:static sticky left-0 bg-base-100 group-hover:bg-base-200 z-20' 
                          : index === 1 
                          ? 'w-32 p-0'
                          : 'px-6 py-4'}`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </motion.tbody>
          </AnimatePresence>
        </table>
      </div>

      <AnimatePresence>
        {favorites.size > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}  // Slowed down
            className="flex-none mt-6 px-4 pb-2 flex flex-col gap-4 items-center"
          >
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleMatch}
              className="btn btn-primary border-1 border-base-content btn-xl shadow-lg text-lg font-medium gap-2 min-w-80 relative overflow-hidden"
            >
              <motion.span 
                className="relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                  staggerChildren: 0.05
                }}
              >
                {(favorites.size === 1 
                  ? "Find your perfect match" 
                  : `Find your match from ${favorites.size} favorites`).split('').map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.03
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.span>
              <div className="flex items-center gap-1">
                <motion.span 
                  className="text-2xl relative z-10" 
                  aria-hidden="true"
                  animate={{
                    y: [0, -8, 0]
                  }}
                  transition={{
                    duration: 1,
                    delay: 0.5, // Offset for alternating effect
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                >
                  🐾
                </motion.span>
              </div>
              <motion.div
                className="absolute inset-0 bg-white"
                animate={{
                  opacity: [0, 0.1, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const Pagination = (
  {prev, next, handlePageChange, dogs, total, favorites}:
  {prev: string | null, next: string | null, handlePageChange: (url: string | null) => void, 
dogs: EnhancedDog[], total: number, favorites: Set<string>}) => {

  // Calculate the current range
  const pageSize = dogs.length;
  const currentStart = (prev ? pageSize + 1 : 1);
  const currentEnd = currentStart + pageSize - 1;

  return <div className="flex flex-col items-center gap-4">
    <div className="mt-4 w-full flex justify-between items-center">
      <button 
        disabled={!prev}
        onClick={() => handlePageChange(prev)}
        className="btn btn-primary w-28"
      >
        Previous
      </button>
      <PaginationInfo 
        className="text-base-content hidden sm:block text-center flex-1 px-4" 
        currentStart={currentStart} 
        currentEnd={currentEnd} 
        total={total}
        favoriteCount={favorites.size}
      />
      <button 
        disabled={!next}
        onClick={() => handlePageChange(next)}
        className="btn btn-primary w-28"
      >
        Next
      </button>
    </div>
    
    <PaginationInfo 
      className="text-base-content sm:hidden text-center w-full" 
      currentStart={currentStart} 
      currentEnd={currentEnd} 
      total={total}
      favoriteCount={favorites.size}
    />
  </div>;
}

const PaginationInfo = ({
  className, 
  currentStart, 
  currentEnd, 
  total,
  favoriteCount
}: {
  className: string, 
  currentStart: number, 
  currentEnd: number, 
  total: number,
  favoriteCount: number
}) => {
  return (
    <div className={className}>
      <span>
        {total > 0 ? `Showing ${currentStart}-${currentEnd} of ${total.toLocaleString()} dogs` : 'No dogs found. Please try different filters.'}
      </span>
      <span className="ml-8">
        {`${favoriteCount} ${favoriteCount === 1 ? 'dog' : 'dogs'} favorited`}
      </span>
    </div>
  );
};
