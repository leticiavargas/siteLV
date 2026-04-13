'use client';
import { useState } from 'react';

export function ContatoForm() {
  const [form, setForm] = useState({ nome: '', email: '', mensagem: '' });
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  function setField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Erro ao enviar.');
      setStatus('success');
      setForm({ nome: '', email: '', mensagem: '' });
    } catch (err) {
      setErrorMsg(err.message);
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className='contatoForm contatoFormSucesso'>
        <span className='material-symbols-outlined contatoFormSucessoIcon'>check_circle</span>
        <p className='contatoFormSucessoTitulo'>Mensagem enviada!</p>
        <p className='contatoFormSucessoTexto'>Obrigada pelo contato — responderei em breve.</p>
        <button type='button' className='contatoBtn' onClick={() => setStatus('idle')}>
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  return (
    <form className='contatoForm' onSubmit={handleSubmit} noValidate>
      {status === 'error' && (
        <p className='contatoFormErro' role='alert'>{errorMsg}</p>
      )}

      <div className='contatoFormGroup'>
        <label htmlFor='nome'>Nome</label>
        <input
          id='nome'
          name='nome'
          type='text'
          placeholder='Seu nome'
          required
          value={form.nome}
          onChange={e => setField('nome', e.target.value)}
          disabled={status === 'loading'}
        />
      </div>
      <div className='contatoFormGroup'>
        <label htmlFor='email'>E-mail</label>
        <input
          id='email'
          name='email'
          type='email'
          placeholder='seu@email.com'
          required
          value={form.email}
          onChange={e => setField('email', e.target.value)}
          disabled={status === 'loading'}
        />
      </div>
      <div className='contatoFormGroup'>
        <label htmlFor='mensagem'>Mensagem</label>
        <textarea
          id='mensagem'
          name='mensagem'
          rows={5}
          placeholder='Escreva sua mensagem...'
          required
          value={form.mensagem}
          onChange={e => setField('mensagem', e.target.value)}
          disabled={status === 'loading'}
        />
      </div>
      <button type='submit' className='contatoBtn' disabled={status === 'loading'}>
        {status === 'loading' ? 'Enviando...' : 'Enviar mensagem'}
      </button>
    </form>
  );
}
