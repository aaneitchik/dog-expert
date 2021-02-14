import './loader.css';

import React from 'react';

interface LoaderProps {
  className?: string;
  children?: React.ReactNode;
}

const Loader: React.FC<LoaderProps> = ({
  className,
  children,
}: LoaderProps): JSX.Element => {
  const additionalClassName = className ? ` ${className}` : '';

  return (
    <div
      role="progressbar"
      className={`loader__container${additionalClassName}`}
    >
      <div className="loader__animation-container">
        <div className="loader" />
      </div>
      {children && <div>{children}</div>}
    </div>
  );
};

export default Loader;
