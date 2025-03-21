'use client';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Dog } from '@/lib/actions/dogs';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useRouter } from 'next/navigation';

interface DogTableProps {
  dogs: Dog[];
  total: number;
  next: string | null;
  prev: string | null;
}

export function DogTable({ dogs, total, next, prev }: DogTableProps) {
  const { favorites, toggleFavorite } = useFavorites();
  const router = useRouter();

  const handleRowClick = (dogId: string) => (e: React.MouseEvent) => {
    // Don't trigger if clicking the favorite button itself
    if ((e.target as HTMLElement).closest('.btn-circle')) {
      return;
    }
    toggleFavorite(dogId);
  };

  const columnHelper = createColumnHelper<Dog>();

  const columns = [
    columnHelper.accessor('id', {
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
    columnHelper.accessor('img', {
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
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => <span className="text-base-content">{info.getValue()}</span>,
    }),
    columnHelper.accessor('breed', {
      header: 'Breed',
      cell: (info) => <span className="text-base-content">{info.getValue()}</span>,
    }),
    columnHelper.accessor('age', {
      header: 'Age',
      cell: (info) => <span className="text-base-content">{info.getValue()}</span>,
    }),
    columnHelper.accessor('zip_code', {
      header: 'Location',
      cell: (info) => <span className="text-base-content">{info.getValue()}</span>,
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
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto overflow-x-auto text-base-content">
        <table className="table bg-base-100 w-full">
          <thead className="bg-base-200 sticky top-0 z-30">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <th
                    key={header.id}
                    className={`text-xs font-medium uppercase tracking-wider text-base-content
                      ${index === 0 ? 'w-12 p-2 sm:static sticky left-0 bg-base-200 z-30 flex items-center justify-center' : 'text-left'}
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
          <tbody className="divide-y divide-base-200">
            {table.getRowModel().rows.map(row => (
              <tr 
                key={row.id} 
                onClick={handleRowClick(row.original.id)}
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination - stays at bottom */}
      <div className="flex-none pt-4 border-t border-base-200">
        <Pagination 
          prev={prev} 
          next={next} 
          handlePageChange={handlePageChange} 
          dogs={dogs} 
          total={total} 
        />
      </div>
    </div>
  );
}

const Pagination = (
  {prev, next, handlePageChange, dogs, total}:
  {prev: string | null, next: string | null, handlePageChange: (url: string | null) => void, 
dogs: Dog[], total: number}) => {

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
      <PaginationInfo className="text-base-content hidden sm:block text-center flex-1 px-4" currentStart={currentStart} currentEnd={currentEnd} total={total} />
      <button 
        disabled={!next}
        onClick={() => handlePageChange(next)}
        className="btn btn-primary w-28"
      >
        Next
      </button>
    </div>
    
    <PaginationInfo className="text-base-content sm:hidden text-center w-full" currentStart={currentStart} currentEnd={currentEnd} total={total} />
  </div>;
}

const PaginationInfo = ({className, currentStart, currentEnd, total}: {className: string, currentStart: number, currentEnd: number, total: number}) => {
  const { favorites } = useFavorites();

  return (
    <div className={className}>
      <span>
        {total > 0 ? `Showing ${currentStart}-${currentEnd} of ${total.toLocaleString()} dogs` : 'No dogs found. Please try different filters.'}
      </span>
      <span className="ml-8">
        {`${favorites.size} ${favorites.size === 1 ? 'dog' : 'dogs'} favorited`}
      </span>
    </div>
  );
}
