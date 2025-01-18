import App from '../../App';
import {html, render } from 'lit-html';
import {gotoRoute, anchorRoute} from '../../Router';
import Auth from '../../Auth';
import Utils from '../../Utils';

class LocationView {
  init(){
    document.title = 'Location';    
    this.render();    
    Utils.pageIntroAnim();
  }

  render(){
    const template = html`
      <va-app-header title="Location" user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
      <div class="page-content">        
        <div class="location-info">  
         <div class="current-location">
            <br>
            <p></p>
            <h1>Currently at</h1>
            <p>Hyde Park Festival<br>
              Hyde Park<br>
              Corner Vincent Street & William Street<br>
              Perth
            </p>

            <br><br>

            <hr>
            
            <br><br>
          
          <div class="next-spot">
            <h1>Next spot</h1>
            <p>Perth Royal Show<br>
              Claremont Showgrounds<br>
              Claremont
            </p>
            <p>22 - 29 November 2024</p>
          </div>
        </div>
        <div class="location-map" class="responsive-img" >  
          
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3385.8410301466956!2d115.85982197578481!3d-31.938073074025386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2a32bac8b73c3ae5%3A0xf04f0b618f1ddc0!2sHyde%20Park!5e0!3m2!1sen!2sau!4v1731065135897!5m2!1sen!2sau" 
            width="1024" height="600" style="border:0;" 
            allowfullscreen="" loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade">
          </iframe>
      

        </div>
        <div class="event-banner">
          <img src="/images/event-banner.png">
        </div>
      </div>      
    `;
    render(template, App.rootEl);
  }
}


export default new LocationView();