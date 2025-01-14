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
      <va-app-header title="Resources" user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
      <div class="page-content"> 
      <section class="banner">
        <img src="images/resources-hero-image-837.png" class="responsive-img" >    
        <div class ="banner-text">      
          <h1>Resources</h1>
          <h2>Supporting You Every Step of the Way.</p>
        </div>
      </section>
      <section class="nav-page">
        <div class="button-group">
          <sl-button type="primary" size="large" @click=${() => gotoRoute('/Support')}>Support</sl-button>
          <sl-button type="primary" size="large" @click=${() => gotoRoute('/Services')}>Services</sl-button>
          <sl-button type="primary" size="large" @click=${() => gotoRoute('/Guides')}>Guides</sl-button>
        </div>
      </section>
      </div>      
    `
    render(template, App.rootEl)
  }
}


export default new resourcesView()