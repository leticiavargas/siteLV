import { makeRouter } from './makeRouter.js';
import { storage } from '../admin.js';

function filtrar(items, q) {
  return items.filter(
    i =>
      i.title?.toLowerCase().includes(q) ||
      i.excerpt?.toLowerCase().includes(q) ||
      i.tags?.some(t => t.toLowerCase().includes(q)),
  );
}

function extrairPathsDoStorage(html = '') {
  const bucket = storage.bucket();
  const prefixo = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/`;
  const regex = /<img[^>]+src="([^"]+)"/g;
  const paths = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    const src = match[1];
    if (src.startsWith(prefixo)) {
      const encodedPath = src.slice(prefixo.length).split('?')[0];
      paths.push(decodeURIComponent(encodedPath));
    }
  }
  return paths;
}

async function aoExcluir(dados) {
  const paths = extrairPathsDoStorage(dados.content ?? '');
  if (paths.length === 0) return;
  const bucket = storage.bucket();
  await Promise.all(paths.map(p => bucket.file(p).delete({ ignoreNotFound: true })));
}

async function aoAtualizar(dadosAntigos, dadosNovos) {
  const pathsAntigos = extrairPathsDoStorage(dadosAntigos.content ?? '');
  const pathsNovos = extrairPathsDoStorage(dadosNovos.content ?? '');
  const orphans = pathsAntigos.filter(p => !pathsNovos.includes(p));
  if (orphans.length === 0) return;
  const bucket = storage.bucket();
  await Promise.all(orphans.map(p => bucket.file(p).delete({ ignoreNotFound: true })));
}

export default makeRouter('articles', filtrar, { aoExcluir, aoAtualizar });
