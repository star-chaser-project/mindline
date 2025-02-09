import App from '../../App'
import { html, render } from 'lit-html'
import { gotoRoute } from '../../Router'
import Auth from '../../Auth'
import Utils from '../../Utils'

// Image adapted from Canva – Accessed on December 18, 2024
class mentalHealthView {
  async init() {
    document.title = 'Mental Health';
    await this.render(); 
    Utils.pageIntroAnim();
  }

 render() {
    const template = html`
      ${Auth.isLoggedIn() ? 
        html`<va-app-header user=${JSON.stringify(Auth.currentUser)}></va-app-header>` : 
        html`<va-public-header></va-public-header>`
      }
      
      <div class="page-content page-centered"> 
        <section class="banner mental-health">
          <div class="banner-content"> 
          <div class="banner-text"> 
            <h1>Mental Health</h1>
            <h2>Because it Matters</h2>
            </div>
           <picture>
            <source srcset="images/mental-health/mental-health-hero-360.webp" media="(max-width: 480px)">
            <source srcset="images/mental-health/mental-health-hero-768.webp" media="(max-width: 768px)">
            <source srcset="images/mental-health/mental-health-hero-1024.webp" media="(min-width: 769px)">
            <img id="heroImage" src="images/mental-health/mental-health-hero-1024.webp" alt="Mental Health banner image of a boy meditating">
          </picture>  
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
    `;

    render(template, App.rootEl);
  }
}

export default new mentalHealthView();
