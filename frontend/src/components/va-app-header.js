import { LitElement, html, css } from '@polymer/lit-element';
import {anchorRoute, gotoRoute} from './../Router';
import Auth from './../Auth';
import App from './../App';

customElements.define('va-app-header', class AppHeader extends LitElement {
  constructor(){
    super();
  }

  static get properties(){
    return {
      title: {
        type: String
      },
      user: {
        type: Object
      }
    };
  }

  firstUpdated(){
    super.firstUpdated();
    this.navActiveLinks();    
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

  hamburgerClick(){  
    const appMenu = this.shadowRoot.querySelector('.app-side-menu');
    appMenu.show();
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

  render(){    
    return html`
    <style>      
      * {
        box-sizing: border-box;
      }
      .app-header {
        background: var(--brand-color);
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        height: var(--app-header-height);
        color: #fff;
        display: flex;
        z-index: 9;
        box-shadow: 4px 0px 10px rgba(0,0,0,0.2);
        align-items: center;
      }
      

      .app-header-main {
        flex-grow: 1;
        display: flex;
        align-items: center;
      }

      .app-header-main::slotted(h1){
        color: #fff;
      }

      .app-logo a {
        color: #fff;
        text-decoration: none;
        font-weight: bold;
        font-size: 1.2em;
        padding: .6em;
        display: inline-block;        
      }

      .app-logo img {
        width: 90px;
      }
      
      .hamburger-btn::part(base) {
        color: #fff;
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
        padding: .5em;
        text-decoration: none;
        font-size: 1.3em;
        color: #2F1E1F;
      }

      .app-side-menu-logo {
        width: 120px;
        margin-bottom: 1em;
        position: absolute;
        top: 2em;
        left: 1.5em;
      }

      .page-title {
        color: var(--app-header-txt-color);
        margin-right: 0.5em;
        font-size: var(--app-header-title-font-size);
      }

      /* active nav links */
      .app-top-nav a.active,
      .app-side-menu-items a.active {
        font-weight: bold;
      }

      .menu-item::part(label) :hover {
        color: #fff;
      }


      /* right side menu */
      .right-side-menu {
        --base-txt-color: #2F1E1F;
      }


      /* RESPONSIVE - MOBILE ------------------- */
      @media all and (max-width: 768px){       
        
        .app-top-nav {
          display: none;
        }
      }

    </style>
  
    <header class="app-header">
      <sl-icon-button class="hamburger-btn" name="list" @click="${this.hamburgerClick}" style="font-size: 2em;"></sl-icon-button>       
      
      <div class="app-header-main">
        ${this.title ? html`
          <h1 class="page-title">${this.title}</h1>
        `:``}
        <slot></slot>
      </div>

      <nav class="app-top-nav">
        <a href="/" @click="${anchorRoute}">Home</a>  
        ${this.user.accessLevel == 2 ? html`
          <a href="/favourites" @click="${anchorRoute}">Add Favourite</a>
          <a href="/favourites" @click="${anchorRoute}">Remove Favourite</a>  
          <a href="/newProduct" @click="${anchorRoute}">Add Product</a> 
          <a href="/products" @click="${anchorRoute}">View Products</a>
          <a href="/orders" @click="${anchorRoute}">View Orders</a>
        ` : ''}
        ${this.user.accessLevel == 1 ? html`
          <a href="/about" @click="${anchorRoute}">About</a>
          <a href="/aboutUs" @click="${anchorRoute}">About Us</a>
          <a href="/location" @click="${anchorRoute}">Location</a>
          <a href="/products" @click="${anchorRoute}">View Products</a>
          <a href="/orders" @click="${anchorRoute}">View Orders</a>
          <sl-icon-button class="cart-icon" name="cart3" label="Add to Cart" style="font-size: 20px"></sl-icon-button>

        ` : ''}
        
        <sl-dropdown>
          <a slot="trigger" href="#" @click="${(e) => e.preventDefault()}">
            <sl-avatar style="--size: 40px;" image=${(this.user && this.user.avatar) ? `${App.apiBase}/images/${this.user.avatar}` : ''}></sl-avatar> ${this.user && this.user.firstName}
          </a>
          <sl-menu class="right-side-menu">            
            <sl-menu-item @click="${() => gotoRoute('/profile')}">Profile</sl-menu-item>
            <sl-menu-item @click="${() => gotoRoute('/editProfile')}">Edit Profile</sl-menu-item>
            <sl-menu-item @click="${() => Auth.signOut()}">Sign Out</sl-menu-item>
          </sl-menu>
        </sl-dropdown>
      </nav>
    </header>

    <sl-drawer class="app-side-menu" placement="left">
    <a href="/" @click="${this.menuClick}"><img class="app-side-menu-logo" src="/images/cafe-minori-logo-portrait.png"></a>
      <br>
      <br>
      <nav class="app-side-menu-items">
        ${this.user.accessLevel == 2 ? html`
        
        <a href="/mentalHealth" @click="${this.menuClick}">Mental Health</a>
        <a href="/mindfulness" @click="${this.menuClick}">Mindfulness</a>
        <a href="/resources" @click="${this.menuClick}">Resources</a>
        <a href="/favourites" @click="${this.menuClick}">Favourites</a>
        <a href="/about" @click="${this.menuClick}">About</a>
        <a href="/profile" @click="${this.menuClick}">Profile</a>
        <a href="#" @click="${() => Auth.signOut()}">Sign Out</a>

        <hr style="color: #fff width:10%" >

        <a href="/products" @click="${this.menuClick}">Privacy</a>
        <a href="/products" @click="${this.menuClick}">T&Cs</a>
        <a href="/products" @click="${this.menuClick}">Socials</a>

        <hr style="color: #fff width:10%" >

        <a href="mailto:hello@mindline.telstra.com.au">hello@mindline.telstra.com.au</a>
        <a href="tel:1800 034 034">1800 034 034</a>

        
        <a href="/newProduct" @click="${this.menuClick}">Add Product</a> 
        ` : ''}
        <a href="/aboutUs" @click="${this.menuClick}">About Us</a>
        <a href="/products" @click="${this.menuClick}">View Products</a>
        <a href="/orders" @click="${this.menuClick}">View Orders</a>
        <a href="/favouriteProducts" @click="${this.menuClick}">Favourites</a>
        <a href="/location" @click="${this.menuClick}">Location</a>
        <a href="/aboutUs" @click="${this.menuClick}">About Us</a>
        
      </nav>  
    </sl-drawer>
    `;
  }
  
});

