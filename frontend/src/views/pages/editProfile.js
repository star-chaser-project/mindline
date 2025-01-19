import App from './../../App';
import {html, render } from 'lit-html';
import {gotoRoute, anchorRoute} from './../../Router';
import Auth from './../../Auth';
import Utils from './../../Utils';
import UserAPI from './../../UserAPI';
import Toast from '../../Toast';
import moment from 'moment';

class EditProfileView {
  init(){
    console.log('EditProfileView.init');
    document.title = 'Edit Profile';
    this.user = Auth.currentUser;
    this.render();
    Utils.pageIntroAnim();
    this.getUser();
  }

  async getUser(){
    try {
      this.user = await UserAPI.getUser(Auth.currentUser._id);
      this.render();
    }catch(err){
      Toast.show(err, 'error');
    }
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

    async updateProfileSubmitHandler(e) {
      e.preventDefault();
      const formData = e.detail.formData;
      const submitBtn = document.querySelector('.submit-btn');
      submitBtn.setAttribute('loading', '');
      
      try {
        const updatedUser = await UserAPI.updateUser(Auth.currentUser._id, formData);
        delete updatedUser.password;
        this.user = updatedUser;
        Auth.currentUser = updatedUser;
        Toast.show('Profile updated successfully');
        
        // Wait brief moment for state to update
        setTimeout(() => {
          gotoRoute('/profile');
        }, 300);
        
      } catch(err) {
        console.error('Profile update error:', err);
        Toast.show(err, 'error');
      }
      
      submitBtn.removeAttribute('loading');
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
  

    .submit-btn::part(base) {
        background-color: #F4D35E;
        border-color: #F4D35E;
        color: #000000;
        padding-bottom: 1em;
        font-family: inherit;
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
      width:238.61px;
      }

      p {
      width: 100%;
      margin-top: 1em;
      }
      
      .app-side-menu-logo {
      width: 150px !important; 
        height: auto !important; /* Remove fixed height to maintain aspect ratio */
        
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

      .header-logo {
        cursor: pointer;
        width: 120px !important; 
        height: auto !important; /* Remove fixed height to maintain aspect ratio */
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

    .custom-file-upload {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold; 
    padding: 6px 12px;
    cursor: pointer;
    background-color:#FFFFFF;
    border-radius: 30px;
    color:rgb(0, 0, 0);
    width: 100%;
    height: 47px;
    width: 100%;
  }

  .custom-file-upload:hover {
    background-color: #e2e8f0;
  }

  .avatar-image {
  margin-bottom: 1em;
  width: 150px;  /* Set width */
  height: 150px; /* Fix height typo */
  --size: 150px; /* Shoelace avatar custom property */
}

.avatar-image::part(base) {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
              
              <hr style="color: #fff width:10%" >
      
              <sl-details summary="Privacy">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </sl-details>
            
              <sl-details summary="T&Cs">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </sl-details>

              <sl-details summary="Socials">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </sl-details>
      
              <hr style="color: #fff width:10%" >
      
              <a href="mailto:hello@mindline.telstra.com.au">hello@mindline.telstra.com.au</a>
              <a href="tel:1800 034 034">1800 034 034</a>
              
      
        </nav>  
      </sl-drawer>

      <div class="page-content page-centered"> 
        ${(this.user == null) ? html`
          <sl-spinner></sl-spinner>
        `:html`
        <div class="signon2-container">
              <a @click="${() => gotoRoute('/')}"><img class="header-logo" src="/images/mindline-white-logo.png"></a>
          <div class="signinup-box">

          
                  <sl-avatar style="--size: 200px; margin-bottom: 1em;" 
                    image="${Auth.currentUser.avatar ? `${App.apiBase}/images/${Auth.currentUser.avatar}` : ''}">
                  </sl-avatar>
                      
          <h1>My Details</h1>
          <p>Updated: ${moment(Auth.currentUser.updatedAt).format('D MMMM YYYY @ h:mm a')}</p>
          <sl-form class="page-form" @sl-submit=${this.updateProfileSubmitHandler.bind(this)}>
            <div class="input-group">
              <sl-input size="large" pill style= "padding-bottom: 1em;" type="text" name="firstName" value="${this.user.firstName}" placeholder="First Name"></sl-input>
            </div>
            <div class="input-group">
              <sl-input size="large" pill style= "padding-bottom: 1em;" type="text" name="lastName" value="${this.user.lastName}" placeholder="Last Name"></sl-input>
            </div>
            <div class="input-group">
              <sl-input size="large" pill style= "padding-bottom: 1em;" type="text" name="email" value="${this.user.email}" placeholder="Email Address"></sl-input>
            </div> 
                 
            <div class="input-group">
  
                    <label for="file-upload" class="custom-file-upload">
                      ${this.user.avatar ? 'Change Avatar' : 'Upload Avatar'}
                    </label>
                    <input id="file-upload" type="file" name="avatar" style="display: none;" />
            </div>
            <br>
            
              <sl-button size="large" pill type="primary" style="width: 100%;" class="submit-btn" submit>Update Profile</sl-button>
            
          </sl-form>
          </div>
        `}
      </div>
    `;
    render(template, App.rootEl);
  }
}

export default new EditProfileView();