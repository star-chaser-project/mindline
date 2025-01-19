import App from './../../App';
import {html, render } from 'lit-html';
import {gotoRoute, anchorRoute } from './../../Router';
import Auth from './../../Auth';
import Utils from './../../Utils';


class HomeView {
  init(){    
    console.log('HomeView.init');
    document.title = 'Home';    
    this.render();    
    Utils.pageIntroAnim();    
  }
   // Image adapted from Canva – Accessed on December 18, 2024
  // Animation - from https://shoelace.style/components/animation
  render(){
    const template = html`
      <va-app-header user=${JSON.stringify(Auth.currentUser)}>
        <a href="/" @click="${anchorRoute}"><img class="header-logo" src="/images/logo-mindline-no-wording-white-125.svg"></a>
      </va-app-header>
    <div class="page-content home-page  ">
        <section class=" banner">
            <h1>Empower Your Life</h1>
            <img class="cloud" src="/images/home-hero-image-175.png" alt="Cloud Image">
            <h2>HARNESS YOUR POTENTIAL</h2>
        </section>
       <section class="nav-page">
        <h3>Ways to deal with...</h3>
          <div class="button-group">
            <sl-button variant="default"  size="large" @click=${() => gotoRoute('/mentalHealth')}>Mental Health</sl-button>
            <sl-button variant="default" size="large" @click=${() => gotoRoute('/mindfulness')}>Mindfulness</sl-button>
            <sl-button variant="default"  size="large" @click=${() => gotoRoute('/resources')}>Resources</sl-button>
          </div>
        </section> 
      </div>
     
    `;
    
    
    render(template, App.rootEl);
  }
}

export default new HomeView();
