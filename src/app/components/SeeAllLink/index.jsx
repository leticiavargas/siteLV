import './styles.css';

const SeeAllLink = ({ href, children }) => (
  <a href={href} className="seeAllLink">{children} ↗</a>
);

export { SeeAllLink };
