import { Router } from 'express';
import { FieldValue } from 'firebase-admin/firestore';
import { db, storage } from '../admin.js';

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

// GET /?q=&future=true&status=&visible=&page=&perPage=
router.get('/', async (req, res) => {
  try {
    const qs = (req.url || '').split('?')[1] || '';
    const { q = '', page = '1', perPage = '10', future, past, status, visible } = Object.fromEntries(new URLSearchParams(qs));

    const snap = await db.collection('events').orderBy('date', 'asc').get();

    let items = snap.docs.map(serializeDoc);

    if (q) {
      const ql = q.toLowerCase();
      items = items.filter(i =>
        i.title?.toLowerCase().includes(ql) ||
        i.location?.toLowerCase().includes(ql),
      );
    }

    if (status) {
      items = items.filter(i => i.status === status);
    }

    if (visible !== undefined) {
      const visFiltro = visible === 'true';
      items = items.filter(i => i.visible === visFiltro);
    }

    if (future === 'true') {
      const hoje = new Date().toISOString().slice(0, 10);
      items = items.filter(i => i.date >= hoje);
    }

    if (past === 'true') {
      const hoje = new Date().toISOString().slice(0, 10);
      items = items.filter(i => i.date < hoje);
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

// GET /:id
router.get('/:id', async (req, res) => {
  try {
    const snap = await db.collection('events').doc(req.params.id).get();
    if (!snap.exists) return res.status(404).json({ error: 'Não encontrado' });
    res.json(serializeDoc(snap));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /
router.post('/', async (req, res) => {
  try {
    const ref = await db.collection('events').add({
      ...req.body,
      createdAt: FieldValue.serverTimestamp(),
    });
    res.status(201).json({ id: ref.id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function extrairPathDoStorage(url = '') {
  const bucket = storage.bucket();
  const prefixo = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/`;
  if (!url.startsWith(prefixo)) return null;
  const encodedPath = url.slice(prefixo.length).split('?')[0];
  return decodeURIComponent(encodedPath);
}

// PUT /:id
router.put('/:id', async (req, res) => {
  try {
    const ref = db.collection('events').doc(req.params.id);
    const snap = await ref.get();

    const dadosAntigos = snap.exists ? snap.data() : {};

    if (snap.exists) {
      const urlAntiga = dadosAntigos.imageUrl;
      const urlNova = req.body.imageUrl;
      if (urlAntiga && urlAntiga !== urlNova) {
        const path = extrairPathDoStorage(urlAntiga);
        if (path) await storage.bucket().file(path).delete({ ignoreNotFound: true });
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

// DELETE /:id
router.delete('/:id', async (req, res) => {
  try {
    const snap = await db.collection('events').doc(req.params.id).get();
    if (!snap.exists) return res.status(404).json({ error: 'Não encontrado' });

    const path = extrairPathDoStorage(snap.data().imageUrl ?? '');
    if (path) await storage.bucket().file(path).delete({ ignoreNotFound: true });

    await snap.ref.delete();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
