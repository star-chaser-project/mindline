import App from '../../App';
import {html, render } from 'lit-html';
import {gotoRoute, anchorRoute} from '../../Router';
import Auth from '../../Auth';
import Utils from '../../Utils';
import ProductAPI from '../../ProductAPI';
import Toast from '../../Toast';

class ProductView {
  init(){
    document.title = 'Products';
    this.product = null;
    this.render();
    Utils.pageIntroAnim();
    this.getProducts();
  }

  async getProducts(){
    try{
      this.products = await ProductAPI.getProducts();
      console.log(this.products);
      this.render();
    }catch(err){
      Toast.show(err, 'error');
  }
}

// hot drink images from https://stock.adobe.com/au/search?k=coffee%20menu
// iced coffee images from https://www.vectorstock.com/royalty-free-vector/coffee-menu-with-different-ice-drink-types-vector-33242437
// the map function = for each
render(){
  const template = html`
    <va-app-header title="Products" user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
    <div class="page-content"> 
      <div class="products-container">
      <h1>View Products</h1>
        <div class="products-top"> 
          <div class="product-list">
              <sl-button type="primary" size="large" @click=${() => gotoRoute('/orders')}>View Order</sl-button>
              <sl-button type="primary" size="large" @click=${() => gotoRoute('/favouriteProducts')}>View Favourites</sl-button>
              <sl-button class="red-btn" type="primary" size="large" @click=${() => gotoRoute('/orders')}>CHECKOUT</sl-button>      
          </div>
          
          <div class="takeaway-cups-img">
              <img src="images/coffee-takeaway-cups-with-text-c.png" alt="Takeaway coffee cup information" class="responsive-img">
          </div>  

          </div>
          <hr>
          <div class="products-grid">
            ${this.products == null ? html`
              <sl-spinner></sl-spinner>
            ` : html`
              ${this.products.map(product => html`
                <va-product class="product-card"  
                  id="${product._id}"
                  name="${product.name}" 
                  description="${product.description}"
                  price="$${product.price}"
                  user="${JSON.stringify(product.user)}"
                  
                  image="${product.image}"
                  size="${product.size}"
                  milk="${product.milk}"
                  shots="${product.shots}"
                >
                </va-product>

              `)}
            `}
      </div>
       

         
     </div>
    `;
    render(template, App.rootEl);
  }
}


export default new ProductView();