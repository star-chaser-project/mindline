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
  // Image - adapted from Microsoft PowerPoint – Accessed on September 23, 2024
  // Animation - from https://shoelace.style/components/animation
  render(){
    const template = html`
      <va-app-header user=${JSON.stringify(Auth.currentUser)}>
        <a href="/" @click="${anchorRoute}"><img class="header-logo" src="/images/cafe-minori-logo-landscape-w.png">
      </a></va-app-header>
      <div class="page-content" class="centered">
        <div class="blurb-container">
          <div class="blurb-text"><h1 class="anim-in">Hey ${Auth.currentUser.firstName}</h1>
          <h1>Empower Your Life</h1>
          <h3>HARNESS YOUR POTENTIAL</h3>
            <p>Lorem lkalkadflkadflk.</p>
          </div>
          
          <div class="order-btn">
          <sl-animation name="heartBeat" duration="1000" play iterations="1"><sl-button type="primary" size="large" @click=${() => gotoRoute('/products')}>ORDER NOW</sl-button></sl-animation>
          </div>
          <img src="/images/background-group-sitting-outdoors-rs.png" >
        </div>
        
        
      </div>
     
    `;
    
    
    render(template, App.rootEl);
  }
}

export default new HomeView();