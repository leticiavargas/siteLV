import './styles.css';

const Button = ({ label, children, variant = 'primary', href, onClick, type = 'button', className = '' }) => {
  const content = children ?? label;
  const cls = `btn btn--${variant}${className ? ` ${className}` : ''}`;

  if (href) {
    return (
      <a href={href} className={cls}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} className={cls} onClick={onClick}>
      {content}
    </button>
  );
};

export { Button };
