'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TagsInput } from '@/app/admin/_components/TagsInput';
import { RichTextEditor } from '@/app/admin/_components/RichTextEditor';
import { materialItemsApi } from '@/lib/api';
import './styles.css';

const EMPTY_FORM = {
  title: '',
  description: '',
  content: '',
  type: 'Artigo',
  iconName: '',
  href: '',
  areaId: '',
  status: 'draft',
  visible: true,
};

const TIPOS = ['Artigo', 'Guia', 'Vídeo'];

export function MaterialItemForm({ itemId, initialData, areas = [] }) {
  const [form, setForm] = useState(initialData ?? EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const isEditing = Boolean(itemId);

  function setField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isEditing) {
        await materialItemsApi.update(itemId, form);
      } else {
        await materialItemsApi.create(form);
      }
      router.push('/admin/materiais');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <form className="materialItemForm" onSubmit={handleSubmit} noValidate>
      {error && (
        <div className="materialItemFormError" role="alert">
          <span className="material-symbols-outlined">error</span>
          {error}
        </div>
      )}

      <div className="materialItemFormMain">
        <div className="materialItemFormCard">
          <div className="materialItemFormGroup">
            <label htmlFor="title" className="materialItemFormLabel">
              Título <span className="materialItemFormRequired" aria-hidden="true">*</span>
            </label>
            <input
              id="title"
              type="text"
              className="materialItemFormInput"
              value={form.title}
              onChange={e => setField('title', e.target.value)}
              placeholder="Título do material"
              required
            />
          </div>

          <div className="materialItemFormGroup">
            <label htmlFor="description" className="materialItemFormLabel">Descrição</label>
            <textarea
              id="description"
              className="materialItemFormTextarea"
              value={form.description}
              onChange={e => setField('description', e.target.value)}
              placeholder="Descrição breve exibida no card do material"
              rows={3}
            />
          </div>

          <div className="materialItemFormGroup">
            <label htmlFor="href" className="materialItemFormLabel">URL do recurso externo</label>
            <input
              id="href"
              type="url"
              className="materialItemFormInput"
              value={form.href}
              onChange={e => setField('href', e.target.value)}
              placeholder="https://..."
            />
            <p className="materialItemFormHint">Opcional. Se preenchido, exibe botão de link externo na página do material.</p>
          </div>

          <div className="materialItemFormGroup">
            <span className="materialItemFormLabel">Conteúdo inline</span>
            <p className="materialItemFormHint">Opcional. Se preenchido, o material terá uma página própria com este conteúdo.</p>
            <RichTextEditor
              value={form.content}
              onChange={value => setField('content', value)}
              pasta="materiais"
            />
          </div>

          <div className="materialItemFormGroup">
            <label htmlFor="iconName" className="materialItemFormLabel">Ícone</label>
            <div className="materialItemFormIconWrapper">
              {form.iconName && (
                <span className="material-symbols-outlined materialItemFormIconPreview">
                  {form.iconName}
                </span>
              )}
              <input
                id="iconName"
                type="text"
                className="materialItemFormInput"
                value={form.iconName}
                onChange={e => setField('iconName', e.target.value)}
                placeholder="Ex: rocket_launch, bolt, grid_view"
              />
            </div>
            <p className="materialItemFormHint">
              Nome do ícone do{' '}
              <a
                href="https://fonts.google.com/icons"
                target="_blank"
                rel="noopener noreferrer"
                className="materialItemFormHintLink"
              >
                Material Symbols
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      <aside className="materialItemFormSidebar">
        <div className="materialItemFormCard">
          <div className="materialItemFormGroup">
            <label htmlFor="areaId" className="materialItemFormLabel">
              Área <span className="materialItemFormRequired" aria-hidden="true">*</span>
            </label>
            <select
              id="areaId"
              className="materialItemFormSelect"
              value={form.areaId}
              onChange={e => setField('areaId', e.target.value)}
              required
            >
              <option value="">Selecionar área</option>
              {areas.map(area => (
                <option key={area.id} value={area.id}>{area.title}</option>
              ))}
            </select>
          </div>

          <div className="materialItemFormGroup">
            <label htmlFor="type" className="materialItemFormLabel">Tipo</label>
            <select
              id="type"
              className="materialItemFormSelect"
              value={form.type}
              onChange={e => setField('type', e.target.value)}
            >
              {TIPOS.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          <div className="materialItemFormGroup">
            <label htmlFor="status" className="materialItemFormLabel">Status</label>
            <select
              id="status"
              className="materialItemFormSelect"
              value={form.status}
              onChange={e => setField('status', e.target.value)}
            >
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
            </select>
          </div>

          <div className="materialItemFormGroup">
            <span className="materialItemFormLabel">Visibilidade</span>
            <label className="materialItemFormToggle">
              <input
                type="checkbox"
                checked={form.visible}
                onChange={e => setField('visible', e.target.checked)}
              />
              <span className="materialItemFormToggleTrack">
                <span className="materialItemFormToggleThumb" />
              </span>
              <span className="materialItemFormToggleLabel">
                {form.visible
                  ? <><span className="material-symbols-outlined">visibility</span> Visível</>
                  : <><span className="material-symbols-outlined">visibility_off</span> Oculto</>
                }
              </span>
            </label>
          </div>
        </div>

        <div className="materialItemFormActions">
          <button
            type="submit"
            className="materialItemFormSubmit"
            disabled={loading}
          >
            {loading
              ? 'Salvando...'
              : isEditing
                ? 'Salvar alterações'
                : 'Criar material'}
          </button>
          <a href="/admin/materiais" className="materialItemFormCancel">
            Cancelar
          </a>
        </div>
      </aside>
    </form>
  );
}
