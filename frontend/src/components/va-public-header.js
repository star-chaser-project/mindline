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
  
  menuClick(e) {
    e.preventDefault();
    const pathname = e.target.closest('a').pathname;
    const appSideMenu = this.shadowRoot.querySelector('.app-side-menu');
  
    if (appSideMenu) {
      appSideMenu.hide();
      appSideMenu.addEventListener('sl-after-hide', () => {
        gotoRoute(pathname);
      });
    }
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
        padding: 0.5em;
        text-decoration: none;
        font-size: 1.3em;
        color: var(--app-header-txt-color);
        padding-bottom: 0.5em;
      }


      .app-side-menu-logo {
        width: 150px !important; 
        height: auto !important; /* Remove fixed height to maintain aspect ratio */
        top: 1em;
        display: block;
      }

      .page-title {
        color: var(--public-header-txt-color);
        margin-right: 0.5em;
        font-size: var(--public-header-title-font-size);
      }

      /* active nav links */
      .app-top-nav a.active,
      
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

      .user-menu {
        margin-right: 2em;
      }

      sl-details::part(base) {
  display: block;
  border: none;
  padding: 0.65em;
}

sl-details::part(content) {
  border: none;
  padding: 0;
}

sl-details::part(header) {
  border: none;
  padding: 0;
}

sl-details::part(summary) {
  color: var(--sl-color-neutral-600);
  font-size: 1.3em;
  color: var(--app-header-txt-color);
}

sl-details::part(base) {
  border: none;
}

.menu-expand {
        font-size: 1.3em;
        margin-left: 1em;
        margin-top: 0.5em;
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
            
            <sl-dropdown class="user-menu">
                      <a slot="trigger" href="#" @click="${(e) => e.preventDefault()}">
                        <sl-avatar style="--size: 40px;">Login</sl-avatar> 
                      </a>
                      <sl-menu class="right-side-menu">            
                        <sl-menu-item @click="${() => gotoRoute('/signin')}">Login</sl-menu-item>
                        
                      </sl-menu>
                    </sl-dropdown>
            
            
          </nav>
        </header>
    
        <sl-drawer class="app-side-menu" placement="left">
          <div slot="label">  
          <a href="/" @click="${this.menuClick}"><img class="app-side-menu-logo" src="/images/logo-mindline-trimmed-no-wording-clr.svg"></a>
              </div>
            <br>
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
              
              <a href="/about" @click="${this.menuClick}">About</a>
              
              <a href="/signin" @click="${this.menuClick}">Profile</a>   
              <a href="/signin" @click="${this.menuClick}">Bookmarks</a>
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
