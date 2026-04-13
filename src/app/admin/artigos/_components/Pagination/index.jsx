'use client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import './styles.css';

export function Pagination({ total, perPage, currentPage }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(total / perPage);

  if (totalPages <= 1) return null;

  function goToPage(page) {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    router.push(`${pathname}?${params.toString()}`);
  }

  function getPages() {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = new Set([1, totalPages, currentPage]);
    if (currentPage > 1) pages.add(currentPage - 1);
    if (currentPage < totalPages) pages.add(currentPage + 1);
    return Array.from(pages).sort((a, b) => a - b);
  }

  const pages = getPages();
  const from = Math.min((currentPage - 1) * perPage + 1, total);
  const to = Math.min(currentPage * perPage, total);

  return (
    <div className="adminPagination">
      <span className="adminPaginationInfo">
        {from}–{to} de {total}
      </span>

      <nav className="adminPaginationControls" aria-label="Paginação">
        <button
          className="adminPaginationBtn"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Página anterior"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>

        {pages.reduce((acc, page, i) => {
          const prev = pages[i - 1];
          if (prev && page - prev > 1) {
            acc.push(
              <span key={`e-${page}`} className="adminPaginationEllipsis">…</span>
            );
          }
          acc.push(
            <button
              key={page}
              className={`adminPaginationBtn${currentPage === page ? ' adminPaginationBtn--active' : ''}`}
              onClick={() => goToPage(page)}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          );
          return acc;
        }, [])}

        <button
          className="adminPaginationBtn"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Próxima página"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </nav>
    </div>
  );
}
