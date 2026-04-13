import { eventsApi } from '@/lib/api';
import { EventForm } from '../../_components/EventForm';

export default async function AdminEventosEditar({ params }) {
  const { id } = await params;
  const evento = await eventsApi.get(id);

  return (
    <>
      <div className="adminPageHeader">
        <h1 className="adminPageTitle">Editar evento</h1>
      </div>
      <EventForm eventId={id} initialData={evento} />
    </>
  );
}
