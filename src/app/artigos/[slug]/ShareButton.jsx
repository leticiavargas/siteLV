'use client';
import { useState } from 'react';
import { Icon } from '../../components/Icon';

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ url });
        return;
      } catch {
        // usuário cancelou ou share falhou — tenta clipboard
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button className="shareBtn" type="button" onClick={handleShare}>
      <Icon iconName={copied ? 'check' : 'link'} />
      {copied ? 'Link copiado!' : 'Compartilhar'}
    </button>
  );
}
