import App from './../../App';
import {html, render } from 'lit-html';
import {gotoRoute, anchorRoute} from './../../Router';
import Auth from './../../Auth';
import Utils from './../../Utils';


class ProfileView {
  init(){
    console.log('ProfileView.init');
    document.title = 'Profile';
    this.user = Auth.currentUser;
    this.render()    ;
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

    editSubmitHandler(e){
            e.preventDefault();    
            const editBtn = document.querySelector('.edit-btn');
            submitBtn.setAttribute('loading', '');    
            const formData = e.detail.formData;
            
            // sign up using Auth
            Auth.signUp(formData, () => {
              submitBtn.removeAttribute('loading');
            }); 
          }

    

  render(){
    console.log('Auth.currentUser:', Auth.currentUser);
    if (!Auth.currentUser) {
      console.error('No user data available')
      return
  }
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
        height: 100vh; /* Full viewport height */
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
  

    .edit-btn::part(base) {
        background-color: #F4D35E;
        border-color: #F4D35E;
        color: #000000;
        style= padding-bottom: 1em;
      }

    .edit-btn::part(base):hover {
        background-color: #e5c654;
        border-color: #e5c654;
      }

    .edit-btn::part(base):active {
        background-color: #d6b84a;
        border-color: #d6b84a;
      }

      h2 {
      text-align: left;
      min-width:238.61px;
      font-size: 5em;
      }

      p {
      width: 100%;
      margin-top: 1em;
      }
      
      .app-side-menu-logo {
        width: 150px !important; 
        height: auto !important; /* Remove fixed height to maintain aspect ratio */
        cursor: pointer;
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

      .user-menu a {
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
        height: auto !important; /* Remove fixed height to maintain aspect ratio */
        position: absolute;
        top: 30px;
        left: 42%;
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
      
      .user-menu {
        position: absolute;
        top: 1em;
        right: 2em;
        z-index: 9;
      }

      .right-side-menu {
        
        --base-txt-color: #2F1E1F;
      }
    </style>  

    <div class="signin-background"></div>
    <sl-dropdown class="user-menu">
              <a slot="trigger" href="#" @click="${(e) => e.preventDefault()}">
                <sl-avatar style="--size: 40px;" image=${(this.user && this.user.avatar) ? `${App.apiBase}/images/${this.user.avatar}` : ''}></sl-avatar> ${this.user && this.user.firstName}
              </a>
              <sl-menu class="right-side-menu">            
                <sl-menu-item @click="${() => gotoRoute('/profile')}">Profile</sl-menu-item>
                <sl-menu-item @click="${() => gotoRoute('/editProfile')}">Edit Profile</sl-menu-item>
                <sl-menu-item @click="${() => Auth.signOut()}">Sign Out</sl-menu-item>
              </sl-menu>
    </sl-dropdown>
    <sl-icon-button class="hamburger-btn" name="list" @click="${this.hamburgerClick}" style="font-size: 2em;"></sl-icon-button>
    
    <sl-drawer class="app-side-menu" placement="left">
        <div slot="label">  
          <a @click="${() => gotoRoute('/')}"><img class="app-side-menu-logo" src="/images/logo-mindline-trimmed-no-wording-clr.png"></a>
        </div>
        <nav class="app-side-menu-items">
        <a href="/" @click="${this.menuClick}">Home</a>
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
              
              <hr style="color: #fff width:10%" >
      
              <a href="/products" @click="${anchorRoute}">Privacy</a>
              <a href="/products" @click="${anchorRoute}">T&Cs</a>
              <a href="/products" @click="${anchorRoute}">Socials</a>
      
              <hr style="color: #fff width:10%" >
      
              <a href="mailto:hello@mindline.telstra.com.au">hello@mindline.telstra.com.au</a>
              <a href="tel:1800 034 034">1800 034 034</a>
              
      
        </nav>  
      </sl-drawer>

      
      <div class="page-content page-centered">  
        <div class="signon2-container">
              <a @click="${() => gotoRoute('/')}"><img class="home-logo" src="/images/mindline-white-logo.png"></a>
              <div class="signinup-box">
                <div class="avatar">
                  <sl-avatar style="--size: 200px; margin-bottom: 1em;" 
                    image="${Auth.currentUser.avatar ? `${App.apiBase}/images/${Auth.currentUser.avatar}` : ''}">
                  </sl-avatar>
                </div>
                <h1 >${Auth.currentUser.firstName} ${Auth.currentUser.lastName}</h1>     
                <p>${Auth.currentUser.email}</p>  
                <sl-form class="form-signup" @sl-submit=${this.signUpSubmitHandler}>
                         
                  <sl-button size="large" pill class="edit-btn" type="primary" style="width: 100%;" @click=${()=> gotoRoute('/editProfile')}>EDIT PROFILE</sl-button>
                </sl-form>
                
              </div>
            
          </div>
          </div>
        <div class="welcome-box">
                  <h2>Hi ${Auth.currentUser.firstName}</h2>
                  <h1 style= "min-width: 250.61px;" >All about you</h1>
          </div>
        </div>  
    `;
    render(template, App.rootEl);
  }
}


export default new ProfileView();