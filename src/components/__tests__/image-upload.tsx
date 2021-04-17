import { render, screen, waitFor } from '@testing-library/react';
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
