const DEFAULT_PAGE_SIZE = 5;

describe('app', () => {
  it('recognizes breed from image and shows more images of the same breed', () => {
    cy.visit('/');
    cy.findByLabelText('Upload image').attachFile('beagle.jpg');
    cy.findByRole('progressbar', { name: 'Classifying...' }).should(
      'be.visible',
    );
    cy.findByText(/Looks like a/iu, { timeout: 60000 })
      .should('be.visible')
      .contains('beagle');
    cy.findAllByAltText('beagle').should(
      'have.length.at.least',
      DEFAULT_PAGE_SIZE,
    );
  });
});
