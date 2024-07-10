import { LightningElement, track } from 'lwc';
import { loadStyle } from 'lightning/platformResourceLoader';
import BOOTSTRAP from '@salesforce/resourceUrl/bootstrap';

export default class ShoppingCart extends LightningElement {
    @track products = [];
    @track cart = [];

    connectedCallback() {
        this.fetchProducts();
        this.loadCart();
        this.loadBootstrap();
    }

    loadBootstrap() {
        loadStyle(this, BOOTSTRAP)
            .then(() => {
                console.log('Bootstrap loaded successfully');
            })
            .catch(error => {
                console.error('Error loading Bootstrap:', error);
            });
    }

    async fetchProducts() {
        try {
            const response = await fetch('https://fakestoreapi.com/products');
            const data = await response.json();
            this.products = data.map(product => ({ ...product, quantity: 1 }));
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    handleQuantityChange(event) {
        const productId = event.target.dataset.id;
        const quantity = event.target.value;
        const product = this.cart.find(p => p.id == productId);
        if (product) {
            product.quantity = quantity;
        } else {
            this.cart.push({ id: productId, quantity });
        }
        this.saveCart();
    }

    removeProduct(event) {
        const productId = event.target.dataset.id;
        this.cart = this.cart.filter(p => p.id != productId);
        this.saveCart();
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    loadCart() {
        const cart = localStorage.getItem('cart');
        if (cart) {
            this.cart = JSON.parse(cart);
        }
    }

    get calculateTotal() {
        let total = 0;
        this.cart.forEach(item => {
            const product = this.products.find(p => p.id == item.id);
            if (product) {
                total += product.price * item.quantity;
            }
        });
        const shipping = this.cart.length > 4 ? 20 : 10;
        return total + shipping;
    }
}
