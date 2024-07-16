import { LightningElement, track, wire } from 'lwc';
import getProduct from '@salesforce/apex/ProductController.getProduct';

export default class ShoppingCart extends LightningElement {
    @track product;
    @track quantity = 1;
    @track shipping = 5; // Initial shipping cost
    @track total = 0;

    @wire(getProduct)
wiredProduct({ error, data }) {
    if (data) {
        console.log('Raw product data:', data);
        let price = parseFloat(data.price);
        if (isNaN(price)) {
            price = 0; // Default to zero or handle differently based on requirements
            console.warn('Invalid price format:', data.price);
        }
        console.log('Parsed product price:', price);
        this.product = { ...data, price };
        console.log('Product fetched:', this.product);
        this.calculateTotal();
    } else if (error) {
        console.error('Error fetching product:', error);
    }
}


    handleQuantityChange(event) {
        this.quantity = parseInt(event.target.value, 10);
        if (isNaN(this.quantity) || this.quantity < 1) {
            this.quantity = 1;
        }
        console.log('Quantity changed:', this.quantity);
        this.calculateTotal();
    }
    

    increaseQuantity() {
        this.quantity += 1;
        console.log('Quantity increased:', this.quantity);
        this.calculateTotal();
    }

    decreaseQuantity() {
        if (this.quantity > 1) {
            this.quantity -= 1;
            console.log('Quantity decreased:', this.quantity);
            this.calculateTotal();
        }
    }

    calculateTotal() {
        if (this.product && !isNaN(this.product.price)) {
            console.log('price:', this.product.price);
            console.log('quantity:',  this.quantity);
            console.log('shipping:', this.shipping);

            let total = this.shipping * this.quantity ;
            this.total = total.toFixed(2); // Format total to 2 decimal places
            console.log('Total calculated:', this.total);
            this.saveCartState();
        }
    }

    handleRemove() {
        this.product = null;
        this.quantity = 0;
        console.log('Product removed');
        this.updateCart();
    }

    updateCart() {
        let total = 0;
        if (this.product && !isNaN(this.product.price)) {
            total += this.product.price * this.quantity;
            console.log('Product price:', this.product.price);
        }
        this.shipping = this.quantity > 4 ? 10 : 5;
        this.total = total + this.shipping;
        console.log('Total calculated:', this.total);
        this.saveCartState();
    }
    

    saveCartState() {
        const cartState = {
            product: this.product,
            quantity: this.quantity
        };
        localStorage.setItem('cartState', JSON.stringify(cartState));
        console.log('Cart state saved:', cartState);
    }

    connectedCallback() {
        const savedCartState = JSON.parse(localStorage.getItem('cartState'));
        if (savedCartState && savedCartState.product) {
            this.product = savedCartState.product;
            this.quantity = savedCartState.quantity || 1; // Default to 1 if quantity not set
            console.log('Cart state loaded:', savedCartState);
            this.calculateTotal();
        }
    }
    
}