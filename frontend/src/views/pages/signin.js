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

  navActiveLinks(){	
    const currentPath = window.location.pathname;
    const navLinks = this.shadowRoot.querySelectorAll('.app-top-nav a, .app-side-menu-items a');
    navLinks.forEach(navLink => {
      if(navLink.href.slice(-1) == '#') return;
      if(navLink.pathname === currentPath){			
        navLink.classList.add('active');
      }
    });
  }
  
  hamburgerClick() {  
    const appMenu = document.querySelector('.app-side-menu'); // Use document instead of shadowRoot
    if (appMenu) {
      appMenu.show();
    } else {
      console.error('Drawer element not found!');
    }
  }
    
    menuClick(e){
      e.preventDefault();
      const pathname = e.target.closest('a').pathname;
      const appSideMenu = this.shadowRoot.querySelector('.app-side-menu');
      // hide appMenu
      appSideMenu.hide();
      appSideMenu.addEventListener('sl-after-hide', () => {
        // goto route after menu is hidden
        gotoRoute(pathname);
      });
    }

    handleTitleClick(path, e) {
      e.preventDefault();
      gotoRoute(path);
    }
  
    handleChevronClick(e) {
      e.stopPropagation();
      const details = e.target.closest('sl-details');
      if (details) {
        details.open = !details.open;
      }
    }
  
    signInSubmitHandler(e){
      e.preventDefault();
      const formData = e.detail.formData;
      const submitBtn = document.querySelector('.submit-btn');
      submitBtn.setAttribute('loading', '');    
      
      // sign in using Auth    
      Auth.signIn(formData, () => {
        submitBtn.removeAttribute('loading');
      });
    }
  



    

  render(){    
    const template = html`    
    <style>
    .signin-background {
        background-image: url('/images/login-background.png');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        height: 100vh;
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: -1;
    }
    
    .page-content {
        display: flex;
        width: 100%;
        height: 100vh;
        /* Full viewport height */
        margin: 0;
        padding: 0;
    }
    
    .signon2-container {
        background-color: rgba(5, 166, 209, 0.8);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        width: 45%;
        height: 100%;
        position: fixed;
        left: 0;
        top: 0;
        margin: 0;
        padding: 0;
    }
    
    .welcome-box {
        width: 55%;
        height: 100%;
        position: fixed;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        color: #fff;
    }
    
    .submit-btn::part(base) {
        background-color: #F4D35E;
        border-color: #F4D35E;
        color: #000000;
        style=padding-bottom: 1em;
    }
    
    .submit-btn::part(base):hover {
        background-color: #e5c654;
        border-color: #e5c654;
    }
    
    .submit-btn::part(base):active {
        background-color: #d6b84a;
        border-color: #d6b84a;
    }
    
    h2 {
        text-align: left;
        width: 250.61px;
        font-size: 5em;
    }
    
    p {
        width: 100%;
        margin-top: 1em;
    }
    
    .app-side-menu-logo {
        width: 150px !important;
        height: auto !important;
        /* Remove fixed height to maintain aspect ratio */
        top: 1em;
        display: block;
    }
    
    .hamburger-btn::part(base) {
        color: #fff;
        position: fixed;
        top: 1em;
        left: 1em;
        z-index: 100;
    }
    
    .app-top-nav {
        display: flex;
        height: 100%;
        align-items: center;
    }
    
    .app-top-nav a {
        display: inline-block;
        padding: .8em;
        text-decoration: none;
        color: #fff;
    }
    
    .app-side-menu-items a {
        display: block;
        padding: 0.5em;
        text-decoration: none;
        font-size: 1.3em;
        color: var(--app-header-txt-color);
        padding-bottom: 0.5em;
    }
    
    .home-logo {
        cursor: pointer;
        width: 150px !important;
        height: auto !important;
        /* Remove fixed height to maintain aspect ratio */
        position: absolute;
        top: 30px;
        left: 5em;
        z-index: 2;
    }
    
    .header-logo {
        cursor: pointer;
        width: 120px !important;
        height: auto !important;
        /* Remove fixed height to maintain aspect ratio */
        position: absolute;
        top: 40px;
        left: 21.5em;
        z-index: 2;
    }
    /* active nav links */
    
    .app-top-nav a.active,
    .app-side-menu-items a.active {
        font-weight: bold;
    }
    
    sl-details::part(summary) {
        transition: color 0.3s ease;
    }
    
    sl-details::part(summary):hover {
        color: var(--sl-color-primary-600);
        cursor: pointer;
    }
    
    .menu-expand {
        transition: color 0.3s ease;
        text-decoration: none;
    }
    
    .menu-expand:hover {
        color: var(--sl-color-primary-600);
        padding-left: 1.5em;
        transition: all 0.5s ease;
    }
    /* right side menu */
    
    .right-side-menu {
        --base-txt-color: #2F1E1F;
    }
    
    .menu-expand {
        font-size: 1.3em;
        margin-left: 1em;
        margin-top: 0.5em;
    }
    
    sl-drawer::part(label) {
        padding: 0.6em;
    }
</style>
<div class="signin-background"></div>
<sl-icon-button class="hamburger-btn" name="list" @click="${this.hamburgerClick}" style="font-size: 2em;"></sl-icon-button>

<sl-drawer class="app-side-menu" placement="left">
    <div slot="label">
        <a href="/" @click="${anchorRoute}"><img class="app-side-menu-logo" src="/images/logo-mindline-trimmed-no-wording-clr.png"></a>
    </div>
    <nav class="app-side-menu-items">
        <a href="/" @click="${anchorRoute}">Home</a>
        <sl-details>
            <div slot="summary" class="summary-content">
                <span class="summary-title" @click="${(e) => this.handleTitleClick('/mentalHealth', e)}">Mental Health</span>
            </div>
            <a class="menu-expand" href="">Stress</a>
            <a class="menu-expand" href="">Anxiety</a>
            <a class="menu-expand" href="">Depression</a>
        </sl-details>
        <sl-details>
            <div slot="summary" class="summary-content">
                <span class="summary-title" @click="${(e) => this.handleTitleClick('/mindfulness', e)}">Mindfulness</span>
            </div>
            <a class="menu-expand" href="">Meditation</a>
            <a class="menu-expand" href="">Breathing</a>
            <a class="menu-expand" href="">Motivation</a>
        </sl-details>
        <sl-details>
            <div slot="summary" class="summary-content">
                <span class="summary-title" @click="${(e) => this.handleTitleClick('/resources', e)}">Resources</span>
            </div>
            <a class="menu-expand" href="">Support</a>
            <a class="menu-expand" href="">Services</a>
            <a class="menu-expand" href="">Guides</a>
        </sl-details>

        <a href="/favouriteLines" @click="${anchorRoute}">Bookmarks</a>
        <a href="/about" @click="${anchorRoute}">About</a>
        <a href="/profile" @click="${anchorRoute}">Profile</a>

        <hr style="color: #fff width:10%">

        <sl-details summary="Privacy">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </sl-details>

        <sl-details summary="T&Cs">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </sl-details>

        <sl-details summary="Socials">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </sl-details>

        <hr style="color: #fff width:10%">

        <a href="mailto:hello@mindline.telstra.com.au">hello@mindline.telstra.com.au</a>
        <a href="tel:1800 034 034">1800 034 034</a>





    </nav>
</sl-drawer>
<div class="page-content page-centered">
    <div class="signon2-container">
        <a href="/" @click="${anchorRoute}"><img class="header-logo" src="/images/mindline-white-logo.png"></a>
        <div class="signinup-box">

            <h1 style="padding-bottom: 1em;">LOG IN</h1>
            <sl-form class="form-signup dark-theme" @sl-submit=${this.signInSubmitHandler}>
                <div class="input-group">
                    <sl-input size="large" pill style="padding-bottom: 1em;" name="email" type="email" placeholder="Email" required></sl-input>
                </div>
                <div class="input-group">
                    <sl-input size="large" pill style="padding-bottom: 4em;" name="password" type="password" placeholder="Password" required toggle-password></sl-input>
                </div>
                <sl-button size="large" pill class="submit-btn" type="primary" submit style="width: 100%;">LOG IN</sl-button>
            </sl-form>
            <p>
                <br>Don’t have an account?</br> <a href="/signup" @click=${anchorRoute}>Sign up</a></p>
        </div>


    </div>
    <div class="welcome-box">
        <h2>Hi</h2>
        <h1>Welcome back!</h1>
    </div>
</div>
    `;
    render(template, App.rootEl);    
  }
}


export default new SignInView();