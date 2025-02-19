import App from './../../App';
import {html, render } from 'lit-html';
import {gotoRoute, anchorRoute } from './../../Router';
import Auth from './../../Auth';
import Utils from './../../Utils';

class HomeView {
  init(){    
    //console.log('HomeView.init');
    document.title = 'Home';    
    this.render();    
    Utils.pageIntroAnim();    
  }
   // Image adapted from Canva – Accessed on December 18, 2024
 render() {
    const template = html`
     <div class="home-header">
      ${Auth.isLoggedIn() ? 
        html`<va-app-header user=${JSON.stringify(Auth.currentUser)}></va-app-header>` : 
        html`<va-public-header></va-public-header>`
      }
  
    <div class="page-content home-page">
      <div class="home-bg"> 
        <section class="home-banner">
            <h1>Empower </br>Your </br>Life</h1>
            <picture>
              <source srcset="images/home/home-hero-image-360.webp" media="(max-width: 480px)">
              <source srcset="images/home/home-hero-image-768.webp" media="(max-width: 768px)">
              <source srcset="images/home/home-hero-image-768.webp" media="(min-width: 1024px)">
              <img class="cloud" id="heroImage" src="images/home/home-hero-image-1024.webp" alt="banner image of a young person meditating">
            </picture>
            <h2>HARNESS YOUR POTENTIAL</h2>
        </section>
       <section class ="secondary-content">
       <div class="nav-page">
        <h3>Ways to deal with...</h3>
          <div class="button-group">
            <sl-button class="home-bth-Mental-Health" @click=${() => gotoRoute('/mentalHealth')}>Mental Health</sl-button>
            <sl-button class="home-bth-mindfulness" @click=${() => gotoRoute('/mindfulness')}>Mindfulness</sl-button>
            <sl-button class="home-bth-resources" @click=${() => gotoRoute('/resources')}>Resources</sl-button>
          </div>
        </div>
        </section> 
      </div> 
    </div>
   </div>
    `;
    
    
    render(template, App.rootEl);
  }
}

export default new HomeView();
