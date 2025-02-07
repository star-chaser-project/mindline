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

  render(){
    const template = html`
       ${Auth.isLoggedIn() ? 
             html`<va-app-header user=${JSON.stringify(Auth.currentUser)}></va-app-header>` : 
             html`<va-public-header></va-public-header>`
           } 
      <div class="page-content"> 
      <section class="banner resources">
        <div class ="banner-content">  
          <h1>Resources</h1>
          <picture>
            <img src="images/resources/resources-hero-image-768.webp" class="responsive-img" >    
          <h2>Supporting You Every Step of the Way.</p>
        </div>
      </section>
      <section class="nav-page">
        <h3>Ways to deal with...</h3>
          <div class="button-group">
          <sl-button class="support" @click=${() => gotoRoute('/support')}>Support</sl-button>
          <sl-button class="services" @click=${() => gotoRoute('/services')}>Services</sl-button>
          <sl-button class="guides" @click=${() => gotoRoute('/guides')}>Guides</sl-button>
        </div>
      </section>
      </div>      
    `
    render(template, App.rootEl)
  }
}


export default new resourcesView()