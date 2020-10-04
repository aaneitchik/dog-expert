import './image-upload.css';

import React, { useRef, useState } from 'react';

interface ImageUploadProps {
  onImageLoad: (
    imageSource: string | ImageData,
    width: number,
    height: number,
  ) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageLoad,
}: ImageUploadProps): JSX.Element => {
  const imageReference = useRef<HTMLImageElement | null>(null);
  const inputReference = useRef<HTMLInputElement | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

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

    /**
     * If the browser supports OffscreenCanvas, we'll just get
     * all image data in the web worker.
     * If not, we need to get something serializable here,
     * so that we're able pass it to the worker for classification
     */
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (window.OffscreenCanvas) {
      onImageLoad(uploadedImageUrl, naturalWidth, naturalHeight);
    } else {
      const canvas = document.createElement('canvas');
      canvas.width = naturalWidth;
      canvas.height = naturalHeight;
      const context = canvas.getContext('2d');

      if (!context) {
        return;
      }

      context.drawImage(
        imageReference.current,
        0,
        0,
        naturalWidth,
        naturalHeight,
      );
      const imageData = context.getImageData(0, 0, naturalWidth, naturalHeight);
      onImageLoad(imageData, naturalWidth, naturalHeight);
    }
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
    </div>
  );
};

export default ImageUpload;
