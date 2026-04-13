'use client';
import { useRef, useState } from 'react';
import './styles.css';

async function uploadImagem(file, pasta) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const base64 = e.target.result.split(',')[1];
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64, contentType: file.type, filename: file.name, pasta }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Erro no upload');
        resolve(data.url);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Erro ao ler o arquivo'));
    reader.readAsDataURL(file);
  });
}

/**
 * Campo de upload de imagem com preview.
 * @param {string}   value    — URL atual da imagem
 * @param {function} onChange — chamado com a nova URL (string) ou '' para limpar
 * @param {string}   pasta    — subpasta no Firebase Storage (ex: 'projetos', 'eventos')
 */
export function ImageUpload({ value, onChange, pasta = 'misc' }) {
  const [uploading, setUploading] = useState(false);
  const [erro, setErro] = useState('');
  const inputRef = useRef(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setErro('');
    setUploading(true);
    try {
      const url = await uploadImagem(file, pasta);
      onChange(url);
    } catch (err) {
      setErro(err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    // Simula o evento para reusar handleFile
    handleFile({ target: { files: [file], value: '' } });
  }

  if (value) {
    return (
      <div className="imageUploadPreview">
        <img src={value} alt="Preview da imagem" className="imageUploadPreviewImg" />
        <div className="imageUploadPreviewActions">
          <button
            type="button"
            className="imageUploadBtn"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            <span className="material-symbols-outlined">
              {uploading ? 'hourglass_top' : 'swap_horiz'}
            </span>
            {uploading ? 'Enviando…' : 'Trocar imagem'}
          </button>
          <button
            type="button"
            className="imageUploadBtn imageUploadBtn--danger"
            onClick={() => onChange('')}
            disabled={uploading}
          >
            <span className="material-symbols-outlined">delete</span>
            Remover
          </button>
        </div>
        {erro && <p className="imageUploadErro" role="alert">{erro}</p>}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="imageUploadHiddenInput"
          onChange={handleFile}
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>
    );
  }

  return (
    <div
      className={`imageUploadZone${uploading ? ' imageUploadZone--loading' : ''}`}
      onDrop={handleDrop}
      onDragOver={e => e.preventDefault()}
      onClick={() => !uploading && inputRef.current?.click()}
      role="button"
      tabIndex={0}
      aria-label="Clique ou arraste uma imagem para fazer upload"
      onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
    >
      <span className="material-symbols-outlined imageUploadZoneIcon">
        {uploading ? 'hourglass_top' : 'add_photo_alternate'}
      </span>
      <span className="imageUploadZoneText">
        {uploading ? 'Enviando imagem…' : 'Clique ou arraste uma imagem'}
      </span>
      <span className="imageUploadZoneHint">JPEG, PNG, WebP ou GIF · máx. 8 MB</span>
      {erro && <p className="imageUploadErro" role="alert">{erro}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="imageUploadHiddenInput"
        onChange={handleFile}
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  );
}
