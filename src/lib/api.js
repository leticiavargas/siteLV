/**
 * Camada de API — chama as Cloud Functions (Express) via HTTP.
 * Server Components usam API_URL (sem NEXT_PUBLIC_).
 * Client Components usam NEXT_PUBLIC_API_URL.
 *
 * Em dev (emulador): http://localhost:5001/leticiavargassite/us-central1/api
 * Em produção:       https://us-central1-leticiavargassite.cloudfunctions.net/api
 */

const BASE = (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, '');

async function req(path, options = {}) {
  if (!BASE) {
    throw new Error('API_URL ou NEXT_PUBLIC_API_URL não configurada');
  }
  
  const url = `${BASE}${path.startsWith('/') ? path : `/${path}`}`;
  console.log('REQ URL:', url);

  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  if (res.status === 204) return null;

  const contentType = res.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    const text = await res.text();

    console.error('API retornou resposta não JSON', {
      url,
      status: res.status,
      contentType,
      preview: text.slice(0, 300),
    });

    throw new Error(`API retornou resposta não JSON: ${url}`);
  }

  const data = await res.json();

  if (!res.ok) {
    console.error('Erro retornado pela API', {
      url,
      status: res.status,
      data,
    });

    throw new Error(data.error ?? `Erro ${res.status}`);
  }

  return data;
}

function qs(params = {}) {
  const p = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v != null && v !== ''),
  );
  const str = new URLSearchParams(p).toString();
  return str ? `?${str}` : '';
}

// ---------------------------------------------------------------------------
// Artigos
// ---------------------------------------------------------------------------

export const articlesApi = {
  list({ q, page, perPage, status, visible, featured } = {}) {
    return req(`/articles${qs({ q, page, perPage, status, visible, featured })}`);
  },
  get(id) {
    return req(`/articles/${id}`);
  },
  create(dados) {
    return req('/articles', { method: 'POST', body: JSON.stringify(dados) });
  },
  update(id, dados) {
    return req(`/articles/${id}`, { method: 'PUT', body: JSON.stringify(dados) });
  },
  delete(id) {
    return req(`/articles/${id}`, { method: 'DELETE' });
  },
};

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

export const faqApi = {
  list({ q, page, perPage, status, visible } = {}) {
    return req(`/faq${qs({ q, page, perPage, status, visible })}`);
  },
  get(id) {
    return req(`/faq/${id}`);
  },
  create(dados) {
    return req('/faq', { method: 'POST', body: JSON.stringify(dados) });
  },
  update(id, dados) {
    return req(`/faq/${id}`, { method: 'PUT', body: JSON.stringify(dados) });
  },
  delete(id) {
    return req(`/faq/${id}`, { method: 'DELETE' });
  },
};

// ---------------------------------------------------------------------------
// Projetos
// ---------------------------------------------------------------------------

export const projectsApi = {
  list({ q, page, perPage, status, visible } = {}) {
    return req(`/projects${qs({ q, page, perPage, status, visible })}`);
  },
  get(id) {
    return req(`/projects/${id}`);
  },
  create(dados) {
    return req('/projects', { method: 'POST', body: JSON.stringify(dados) });
  },
  update(id, dados) {
    return req(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(dados) });
  },
  delete(id) {
    return req(`/projects/${id}`, { method: 'DELETE' });
  },
};

// ---------------------------------------------------------------------------
// Áreas de material
// ---------------------------------------------------------------------------

export const areasApi = {
  list({ q, page, perPage, status, visible } = {}) {
    return req(`/areas${qs({ q, page, perPage, status, visible })}`);
  },
  get(id) {
    return req(`/areas/${id}`);
  },
  create(dados) {
    return req('/areas', { method: 'POST', body: JSON.stringify(dados) });
  },
  update(id, dados) {
    return req(`/areas/${id}`, { method: 'PUT', body: JSON.stringify(dados) });
  },
  delete(id) {
    return req(`/areas/${id}`, { method: 'DELETE' });
  },
};

// ---------------------------------------------------------------------------
// Itens de material
// ---------------------------------------------------------------------------

export const materialItemsApi = {
  list({ q, page, perPage, areaId, status, visible } = {}) {
    return req(`/materials${qs({ q, page, perPage, areaId, status, visible })}`);
  },
  get(id) {
    return req(`/materials/${id}`);
  },
  create(dados) {
    return req('/materials', { method: 'POST', body: JSON.stringify(dados) });
  },
  update(id, dados) {
    return req(`/materials/${id}`, { method: 'PUT', body: JSON.stringify(dados) });
  },
  delete(id) {
    return req(`/materials/${id}`, { method: 'DELETE' });
  },
};

// ---------------------------------------------------------------------------
// Eventos
// ---------------------------------------------------------------------------

export const eventsApi = {
  list({ q, page, perPage, status, visible, future, past } = {}) {
    return req(`/events${qs({ q, page, perPage, status, visible, future, past })}`);
  },
  get(id) {
    return req(`/events/${id}`);
  },
  create(dados) {
    return req('/events', { method: 'POST', body: JSON.stringify(dados) });
  },
  update(id, dados) {
    return req(`/events/${id}`, { method: 'PUT', body: JSON.stringify(dados) });
  },
  delete(id) {
    return req(`/events/${id}`, { method: 'DELETE' });
  },
};

// ---------------------------------------------------------------------------
// Usuários admin
// ---------------------------------------------------------------------------

export const adminUsersApi = {
  list() {
    return req('/adminUsers');
  },
  add(dados) {
    return req('/adminUsers', { method: 'POST', body: JSON.stringify(dados) });
  },
  delete(id) {
    return req(`/adminUsers/${id}`, { method: 'DELETE' });
  },
};
