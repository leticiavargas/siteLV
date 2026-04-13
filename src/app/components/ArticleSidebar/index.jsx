import './styles.css';
import { Button } from '../Button';

const ArticleSidebar = ({ description, communityText, communityHref }) => {
  return (
    <div className='articleSidebar'>
      <article className='articleSidebarAbout'>
        <div className='articleSidebarAboutTop'>
          <div className='articleSidebarPhoto' aria-hidden="true"></div>
          <h2>
            Quem é a <br />
            <strong>Letícia?</strong>
          </h2>
        </div>
        <p>{description}</p>
      </article>

      <aside className='articleSidebarCommunity'>
        <h2>Encontre outras pessoas com as mesmas dúvidas</h2>
        <p>{communityText}</p>
        <Button label="Clique aqui!" variant="primary" href={communityHref} />
      </aside>
    </div>
  );
};

export { ArticleSidebar };
