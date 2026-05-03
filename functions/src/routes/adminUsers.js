import { Router } from 'express';
import { FieldValue } from 'firebase-admin/firestore';
import { db } from '../admin.js';

const router = Router();

// GET /check?email= — verifica se email tem acesso (usado pelo signIn callback)
router.get('/check', async (req, res) => {
  try {
    const qs = (req.url || '').split('?')[1] || '';
    const { email } = Object.fromEntries(new URLSearchParams(qs));
    if (!email) return res.status(400).json({ error: 'email obrigatório' });

    const snap = await db.collection('adminUsers')
      .where('email', '==', email)
      .limit(1)
      .get();

    res.json({ allowed: !snap.empty });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET / — lista todos os usuários admin
router.get('/', async (_req, res) => {
  try {
    const snap = await db.collection('adminUsers')
      .orderBy('createdAt', 'desc')
      .get();

    const items = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.().toISOString() ?? null,
    }));

    res.json({ items, total: items.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST / — adiciona usuário
router.post('/', async (req, res) => {
  try {
    const { email, nome } = req.body;
    if (!email) return res.status(400).json({ error: 'email obrigatório' });

    const existing = await db.collection('adminUsers')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (!existing.empty) {
      return res.status(409).json({ error: 'Este email já tem acesso' });
    }

    const ref = await db.collection('adminUsers').add({
      email,
      nome: nome || '',
      createdAt: FieldValue.serverTimestamp(),
    });

    res.status(201).json({ id: ref.id, email, nome: nome || '' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /:id — remove usuário
router.delete('/:id', async (req, res) => {
  try {
    const snap = await db.collection('adminUsers').doc(req.params.id).get();
    if (!snap.exists) return res.status(404).json({ error: 'Não encontrado' });

    await snap.ref.delete();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
