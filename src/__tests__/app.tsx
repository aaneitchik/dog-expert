import { render, screen, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import React from 'react';

import App from '../app';
import { preloadModel } from '../get-dog-breed.worker';

jest.mock('../get-dog-breed.worker');

const mockPreloadModel = preloadModel as jest.MockedFunction<
  () => Promise<void>
>;

afterEach(() => {
  jest.clearAllMocks();
});

test('app is rendered and accessible', async () => {
  const { container } = render(<App />);

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('model is preloaded', () => {
  render(<App />);

  expect(mockPreloadModel).toHaveBeenCalledTimes(1);
});

test('error is shown if failed to load model', async () => {
  mockPreloadModel.mockRejectedValueOnce(new Error('Failed to load model'));

  render(<App />);

  await waitFor(() => {
    expect(screen.getByText("Couldn't load model")).toBeVisible();
  });
});
