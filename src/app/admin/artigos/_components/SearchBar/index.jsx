'use client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useRef } from 'react';
import './styles.css';

export function SearchBar({ placeholder = 'Pesquisar...' }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const timer = useRef(null);

  function handleChange(e) {
    const value = e.target.value;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set('q', value);
      } else {
        params.delete('q');
      }
      params.delete('page');
      router.replace(`${pathname}?${params.toString()}`);
    }, 300);
  }

  return (
    <div className="adminSearchBar">
      <span className="material-symbols-outlined adminSearchIcon">search</span>
      <input
        type="search"
        className="adminSearchInput"
        placeholder={placeholder}
        defaultValue={searchParams.get('q') ?? ''}
        onChange={handleChange}
      />
    </div>
  );
}
