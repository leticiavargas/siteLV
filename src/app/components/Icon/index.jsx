import Image from 'next/image';
import github from '@assets/github.svg';
import instagram from '@assets/instagram.svg';
import linkedin from '@assets/linkedin.svg';
import youtube from '@assets/youtube.svg';

const SOCIAL = {
  "github": github,
  "instagram": instagram,
  "linkedin": linkedin,
  "youtube": youtube,
};

const Icon = ({ className = '', iconName, ...rest }) => {

  if (SOCIAL.hasOwnProperty(iconName)) {
    return (
      <Image
        className={`icon ${className}`}
        src={SOCIAL[iconName]}
        alt={iconName}
        {...rest}
      />
    );
  } else {
  return (
    <span 
      className={`material-symbols-outlined icon ${className}`} 
      {...rest}
    >
      {iconName}
    </span>
  );
};
}

export { Icon };