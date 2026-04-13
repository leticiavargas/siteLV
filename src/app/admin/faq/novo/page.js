import { FaqForm } from '../_components/FaqForm';
import './styles.css';

export const metadata = {
  title: 'Nova pergunta — Admin',
};

export default function NovaPergunfa() {
  return (
    <>
      <div className="adminFaqPageHeader">
        <a href="/admin/faq" className="adminFaqBackLink">
          <span className="material-symbols-outlined">arrow_back</span>
          FAQ
        </a>
        <h1 className="adminPageTitle">Nova pergunta</h1>
      </div>

      <FaqForm />
    </>
  );
}
