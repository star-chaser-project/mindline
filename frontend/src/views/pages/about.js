import App from '../../App';
import {html, render } from 'lit-html';
import {gotoRoute, anchorRoute} from '../../Router';
import Auth from '../../Auth';
import Utils from '../../Utils';

class aboutUsView {
  init(){
    document.title = 'About';    
    this.render();    
    Utils.pageIntroAnim();
  }

  // Image adapted from Microsoft PowerPoint – Accessed on September 23, 2024
  render(){
    const template = html`
      <va-app-header title="About" user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
      <div class="page-content">        
        <div class="owner-bio">
        <sl-animation name="fadeIn" duration="2000" play iterations="1">
          <div class="owner-bio-text">
            <h1>About Us</h1>
            <p>
              Mindline AU's is a not-for-profit organisation on a mission to raise awareness
              and support for young people to reach their full potential mentally, physically,
              and emotionally<br><br>

              <b><i>The Mindline Team</i></b>
              
            </p>
          </div>
          <div>
          <h1>Our Mission</h1>
            <p>
              For you to have a safe space to hang out and explore resources and tools
              to empower you to manage your wellbeing, have fun! <br><br>

              <b><i>The Mindline Team</i></b>
              
            </p>
          </div>

          <div>
          <h1>Contact Info</h1>
            <p>
              Address: 143 Brookland Avenue, Merryville QLD 4506 
              Phone: <a href="tel:0406 090 996">1800 034 034</a>
              Email: <a href="mailto:hello@mindline.telstra.com.au">hello@mindline.telstra.com.au</a>
              Web: www.mindline-au@netlify.com.au
                            
              <br><br>
                      
            </p>
          </div>

        </sl-animation>
          <div class="bg-img" class="responsive-img"><img src="/images/cafe-minori-owner-with-truck-custom.png"></div>
        </div>
      </div>      
    `;
    render(template, App.rootEl);
  }
}


export default new aboutUsView();