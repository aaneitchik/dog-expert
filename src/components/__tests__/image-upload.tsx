import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import React from 'react';

import { createObjectUrlMock } from '../../../test/url-mock';
import ImageUpload from '../image-upload';

const noop = jest.fn();

test('renders file input', () => {
  render(<ImageUpload onImageLoad={noop} />);

  expect(screen.getByLabelText('Upload image')).toBeVisible();
  expect(screen.getByText('No image uploaded')).toBeVisible();
});

test('file input is accessible', async () => {
  const { container } = render(<ImageUpload onImageLoad={noop} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('do nothing if there is no file uploaded', () => {
  render(<ImageUpload onImageLoad={noop} />);

  const fileInput = screen.getByLabelText('Upload image');
  userEvent.upload(fileInput, []);

  expect(createObjectUrlMock).not.toHaveBeenCalled();
});

test('displays preview for uploaded image', async () => {
  render(<ImageUpload onImageLoad={noop} />);

  const dogImage = new File(['◖⚆ᴥ⚆◗'], 'dog.png', { type: 'image/png' });
  const fileInput = screen.getByLabelText('Upload image');

  createObjectUrlMock.mockImplementationOnce(() => 'dogImage 1 blob');

  userEvent.upload(fileInput, [dogImage]);

  await waitFor(() => screen.getByAltText('Uploaded dog'));

  const preview = screen.getByAltText('Uploaded dog') as HTMLImageElement;
  expect(preview.src).toMatchInlineSnapshot(
    `"https://example.com/dogImage%201%20blob"`,
  );
});

const imageDataMock = {};
const canvasMock = {
  getContext: () => ({
    drawImage: jest.fn(),
    getImageData: jest.fn(() => imageDataMock),
  }),
};

test('calls onImageLoad if there is no OffscreenCanvas', async () => {
  const onImageLoad = jest.fn();
  render(<ImageUpload onImageLoad={onImageLoad} />);

  const dogImage = new File(['◖⚆ᴥ⚆◗'], 'dog.png', { type: 'image/png' });
  const fileInput = screen.getByLabelText('Upload image');

  createObjectUrlMock.mockImplementationOnce(() => 'dogImage 1 blob');

  userEvent.upload(fileInput, [dogImage]);

  await waitFor(() => screen.getByAltText('Uploaded dog'));

  const originalCreateElement = document.createElement.bind(document);
  jest
    .spyOn(document, 'createElement')
    // @ts-expect-error: no need to create a full canvas mock
    .mockImplementationOnce((element: string) =>
      element === 'canvas' ? canvasMock : originalCreateElement(element),
    );
  // Trigger img "onload", cause it doesn't happen automatically in tests
  fireEvent.load(screen.getByAltText('Uploaded dog'));

  await waitFor(() => {
    expect(onImageLoad).toHaveBeenCalledWith(imageDataMock, 0, 0);
  });
});

test('calls onImageLoad if there is an OffscreenCanvas', async () => {
  const onImageLoad = jest.fn();
  render(<ImageUpload onImageLoad={onImageLoad} />);

  const dogImage = new File(['◖⚆ᴥ⚆◗'], 'dog.png', { type: 'image/png' });
  const fileInput = screen.getByLabelText('Upload image');

  createObjectUrlMock.mockImplementationOnce(() => 'dogImage blob');

  userEvent.upload(fileInput, [dogImage]);

  await waitFor(() => screen.getByAltText('Uploaded dog'));

  // .spyOn doesn't work for window, that's why this dirty hack
  // eslint-disable-next-line jest/prefer-spy-on
  window.OffscreenCanvas = jest.fn();

  // Trigger img "onload", cause it doesn't happen automatically in tests
  fireEvent.load(screen.getByAltText('Uploaded dog'));

  await waitFor(() => {
    expect(onImageLoad).toHaveBeenCalledWith('dogImage blob', 0, 0);
  });

  // @ts-expect-error: hack to check for window.OffscreenCanvas
  delete window.OffscreenCanvas;
});
