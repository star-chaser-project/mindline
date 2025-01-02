import App from './../../App';
import Auth from './../../Auth';
import {html, render } from 'lit-html';
import {anchorRoute, gotoRoute} from './../../Router';
import Utils from './../../Utils';

class SignUpView{
   
  init(){      
    console.log('SignUpView.init');  
    document.title = 'Sign up';    
    this.render();
    Utils.pageIntroAnim();
  }

  signUpSubmitHandler(e){
    e.preventDefault();    
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.setAttribute('loading', '');    
    const formData = e.detail.formData;
    
    // sign up using Auth
    Auth.signUp(formData, () => {
      submitBtn.removeAttribute('loading');
    });   
  }

  render(){
    const template = html`      
      <div class="page-content page-centered">   
        <div class="signon-container">   
          <div class="signinup-box">
            <img class="signinup-logo" src="/images/cafe-minori-logo-portrait.png" class="responsive-img">
            <br>
            <h1>You're nearly there!</h1>
            <h4>Let's us know a little more about you</h4>
            <sl-form class="form-signup" @sl-submit=${this.signUpSubmitHandler}>
              <div class="input-group">
                <sl-input name="firstName" type="text" placeholder="First name" required></sl-input>
              </div>
              <div class="input-group">
                <sl-input name="lastName" type="text" placeholder="Last name" required></sl-input>
              </div>
              <div class="input-group">
                <sl-input name="email" type="email" placeholder="Email" required></sl-input>
              </div>
              <div class="input-group">
                <sl-input name="password" type="password" placeholder="Password" required toggle-password></sl-input>
              </div>
              <div class="input-group">
                <sl-select name="accessLevel" placeholder="I am a ..." placement="bottom">
                  <sl-menu-item value="1">Customer</sl-menu-item>
                  <sl-menu-item value="2">Barista</sl-menu-item>
                </sl-select>
              </div>
              <div>         
              <sl-button type="primary" class="submit-btn" submit style="width: 50%;">SIGN UP</sl-button>
            </sl-form>
              <p>Brand new? <a href="/signin" @click=${anchorRoute}>Sign in</a></p>
          </div>
          
          </div>
           <div class="signon-img">
             <img src="/images/coffee-beans-custom.png" class="responsive-img">
            </div>
      </div>
    `;
    render(template, App.rootEl);
  }
}


export default new SignUpView();