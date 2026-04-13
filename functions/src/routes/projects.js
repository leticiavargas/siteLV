import { makeRouter } from './makeRouter.js';
import { storage } from '../admin.js';

function filtrar(items, q) {
  return items.filter(
    i =>
      i.title?.toLowerCase().includes(q) ||
      i.description?.toLowerCase().includes(q) ||
      i.tags?.some(t => t.toLowerCase().includes(q)),
  );
}

function extrairPathDoStorage(url = '') {
  const bucket = storage.bucket();
  const prefixo = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/`;
  if (!url.startsWith(prefixo)) return null;
  const encodedPath = url.slice(prefixo.length).split('?')[0];
  return decodeURIComponent(encodedPath);
}

async function aoAtualizar(dadosAntigos, dadosNovos) {
  const urlAntiga = dadosAntigos.imageUrl;
  const urlNova = dadosNovos.imageUrl;
  if (!urlAntiga || urlAntiga === urlNova) return;
  const path = extrairPathDoStorage(urlAntiga);
  if (!path) return;
  await storage.bucket().file(path).delete({ ignoreNotFound: true });
}

async function aoExcluir(dados) {
  const path = extrairPathDoStorage(dados.imageUrl ?? '');
  if (!path) return;
  await storage.bucket().file(path).delete({ ignoreNotFound: true });
}

export default makeRouter('projects', filtrar, { aoAtualizar, aoExcluir });
