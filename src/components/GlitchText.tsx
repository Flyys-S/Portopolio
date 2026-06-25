import React from 'react';
import './GlitchText.css';

interface GlitchTextProps {
  children: string;
  speed?: number;
  enableShadows?: boolean;
  enableOnHover?: boolean;
  className?: string;
}

const GlitchText: React.FC<GlitchTextProps> = ({
  children,
  speed = 0.5,
  enableShadows = true,
  enableOnHover = false,
  className = ''
}) => {
  const inlineStyles = {
    '--after-duration': `${speed * 3}s`,
    '--before-duration': `${speed * 2}s`,
    '--after-shadow': enableShadows ? '-5px 0 #ff5e3a' : 'none',
    '--before-shadow': enableShadows ? '5px 0 #d39700ff' : 'none'
  } as React.CSSProperties;

  const baseClass = 'glitch-text-base';
  const pseudoClass = enableOnHover ? 'glitch-hover-mode' : 'glitch-active-mode';
  const combinedClasses = `${baseClass} ${pseudoClass} ${className}`;

  return (
    <div style={inlineStyles} data-text={children} className={combinedClasses}>
      {children}
    </div>
  );
};

export default GlitchText;
