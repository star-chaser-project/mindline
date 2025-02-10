import App from '../../App'
import {html, render } from 'lit-html'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../Auth'
import Utils from '../../Utils'

 // Image adapted from Canva – Accessed on December 18, 2024
class resourcesView {
  init(){
    document.title = 'Resources'    
    this.render()    
    Utils.pageIntroAnim()
  }

 render() {
    const template = html`
      ${Auth.isLoggedIn() ? 
        html`<va-app-header user=${JSON.stringify(Auth.currentUser)}></va-app-header>` : 
        html`<va-public-header></va-public-header>`
      }

      <div class="page-content page-centered"> 
      <section class="banner resources">
        <div class ="banner-content"> 
          <div class="banner-text"> 
          <h1>Resources</h1>
          <h2>Supporting You Every Step of the Way.</h2>
          </div>
          <picture>
            <source srcset="images/resources/resources-hero-image-360.webp" media="(max-width: 480px)">
            <source srcset="images/resources/resources-hero-image-768.webp" media="(max-width: 768px)">
            <source srcset="images/resources/resources-hero-image-1024.webp" media="(min-width: 769px)">
            <img id="heroImage" src="images/resources/resources-hero-1024.webp" alt="resources banner image of a two women supporting each other">
          </picture>
        </div>
      </section>
      <section class="nav-page">
        <h3>Ways to deal with...</h3>
          <div class="button-group">
          <sl-button class="support-page" @click=${() => gotoRoute('/resourcesExpanded?tab=support')}>Support</sl-button>
          <sl-button class="services-page" @click=${() => gotoRoute('/resourcesExpanded?tab=services')}>Services</sl-button>
          <sl-button class="guides-page" @click=${() => gotoRoute('/resourcesExpanded?tab=guides')}>Guides</sl-button>
        </div>
      </section>
      </div>      
    `
    render(template, App.rootEl)
  }
}


export default new resourcesView()