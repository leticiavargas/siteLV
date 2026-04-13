/**
 * API route para envio do formulário de contato via Resend.
 *
 * Variáveis de ambiente necessárias (.env.local):
 *   RESEND_API_KEY=re_...          (chave da API do Resend — resend.com)
 *   CONTATO_EMAIL=leticia@seudominio.com  (e-mail que receberá as mensagens)
 *   CONTATO_FROM=Site <noreply@seudominio.com>  (deve ser um domínio verificado no Resend)
 */
export async function POST(request) {
  const { nome, email, mensagem } = await request.json();

  if (!nome || !email || !mensagem) {
    return Response.json({ error: 'Preencha todos os campos.' }, { status: 400 });
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.CONTATO_FROM ?? 'Site <onboarding@resend.dev>',
      to: process.env.CONTATO_EMAIL,
      reply_to: email,
      subject: `Nova mensagem de ${nome}`,
      text: `Nome: ${nome}\nE-mail: ${email}\n\n${mensagem}`,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error('[contato] Resend error:', err);
    return Response.json({ error: 'Não foi possível enviar a mensagem. Tente novamente.' }, { status: 500 });
  }

  return Response.json({ ok: true });
}
