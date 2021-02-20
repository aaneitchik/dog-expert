import './loader.css';

import React from 'react';

interface LoaderProps {
  className?: string;
  message: string;
  isMessageVisible?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
  className,
  message,
  isMessageVisible = false,
}: LoaderProps): JSX.Element => {
  const additionalClassName = className ? ` ${className}` : '';

  return (
    <div
      role="progressbar"
      aria-label={message}
      className={`loader__container${additionalClassName}`}
    >
      <div className="loader__animation-container">
        <div className="loader" />
      </div>
      {isMessageVisible && <div>{message}</div>}
    </div>
  );
};

export default Loader;
