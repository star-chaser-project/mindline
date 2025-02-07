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
        <div class="banner-content"> 
          <h1>About Us</h1>
          <picture>
            <img src="/images/about/about-hero-image-768.webp" alt="Group of people">
          </picture> 
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
              <strong><sl-icon name="mailbox"></sl-icon> &nbsp;Address:&nbsp;</strong>10-20 Walkers Rd, Morayfield QLD 4506 (We share our space with Youth Justice) &nbsp;<a href="/" @click="${anchorRoute}"><sl-icon name="geo-alt"><div class="location-map" class="responsive-img" >  
                <div><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d677.7431096476914!2d152.94963042937584!3d-27.11253173219729!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b93f165fe831745%3A0x644423865a59d123!2sYouth%20Justice!5e1!3m2!1sen!2sau!4v1737785324838!5m2!1sen!2sau" 
                  width="600" height="450" style="border:0;" allowfullscreen="" 
                  loading="lazy" referrerpolicy="no-referrer-when-downgrade">
                </iframe></div></sl-icon></a><br>              
              <strong><sl-icon name="telephone"></sl-icon> &nbsp;Phone:</strong> <a href="tel:1800 034 034"></a><br>
              <strong><sl-icon name="envelope"></sl-icon> &nbsp;Email:</strong> <a href="mailto:hello@mindline.telstra.com.au">hello@mindline.telstra.com.au</a><br>
              <strong><sl-icon name="globe"></sl-icon> &nbsp;Web:</strong> <a href="https://mindlineau-a3.netlify.app/">www.mindlineau-A3.netlify.app</a>
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