import { getBreedUrl } from '../get-breed-url';

test('returns breed if all possible breeds are not provided', () => {
  const breed = 'beagle';
  const allBreeds = null;

  expect(getBreedUrl(breed, allBreeds)).toStrictEqual(breed);
});

test('returns breed if there are no sub-breeds', () => {
  const breed = 'beagle';
  const allBreeds = { beagle: [] };

  expect(getBreedUrl(breed, allBreeds)).toStrictEqual(breed);
});

test('returns breed without spaces if it is an available breed', () => {
  const breed = 'german shepherd';
  const allBreeds = { germanshepherd: [] };

  expect(getBreedUrl(breed, allBreeds)).toStrictEqual('germanshepherd');
});

test('returns master/sub-breed', () => {
  const breed = 'french bulldog';
  const allBreeds = {
    bulldog: ['boston', 'english', 'french'],
  };

  expect(getBreedUrl(breed, allBreeds)).toStrictEqual('bulldog/french');
});

test('returns sub-breed/master', () => {
  const breed = 'australian shepherd';
  const allBreeds = {
    australian: ['shepherd'],
  };

  expect(getBreedUrl(breed, allBreeds)).toStrictEqual('australian/shepherd');
});

test('returns breed if none of transformations to find it in the breeds worked', () => {
  const breed = 'cardigan welsh corgi';
  const allBreeds = { beagle: [] };

  expect(getBreedUrl(breed, allBreeds)).toStrictEqual('cardigan welsh corgi');
});
