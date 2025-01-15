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

  // Image adapted from Canva – Accessed on December 18, 2024
  // Animation from Shoelace - access September 23, 2024. https://shoelace.style/components/animation
  // <sl-animation name="fadeIn" duration="2000" play iterations="1"></sl-animation>
  render(){
    const template = html`
       <va-app-header user=${JSON.stringify(Auth.currentUser)}>
           <a href="/" @click="${anchorRoute}"><img class="header-logo" src="/images/logo-mindline-no-wording-white-125.png"></a>
           </va-app-header>  
      <div class="page-content about">        
            <div>
              <h1>About Us</h1>
            <p>
              As a not-for-profit organisation, the team at Mindline AU aims to raise awareness
              and support for young people to reach their full potential mentally, physically,
              and emotionally<br><br>
              
            </p>            
            </div>
            
            <div>
              <h1>Our Mission</h1>
            <p>
              Mindline AU's mission is for young users to have a safe web space to hang out and explore information, resources and tools
              that empower them to manage their wellbeing that's interactive and fun! <br><br>

              <b><i>The Mindline Team</i></b>
              
            </p>
            </div>

            <div>
              <h1>Contact Info</h1>
            <p>
              Address: 143 Brookland Avenue, Merryville QLD 4506 
              Phone: <a href="tel:0406 090 996">1800 034 034</a>
              Email: <a href="mailto:hello@mindline.telstra.com.au">hello@mindline.telstra.com.au</a>
              Web: <a href=“http://Internet URL goes here.”>Web: www.mindline-au@netlify.com.au
                            
              <br><br>
                      
            </p>
            </div>

          <div class="bg-img" class="responsive-img"><img src="/images/about-group-hero-image-no-bg-768.png"></div>
        </div>
      </div>      
    `;
    render(template, App.rootEl);
  }
}


export default new aboutUsView();