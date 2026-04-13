'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RichTextEditor } from '@/app/admin/_components/RichTextEditor';
import { faqApi } from '@/lib/api';
import './styles.css';

const EMPTY_FORM = {
  question: '',
  answer: '',
  links: [],
  status: 'draft',
  visible: true,
};

function LinksInput({ value, onChange }) {
  function addLink() {
    onChange([...value, { label: '', url: '' }]);
  }

  function updateLink(i, field, val) {
    onChange(value.map((l, idx) => (idx === i ? { ...l, [field]: val } : l)));
  }

  function removeLink(i) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  return (
    <div className="faqFormLinks">
      {value.length > 0 && (
        <ul className="faqFormLinkList">
          {value.map((link, i) => (
            <li key={i} className="faqFormLinkRow">
              <input
                type="text"
                className="faqFormInput faqFormLinkRotulo"
                placeholder="Rótulo"
                value={link.label}
                onChange={e => updateLink(i, 'label', e.target.value)}
              />
              <input
                type="url"
                className="faqFormInput faqFormLinkUrl"
                placeholder="https://..."
                value={link.url}
                onChange={e => updateLink(i, 'url', e.target.value)}
              />
              <button
                type="button"
                className="faqFormLinkRemove"
                onClick={() => removeLink(i)}
                aria-label="Remover link"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <button type="button" className="faqFormAddLink" onClick={addLink}>
        <span className="material-symbols-outlined">add</span>
        Adicionar link
      </button>
    </div>
  );
}

export function FaqForm({ faqId, initialData }) {
  const [form, setForm] = useState(initialData ?? EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const isEditing = Boolean(faqId);

  function setField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isEditing) {
        await faqApi.update(faqId, form);
      } else {
        await faqApi.create(form);
      }
      router.push('/admin/faq');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <form className="faqForm" onSubmit={handleSubmit} noValidate>
      {error && (
        <div className="faqFormError" role="alert">
          <span className="material-symbols-outlined">error</span>
          {error}
        </div>
      )}

      <div className="faqFormMain">
        <div className="faqFormCard">
          <div className="faqFormGroup">
            <label htmlFor="question" className="faqFormLabel">
              Pergunta <span className="faqFormRequired" aria-hidden="true">*</span>
            </label>
            <textarea
              id="question"
              className="faqFormTextarea"
              value={form.question}
              onChange={e => setField('question', e.target.value)}
              placeholder="Qual é a pergunta?"
              rows={2}
              required
            />
          </div>

          <div className="faqFormGroup">
            <label className="faqFormLabel">Resposta</label>
            <RichTextEditor
              value={form.answer}
              onChange={val => setField('answer', val)}
            />
          </div>

          <div className="faqFormGroup">
            <label className="faqFormLabel">Links complementares</label>
            <p className="faqFormHint">
              Recursos externos que complementam a resposta.
            </p>
            <LinksInput
              value={form.links}
              onChange={val => setField('links', val)}
            />
          </div>
        </div>
      </div>

      <aside className="faqFormSidebar">
        <div className="faqFormCard">
          <div className="faqFormGroup">
            <label htmlFor="status" className="faqFormLabel">Status</label>
            <select
              id="status"
              className="faqFormSelect"
              value={form.status}
              onChange={e => setField('status', e.target.value)}
            >
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
            </select>
          </div>

          <div className="faqFormGroup">
            <span className="faqFormLabel">Visibilidade</span>
            <label className="faqFormToggle">
              <input
                type="checkbox"
                checked={form.visible}
                onChange={e => setField('visible', e.target.checked)}
              />
              <span className="faqFormToggleTrack">
                <span className="faqFormToggleThumb" />
              </span>
              <span className="faqFormToggleLabel">
                {form.visible
                  ? <><span className="material-symbols-outlined">visibility</span> Visível</>
                  : <><span className="material-symbols-outlined">visibility_off</span> Oculto</>
                }
              </span>
            </label>
          </div>
        </div>

        <div className="faqFormActions">
          <button
            type="submit"
            className="faqFormSubmit"
            disabled={loading}
          >
            {loading
              ? 'Salvando...'
              : isEditing
                ? 'Salvar alterações'
                : 'Criar pergunta'}
          </button>
          <a href="/admin/faq" className="faqFormCancel">
            Cancelar
          </a>
        </div>
      </aside>
    </form>
  );
}
