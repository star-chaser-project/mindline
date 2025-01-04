import App from '../../App';
import {html, render } from 'lit-html';
import {gotoRoute, anchorRoute} from '../../Router';
import Auth from '../../Auth';
import Utils from '../../Utils';
import Toast from '../../Toast';
import UserAPI from '../../UserAPI';


class FavouritesView {
  init(){
    document.title = 'Favourites';
    this.favProducts = null;    
    this.render();    
    Utils.pageIntroAnim();
    this.getFavProducts();
  }

  async getFavProducts(){
    try {
      const currentUser = await UserAPI.getUser(Auth.currentUser._id);
      this.favProducts = currentUser.favourites;
      console.log(this.favourites);
      this.render();
    }catch(err){
      Toast.show(err, 'error');
    }
  }

  render(){
    const template = html`
      <va-app-header title="Favourites" user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
      <div class="page-content">   
        <div class="fav-container">     
        <h1>Favourites</h1>
        
        <div class="fav-list">
          <sl-button type="primary" size="large" @click=${() => gotoRoute('/orders')}>View Order</sl-button>
          <sl-button type="primary" size="large" @click=${() => gotoRoute('/products')}>View Products</sl-button>
          <sl-button class="red-btn" type="primary" size="large" @click=${() => gotoRoute('/orders')}>CHECKOUT</sl-button>      
        </div>

        <hr>
        <br>

        <p>Page content ...</p>

      </div> 
      <div class="favourites-grid">
        ${this.favourites == null ? html`
          <sl-spinner></sl-spinner>
        ` : html`
          ${this.favProducts.map(product => html`
            <va-favourite-product class="favourite-card"
              id="${product._id}"
              name="${product.name}"
              description="${product.description}"
              price="${product.price}"
              user="${JSON.stringify(product.user)}"
              favourite="${favourite.product}" 
              image="${product.image}"
              milk="${product.milk}"
              shots="${product.shots}"
            >        
            </va-favourite-product>

          `)}
        `}
        </div>
      </div>
    `;
    render(template, App.rootEl);
  }
}


export default new FavouritesView();