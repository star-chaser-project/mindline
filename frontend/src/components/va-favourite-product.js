import { LitElement, html, css } from '@polymer/lit-element';
import { render } from 'lit-html';
import {anchorRoute, gotoRoute} from '../Router';
import Auth from '../Auth';
import App from '../App';
import UserAPI from '../UserAPI';
import Toast from '../Toast';


// Adapted from CoPilot accessed 18 November 2024
customElements.define('va-favourite-product', class FavouriteProducts extends LitElement {
    static properties = {
        products: { type: Array }
    };

    constructor() {
        super();
        this.products = [
            { id: 1, name: 'Product 1', favourite: false },
            { id: 2, name: 'Product 2', favourite: false },
            { id: 3, name: 'Product 3', favourite: false }
        ];
    }

    
    render() {
        return html`
            <style>
                .product-list {
                    list-style-type: none;
                    padding: 0;
                    box-shadow: 8px 5px 20px rgba(0,0,0.1);
                }
                .product-item {
                    padding: 10px;
                    border-bottom: 1px solid #ccc;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .favourite {
                    color: red;
                }
            </style>
            <ul class="product-list">
                ${this.products.map(product => html`
                    <li class="product-item">
                        ${this.name}
                        ${this.product.name}
                        <sl-button @click="${() => this.toggleFavourite(product)}">
                            ${favourite.product ? '❤️' : '♡'}
                        </sl-button>
                    </li>
                `)}
            </ul>
        `;
    }

    toggleFavourite(product) {
        favourite.product = !favourite.product;
        this.requestUpdate();
    }
});




