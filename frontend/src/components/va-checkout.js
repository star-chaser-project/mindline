import { LitElement, html, css } from '@polymer/lit-element';
import { render } from 'lit-html';
import {anchorRoute, gotoRoute} from '../Router';
import Auth from '../Auth';
import App from '../App';
import UserAPI from '../UserAPI';
import Toast from '../Toast';


// Code adapted using CoPilot accessed 17 November 2024
class CheckoutBox extends LitElement {
    static styles = css`
        .checkout-box {
            width: 300px;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            margin: 0 auto;
        }
        h2 {
            text-align: center;
        }
        input[type="text"],
        input[type="email"],
        input[type="number"] {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
        button {
            width: 100%;
            padding: 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        button:hover {
            background-color: #45a049;
        }
    `;

    render() {
        return html`
            <div class="checkout-box">
                <h2>Checkout</h2>
                <form @submit="${this._placeOrder}">
                    <label for="name">Name</label>
                    <input type="text" id="name" name="name" placeholder="Your name.." required>
                    
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="Your email.." required>
                    
                    <label for="address">Address</label>
                    <input type="text" id="address" name="address" placeholder="Your address.." required>
                    
                    <label for="total">Total</label>
                    <input type="number" id="total" name="total" placeholder="Total amount.." required>
                    
                    <button type="submit">Place Order</button>
                </form>
            </div>
        `;
    }

    _placeOrder(event) {
        event.preventDefault();
        alert('Order placed successfully!');
    }
}

customElements.define('checkout-box', CheckoutBox);
