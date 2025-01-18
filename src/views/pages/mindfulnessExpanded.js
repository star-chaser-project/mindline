import App from '../../App'
import {html, render } from 'lit-html'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../Auth'
import Utils from '../../Utils'

 // Image adapted from Canva – Accessed on December 18, 2024
 class mindfulnessExpandedView {
  init(){
    document.title = 'Mindfulness Expanded'    
    this.render()    
    Utils.pageIntroAnim()
  }

  render(){
    const template = html`
      <va-app-header user=${JSON.stringify(Auth.currentUser)}>
        <a href="/" @click="${anchorRoute}"><img class="header-logo" src="/images/logo-mindline-no-wording-white-125.svg"></a>
      </va-app-header>       
      <div class="page-content">        
        <section class="banner mindfulness">  
        <img src="images/mindfulness-hero-image-837.png" class="responsive-img" >  
          <div class="banner-content"> 
          <h1>Mindfulness</h1>
            <h2 class="quote">Be Present</h2>
            <h2 class="quote">Be Peaceful</h2>
            <h2 class="quote">Be You</h2>
          </div>
        </section>
        <section class="nav-page">
        <h3>Ways to Practice...</h3>
          <div class="button-group">
          <sl-button type="primary" size="large" @click=${() => gotoRoute('')}>Meditation</sl-button>
          <sl-button type="primary" size="large" @click=${() => gotoRoute('')}>Mindfulness</sl-button>
          <sl-button type="primary" size="large" @click=${() => gotoRoute('')}>Motivation</sl-button>
          <sl-button type="primary" size="large" @click=${() => gotoRoute('')}>Motivation</sl-button>
          </div>
       </section>
      </div>            
           
    `
    render(template, App.rootEl)
  }
}


export default new mindfulnessExpandedView()