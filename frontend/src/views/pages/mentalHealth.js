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
    const template = html`
      <va-app-header title="Mental Health" user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
      <div class="page-content"> 
        <section class="banner">
            <img src="images/mental-health-hero-image.png" class="responsive-img" >    
              <div class ="banner-text">      
                <h1>Mental Health</h1>
                <h2>Because it Matters</p>
              </div>
        </section>
        <section class="nav-page">
         <section class="nav-page">
          <div class="button-group">
          <sl-button type="primary" size="large" @click=${() => gotoRoute('/Stress')}>Stress</sl-button>
          <sl-button type="primary" size="large" @click=${() => gotoRoute('/Anxiety')}>Anxiety</sl-button>
          <sl-button type="primary" size="large" @click=${() => gotoRoute('/Depression')}>Depression</sl-button>
          </div>
       </section>
      
      </div>  
    `
    render(template, App.rootEl)
  }
}


export default new mentalHealthView()