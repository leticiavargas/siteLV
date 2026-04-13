import './styles.css';

const Tag = ({ text, variant = 'filled' }) => {
  return (
    <span className={`tagContainer tagContainer--${variant}`}>{text}</span>
  );
}

export { Tag };