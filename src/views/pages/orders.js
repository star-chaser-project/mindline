import App from '../../App';
import {html, render } from 'lit-html';
import {gotoRoute, anchorRoute} from '../../Router';
import Auth from '../../Auth';
import Utils from '../../Utils';
import OrderAPI from '../../OrderAPI';
import UserAPI from '../../UserAPI';
import Toast from '../../Toast';

class OrdersView {
  init(){
    document.title = 'Orders'; 
    this.orders = null;    
    this.render();    
    Utils.pageIntroAnim();
    this.getOrders();
    
  }

    async getOrders(){
      try{
        const userOrders = await UserAPI.getUser(Auth.currentUser._id);
        this.orders=userOrders.order;
        console.log("orders 1/1/25", userOrders.order);
        this.render();
      }catch(err){
        Toast.show(err, 'error');
    }
  }

  render(){
    const template = html`
      <va-app-header title="Orders" user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
      <div class="page-content">        
        <div class="orders-container">
          <div class="orders-top"> 
          <h1>View Orders</h1>
          <p>Here you can view current and previous orders.</p>
          <div class="order-list">
            <sl-button type="primary" size="large" @click=${() => gotoRoute('/products')}>View Products</sl-button>
            <sl-button type="primary" size="large" @click=${() => gotoRoute('/favouriteProducts')}>View Favourites</sl-button>
            <sl-button class="red-btn" type="primary" size="large" @click=${() => gotoRoute('/orders')}>CHECKOUT</sl-button>      
          </div>

            <hr>

            <br>         
            
            <div>
              <h1>Current order</h1>
            
              <div class="orders-grid">
                ${this.orders == null ? html`
                <sl-spinner></sl-spinner>
              ` : html`
                ${this.orders.map(order => html`
                  <va-order class="order-card"  
                    id="${order._id}"
                    user="${JSON.stringify(order.user)}"
                    product="${JSON.stringify(order.product)}"
                    favourite="${order.favourite}" 
                    price="$${order.product.price}"
                    totalPrice="$${order.totalPrice}"
                    orderTime="${order.orderTime}"
                  >
                  </va-order>


                `)}

                
              `}
            </div>


          </div>  

          <br>

          <hr>
          
          <br>

          <div class="prev-orders-btn-set">
            <h1>Previous orders</h1>
            <sl-button type="primary" size="small" @click=${() => gotoRoute('/orders')}>VIEW ALL</sl-button> 
              
          </div>  
        

          <div>
            
              <div class="orders-grid">
                ${this.orders == null ? html`
                <sl-spinner></sl-spinner>
              ` : html`
                ${this.orders.map(order => html`
                  <va-order class="order-card"  
                    id="${order._id}"
                    user="${JSON.stringify(order.user)}"
                    product="${JSON.stringify(order.product)}"
                    favourite="${order.favourite}" 
                    price="$${order.product.price}"
                    totalPrice="$${order.totalPrice}"
                    orderTime="${order.orderTime}"
                    orderCompleted="${order.orderCompleted}"
                  >
                  </va-order>


                `)}

                
              `}  

        </div>
      
      </div>      
    `;
    render(template, App.rootEl);
  }
}


export default new OrdersView();