import App from '../../App';
import {html, render } from 'lit-html';
import {gotoRoute, anchorRoute} from '../../Router';
import Auth from '../../Auth';
import Utils from '../../Utils';

class aboutUsView {
  init(){
    document.title = 'About Us';    
    this.render();    
    Utils.pageIntroAnim();
  }

  // Image adapted from Microsoft PowerPoint – Accessed on September 23, 2024
  render(){
    const template = html`
      <va-app-header title="About Us" user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
      <div class="page-content">        
        <div class="owner-bio">
        <sl-animation name="fadeIn" duration="2000" play iterations="1">
          <div class="owner-bio-text">
            <h1>My Story</h1>
            <p>
              I grew up with the aroma of freshly made coffee <br>
              every morning as my Mum and Nona made that every <br> 
              day coming from a big Italian family. My coffee van <br> 
              dream was born after a visit to see my Grandfather <br> 
              in Minori, Italy. His love of coffee and serving his <br>
              community inspired me to do the same here in Perth. <br>
              I've been serving great coffee and delicious savoury <br>
              and sweet treats from my quirky coffee van since <br>
              August 2024. I look forward to meeting you soon.<br><br>

              <b><i>Liz</i></b> <br>
              xx
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