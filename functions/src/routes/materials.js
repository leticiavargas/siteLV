import { Router } from 'express';
import { FieldValue } from 'firebase-admin/firestore';
import { db, storage } from '../admin.js';

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

const router = Router();

function serializeDoc(snap) {
  const data = snap.data();
  return {
    id: snap.id,
    ...data,
    createdAt: data.createdAt?.toDate?.().toISOString() ?? data.createdAt ?? null,
    publishedAt: data.publishedAt?.toDate?.().toISOString() ?? data.publishedAt ?? null,
    updatedAt: data.updatedAt?.toDate?.().toISOString() ?? data.updatedAt ?? null,
  };
}

function filtrar(items, q) {
  return items.filter(
    i =>
      i.title?.toLowerCase().includes(q) ||
      i.description?.toLowerCase().includes(q),
  );
}

// GET /?q=&page=&perPage=&areaId=&status=&visible=
router.get('/', async (req, res) => {
  try {
    const qs = (req.url || '').split('?')[1] || '';
    const { q = '', page = '1', perPage = '10', areaId, status, visible } = Object.fromEntries(new URLSearchParams(qs));
    const snap = await db
      .collection('materials')
      .orderBy('createdAt', 'desc')
      .get();

    let items = snap.docs.map(serializeDoc);

    if (areaId) items = items.filter(i => i.areaId === areaId);
    if (q) items = filtrar(items, q.toLowerCase());
    if (status) items = items.filter(i => i.status === status);
    if (visible !== undefined) {
      const visFiltro = visible === 'true';
      items = items.filter(i => visFiltro ? i.visible === true : i.visible !== true);
    }

    const total = items.length;
    const p = parseInt(page, 10);
    const pp = parseInt(perPage, 10);
    const inicio = (p - 1) * pp;

    res.json({ items: items.slice(inicio, inicio + pp), total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const snap = await db.collection('materials').doc(req.params.id).get();
    if (!snap.exists) return res.status(404).json({ error: 'Não encontrado' });
    res.json(serializeDoc(snap));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const ref = await db.collection('materials').add({
      ...req.body,
      createdAt: FieldValue.serverTimestamp(),
    });
    res.status(201).json({ id: ref.id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const ref = db.collection('materials').doc(req.params.id);
    const snap = await ref.get();
    const dadosAntigos = snap.exists ? snap.data() : {};

    if (snap.exists) {
      const pathsAntigos = extrairPathsDoStorage(dadosAntigos.content ?? '');
      const pathsNovos = extrairPathsDoStorage(req.body.content ?? '');
      const orphans = pathsAntigos.filter(p => !pathsNovos.includes(p));
      if (orphans.length > 0) {
        const bucket = storage.bucket();
        await Promise.all(orphans.map(p => bucket.file(p).delete({ ignoreNotFound: true })));
      }
    }

    const payload = { ...req.body };
    delete payload.publishedAt;

    const statusResultante = payload.status ?? dadosAntigos?.status;
    if (payload.visible === true && statusResultante !== 'published') {
      return res.status(400).json({ error: 'visible só pode ser true quando status for published' });
    }

    if (payload.status === 'published' && !dadosAntigos?.publishedAt) {
      payload.publishedAt = FieldValue.serverTimestamp();
    }

    payload.updatedAt = FieldValue.serverTimestamp();

    await ref.update(payload);
    res.json({ id: req.params.id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const snap = await db.collection('materials').doc(req.params.id).get();
    if (snap.exists) {
      const paths = extrairPathsDoStorage(snap.data().content ?? '');
      if (paths.length > 0) {
        const bucket = storage.bucket();
        await Promise.all(paths.map(p => bucket.file(p).delete({ ignoreNotFound: true })));
      }
    }
    await db.collection('materials').doc(req.params.id).delete();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
