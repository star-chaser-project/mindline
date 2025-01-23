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
      ${Auth.isLoggedIn() ? 
            html`<va-app-header user=${JSON.stringify(Auth.currentUser)}></va-app-header>` : 
            html`<va-public-header></va-public-header>`
          }       
      <div class="page-content">        
        <section class="banner mindfulness">  
        <img src="images/mindfulness-hero-image-837.png" class="responsive-img" >  
          <div class="banner-content"> 
            <h2 class="quote">Be Present</h2>
            <h2 class="quote">Be Peaceful</h2>
            <h2 class="quote">Be You</h2>
          </div>
        </section>
        <section class="nav-page">
        <h3>Ways to Practice...</h3>
          <div class="button-group">
          <sl-button type="primary" size="large" @click=${() => gotoRoute('/Meditation')}>Meditation</sl-button>
          <sl-button type="primary" size="large" @click=${() => gotoRoute('/mindfulness')}>mindfulness</sl-button>
          <sl-button type="primary" size="large" @click=${() => gotoRoute('/Meditation')}>Meditation</sl-button>
          </div>
       </section>
      </div>            
           
    `
    render(template, App.rootEl)
  }
}


export default new mindfulnessExpandedView()