import App from '../../App'
import {html, render } from 'lit-html'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../Auth'
import Utils from '../../Utils'


 // Image adapted from Canva – Accessed on December 18, 2024
class mentalHealthView {
  init(){
    document.title = 'Mental Health'    
    this.render()    
    Utils.pageIntroAnim()
  }
  

  render(){
    console.log('Auth.currentUser:', Auth.currentUser);
    const template = html`
    ${Auth.isLoggedIn() ? 
      html`<va-app-header user=${JSON.stringify(Auth.currentUser)}></va-app-header>` : 
      html`<va-public-header></va-public-header>`
    }
      </va-app-header>      
      <div class="page-content"> 
        <section class="mental-health">
          <div class="banner">
          <img src="images/mental-health-hero-768.webp" class="responsive-img" >    
            <div class="banner-content">     
              <h1>Mental Health</h1>
              <h2>Because it Matters</p>
            </div>
          </div>
        </section>
        <section class="nav-page nav-mental-health">
        <h3>Ways to deal with...</h3>
          <div class="button-group">
            <sl-button class="Stress" @click=${() => gotoRoute('/Stress')}>Stress</sl-button>
            <sl-button class="Anxiety" @click=${() => gotoRoute('/Anxiety')}>Anxiety</sl-button>
            <sl-button class="Depression" @click=${() => gotoRoute('/Depression')}>Depression</sl-button>
          </div>
       </section>
      
      </div>  
    `
    render(template, App.rootEl)
  }
}

export default new mentalHealthView()