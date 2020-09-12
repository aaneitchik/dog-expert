import './app.css';

import * as mobilenet from '@tensorflow-models/mobilenet';
import React, { useEffect, useRef, useState } from 'react';

import ClassificationResult from './components/classification-result';
import DogsViewer from './components/dogs-viewer';
import ImageUpload from './components/image-upload';
import { getDogBreed, preloadModel } from './get-dog-breed.worker';

const App = (): JSX.Element => {
  const modelPromise = useRef<Promise<mobilenet.MobileNet> | null>(null);
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
    // No sense in moving this outside, it's a crucial part of this effect
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const loadModel = async (): Promise<void> => {
      modelPromise.current = preloadModel();
    };

    try {
      // This is the way to call an async function in useEffect
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      loadModel();
    } catch {
      setClassificationError(`Couldn't load model`);
    }
  }, []);

  const handleImageLoad = async (
    imageUrl: string,
    width: number,
    height: number,
  ): Promise<void> => {
    setClassificationError(null);
    setIsClassifying(true);
    const breed = await getDogBreed(
      imageUrl,
      width,
      height,
      modelPromise.current,
    );
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
      {!!dogBreed && <DogsViewer breed={dogBreed} />}
    </div>
  );
};

export default App;
