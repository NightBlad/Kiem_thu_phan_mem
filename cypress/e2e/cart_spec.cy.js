describe('Cart Test', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.get('#user-name').type('standard_user');
        cy.get('#password').type('secret_sauce');
        cy.get('#login-button').click();
    });

    it('Should add a product to the cart', () => {
        cy.get('.inventory_item').first().find('.btn_inventory').click();
        cy.get('.shopping_cart_badge').should('have.text', '1');
    });

    it('Should sort products by price low to high', () => {
        cy.get('.product_sort_container').select('lohi');
        cy.get('.inventory_item_price').first().should('have.text', '$7.99');
    });

    it('Should remove a product from the cart', () => {
        // Add product first
        cy.get('.inventory_item').first().find('.btn_inventory').click();
        cy.get('.shopping_cart_badge').should('have.text', '1');

        // Remove product
        cy.get('.inventory_item').first().find('.btn_inventory').click(); // Button text changes to "Remove"
        cy.get('.shopping_cart_badge').should('not.exist');
    });

    it('Should complete the checkout process', () => {
        // Add product and go to cart
        cy.get('.inventory_item').first().find('.btn_inventory').click();
        cy.get('.shopping_cart_link').click();

        // Checkout step 1
        cy.get('#checkout').click();
        cy.get('#first-name').type('John');
        cy.get('#last-name').type('Doe');
        cy.get('#postal-code').type('12345');
        cy.get('#continue').click();

        // Verify step 2
        cy.url().should('include', '/checkout-step-two.html');
        cy.get('.header_secondary_container').should('contain', 'Checkout: Overview');

        // Finish checkout
        cy.get('#finish').click();
        cy.url().should('include', '/checkout-complete.html');
        cy.get('.complete-header').should('contain', 'Thank you for your order!');
    });
});
