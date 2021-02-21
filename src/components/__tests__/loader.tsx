import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import React from 'react';

import Loader from '../loader';

test('renders loader', () => {
  render(<Loader message="Loading breeds..." />);

  expect(screen.getByRole('progressbar')).toBeVisible();
});

test('loader is accessible', async () => {
  const { container } = render(<Loader message="Accessible loader" />);

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('renders loader with className', () => {
  render(
    <Loader className="loader--default" message="Loading dog images..." />,
  );

  expect(screen.getByRole('progressbar')).toHaveClass('loader--default');
});

test('renders loader with accessible invisible message', () => {
  render(<Loader message="Classifying..." />);

  const loader = screen.getByRole('progressbar', { name: 'Classifying...' });
  expect(loader).toBeVisible();
});

test('renders loader with accessible visible message', () => {
  render(<Loader message="Classifying..." isMessageVisible />);

  const loader = screen.getByRole('progressbar', { name: 'Classifying...' });
  expect(loader).toBeVisible();
  expect(loader).toHaveTextContent('Classifying...');
});
