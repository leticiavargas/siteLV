'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUpload } from '@/app/admin/_components/ImageUpload';
import { eventsApi } from '@/lib/api';
import './styles.css';

const EMPTY_FORM = {
  title: '',
  description: '',
  date: '',
  endDate: '',
  location: '',
  format: '',
  href: '',
  imageUrl: '',
  attending: false,
  role: 'attendee',
  talkTitle: '',
  materialsHref: '',
  status: 'draft',
  visible: false,
};

export function EventForm({ eventId, initialData }) {
  const [form, setForm] = useState(initialData ?? EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const isEditing = Boolean(eventId);

  function setField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isEditing) {
        await eventsApi.update(eventId, form);
      } else {
        await eventsApi.create(form);
      }
      router.push('/admin/eventos');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  async function handlePublish() {
    setLoading(true);
    setError(null);
    try {
      await eventsApi.update(eventId, { status: 'published', visible: true });
      router.push('/admin/eventos');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <form className="eventForm" onSubmit={handleSubmit} noValidate>
      {error && (
        <div className="eventFormError" role="alert">
          <span className="material-symbols-outlined">error</span>
          {error}
        </div>
      )}

      <div className="eventFormMain">
        <div className="eventFormCard">
          <div className="eventFormGroup">
            <label htmlFor="title" className="eventFormLabel">
              Título <span className="eventFormRequired" aria-hidden="true">*</span>
            </label>
            <input
              id="title"
              type="text"
              className="eventFormInput"
              value={form.title}
              onChange={e => setField('title', e.target.value)}
              placeholder="Nome do evento"
              required
            />
          </div>

          <div className="eventFormGroup">
            <label htmlFor="description" className="eventFormLabel">Descrição</label>
            <textarea
              id="description"
              className="eventFormTextarea"
              value={form.description}
              onChange={e => setField('description', e.target.value)}
              placeholder="Breve descrição exibida no card"
              rows={3}
            />
          </div>

          <div className="eventFormRow">
            <div className="eventFormGroup">
              <label htmlFor="date" className="eventFormLabel">
                Data de início <span className="eventFormRequired" aria-hidden="true">*</span>
              </label>
              <input
                id="date"
                type="date"
                className="eventFormInput"
                value={form.date}
                onChange={e => setField('date', e.target.value)}
                required
              />
            </div>

            <div className="eventFormGroup">
              <label htmlFor="endDate" className="eventFormLabel">Data de encerramento</label>
              <input
                id="endDate"
                type="date"
                className="eventFormInput"
                value={form.endDate}
                onChange={e => setField('endDate', e.target.value)}
              />
            </div>
          </div>

          <div className="eventFormRow">
            <div className="eventFormGroup">
              <label htmlFor="location" className="eventFormLabel">Local</label>
              <input
                id="location"
                type="text"
                className="eventFormInput"
                value={form.location}
                onChange={e => setField('location', e.target.value)}
                placeholder='Ex: "São Paulo, SP"'
              />
            </div>

            <div className="eventFormGroup">
              <label htmlFor="format" className="eventFormLabel">Formato</label>
              <select
                id="format"
                className="eventFormSelect"
                value={form.format}
                onChange={e => setField('format', e.target.value)}
              >
                <option value="">Não definido</option>
                <option value="in-person">Presencial</option>
                <option value="online">Online</option>
                <option value="hybrid">Híbrido</option>
              </select>
            </div>
          </div>

          <div className="eventFormGroup">
            <label htmlFor="href" className="eventFormLabel">Link externo</label>
            <input
              id="href"
              type="url"
              className="eventFormInput"
              value={form.href}
              onChange={e => setField('href', e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="eventFormGroup">
            <label htmlFor="role" className="eventFormLabel">Minha participação</label>
            <select
              id="role"
              className="eventFormSelect"
              value={form.role}
              onChange={e => setField('role', e.target.value)}
            >
              <option value="attendee">Participante</option>
              <option value="speaker">Palestrante</option>
              <option value="coordinator">Coordenador(a)</option>
              <option value="organizer">Organizador(a)</option>
            </select>
          </div>

          {(form.role === 'speaker' || form.role === 'coordinator' || form.role === 'organizer') && (
            <>
              <div className="eventFormGroup">
                <label htmlFor="talkTitle" className="eventFormLabel">Título da palestra</label>
                <input
                  id="talkTitle"
                  type="text"
                  className="eventFormInput"
                  value={form.talkTitle}
                  onChange={e => setField('talkTitle', e.target.value)}
                  placeholder="Nome da talk ou workshop"
                />
              </div>
              <div className="eventFormGroup">
                <label htmlFor="materialsHref" className="eventFormLabel">Link dos materiais</label>
                <input
                  id="materialsHref"
                  type="url"
                  className="eventFormInput"
                  value={form.materialsHref}
                  onChange={e => setField('materialsHref', e.target.value)}
                  placeholder="Slides, repo, etc."
                />
              </div>
            </>
          )}

          <div className="eventFormGroup">
            <span className="eventFormLabel">Imagem de capa</span>
            <ImageUpload
              value={form.imageUrl}
              onChange={url => setField('imageUrl', url)}
              pasta="eventos"
            />
          </div>
        </div>
      </div>

      <aside className="eventFormSidebar">
        <div className="eventFormCard">
          <div className="eventFormGroup">
            <label htmlFor="status" className="eventFormLabel">Status</label>
            <select
              id="status"
              className="eventFormSelect"
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

          <div className="eventFormGroup">
            <span className="eventFormLabel">Vou ao evento?</span>
            <label className="eventFormToggle">
              <input
                type="checkbox"
                checked={form.attending}
                onChange={e => setField('attending', e.target.checked)}
              />
              <span className="eventFormToggleTrack">
                <span className="eventFormToggleThumb" />
              </span>
              <span className="eventFormToggleLabel">
                {form.attending
                  ? <><span className="material-symbols-outlined">check_circle</span> Sim, vou!</>
                  : <><span className="material-symbols-outlined">cancel</span> Não vou</>
                }
              </span>
            </label>
          </div>

          <div className="eventFormGroup">
            <span className="eventFormLabel">Visibilidade</span>
            <label className="eventFormToggle">
              <input
                type="checkbox"
                checked={form.visible}
                disabled={form.status !== 'published'}
                onChange={e => setField('visible', e.target.checked)}
              />
              <span className="eventFormToggleTrack">
                <span className="eventFormToggleThumb" />
              </span>
              <span className="eventFormToggleLabel">
                {form.visible
                  ? <><span className="material-symbols-outlined">visibility</span> Visível</>
                  : <><span className="material-symbols-outlined">visibility_off</span> Oculto</>
                }
              </span>
            </label>
          </div>
        </div>

        <div className="eventFormActions">
          {isEditing && form.status !== 'published' && (
            <button
              type="button"
              className="eventFormPublish"
              disabled={loading}
              onClick={handlePublish}
            >
              <span className="material-symbols-outlined">publish</span>
              Publicar agora
            </button>
          )}
          <button
            type="submit"
            className="eventFormSubmit"
            disabled={loading}
          >
            {loading
              ? 'Salvando...'
              : isEditing
                ? 'Salvar alterações'
                : 'Criar evento'}
          </button>
          <a href="/admin/eventos" className="eventFormCancel">
            Cancelar
          </a>
        </div>
      </aside>
    </form>
  );
}
