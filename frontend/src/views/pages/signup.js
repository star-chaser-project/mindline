//SignUpView
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

  firstUpdated(){
      super.firstUpdated()
      this.navActiveLinks()
      console.log('Header initialized with title:', this.title);    
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
    console.log('Auth.currentUser:', Auth.currentUser);
    const template = html`
    ${Auth.isLoggedIn() ? 
      html`<va-app-header user=${JSON.stringify(Auth.currentUser)}></va-app-header>` : 
      html`<va-public-header></va-public-header>`
    }  
   
<div class="page-content page-centered ">
    <div class="signon2-container profile-container">
     <!-- Left Section -->
        <div class="profile-left">
        <div class="signinup-box">
            <h1 style="padding-bottom: 1em;">LOG IN</h1>
            <sl-form class="form-signup" @sl-submit=${this.signUpSubmitHandler}>
                <div class="input-group">
                    <sl-input size="large" pill style="padding-bottom: 1em;" name="firstName" type="text" placeholder="First name" required></sl-input>
                </div>
                <div class="input-group">
                    <sl-input size="large" pill style="padding-bottom: 1em;" name="lastName" type="text" placeholder="Last name" required></sl-input>
                </div>
                <div class="input-group">
                    <sl-input size="large" pill style="padding-bottom: 1em;" name="email" type="email" placeholder="Email" required></sl-input>
                </div>
                <div class="input-group">
                    <sl-input size="large" pill style="padding-bottom: 1em;" name="password" type="password" placeholder="Password" required toggle-password></sl-input>
                </div>
                <div class="input-group">
                    <sl-select size="large" pill style="padding-bottom: 4em;" name="accessLevel" placeholder="I am a ..." placement="bottom">
                        <sl-menu-item value="1">Customer</sl-menu-item>
                        <sl-menu-item value="2">Mindline Admin</sl-menu-item>
                    </sl-select>
                </div>
                <div>
                    <sl-button size="large" pill class="submit-btn edit-btn edit-button" type="primary"  submit style="width: 100%;">SIGN UP</sl-button>
            </sl-form>
            <p>Already have an account? <a href="/signin" @click=${anchorRoute}>Sign in</a></p>
            </div>
        </div>
    </div>
   <!-- Right Section -->
        <div class="profile-right">
    <div class="welcome-box">
        <h1>Hi</h1>
        <h2>Tell us more about you!</h2>
    </div>
</div>
    `;
    render(template, App.rootEl);
  }
}


export default new SignUpView();
