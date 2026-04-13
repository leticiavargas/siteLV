import { EventForm } from '../_components/EventForm';

export default function AdminEventosNovo() {
  return (
    <>
      <div className="adminPageHeader">
        <h1 className="adminPageTitle">Novo evento</h1>
      </div>
      <EventForm />
    </>
  );
}
