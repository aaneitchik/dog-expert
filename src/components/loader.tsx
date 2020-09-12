import './loader.css';

import React from 'react';

interface LoaderProps {
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({
  className,
}: LoaderProps): JSX.Element => {
  return (
    <div className={`loader__container ${className}`}>
      <div className="loader" />
    </div>
  );
};

export default Loader;
