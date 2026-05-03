import { Router } from 'express';
import { FieldValue } from 'firebase-admin/firestore';
import { db } from '../admin.js';

/**
 * Cria um router Express com CRUD completo para uma coleção Firestore.
 * @param {string} colecao — nome da coleção no Firestore
 * @param {(items: object[], q: string) => object[]} filtrar — fn de busca textual
 * @param {{ aoExcluir?: (dados: object) => Promise<void> }} opts — hooks opcionais
 */
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

export function makeRouter(colecao, filtrar, { aoExcluir, aoAtualizar } = {}) {
  const router = Router();

  // GET /?q=&page=&perPage=
  router.get('/', async (req, res) => {
    try {
      const qs = (req.url || '').split('?')[1] || '';
      const query = Object.fromEntries(new URLSearchParams(qs));

      const {
        q = '',
        page = '1',
        perPage = '10',
        status,
        visible,
        featured,
      } = query;

      const snap = await db.collection(colecao).get();

      let items = snap.docs
        .map(serializeDoc)
        .sort((a, b) => {
          const da = a.publishedAt ?? a.createdAt ?? '';
          const db2 = b.publishedAt ?? b.createdAt ?? '';
          return da < db2 ? 1 : da > db2 ? -1 : 0;
        });

      const termo = String(q).toLowerCase().trim();

      if (termo) {
        items = filtrar(items, termo.toLowerCase());
      }

      if (status) {
        items = items.filter(i => i.status === status);
      }

      if (visible !== undefined) {
        const visFiltro = visible === 'true';
        items = items.filter(i => visFiltro ? i.visible === true : i.visible !== true);
      }

      if (featured !== undefined) {
        const featFiltro = featured === 'true';
        items = items.filter(i => featFiltro ? i.featured === true : i.featured !== true);
      }


    const total = items.length;
    const p = Math.max(parseInt(page, 10) || 1, 1);
    const pp = Math.max(parseInt(perPage, 10) || 10, 1);
    const inicio = (p - 1) * pp;

    res.json({ items: items.slice(inicio, inicio + pp), total });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /:id
  router.get('/:id', async (req, res) => {
    try {
      const snap = await db.collection(colecao).doc(req.params.id).get();
      if (!snap.exists) return res.status(404).json({ error: 'Não encontrado' });
      res.json(serializeDoc(snap));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST /
  router.post('/', async (req, res) => {
    try {
      const ref = await db.collection(colecao).add({
        ...req.body,
        createdAt: FieldValue.serverTimestamp(),
      });
      res.status(201).json({ id: ref.id, ...req.body });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // PUT /:id
  router.put('/:id', async (req, res) => {
    try {
      const ref = db.collection(colecao).doc(req.params.id);
      const payload = { ...req.body };

      // publishedAt é sempre controlado pelo servidor — nunca aceita do cliente
      delete payload.publishedAt;

      const needsSnap = aoAtualizar || payload.status === 'published' || payload.visible === true;

      let dadosAntigos = null;
      if (needsSnap) {
        const snap = await ref.get();
        dadosAntigos = snap.data() ?? {};
      }

      // Rejeita visible: true se o status resultante não for published
      const statusResultante = payload.status ?? dadosAntigos?.status;
      if (payload.visible === true && statusResultante !== 'published') {
        return res.status(400).json({ error: 'visible só pode ser true quando status for published' });
      }

      // Grava publishedAt apenas na primeira publicação
      if (payload.status === 'published' && !dadosAntigos?.publishedAt) {
        payload.publishedAt = FieldValue.serverTimestamp();
      }

      payload.updatedAt = FieldValue.serverTimestamp();

      if (aoAtualizar && dadosAntigos) {
        await aoAtualizar(dadosAntigos, req.body, req.params.id);
      }

      await ref.update(payload);
      res.json({ id: req.params.id, ...req.body });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // DELETE /:id
  router.delete('/:id', async (req, res) => {
    try {
      const snap = await db.collection(colecao).doc(req.params.id).get();
      if (!snap.exists) return res.status(404).json({ error: 'Não encontrado' });

      if (aoExcluir) await aoExcluir(snap.data());

      await snap.ref.delete();
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}
