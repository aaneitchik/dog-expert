import { render, screen } from '@testing-library/react';
import React from 'react';

import Loader from '../loader';

test('renders loader', () => {
  render(<Loader />);

  expect(screen.getByRole('progressbar')).toBeVisible();
});

test('renders loader with className', () => {
  render(<Loader className="loader--default" />);

  expect(screen.getByRole('progressbar')).toHaveClass('loader--default');
});
