import { LightningElement, track } from 'lwc';

export default class ShoppingCart extends LightningElement {
    @track products = [];
    @track shippingValue = 0;
    @track totalPrice = 0;

    connectedCallback() {
        this.loadCart();
        this.fetchProducts();
    }

    fetchProducts() {
        fetch('https://fakestoreapi.com/products')
            .then(response => response.json())
            .then(data => {
                data.forEach(product => {
                    const storedProduct = this.products.find(p => p.id === product.id);
                    product.quantity = storedProduct ? storedProduct.quantity : 1;
                });
                this.products = data;
                this.updateCartSummary();
            })
            .catch(error => console.error('Error fetching products:', error));
    }

    increaseQuantity(event) {
        const productId = event.target.dataset.id;
        this.products = this.products.map(product => {
            if (product.id == productId) {
                product.quantity++;
            }
            return product;
        });
        this.updateCartSummary();
        this.saveCart();
    }

    decreaseQuantity(event) {
        const productId = event.target.dataset.id;
        this.products = this.products.map(product => {
            if (product.id == productId && product.quantity > 1) {
                product.quantity--;
            }
            return product;
        });
        this.updateCartSummary();
        this.saveCart();
    }

    removeProduct(event) {
        const productId = event.target.dataset.id;
        this.products = this.products.filter(product => product.id != productId);
        this.updateCartSummary();
        this.saveCart();
    }

    updateCartSummary() {
        let totalQuantity = 0;
        this.totalPrice = this.products.reduce((total, product) => {
            totalQuantity += product.quantity;
            return total + (product.price * product.quantity);
        }, 0);
        this.shippingValue = totalQuantity > 4 ? 10 : 0;
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.products));
    }

    loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.products = JSON.parse(savedCart);
        }
    }
}
