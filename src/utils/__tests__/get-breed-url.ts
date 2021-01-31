import { getBreedUrl } from '../get-breed-url';

test('returns breed if all possible breeds are not provided', () => {
  const breed = 'beagle';
  const allBreeds = null;

  expect(getBreedUrl(breed, allBreeds)).toStrictEqual(breed);
});
