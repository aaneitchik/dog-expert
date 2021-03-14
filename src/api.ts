import { AllBreeds, Image } from './types';
import { getBreedUrl } from './utils/get-breed-url';

export const DOG_API_BASE_URL = 'https://dog.ceo/api';

export const PAGE_SIZE = 5;

// Use id as a key for images, since they can be duplicated
let imageIdIncrement = 1;

export const fetchBreeds = async (): Promise<AllBreeds> => {
  const response = await fetch(`${DOG_API_BASE_URL}/breeds/list/all`);
  const json = await response.json();

  if (json.status === 'error') {
    throw new Error('Could not load available breeds');
  }

  return json.message;
};

export const fetchImagesForBreed = async (
  breed: string,
  allBreeds: AllBreeds | null,
): Promise<Image[]> => {
  const breedUrl = getBreedUrl(breed.toLowerCase(), allBreeds);
  const response = await fetch(
    `${DOG_API_BASE_URL}/breed/${breedUrl}/images/random/${PAGE_SIZE}`,
  );

  const json = await response.json();

  if (json.status === 'error') {
    throw `Sorry, couldn't find images for ${breed}`;
  }

  return json.message.map(
    (url: string): Image => ({ url, altText: breed, id: imageIdIncrement++ }),
  );
};
