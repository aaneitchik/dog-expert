import './app.css';

import React, { useEffect, useState } from 'react';

import ClassificationResult from './components/classification-result';
import DogsViewer from './components/dogs-viewer';
import ImageUpload from './components/image-upload';
import { getDogBreed, preloadModel } from './get-dog-breed.worker';

const App = (): JSX.Element => {
  const [isClassifying, setIsClassifying] = useState(false);
  const [dogBreed, setDogBreed] = useState<string | null>(null);
  const [classificationError, setClassificationError] = useState<string | null>(
    null,
  );

  /**
   * Start loading the model right away in the web worker,
   * so it's there when we need it
   */
  useEffect((): void => {
    const loadModel = async (): Promise<void> => {
      try {
        await preloadModel();
      } catch {
        setClassificationError(`Couldn't load model`);
      }
    };

    // This is the way to call an async function in useEffect
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadModel();
  }, []);

  const handleImageLoad = async (
    imageSource: string | ImageData,
    width: number,
    height: number,
  ): Promise<void> => {
    setClassificationError(null);
    setIsClassifying(true);
    setDogBreed(null);
    const breed = await getDogBreed(imageSource, width, height);
    setDogBreed(breed);
    setIsClassifying(false);
  };

  return (
    <div className="app">
      <ImageUpload onImageLoad={handleImageLoad} />
      <ClassificationResult
        isClassifying={isClassifying}
        dogBreed={dogBreed}
        error={classificationError}
      />
      <DogsViewer breed={dogBreed} />
    </div>
  );
};

export default App;
