import { LitElement, html, css } from '@polymer/lit-element';
import { render } from 'lit-html'
import {anchorRoute, gotoRoute} from './../Router';
import Auth from './../Auth';
import App from './../App';
import UserAPI from '../UserAPI';
import Toast from './../Toast';

customElements.define('va-haircut', class Haircut extends LitElement {
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
        const dialogEl = document.createElement('sl-dialog')
       
        // add className
        dialogEl.className = 'product-dialog'
       
        // sl-dialog content
        // created new variable to store all the content inside the dialog
        const dialogContent = html`
       <style>
            .wrap {
                display: flex;
            }
            .image {
                width: 50%;
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
            <p class="milk">milk: <span>${this.milk}</span></p>
            <p class="shots">shots: <span>${this.shots}</span></p>

            <sl-button @click=${this.addFavHandler.bind(this)}>
            <sl-icon slot="prefix" name="heart-fill"></sl-icon>
            Add to Favourites
            </sl-button>
        </div>
        </div>
`
        //sl-dialog content (paste #2)
        
        // actions - where is the html to render (dialogContent) and what element inserting inside the dialog (dialogEl)
        render(dialogContent, dialogEl)

        // append to document.body to view but still hidden as dialogs are hidden by default
        document.body.append(dialogEl)

        // need to run the show method to see the sl-dialog
        dialogEl.show()

        // on hide delete dialogEl
        dialogEl.addEventListener('sl-after-hide', () => {
            dialogEl.remove()
        })
    } 

    async addFavHandler(){    
        try {
            await UserAPI.addFavProducts(this.id)
            Toast.show('Product added to favourites')
        }catch(err){
            Toast.show(err, 'error')
        }
    }

   
    // the visuals the user sees in the browser including the styling
    // use .bind(this) when need to bind an event handler in a function to the Class and not to the element, like on the button below 
    render(){
        return html`
        <style>
            .author {
                font-size: 0.9em;
                font-style: italic;
                opacity: 0.8;
            }
        </style>
        
        <sl-card>
            <img slot="image" src="${App.apiBase}/images/${this.image}" />
            <h2>${this.name}</h2>
            <h3>${this.price}</h3>
            <p class="author">By ${this.user.firstName} ${this.user.lastName}</p>
            <sl-button @click=${this.moreInfoHandler.bind(this)}>More Info</sl-button>
            <sl-icon-button name="star-fill" label="Add to Favourites" @click=${this.addFavHandler.bind(this)}></sl-icon-button>
        </sl-card>

        `;
    }
});