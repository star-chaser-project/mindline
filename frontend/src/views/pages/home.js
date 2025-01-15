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
        <a href="/" @click="${anchorRoute}"><img class="header-logo" src="/images/logo-mindline-no-wording-white-125.png">
      </a></va-app-header>
    <div class="page-content centered home">
        <section class="banner home">
        <img src="/images/home-hero-image-175.png">
        <div class="blurb-container">
            <div class="blurb-text"><h1 class="anim-in">Hey ${Auth.currentUser.firstName}</h1>
            <h1>Empower Your Life</h1>
            <h2>HARNESS YOUR POTENTIAL</h2>
            </div>
        </section>
        <section class="nav-page">
          <div class="button-group">
          <h3>Explore...</h3>
            <sl-button type="primary" size="large" @click=${() => gotoRoute('/mentalHealth')}>MntalHealth</sl-button>
            <sl-button type="primary" size="large" @click=${() => gotoRoute('/mindfulness')}>Mindfulness</sl-button>
            <sl-button type="primary" size="large" @click=${() => gotoRoute('/resources')}>Resources</sl-button>
          </div>
        </section> 
      </div>
     
    `;
    
    
    render(template, App.rootEl);
  }
}

export default new HomeView();