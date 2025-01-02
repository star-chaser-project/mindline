import { LitElement, html, css } from '@polymer/lit-element';
import { render } from 'lit-html';
import {anchorRoute, gotoRoute} from '../Router';
import Auth from '../Auth';
import App from '../App';
import UserAPI from '../UserAPI';
import Toast from '../Toast';

customElements.define('va-order', class Order extends LitElement {
    constructor() {
        super();
    }

    static get properties(){
        return {
            id: {
                type: String
            },
            user: {
                type: Object
            },
            product: {
                type: Object
            },
            favourite: {
                type: String
            },
            totalPrice: {
                type: String
            },
            orderTime: {
                type: String
            },
            orderCompleted: {
                type: String
            }           
        };
    }

    firstUpdated(){
        super.firstUpdated();
    }


    

    async addFavHandler(){    
        try {
            await UserAPI.addFavProducts(this.id);
            Toast.show('Product added to favourites');
        }catch(err){
            Toast.show(err, 'error');
        }
    }

   
    // the visuals the user sees in the browser including the styling
    // use .bind(this) when need to bind an event handler in a function to the Class and not to the element, like on the button below 
    render(){
        return html`
        <style>
            .order-wrap {
                background: #fff;
                border-radius: 10px;
                box-shadow: 8px 5px 20px rgba(0,0,0.1);
                margin-bottom: 0.5em;
                padding: 1em;
                width: 85%;
                display: flex;
                gap: 1.5em;
            }

            .order-items {
                display: flex;
                gap: 1.5em;
            }


        </style>
        <div class="order-wrap">
            <div class="order-img-container">
                <img class="order-img" slot="image" src="${App.apiBase}/images/${this.product.image}" />
            </div>
            <div class="order-items">
                <p class="product-name">Product Name: <br><br> <b><span>${this.product.name}</span></b></p>
                <p class="favourite-product">Favourite Product: <br><br> <b><span>${this.favourite}</span></b></p>
                <p class="product-price">Product Price: <br><br> <b><span>$${this.product.price}</b></span></p>
                
                <hr>

                <p class="order-time">Time ordered: <br><br> <b><span>${this.orderTime}</b></span></p>
                <p class="order-completed">Order Completed: <br><br> <b><span>${this.orderCompleted}</b></span></p>
                
                <hr>
                        
                <p class="total-price"><b>Order Total: <br> <br> <span>${this.totalPrice}</span></b></p></div>

                
            </div>
       
    
 
  
        `;
    }
});