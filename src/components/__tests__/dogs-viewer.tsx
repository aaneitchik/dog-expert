import 'whatwg-fetch';

import { render, screen, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';

import { DOG_API_BASE_URL } from '../../api';
import DogsViewer from '../dogs-viewer';

const server = setupServer(
  // This is an unused parameter, it MUST be prefixed with underscore to compile
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
  // This is an unused parameter, it MUST be prefixed with underscore to compile
  // eslint-disable-next-line @typescript-eslint/naming-convention
  rest.get(`${DOG_API_BASE_URL}/breed/*/images/random/*`, (_req, res, ctx) =>
    res(
      ctx.json({
        status: 'success',
        message: ['image-url-1.jpg', 'image-url-2.jpg'],
      }),
    ),
  ),
);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});
afterAll(() => {
  server.close();
});
afterEach(() => {
  server.resetHandlers();
});

const observe = jest.fn();
const unobserve = jest.fn();

class MockIntersectionObserver {
  // No need to mock properly, we're not testing IntersectionObserver
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  public constructor() {}

  public observe = observe;

  public unobserve = unobserve;
}

// @ts-expect-error: No need to mock properly, that's not what we test
window.IntersectionObserver = MockIntersectionObserver;

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

test('image gallery is accessible', async () => {
  const { container } = render(<DogsViewer breed="beagle" />);

  await waitFor(() => {
    expect(screen.getByTestId('breeds-loaded')).toBeInTheDocument();
    expect(screen.getAllByAltText(/beagle/iu)).not.toHaveLength(0);
  });

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
