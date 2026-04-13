'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

/**
 * Botão de exclusão com confirmação via dialog nativo.
 * Chama DELETE {NEXT_PUBLIC_API_URL}/{endpoint}/{id} e recarrega a página.
 *
 * @param {string} endpoint  - ex: '/articles'
 * @param {string} id        - ID do recurso
 * @param {string} nome      - Nome exibido na mensagem de confirmação
 * @param {string} className - Classe CSS do botão
 * @param {string} ariaLabel - aria-label do botão
 */
export function DeleteButton({ endpoint, id, nome, className, ariaLabel }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!window.confirm(`Excluir "${nome}"? Esta ação não pode ser desfeita.`)) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}/${id}`,
        { method: 'DELETE' },
      );
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Erro ${res.status}`);
      }
      router.refresh();
    } catch (err) {
      alert(`Não foi possível excluir: ${err.message}`);
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      className={className}
      aria-label={ariaLabel}
      onClick={handleDelete}
      disabled={loading}
    >
      <span className="material-symbols-outlined">
        {loading ? 'hourglass_empty' : 'delete'}
      </span>
    </button>
  );
}
