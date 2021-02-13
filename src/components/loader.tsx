import './loader.css';

import React from 'react';

interface LoaderProps {
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({
  className,
}: LoaderProps): JSX.Element => {
  const additionalClassName = className ? ` ${className}` : '';

  return (
    <div
      role="progressbar"
      className={`loader__container${additionalClassName}`}
    >
      <div className="loader" />
    </div>
  );
};

export default Loader;
