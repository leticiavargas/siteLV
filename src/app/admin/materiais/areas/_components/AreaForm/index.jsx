'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { areasApi } from '@/lib/api';
import './styles.css';

const EMPTY_FORM = {
  title: '',
  slug: '',
  iconName: '',
  description: '',
  status: 'draft',
  visible: true,
};

function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function AreaForm({ areaId, initialData }) {
  const [form, setForm] = useState(initialData ?? EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const isEditing = Boolean(areaId);

  function setField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handleTitleChange(e) {
    const title = e.target.value;
    setForm(prev => ({
      ...prev,
      title,
      slug: prev.slug === slugify(prev.title) ? slugify(title) : prev.slug,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isEditing) {
        await areasApi.update(areaId, form);
      } else {
        await areasApi.create(form);
      }
      router.push('/admin/materiais');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <form className="areaForm" onSubmit={handleSubmit} noValidate>
      {error && (
        <div className="areaFormError" role="alert">
          <span className="material-symbols-outlined">error</span>
          {error}
        </div>
      )}

      <div className="areaFormMain">
        <div className="areaFormCard">
          <div className="areaFormGroup">
            <label htmlFor="title" className="areaFormLabel">
              Título <span className="areaFormRequired" aria-hidden="true">*</span>
            </label>
            <input
              id="title"
              type="text"
              className="areaFormInput"
              value={form.title}
              onChange={handleTitleChange}
              placeholder="Ex: React, CSS, Git & Versionamento"
              required
            />
          </div>

          <div className="areaFormGroup">
            <label htmlFor="slug" className="areaFormLabel">Slug</label>
            <div className="areaFormSlugWrapper">
              <span className="areaFormSlugPrefix">#</span>
              <input
                id="slug"
                type="text"
                className="areaFormInput areaFormSlugInput"
                value={form.slug}
                onChange={e => setField('slug', e.target.value)}
                placeholder="react"
              />
            </div>
            <p className="areaFormHint">Usado como âncora na página pública (#slug).</p>
          </div>

          <div className="areaFormGroup">
            <label htmlFor="description" className="areaFormLabel">Descrição</label>
            <textarea
              id="description"
              className="areaFormTextarea"
              value={form.description}
              onChange={e => setField('description', e.target.value)}
              placeholder="Descrição breve exibida no card da área"
              rows={3}
            />
          </div>

          <div className="areaFormGroup">
            <label htmlFor="iconName" className="areaFormLabel">Ícone</label>
            <div className="areaFormIconWrapper">
              {form.iconName && (
                <span className="material-symbols-outlined areaFormIconPreview">
                  {form.iconName}
                </span>
              )}
              <input
                id="iconName"
                type="text"
                className="areaFormInput"
                value={form.iconName}
                onChange={e => setField('iconName', e.target.value)}
                placeholder="Ex: code, palette, storage"
              />
            </div>
            <p className="areaFormHint">
              Nome do ícone do{' '}
              <a
                href="https://fonts.google.com/icons"
                target="_blank"
                rel="noopener noreferrer"
                className="areaFormHintLink"
              >
                Material Symbols
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      <aside className="areaFormSidebar">
        <div className="areaFormCard">
          <div className="areaFormGroup">
            <label htmlFor="status" className="areaFormLabel">Status</label>
            <select
              id="status"
              className="areaFormSelect"
              value={form.status}
              onChange={e => setField('status', e.target.value)}
            >
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
            </select>
          </div>

          <div className="areaFormGroup">
            <span className="areaFormLabel">Visibilidade</span>
            <label className="areaFormToggle">
              <input
                type="checkbox"
                checked={form.visible}
                onChange={e => setField('visible', e.target.checked)}
              />
              <span className="areaFormToggleTrack">
                <span className="areaFormToggleThumb" />
              </span>
              <span className="areaFormToggleLabel">
                {form.visible
                  ? <><span className="material-symbols-outlined">visibility</span> Visível</>
                  : <><span className="material-symbols-outlined">visibility_off</span> Oculto</>
                }
              </span>
            </label>
          </div>
        </div>

        <div className="areaFormActions">
          <button
            type="submit"
            className="areaFormSubmit"
            disabled={loading}
          >
            {loading
              ? 'Salvando...'
              : isEditing
                ? 'Salvar alterações'
                : 'Criar área'}
          </button>
          <a href="/admin/materiais" className="areaFormCancel">
            Cancelar
          </a>
        </div>
      </aside>
    </form>
  );
}
