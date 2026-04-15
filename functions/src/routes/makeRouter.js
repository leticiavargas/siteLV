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
  };
}

export function makeRouter(colecao, filtrar, { aoExcluir, aoAtualizar } = {}) {
  const router = Router();

  // GET /?q=&page=&perPage=
  router.get('/', async (req, res) => {
    try {
      const { q = '', page = '1', perPage = '10' } = req.query;
      const snap = await db
        .collection(colecao)
        .orderBy('createdAt', 'desc')
        .get();

      let items = snap.docs.map(serializeDoc);

      if (q) items = filtrar(items, q.toLowerCase());
      if (req.query.status) items = items.filter(i => i.status === req.query.status);
      if (req.query.visible !== undefined) {
        const visFiltro = req.query.visible === 'true';
        // visible=true → inclui itens visíveis (true) e sem o campo (undefined = visível por padrão)
        // visible=false → inclui somente itens explicitamente ocultos
        items = items.filter(i => visFiltro ? i.visible !== false : i.visible === false);
      }
      if (req.query.featured !== undefined) {
        const featFiltro = req.query.featured === 'true';
        items = items.filter(i => featFiltro ? i.featured === true : i.featured !== true);
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

      const needsSnap =
        aoAtualizar ||
        (payload.status === 'published' && !payload.publishedAt);

      let dadosAntigos = null;
      if (needsSnap) {
        const snap = await ref.get();
        dadosAntigos = snap.data() ?? {};
      }

      // Registra publishedAt na primeira vez que status muda para 'published'
      if (payload.status === 'published' && !payload.publishedAt) {
        if (!dadosAntigos?.publishedAt) {
          payload.publishedAt = FieldValue.serverTimestamp();
        }
      }

      if (aoAtualizar && dadosAntigos) {
        await aoAtualizar(dadosAntigos, req.body);
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
