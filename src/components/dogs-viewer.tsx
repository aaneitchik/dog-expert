import './dogs-viewer.css';

import React, { useEffect, useState } from 'react';

import { AllBreeds } from '../types';
import { getBreedUrl } from '../utils/get-breed-url';
import Loader from './loader';

interface Image {
  url: string;
  altText: string;
  // It is not provided by the API, we add id later to use as key
  id?: number;
}

interface DogsViewerProps {
  breed: string | null;
}

const PAGE_SIZE = 5;
// Use id as a key for images, since they can be duplicated
let imageIdIncrement = 1;

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
      const response = await fetch('https://dog.ceo/api/breeds/list/all');
      const json = await response.json();

      if (json.status === 'success') {
        setAllBreeds(json.message);
      }
    };

    // This is the way to call an async function in useEffect
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchAllBreeds();
  }, []);

  // Fetch images for chosen breed
  useEffect((): void => {
    if (!breed) {
      return;
    }

    const fetchImages = async (): Promise<void> => {
      setErrorMessage(null);

      try {
        const breedUrl = getBreedUrl(breed.toLowerCase(), allBreeds);
        const response = await fetch(
          `https://dog.ceo/api/breed/${breedUrl}/images/random/${PAGE_SIZE}/alt`,
        );
        const json = await response.json();

        if (json.status === 'error') {
          setErrorMessage(`Sorry, couldn't find images for ${breed}`);
        } else {
          setImages((existingImages: Image[]): Image[] => [
            ...existingImages,
            ...json.message.map(
              (image: Image): Image => ({ ...image, id: imageIdIncrement++ }),
            ),
          ]);
        }
      } catch (error: unknown) {
        setErrorMessage(`Sorry, couldn't load images for ${breed}`);
      }
    };

    // This is the way to call an async function in useEffect
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchImages();
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
    return null;
  }

  if (errorMessage) {
    return <div className="dogs-viewer__error">{errorMessage}</div>;
  }

  return (
    <div>
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
          <Loader />
        </div>
      </div>
    </div>
  );
};

export default DogsViewer;
