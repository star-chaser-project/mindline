import App from './../../App';
import {html, render } from 'lit-html';
import {anchorRoute, gotoRoute} from './../../Router';
import Auth from './../../Auth';
import Utils from './../../Utils';
import './../../components/va-public-header.js';

class SignInView {
  init(){
    document.title = 'Log in';
    this.render();
    Utils.pageIntroAnim();
  }

  firstUpdated(){
    super.firstUpdated()
    this.navActiveLinks()
    console.log('Header initialized with title:', this.title);    
  }

    signInSubmitHandler(e) {
        e.preventDefault();
        // Get the FormData from the event
        const formData = e.detail.formData;
        
        // Convert FormData to a plain object
        const data = {};
        formData.forEach((value, key) => {
          data[key] = value;
        });
        
        console.log('Converted form data:', data); // Debug: check the converted data
        
        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.setAttribute('loading', '');
        
        // Sign in using Auth with the plain object data
        Auth.signIn(data, () => {
          submitBtn.removeAttribute('loading');
        });
      }

  render(){    
    const template = html`
    ${Auth.isLoggedIn() ? 
      html`<va-app-header user=${JSON.stringify(Auth.currentUser)}></va-app-header>` : 
      html`<va-public-header></va-public-header>`
    }  
    <!-- Left Section -->
    <div class="page-content page-centered">
        <div class="signon2-container profile-container">
            <!-- Left Section -->
            <div class="profile-left">
                <div class="signinup-box">
                    <h1 >LOG IN</h1>
                    <sl-form class="form-signup dark-theme" @sl-submit=${this.signInSubmitHandler}>
                        <div class="input-group">
                            <sl-input size="large" pill style="padding-bottom: 1em;" name="email" type="email" placeholder="Email" required></sl-input>
                        </div>
                        <div class="input-group">
                            <sl-input size="large" pill style="padding-bottom: 4em;" name="password" type="password" placeholder="Password" required toggle-password></sl-input>
                        </div>
                        <sl-button size="large" pill class="submit-btn" type="primary" submit style="width: 100%;">LOG IN</sl-button>
                    </sl-form>
                    <p><br>Don’t have an account?</br> <a href="/signup" @click=${anchorRoute}>Sign up</a></p>
            </div>
        </div> 
        <!-- Right Section -->
        <div class="profile-right">
            <div class="welcome-box">
                <h2>Hi</h2>
                <h1>Welcome back!</h1>
            </div>
        </div>
    </div>
    `;
    render(template, App.rootEl);    
  }
}


export default new SignInView();