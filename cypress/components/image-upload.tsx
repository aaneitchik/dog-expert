import { mount } from '@cypress/react';
import * as React from 'react';

import ImageUpload from '../../src/components/image-upload';

it('calls onImageLoad if there is an OffscreenCanvas', () => {
  const mock = {
    onImageLoad: () => {},
  };
  cy.spy(mock, 'onImageLoad').as('onImageLoad');

  mount(<ImageUpload onImageLoad={mock.onImageLoad} />);
  cy.findByLabelText('Upload image').attachFile('beagle.jpg');

  cy.get('@onImageLoad').should('have.been.calledOnce');
});

it('calls onImageLoad if there is no OffscreenCanvas', () => {
  const mock = {
    onImageLoad: () => {},
  };
  cy.stub(mock, 'onImageLoad').as('onImageLoad');

  // @ts-ignore Imitate a browser that doesn't support OffscreenCanvas
  cy.window().then((win) => (win.OffscreenCanvas = undefined));

  mount(<ImageUpload onImageLoad={mock.onImageLoad} />);
  cy.findByLabelText('Upload image').attachFile('beagle.jpg');

  cy.get('@onImageLoad').should('have.been.calledOnce');
});
