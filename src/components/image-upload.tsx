import './image-upload.css';

import * as mobilenet from '@tensorflow-models/mobilenet';
import React, { useEffect, useRef, useState } from 'react';

import { getDogBreed, preloadModel } from './get-dog-breed.worker';

const ImageUpload: React.FC = (): JSX.Element => {
  const modelPromise = useRef<Promise<mobilenet.MobileNet> | null>(null);
  const imageReference = useRef<HTMLImageElement | null>(null);
  const inputReference = useRef<HTMLInputElement | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
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

  const handleImageChange = async (): Promise<void> => {
    if (!inputReference?.current?.files?.[0]) {
      return;
    }

    const image = URL.createObjectURL(inputReference.current.files[0]);
    setUploadedImageUrl(image);
  };

  const handleImageLoad = async (): Promise<void> => {
    if (!imageReference.current || !uploadedImageUrl) {
      return;
    }

    // Get original dimensions, it improves classification
    const { naturalWidth, naturalHeight } = imageReference.current;
    await getDogBreed(
      uploadedImageUrl,
      naturalWidth,
      naturalHeight,
      modelPromise.current,
    );
  };

  return (
    <div className="image-upload">
      <div className="image-upload__preview-container">
        {uploadedImageUrl ? (
          <img
            src={uploadedImageUrl}
            className="image-upload__preview"
            alt="Uploaded dog"
            ref={imageReference}
            onLoad={handleImageLoad}
          />
        ) : (
          <div className="image-upload__no-data">No image uploaded</div>
        )}
      </div>
      <input
        type="file"
        id="image-upload"
        className="image-upload__input"
        accept="image/*"
        ref={inputReference}
        onChange={handleImageChange}
      />
      <label className="image-upload__btn" htmlFor="image-upload">
        Upload image
      </label>

      {!!classificationError && <div>{classificationError}</div>}
    </div>
  );
};

export default ImageUpload;
