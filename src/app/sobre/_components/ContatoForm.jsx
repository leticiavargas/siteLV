'use client';
import { ContactForm } from '@components/ContactForm';

export function ContatoForm() {
  return (
    <ContactForm
      successTitle='Mensagem enviada!'
      successMessage='Obrigada pelo contato — responderei em breve.'
      buttonLabel='Enviar mensagem'
    />
  );
}
