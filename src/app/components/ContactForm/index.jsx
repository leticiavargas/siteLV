'use client';
import { useState } from 'react';
import './styles.css';

export function ContactForm({
  title,
  successTitle = 'Mensagem enviada!',
  successMessage = 'Obrigada pelo contato — responderei em breve.',
  buttonLabel = 'Enviar mensagem',
  showNome = true,
  hiddenNome = '',
}) {
  const [form, setForm] = useState({ nome: '', email: '', mensagem: '' });
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  function setField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const payload = {
      ...form,
      nome: showNome ? form.nome : hiddenNome,
    };

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
          name: payload.nome,
          email: payload.email,
          message: payload.mensagem,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message ?? 'Erro ao enviar.');
      setStatus('success');
      setForm({ nome: '', email: '', mensagem: '' });
    } catch (err) {
      setErrorMsg(err.message);
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className='contactFormSuccess'>
        <span className='material-symbols-outlined contactFormSuccessIcon'>check_circle</span>
        <p className='contactFormSuccessTitle'>{successTitle}</p>
        <p className='contactFormSuccessText'>{successMessage}</p>
        <button type='button' className='contactFormBtn' onClick={() => setStatus('idle')}>
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  return (
    <form className='contactForm' onSubmit={handleSubmit} noValidate>
      {title && <p className='contactFormTitle'>{title}</p>}
      {status === 'error' && (
        <p className='contactFormError' role='alert'>{errorMsg}</p>
      )}

      {showNome && (
        <div className='contactFormGroup'>
          <label htmlFor='contactNome'>Nome</label>
          <div className='contactFormField'>
            <input
              id='contactNome'
              name='nome'
              type='text'
              placeholder='Seu nome'
              required
              value={form.nome}
              onChange={e => setField('nome', e.target.value)}
              disabled={status === 'loading'}
            />
          </div>
        </div>
      )}

      <div className='contactFormGroup'>
        <label htmlFor='contactEmail'>E-mail</label>
        <div className='contactFormField'>
          <input
            id='contactEmail'
            name='email'
            type='email'
            placeholder='seu@email.com'
            required
            value={form.email}
            onChange={e => setField('email', e.target.value)}
            disabled={status === 'loading'}
          />
        </div>
      </div>

      <div className='contactFormGroup'>
        <label htmlFor='contactMensagem'>Mensagem</label>
        <div className='contactFormField'>
          <textarea
            id='contactMensagem'
            name='mensagem'
            rows={5}
            placeholder='Escreva sua mensagem...'
            required
            value={form.mensagem}
            onChange={e => setField('mensagem', e.target.value)}
            disabled={status === 'loading'}
          />
        </div>
      </div>

      <button type='submit' className='contactFormBtn' disabled={status === 'loading'}>
        {status === 'loading' ? 'Enviando...' : buttonLabel}
      </button>
    </form>
  );
}
