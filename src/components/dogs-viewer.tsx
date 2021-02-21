import './dogs-viewer.css';

import React, { useEffect, useState } from 'react';

import { fetchBreeds, fetchImagesForBreed } from '../api';
import { AllBreeds, Image } from '../types';
import Loader from './loader';

interface DogsViewerProps {
  breed: string | null;
}

const DogsViewer: React.FC<DogsViewerProps> = ({
  breed,
}: DogsViewerProps): JSX.Element | null => {
  const [pageCount, setPageCount] = useState(1);
  // We'll save the reference as state to react to its changes
  const [
    loadMoreReference,
    setLoadMoreReference,
  ] = useState<HTMLDivElement | null>(null);
  const [allBreeds, setAllBreeds] = useState<AllBreeds | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [images, setImages] = useState<Image[]>([]);

  // Preload dog breeds, we'll need them later for better image search
  useEffect((): void => {
    const fetchAllBreeds = async (): Promise<void> => {
      try {
        const breeds = await fetchBreeds();

        setAllBreeds(breeds);
      } catch (error: unknown) {
        setAllBreeds(null);
      }
    };

    // This is the way to call an async function in useEffect
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchAllBreeds();
  }, []);

  // Fetch images for chosen breed
  useEffect((): (() => void) | undefined => {
    if (!breed) {
      return;
    }

    let didCancel = false;

    const fetchImages = async (): Promise<void> => {
      setErrorMessage(null);

      try {
        const breedImages = await fetchImagesForBreed(breed, allBreeds);

        if (!didCancel) {
          setImages((existingImages: Image[]): Image[] => [
            ...existingImages,
            ...breedImages,
          ]);
        }
      } catch (error: unknown) {
        setErrorMessage(`Sorry, couldn't load images for ${breed}`);
      }
    };

    // This is the way to call an async function in useEffect
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchImages();

    return (): void => {
      didCancel = true;
    };
    // We'll use pageCount as a trigger to fetch more images
  }, [breed, allBreeds, pageCount]);

  // IntersectionObserver to load more images
  useEffect((): (() => void) => {
    const handleObserver = ([target]: IntersectionObserverEntry[]): void => {
      if (target.isIntersecting) {
        setPageCount((previousCount: number): number => previousCount + 1);
      }
    };

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.25,
    };
    const observer = new IntersectionObserver(handleObserver, observerOptions);

    if (loadMoreReference) {
      observer.observe(loadMoreReference);
    }

    return (): void => {
      if (loadMoreReference) {
        observer.unobserve(loadMoreReference);
      }
    };
  }, [loadMoreReference]);

  if (!breed) {
    if (allBreeds !== null) {
      return <p data-testid="breeds-loaded" hidden />;
    }

    return null;
  }

  if (errorMessage) {
    return <div className="dogs-viewer__error">{errorMessage}</div>;
  }

  return (
    <div>
      {allBreeds !== null && <p data-testid="breeds-loaded" hidden />}
      <div className="dogs-viewer__success">
        Here are some more pictures for you:
      </div>
      <div className="dogs-viewer__images">
        {images.map(
          (image: Image): JSX.Element => (
            <img
              key={image.id}
              src={image.url}
              alt={image.altText}
              className="dogs-viewer__image"
            />
          ),
        )}
        <div ref={setLoadMoreReference}>
          <Loader
            message={`Loading ${breed} images...`}
            isMessageVisible={false}
          />
        </div>
      </div>
    </div>
  );
};

export default DogsViewer;
