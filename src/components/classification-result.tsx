import './classification-result.css';

import React from 'react';

import Loader from './loader';

interface ClassificationResultProps {
  isClassifying: boolean;
  dogBreed: string | null;
  error: string | null;
}

const ClassificationResult: React.FC<ClassificationResultProps> = ({
  isClassifying,
  dogBreed,
  error,
}: ClassificationResultProps): JSX.Element | null => {
  if (error) {
    return <div>error</div>;
  }

  if (isClassifying) {
    return <Loader className="classification-result__loader" />;
  }

  if (dogBreed) {
    return (
      <div className="classification-result__success">
        It looks like a{' '}
        <span className="classification-result__breed">{dogBreed}</span>! Here
        are some more of its pictures for you:
      </div>
    );
  }

  return null;
};

export default ClassificationResult;
