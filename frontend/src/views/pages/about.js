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
      ${Auth.isLoggedIn() ? 
            html`<va-app-header user=${JSON.stringify(Auth.currentUser)}></va-app-header>` : 
            html`<va-public-header></va-public-header>`
          } 
      <div class="page-content"> 
        <!-- Banner Section -->
      <section class="banner about">
        <div class="bg-img responsive-img">
          <img src="/images/about-group-hero-image-no-bg-1024.png" alt="Group of people">
        </div>
        <div class="banner-text">      
          <h1>About Us</h1>
        </div>
      </section>
      <section class="about-content">
        <article class="how-we-are">
          <h2>How We Are</h2>
          <p>
            As a not-for-profit organisation, the team at Mindline AU aims to raise awareness
            and support for young people to reach their full potential mentally, physically,
            and emotionally.
          </p>
        </article>
        <article class="our-mission">    
          <h2>Our Mission</h2>
          <p>
            Mindline AU's mission is for young users to have a safe web space to hang out and explore information, resources, 
            and tools that empower them to manage their wellbeing interactively and in a fun way! 
          </p>
        </article>
        <article class="contact-info">
          <h2>Contact Info</h2>
          <address>
            <p>
              <strong>Address:</strong> 143 Brookland Avenue, Merryville QLD 4506<br>
              <strong>Phone:</strong> <a href="tel:0406090996">1800 034 034</a><br>
              <strong>Email:</strong> <a href="mailto:hello@mindline.telstra.com.au">hello@mindline.telstra.com.au</a><br>
              <strong>Web:</strong> <a href="/">www.mindline-au.netlify.com.au</a>
            </p>
          </address>
        </article>
        
      </section>
    </div>
  `;
  render(template, App.rootEl);
}

}
export default new aboutUsView();