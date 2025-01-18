import App from '../../App';
import {html, render } from 'lit-html';
import {gotoRoute, anchorRoute} from '../../Router';
import Auth from '../../Auth';
import Utils from '../../Utils';
import ProductAPI from '../../ProductAPI';
import Toast from '../../Toast';

class newProductView {
  init(){
    document.title = 'New Product';    
    this.render();    
    Utils.pageIntroAnim();
  }

  async newProductSubmitHandler(e){
    // e = event and stops form from reloading the page
    e.preventDefault();
    e.preventDefault()  ;  
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.setAttribute('loading', '');    
    const formData = e.detail.formData;

    try{
      await ProductAPI.newProduct(formData);
      Toast.show('Product added!');
      submitBtn.removeAttribute('loading');
      // reset form
      // reset text + textarea inputs
      const textInputs = document.querySelectorAll('sl-input, sl-textarea');
      if(textInputs) textInputs.forEach(textInput => textInput.value = null);
      // reset radio inputs
      const radioInputs = document.querySelectorAll('sl-radio');
      if(radioInputs) radioInputs.forEach(radioInput => radioInput.removeAttribute('checked'));
      // reset file input
      const fileInput = document.querySelector('input[type=file');
      if(fileInput) fileInput.value = null;
      


    }catch(err){
      Toast.show(err, 'error');
      submitBtn.removeAttribute('loading');
    }
  }
  // // Animation - from https://shoelace.style/components/animation/
  render(){
    const template = html`
      <va-app-header title="Add Product" user="${JSON.stringify(Auth.currentUser)}">
      </va-app-header>
      <div class="page-content">   
        <div class="new-product-page-container">     
          <h1>Add a new Product</h1>
          <sl-form class="page-form" @sl-submit=${this.newProductSubmitHandler}>
            <input type="hidden" name="user" value="${Auth.currentUser._id}" />
            <div class="input-group">
              <sl-input name="name" type="text" placeholder="Product Name" required></sl-input>
            </div>
            <div class="input-group">              
              <sl-input name="price" type="text" placeholder="Price" required>
                <span slot="prefix">$</span>
              </sl-input>
            </div>
            <div class="input-group">
              <sl-textarea name="description" rows="3" placeholder="Description"></sl-textarea>
            </div>
            <div class="input-group" style="margin-bottom: 2em;">
              <label><h4>Image<h4></label>
              <input type="file" name="image" />              
            </div>
            <div class="input-group" style="margin-bottom: 2em;">
              <label><h4>Milk</h4></p>
              <sl-radio-group label="Select milk" no-fieldset>
                <sl-radio name="milk" value="none">None</sl-radio> &nbsp;
                <sl-radio name="milk" value="full-cream">Full cream</sl-radio> &nbsp;
                <sl-radio name="milk" value="hilo">Hilo</sl-radio> &nbsp;
                <sl-radio name="milk" value="skimmed">Skimmed</sl-radio> &nbsp;
                <sl-radio name="milk" value="almond">Almond</sl-radio> &nbsp;
                <sl-radio name="milk" value="oat">Oat</sl-radio> &nbsp;
                <sl-radio name="milk" value="soy">Soy</sl-radio> &nbsp;
              </sl-radio-group>
            </div>
            <div class="input-group" style="margin-bottom: 2em;">
              <label><h4>Size</h4></label>
              <sl-radio-group label="Select size" no-fieldset>
                <sl-radio name="size" value="small">Small</sl-radio> &nbsp;
                <sl-radio name="size" value="medium">Medium</sl-radio> &nbsp;
                <sl-radio name="size" value="large">Large</sl-radio> &nbsp;
              </sl-radio-group>
            </div>
            <div class="input-group" style="margin-bottom: 2em;">
              <label><h4>Shots</h4></label>
              <sl-radio-group label="Select size" no-fieldset>
                <sl-radio name="shots" value="1">1</sl-radio> &nbsp;
                <sl-radio name="shots" value="2">2</sl-radio> &nbsp;
                <sl-radio name="shots" value="3">3</sl-radio> &nbsp;
              </sl-radio-group>
            </div>
            <sl-animation name="jello" duration="2000" play iterations="2">
              <sl-button type="primary" class="submit-btn" submit>Add Product</sl-button>
            </sl-animation>
          </sl-form>
        </div>
        
      </div>      
    `;
    render(template, App.rootEl);
  }
}


export default new newProductView();