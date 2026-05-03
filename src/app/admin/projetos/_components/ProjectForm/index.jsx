'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TagsInput } from '@/app/admin/_components/TagsInput';
import { ImageUpload } from '@/app/admin/_components/ImageUpload';
import { RichTextEditor } from '@/app/admin/_components/RichTextEditor';
import { projectsApi } from '@/lib/api';
import './styles.css';

const EMPTY_FORM = {
  title: '',
  description: '',
  details: '',
  tags: [],
  iconName: '',
  liveHref: '',
  repoHref: '',
  imageUrl: '',
  status: 'draft',
  visible: false,
};

export function ProjectForm({ projectId, initialData }) {
  const [form, setForm] = useState(initialData ?? EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const isEditing = Boolean(projectId);

  function setField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isEditing) {
        await projectsApi.update(projectId, form);
      } else {
        await projectsApi.create(form);
      }
      router.push('/admin/projetos');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  async function handlePublish() {
    setLoading(true);
    setError(null);
    try {
      await projectsApi.update(projectId, { status: 'published', visible: true });
      router.push('/admin/projetos');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <form className="projectForm" onSubmit={handleSubmit} noValidate>
      {error && (
        <div className="projectFormError" role="alert">
          <span className="material-symbols-outlined">error</span>
          {error}
        </div>
      )}

      <div className="projectFormMain">
        <div className="projectFormCard">
          <div className="projectFormGroup">
            <label htmlFor="title" className="projectFormLabel">
              Título <span className="projectFormRequired" aria-hidden="true">*</span>
            </label>
            <input
              id="title"
              type="text"
              className="projectFormInput"
              value={form.title}
              onChange={e => setField('title', e.target.value)}
              placeholder="Nome do projeto"
              required
            />
          </div>

          <div className="projectFormGroup">
            <label htmlFor="description" className="projectFormLabel">Descrição</label>
            <textarea
              id="description"
              className="projectFormTextarea"
              value={form.description}
              onChange={e => setField('description', e.target.value)}
              placeholder="O que é o projeto, o que ele resolve, o que foi aprendido"
              rows={4}
            />
          </div>

          <div className="projectFormGroup">
            <label className="projectFormLabel">Detalhes do projeto</label>
            <RichTextEditor
              value={form.details}
              onChange={val => setField('details', val)}
              pasta="projetos"
            />
            <p className="projectFormHint">Conceito, stack, decisões técnicas, aprendizados — exibido na página de projetos ao expandir o card.</p>
          </div>

          <div className="projectFormRow">
            <div className="projectFormGroup">
              <label htmlFor="liveHref" className="projectFormLabel">Link do projeto</label>
              <input
                id="liveHref"
                type="url"
                className="projectFormInput"
                value={form.liveHref}
                onChange={e => setField('liveHref', e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="projectFormGroup">
              <label htmlFor="repoHref" className="projectFormLabel">Link do repositório</label>
              <input
                id="repoHref"
                type="url"
                className="projectFormInput"
                value={form.repoHref}
                onChange={e => setField('repoHref', e.target.value)}
                placeholder="https://github.com/..."
              />
            </div>
          </div>

          <div className="projectFormGroup">
            <span className="projectFormLabel">Imagem de capa</span>
            <ImageUpload
              value={form.imageUrl}
              onChange={url => setField('imageUrl', url)}
              pasta="projetos"
            />
          </div>
        </div>
      </div>

      <aside className="projectFormSidebar">
        <div className="projectFormCard">
          <div className="projectFormGroup">
            <label htmlFor="status" className="projectFormLabel">Status</label>
            <select
              id="status"
              className="projectFormSelect"
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

          <div className="projectFormGroup">
            <label htmlFor="iconName" className="projectFormLabel">Ícone</label>
            <div className="projectFormIconWrapper">
              {form.iconName && (
                <span className="material-symbols-outlined projectFormIconPreview">
                  {form.iconName}
                </span>
              )}
              <input
                id="iconName"
                type="text"
                className="projectFormInput"
                value={form.iconName}
                onChange={e => setField('iconName', e.target.value)}
                placeholder="Ex: rocket_launch, code, terminal"
              />
            </div>
            <p className="projectFormHint">
              Nome do ícone do{' '}
              <a
                href="https://fonts.google.com/icons"
                target="_blank"
                rel="noopener noreferrer"
                className="projectFormHintLink"
              >
                Material Symbols
              </a>
              . Exibido no círculo da listagem.
            </p>
          </div>

          <div className="projectFormGroup">
            <label className="projectFormLabel">Tags</label>
            <TagsInput
              value={form.tags}
              onChange={val => setField('tags', val)}
            />
          </div>

          <div className="projectFormGroup">
            <span className="projectFormLabel">Visibilidade</span>
            <label className="projectFormToggle">
              <input
                type="checkbox"
                checked={form.visible}
                disabled={form.status !== 'published'}
                onChange={e => setField('visible', e.target.checked)}
              />
              <span className="projectFormToggleTrack">
                <span className="projectFormToggleThumb" />
              </span>
              <span className="projectFormToggleLabel">
                {form.visible
                  ? <><span className="material-symbols-outlined">visibility</span> Visível</>
                  : <><span className="material-symbols-outlined">visibility_off</span> Oculto</>
                }
              </span>
            </label>
          </div>
        </div>

        <div className="projectFormActions">
          {isEditing && form.status !== 'published' && (
            <button
              type="button"
              className="projectFormPublish"
              disabled={loading}
              onClick={handlePublish}
            >
              <span className="material-symbols-outlined">publish</span>
              Publicar agora
            </button>
          )}
          <button
            type="submit"
            className="projectFormSubmit"
            disabled={loading}
          >
            {loading
              ? 'Salvando...'
              : isEditing
                ? 'Salvar alterações'
                : 'Criar projeto'}
          </button>
          <a href="/admin/projetos" className="projectFormCancel">
            Cancelar
          </a>
        </div>
      </aside>
    </form>
  );
}
