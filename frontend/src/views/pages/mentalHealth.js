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
        <section class="banner mental-health">
          <div class="banner-content">  
            <h1>Mental Health</h1>
            <picture>
            <img src="images/mental-health/mental-health-hero-768.webp" class="responsive-img" >    
            </picture>  
            <h2>Because it Matters</p>
          </div>
        </section>
        <section class="nav-page">
        <h3>Ways to deal with...</h3>
          <div class="button-group">
            <sl-button class="stress" @click=${() => gotoRoute('/stress')}>Stress</sl-button>
            <sl-button class="anxiety" @click=${() => gotoRoute('/anxiety')}>Anxiety</sl-button>
            <sl-button class="depression" @click=${() => gotoRoute('/depression')}>Depression</sl-button>
            </div>
       </section>
      
      </div>  
    `
    render(template, App.rootEl)
  }
}

export default new mentalHealthView()