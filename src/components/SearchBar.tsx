'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

interface Hit {
  objectID: string;
  [key: string]: any;
}

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Hit[]>([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        if (res.ok) {
          const data = await res.json();
          setResults(data.hits);
        }
      } catch (err) {
        console.error(err);
      }
    }, 300);
    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [query]);

  return (
    <div className="relative w-full max-w-md">
      <Input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="w-full"
      />
      {results.length > 0 && (
        <ul className="absolute z-10 mt-2 w-full rounded-md border bg-white shadow">
          {results.map((hit) => (
            <li
              key={hit.objectID}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100"
            >
              {hit.title || hit.name || hit.objectID}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
