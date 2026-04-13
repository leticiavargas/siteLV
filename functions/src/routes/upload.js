import { Router } from 'express';
import path from 'path';
import { storage } from '../admin.js';

const router = Router();

const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const TAMANHO_MAX = 8 * 1024 * 1024; // 8MB em bytes

// POST /upload
// Body JSON: { base64: string, contentType: string, filename: string, pasta?: string }
// Retorna: { url: string }
router.post('/', async (req, res) => {
  try {
    const { base64, contentType, filename = 'imagem', pasta = 'misc' } = req.body;

    if (!base64 || !contentType) {
      return res.status(400).json({ error: 'base64 e contentType são obrigatórios' });
    }

    if (!TIPOS_PERMITIDOS.includes(contentType)) {
      return res.status(400).json({ error: `Tipo não permitido. Use: ${TIPOS_PERMITIDOS.join(', ')}` });
    }

    const buffer = Buffer.from(base64, 'base64');

    if (buffer.byteLength > TAMANHO_MAX) {
      return res.status(400).json({ error: 'Imagem muito grande (máximo 8MB)' });
    }

    const ext = path.extname(filename) || `.${contentType.split('/')[1].replace('jpeg', 'jpg')}`;
    const storagePath = `${pasta}/${crypto.randomUUID()}${ext}`;
    const token = crypto.randomUUID();

    const bucket = storage.bucket();
    const fileRef = bucket.file(storagePath);

    await fileRef.save(buffer, {
      contentType,
      metadata: {
        metadata: {
          firebaseStorageDownloadTokens: token,
        },
      },
    });

    const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(storagePath)}?alt=media&token=${token}`;

    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
