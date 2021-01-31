import { AllBreeds } from '../types';

const checkIfBreedAndSubbreedExist = (
  breed: string,
  subbreed: string,
  allBreeds: AllBreeds,
): boolean => !!allBreeds[breed]?.includes(subbreed);

/**
 * The API isn't perfect, and some breeds are divided into sub-breeds.
 * Since this will decide whether we'll be able to display some images,
 * we'll try to find our breed among all breeds and provide a correct URL
 */
export const getBreedUrl = (
  breed: string,
  allBreeds: AllBreeds | null,
): string => {
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
