import 'whatwg-fetch';

import { render, screen, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';

import { DOG_API_BASE_URL } from '../../api';
import DogsViewer from '../dogs-viewer';

// The unused `req` parameters MUST be prefixed with underscore to compile
const handlers = {
  getBreedsList:
    // eslint-disable-next-line @typescript-eslint/naming-convention
    rest.get(`${DOG_API_BASE_URL}/breeds/list/all`, (_req, res, ctx) =>
      res(
        ctx.json({
          status: 'success',
          message: {
            australian: ['shepherd'],
            beagle: [],
          },
        }),
      ),
    ),
  getImagesForBreed:
    // eslint-disable-next-line @typescript-eslint/naming-convention
    rest.get(`${DOG_API_BASE_URL}/breed/*/images/random/*`, (_req, res, ctx) =>
      res(
        ctx.json({
          status: 'success',
          message: ['image-url-1.jpg', 'image-url-2.jpg'],
        }),
      ),
    ),
};

const erroringHandlers = {
  getBreedsList:
    // eslint-disable-next-line @typescript-eslint/naming-convention
    rest.get(`${DOG_API_BASE_URL}/breeds/list/all`, (_req, res, ctx) =>
      res(
        ctx.json({
          status: 'error',
        }),
      ),
    ),
  getImagesForBreed:
    // eslint-disable-next-line @typescript-eslint/naming-convention
    rest.get(`${DOG_API_BASE_URL}/breed/*/images/random/*`, (_req, res, ctx) =>
      res(
        ctx.json({
          status: 'error',
        }),
      ),
    ),
};

const server = setupServer(...Object.values(handlers));

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});
afterAll(() => {
  server.close();
});
afterEach(() => {
  server.resetHandlers();
});

test('pre-fetches dog breeds', async () => {
  render(<DogsViewer breed={null} />);

  // To avoid the act warning, we need some check that we can "waitFor".
  // So a hidden element with a test-id is created specifically for that
  await waitFor(() => {
    expect(screen.getByTestId('breeds-loaded')).toBeInTheDocument();
  });
});

test('fetches images if breed is provided', async () => {
  render(<DogsViewer breed="beagle" />);

  expect(screen.getByText(/more pictures for you/iu)).toBeVisible();

  await waitFor(() => {
    expect(screen.getByTestId('breeds-loaded')).toBeInTheDocument();
    expect(screen.getAllByAltText(/beagle/iu)).not.toHaveLength(0);
  });
});

test('fetches images for one-word breed even if all breeds failed to load', async () => {
  server.resetHandlers(
    erroringHandlers.getBreedsList,
    handlers.getImagesForBreed,
  );
  render(<DogsViewer breed="akita" />);

  expect(screen.getByText(/more pictures for you/iu)).toBeVisible();

  await waitFor(() => {
    expect(screen.getAllByAltText(/akita/iu)).not.toHaveLength(0);
  });
});

test('shows error if could not fetch images for breed', async () => {
  server.resetHandlers(
    handlers.getBreedsList,
    erroringHandlers.getImagesForBreed,
  );
  render(<DogsViewer breed="beagle" />);

  const error = await screen.findByText(
    "Sorry, couldn't load images for beagle",
  );
  expect(error).toBeVisible();
});

test('image gallery is accessible', async () => {
  const { container } = render(<DogsViewer breed="beagle" />);

  await waitFor(() => {
    expect(screen.getByTestId('breeds-loaded')).toBeInTheDocument();
    expect(screen.getAllByAltText(/beagle/iu)).not.toHaveLength(0);
  });

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
