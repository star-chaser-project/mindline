import { LitElement, html, css } from '@polymer/lit-element'
import {anchorRoute, gotoRoute} from '../Router'
import App from '../App'

customElements.define('va-public-header', class PublicHeader extends LitElement {
  static get properties(){
    return {
      title: { type: String }
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

  hamburgerClick(){  
    const appMenu = this.shadowRoot.querySelector('.app-side-menu')
    appMenu.show()
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


      .public-header {
        background: transparent !important;
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        height: var(--public-header-height);
        
        display: flex;
        z-index: 9;
        align-items: center;
      }
      

      .public-header-main {
        flex-grow: 1;
        display: flex-start;
        align-items: center;
      }

      .public-header-main::slotted(h1){
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
        color: var(--app-header-txt-color);
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
        color: var(--app-header-txt-color);
      }

      .app-side-menu-logo {
        width: 120px;
        margin-bottom: 1em;
        position: absolute;
        top: 2em;
        left: 1.5em;
      }

      .page-title {
        color: var(--public-header-txt-color);
        margin-right: 0.5em;
        font-size: var(--public-header-title-font-size);
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
    
    <header class="public-header">
          <sl-icon-button class="hamburger-btn" name="list" @click="${this.hamburgerClick}" style="font-size: 2em;"></sl-icon-button>       
          
          <div class="public-header-main">
            ${this.title ? html`
              <h1 class="page-title">${this.title}</h1>
            `:``}
            <slot></slot>
          </div>
    
          <nav class="app-top-nav">
            
            
            
            
          </nav>
        </header>
    
        <sl-drawer class="app-side-menu" placement="left">
        <a href="/" @click="${this.menuClick}"><img class="app-side-menu-logo" src="/images/logo-mindline-trimmed-no-wording-clr.png"></a>
          <br>
          <nav class="app-side-menu-items">
            <a href="/mentalHealth" @click="${this.menuClick}">Mental Health</a>
            <a href="/mindfulness" @click="${this.menuClick}">Mindfulness</a>
            <a href="/resources" @click="${this.menuClick}">Resources</a>
            <a href="/favouriteLines" @click="${this.menuClick}">Bookmarks</a>
            <a href="/about" @click="${this.menuClick}">About</a>
            <a href="/profile" @click="${this.menuClick}">Profile</a>   
            
            <hr style="color: #fff width:10%" >
    
            <a href="/products" @click="${this.menuClick}">Privacy</a>
            <a href="/products" @click="${this.menuClick}">T&Cs</a>
            <a href="/products" @click="${this.menuClick}">Socials</a>
    
            <hr style="color: #fff width:10%" >
    
            <a href="mailto:hello@mindline.telstra.com.au">hello@mindline.telstra.com.au</a>
            <a href="tel:1800 034 034">1800 034 034</a>
    
           
            
            
    
          </nav>  
        </sl-drawer>
        `;
    }
})
