import './styles.css';

const Button = ({ label, variant = 'primary', href, onClick, type = 'button' }) => {
  if (href) {
    return (
      <a href={href} className={`btn btn--${variant}`}>
        {label}
      </a>
    );
  }

  return (
    <button type={type} className={`btn btn--${variant}`} onClick={onClick}>
      {label}
    </button>
  );
};

export { Button };
