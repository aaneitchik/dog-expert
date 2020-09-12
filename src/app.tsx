import './app.css';

import * as mobilenet from '@tensorflow-models/mobilenet';
import React, { useEffect, useRef, useState } from 'react';

import ImageUpload from './components/image-upload';
import { getDogBreed, preloadModel } from './get-dog-breed.worker';

const App = (): JSX.Element => {
  const modelPromise = useRef<Promise<mobilenet.MobileNet> | null>(null);
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
    await getDogBreed(imageUrl, width, height, modelPromise.current);
  };

  return (
    <div className="app">
      <ImageUpload onImageLoad={handleImageLoad} />
      {!!classificationError && <div>{classificationError}</div>}
    </div>
  );
};

export default App;
