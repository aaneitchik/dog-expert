import './dogs-viewer.css';

import React, { useEffect, useState } from 'react';

interface AllBreeds {
  [breed: string]: string[] | undefined;
}

const checkIfBreedAndSubbreedExist = (
  breed: string,
  subbreed: string,
  allBreeds: AllBreeds,
): boolean => {
  return !!allBreeds[breed]?.includes(subbreed);
};

/**
 * The API isn't perfect, and some breeds are divided into sub-breeds.
 * Since this will decide whether we'll be able to display some images,
 * we'll try to find our breed among all breeds and provide a correct URL
 */
const getBreedUrl = (breed: string, allBreeds: AllBreeds | null): string => {
  // If we didn't load the breeds yet, don't bother, just send as is
  if (!allBreeds) {
    return breed;
  }

  // If breed exists as is, and has no sub-breeds, return it
  if (allBreeds[breed]?.length === 0) {
    return breed;
  }

  // Try uniting two words, it works for example for "germanshepherd"
  const unitedBreed = breed.split(' ').join('');

  if (allBreeds[unitedBreed]?.length === 0) {
    return unitedBreed;
  }

  // Try splitting into 2 words (master breed, sub-breed)
  const [firstWord, secondWord] = breed.split(' ');

  if (checkIfBreedAndSubbreedExist(firstWord, secondWord, allBreeds)) {
    return `${firstWord}/${secondWord}`;
  }

  if (checkIfBreedAndSubbreedExist(secondWord, firstWord, allBreeds)) {
    return `${secondWord}/${firstWord}`;
  }

  // Seems like this breed actually doesn't exit in our list
  return breed;
};

interface DogsViewerProps {
  breed: string | null;
}

const DogsViewer: React.FC<DogsViewerProps> = ({
  breed,
}: DogsViewerProps): JSX.Element | null => {
  const [allBreeds, setAllBreeds] = useState<AllBreeds | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // Preload dog breeds, we'll need them later for better image search
  useEffect((): void => {
    // No sense in moving this outside, it's a crucial part of this effect
    // eslint-disable-next-line unicorn/consistent-function-scoping
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

    // No sense in moving this outside, it's a crucial part of this effect
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const fetchImages = async (): Promise<void> => {
      try {
        const breedUrl = getBreedUrl(breed.toLowerCase(), allBreeds);
        const response = await fetch(
          `https://dog.ceo/api/breed/${breedUrl}/images/random/3`,
        );
        const json = await response.json();

        if (json.status === 'error') {
          setErrorMessage(`Sorry, couldn't find images for ${breed}`);
        } else {
          setImageUrls(json.message);
        }
      } catch (error) {
        setErrorMessage(`Sorry, couldn't load images for ${breed}`);
      }
    };

    // This is the way to call an async function in useEffect
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchImages();
  }, [breed, allBreeds]);

  if (!breed) {
    return null;
  }

  if (errorMessage) {
    return <div className="dogs-viewer__error">{errorMessage}</div>;
  }

  return (
    <div>
      {!!imageUrls.length && (
        <div className="dogs-viewer__success">
          Here are some more pictures for you:
        </div>
      )}
      <div className="dogs-viewer__images">
        {imageUrls.map(
          (image: string): JSX.Element => (
            <img
              key={image}
              src={image}
              alt={breed}
              className="dogs-viewer__image"
            />
          ),
        )}
      </div>
    </div>
  );
};

export default DogsViewer;
