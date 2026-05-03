'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RichTextEditor } from '@/app/admin/_components/RichTextEditor';
import { TagsInput } from '@/app/admin/_components/TagsInput';
import { ImageUpload } from '@/app/admin/_components/ImageUpload';
import { articlesApi } from '@/lib/api';
import './styles.css';

const EMPTY_FORM = {
  title: '',
  excerpt: '',
  content: '',
  tags: [],
  iconName: '',
  imageUrl: '',
  status: 'draft',
  visible: false,
  featured: false,
  publishedAt: null,
};

export function ArticleForm({ artigoId, initialData }) {
  const [form, setForm] = useState(initialData ?? EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const isEditing = Boolean(artigoId);

  function setField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isEditing) {
        await articlesApi.update(artigoId, form);
      } else {
        await articlesApi.create(form);
      }
      router.push('/admin/artigos');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  async function handlePublish() {
    setLoading(true);
    setError(null);
    try {
      await articlesApi.update(artigoId, { status: 'published', visible: false });
      router.push('/admin/artigos');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <form className="articleForm" onSubmit={handleSubmit} noValidate>
      {error && (
        <div className="articleFormError" role="alert">
          <span className="material-symbols-outlined">error</span>
          {error}
        </div>
      )}

      <div className="articleFormMain">
        <div className="articleFormCard">
          <div className="articleFormGroup">
            <label htmlFor="title" className="articleFormLabel">
              Título <span className="articleFormRequired" aria-hidden="true">*</span>
            </label>
            <input
              id="title"
              type="text"
              className="articleFormInput"
              value={form.title}
              onChange={e => setField('title', e.target.value)}
              placeholder="Título do artigo"
              required
            />
          </div>

          <div className="articleFormGroup">
            <label htmlFor="excerpt" className="articleFormLabel">Lead / Resumo</label>
            <textarea
              id="excerpt"
              className="articleFormTextarea"
              value={form.excerpt}
              onChange={e => setField('excerpt', e.target.value)}
              placeholder="Resumo exibido no card e no topo do artigo"
              rows={3}
            />
            <span className={`articleFormCharCount${form.excerpt.length > 120 ? ' articleFormCharCount--over' : ''}`}>
              {form.excerpt.length} / 120 caracteres
            </span>
          </div>

          <div className="articleFormGroup">
            <label className="articleFormLabel">Conteúdo</label>
            <RichTextEditor
              value={form.content}
              onChange={val => setField('content', val)}
              pasta="artigos"
            />
          </div>
        </div>
      </div>

      <aside className="articleFormSidebar">
        <div className="articleFormCard">
          <div className="articleFormGroup">
            <label htmlFor="status" className="articleFormLabel">Status</label>
            <select
              id="status"
              className="articleFormSelect"
              value={form.status}
              onChange={e => {
                const novoStatus = e.target.value;
                setField('status', novoStatus);
                if (novoStatus !== 'published') setField('visible', false);
              }}
            >
              <option value="draft">Rascunho</option>
              <option value="ready">Pronto para revisar</option>
              <option value="published">Publicado</option>
            </select>
          </div>

          <div className="articleFormGroup">
            <label htmlFor="iconName" className="articleFormLabel">Ícone</label>
            <div className="articleFormIconWrapper">
              {form.iconName && (
                <span className="material-symbols-outlined articleFormIconPreview">
                  {form.iconName}
                </span>
              )}
              <input
                id="iconName"
                type="text"
                className="articleFormInput"
                value={form.iconName}
                onChange={e => setField('iconName', e.target.value)}
                placeholder="Ex: code, bolt, rocket_launch"
              />
            </div>
            <p className="articleFormHint">
              Nome do ícone do{' '}
              <a
                href="https://fonts.google.com/icons"
                target="_blank"
                rel="noopener noreferrer"
                className="articleFormHintLink"
              >
                Material Symbols
              </a>
              . Exibido no círculo do card.
            </p>
          </div>

          <div className="articleFormGroup">
            <label className="articleFormLabel">Imagem de capa</label>
            <ImageUpload
              value={form.imageUrl}
              onChange={url => setField('imageUrl', url)}
              pasta="artigos"
            />
          </div>

          <div className="articleFormGroup">
            <label className="articleFormLabel">Tags</label>
            <TagsInput
              value={form.tags}
              onChange={val => setField('tags', val)}
            />
          </div>

          <div className="articleFormGroup">
            <span className="articleFormLabel">Visibilidade</span>
            <label className="articleFormToggle">
              <input
                type="checkbox"
                checked={form.visible}
                disabled={form.status !== 'published'}
                onChange={e => setField('visible', e.target.checked)}
              />
              <span className="articleFormToggleTrack">
                <span className="articleFormToggleThumb" />
              </span>
              <span className="articleFormToggleLabel">
                {form.visible
                  ? <><span className="material-symbols-outlined">visibility</span> Visível</>
                  : <><span className="material-symbols-outlined">visibility_off</span> Oculto</>
                }
              </span>
            </label>
          </div>
        </div>

        <div className="articleFormActions">
          {isEditing && form.status !== 'published' && (
            <button
              type="button"
              className="articleFormPublish"
              disabled={loading}
              onClick={handlePublish}
            >
              <span className="material-symbols-outlined">publish</span>
              Publicar agora
            </button>
          )}
          <button
            type="submit"
            className="articleFormSubmit"
            disabled={loading}
          >
            {loading
              ? 'Salvando...'
              : isEditing
                ? 'Salvar alterações'
                : 'Criar artigo'}
          </button>
          <a href="/admin/artigos" className="articleFormCancel">
            Cancelar
          </a>
        </div>
      </aside>
    </form>
  );
}
