import { faqApi } from '@/lib/api';
import { FaqForm } from '../../_components/FaqForm';
import '../../novo/styles.css';

export const metadata = {
  title: 'Editar pergunta — Admin',
};

export default async function EditarPergunta({ params }) {
  const { id } = await params;
  const item = await faqApi.get(id);

  if (!item) {
    return (
      <>
        <div className="adminFaqPageHeader">
          <a href="/admin/faq" className="adminFaqBackLink">
            <span className="material-symbols-outlined">arrow_back</span>
            FAQ
          </a>
          <h1 className="adminPageTitle">Editar pergunta</h1>
        </div>
        <p style={{ opacity: 0.5, fontSize: '0.9375rem' }}>
          Pergunta não encontrada. Conecte a API para carregar os dados.
        </p>
      </>
    );
  }

  return (
    <>
      <div className="adminFaqPageHeader">
        <a href="/admin/faq" className="adminFaqBackLink">
          <span className="material-symbols-outlined">arrow_back</span>
          FAQ
        </a>
        <h1 className="adminPageTitle">{item.question}</h1>
      </div>

      <FaqForm
        faqId={id}
        initialData={{
          question: item.question,
          answer: item.answer,
          links: item.links,
          status: item.status,
          visible: item.visible,
        }}
      />
    </>
  );
}
