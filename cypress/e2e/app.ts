import { PAGE_SIZE } from '../../src/api';

describe('app', () => {
  it('recognizes breed from image and shows more images of the same breed', () => {
    cy.visit('/');
    cy.findByLabelText('Upload image').attachFile('beagle.jpg');
    cy.findByRole('progressbar', { name: 'Classifying...' }).should(
      'be.visible',
    );
    cy.findByText(/Looks like a/iu)
      .should('be.visible')
      .contains('beagle');
    cy.findAllByAltText('beagle').should('have.length.at.least', PAGE_SIZE);
  });
});
