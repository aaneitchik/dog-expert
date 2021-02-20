import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import React from 'react';

import ClassificationResult from '../classification-result';

test('error message is shown and accessible', async () => {
  const { container } = render(
    <ClassificationResult
      isClassifying={false}
      dogBreed={null}
      error="Could not load model"
    />,
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();

  const errorMessage = screen.getByRole('alert');
  expect(errorMessage).toBeVisible();
  expect(errorMessage).toHaveTextContent('Could not load model');
});

test('loader shown if classification is in progress', () => {
  render(<ClassificationResult isClassifying dogBreed={null} error={null} />);

  const loader = screen.getByRole('progressbar', { name: 'Classifying...' });
  expect(loader).toBeVisible();
});

test('dog breed is shown if it is recognized and classification done', () => {
  render(
    <ClassificationResult
      isClassifying={false}
      dogBreed="beagle"
      error={null}
    />,
  );

  expect(screen.getByText(/beagle/iu)).toBeVisible();
});

test('nothing is rendered if no error and no breed recognized', () => {
  const { container } = render(
    <ClassificationResult isClassifying={false} dogBreed={null} error={null} />,
  );

  expect(container).toBeEmptyDOMElement();
});
