import { LitElement, html, css } from '@polymer/lit-element';
import { render } from 'lit-html';
import {anchorRoute, gotoRoute} from '../Router';
import Auth from '../Auth';
import App from '../App';
import UserAPI from '../UserAPI';
import Toast from '../Toast';

customElements.define('va-product', class Product extends LitElement {
    constructor() {
        super();
    }

    static get properties(){
        return {
            id: {
                type: String
            },
            name: {
                type: String
            },
            description: {
                type: String
            },
            price: {
                type: String
            },
            user: {
                type: Object
            },
            image: {
                type: String
            },
            size: {
                type: String
            },
            milk: {
                type: String
            },
            shots: {
                type: String
            }
        };
    }

    firstUpdated(){
        super.firstUpdated();
    }

    
    moreInfoHandler(){
        // create sl-dialog
        const dialogEl = document.createElement('sl-dialog');
       
        // add className
        dialogEl.className = 'product-dialog';
       
        // sl-dialog content
        // created new variable to store all the content inside the dialog
        const dialogContent = html`
        <style>
            .wrap {
                display: flex;
                height: 470px;
            }
            .image {
                width: 50%;
                height: auto;
                margin-left: 50px;
                margin-top: 0;
                padding: 0;
            }
            .image img {
                width: 100%;
            }
            .content {
                padding-left: 1em;
            }
            .milk span,
            .shots span {
                text-transform: uppercase;
                font-weight: bold;
            }
            .size {
                font-size: 1.5em;
                color: var(--brand-color)
            }
            .price {
                font-size: 1.5em;
                color: var(--brand-color)
            }
            </style>
        <div class="wrap">
            
            <div class="image">
                <img src="${App.apiBase}/images/${this.image}" alt="${this.name}" />
            </div>
            <div class="content">
                <h1>${this.name}</h1>
                <p>${this.description}</p>
                <p class="price">${this.price}</p>
                <p class="size">size: <span>${this.size}</span></p>
                <p class="milk">milk: <span>${this.milk}</span></p>
                <p class="shots">shots: <span>${this.shots}</span></p>
                
                <hr style="3px">
                
                <sl-button @click=${this.addFavHandler.bind(this)}>
                    <sl-icon slot="prefix" style="font-size: 24px" name="star-fill"></sl-icon>
                    Add to Favourites
                </sl-button>
                <sl-button @click=${this.addCartHandler.bind(this)}>
                    <sl-icon-button class="cart-icon" name="cart3" style="font-size: 24px" label="Add to Cart" @click=${this.addCartHandler}>
                    Add to Cart
                </sl-icon-button>
                
            </div>
        </div>
        `;
        //sl-dialog content
        
        // actions - where is the html to render (dialogContent) and what element inserting inside the dialog (dialogEl)
        render(dialogContent, dialogEl);

        // append to document.body to view but still hidden as dialogs are hidden by default
        document.body.append(dialogEl);

        // need to run the show method to see the sl-dialog
        dialogEl.show();

        // on hide delete dialogEl
        dialogEl.addEventListener('sl-after-hide', () => {
            dialogEl.remove();
        });
    } 

    async addFavHandler(){    
        try {
            await UserAPI.addFavProduct(this.id);
            Toast.show('Product added to favourites');
        }catch(err){
            Toast.show(err, 'error');
        }
    }

    async addCartHandler(){    
        try {
            await UserAPI.addCartProducts(this.id);
            Toast.show('Product added to Order');
        }catch(err){
            Toast.show(err, 'error');
        }
    }

   
    // the visuals the user sees in the browser including the styling
    // use .bind(this) when need to bind an event handler in a function to the Class and not to the element, like on the below buttons 
    render(){
        return html`
        <style>
            .product-card {
                box-shadow: 8px 5px 20px rgba(0,0,0.1);
            }
        </style>
        
       <sl-card>
        <img slot="image" src="${App.apiBase}/images/${this.image}" />
        <h2>${this.name}</h2>
        <h3>${this.price}</h3>
        <hr>
        <sl-button @click=${this.moreInfoHandler.bind(this)}>More Info</sl-button>
        <sl-icon-button name="star-fill" style="font-size: 24px" label="Add to Favourites" @click=${this.addFavHandler.bind(this)}></sl-icon-button>
        <sl-icon-button name="cart3" style="font-size: 24px" label="Add to Cart" @click=${this.addCartHandler.bind(this)}></sl-icon-button>
       </sl-card>
        
        `;
    }
});