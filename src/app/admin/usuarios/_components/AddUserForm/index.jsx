'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export function AddUserForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const emailRef = useRef(null);
  const nomeRef = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const email = emailRef.current.value.trim();
    const nome = nomeRef.current.value.trim();

    if (!email) {
      setErro('Email é obrigatório.');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/adminUsers`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, nome }),
        },
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error ?? `Erro ${res.status}`);
      }

      emailRef.current.value = '';
      nomeRef.current.value = '';
      router.refresh();
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="addUserForm" onSubmit={handleSubmit}>
      <div className="addUserFormFields">
        <div className="addUserFormGroup">
          <label htmlFor="addUserEmail" className="addUserFormLabel">Email</label>
          <input
            ref={emailRef}
            id="addUserEmail"
            type="email"
            className="addUserFormInput"
            placeholder="usuario@email.com"
            required
          />
        </div>
        <div className="addUserFormGroup">
          <label htmlFor="addUserNome" className="addUserFormLabel">Nome <span className="addUserFormOptional">(opcional)</span></label>
          <input
            ref={nomeRef}
            id="addUserNome"
            type="text"
            className="addUserFormInput"
            placeholder="Nome completo"
          />
        </div>
        <button type="submit" className="addUserFormBtn" disabled={loading}>
          <span className="material-symbols-outlined">
            {loading ? 'hourglass_empty' : 'person_add'}
          </span>
          {loading ? 'Adicionando…' : 'Adicionar'}
        </button>
      </div>
      {erro && <p className="addUserFormErro" role="alert">{erro}</p>}
    </form>
  );
}
