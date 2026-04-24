'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';

const PageHeroSearch = ({ placeholder }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const debounceRef = useRef(null);
  const searchParamsRef = useRef(searchParams);
  searchParamsRef.current = searchParams;
  const [inputValue, setInputValue] = useState(searchParams.get('q') ?? '');

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParamsRef.current);
      if (value.trim()) {
        params.set('q', value.trim());
      } else {
        params.delete('q');
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, 300);
  };

  return (
    <label className='pageHeroSearch' htmlFor='page-hero-search'>
      <span className='material-symbols-outlined' aria-hidden="true">search</span>
      <input
        id='page-hero-search'
        type='text'
        placeholder={placeholder}
        className='pageHeroInput'
        value={inputValue}
        onChange={handleChange}
      />
    </label>
  );
};

export { PageHeroSearch };
