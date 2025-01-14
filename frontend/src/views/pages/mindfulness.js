import App from '../../App'
import {html, render } from 'lit-html'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../Auth'
import Utils from '../../Utils'

 // Image adapted from Canva – Accessed on December 18, 2024
class mindfulnessView {
  init(){
    document.title = 'Mindfulness'    
    this.render()    
    Utils.pageIntroAnim()
  }

  render(){
    const template = html`
    <va-app-header title="Mindfulness" user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
      <div class="page-content">        
        <section class="banner">  
        <img src="images/mindfulness-hero-image-837.png" class="responsive-img" >  
          <div class="banner-content"> 
            <h2 class="quote">Be Present</h2>
            <h2 class="quote">Be Peaceful</h2>
            <h2 class="quote">Be You</h2>
          </div>
        </section>
        <section class="nav-page">
          <div class="button-group">
          <sl-button type="primary" size="large" @click=${() => gotoRoute('/Meditation')}>Meditation</sl-button>
          <sl-button type="primary" size="large" @click=${() => gotoRoute('/Breathing')}>Breathing</sl-button>
          <sl-button type="primary" size="large" @click=${() => gotoRoute('/Meditation')}>Meditation</sl-button>
          </div>
       </section>
      </div>            
           
    `
    render(template, App.rootEl)
  }
}


export default new mindfulnessView()