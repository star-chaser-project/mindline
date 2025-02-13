import App from '../../App';
import {html, render } from 'lit-html';
import {gotoRoute, anchorRoute} from '../../Router';
import Auth from '../../Auth';
import Utils from '../../Utils';
import UserAPI from './../../UserAPI';
import Toast from '../../Toast';

class GuideView {
  init(){
    document.title = 'Guide';    
    this.render();    
    Utils.pageIntroAnim();
    if (Auth.currentUser?.newUser) {
      this.updateCurrentUser();
    }
  }

  async updateCurrentUser(){
    try{
      const updatedUser = await UserAPI.updateUser(Auth.currentUser._id, { newUser: false});
      Auth.currentUser = updatedUser;
      console.log('user updated');

      
    }catch(err){
        Toast.show(err, 'error');
    }
  }
  // Animation - from https://shoelace.style/components/animation/
  render(){
    const template = html`
      ${Auth.isLoggedIn() ? 
                html`<va-app-header user=${JSON.stringify(Auth.currentUser)}></va-app-header>` : 
                html`<va-public-header></va-public-header>`
              }
      <div class="page-content calign">     
      <br>
      <p></p>   
      <h2 class="--base-txt-color">Welcome ${Auth.currentUser.firstName}!</h2>
        <p>Here's a quick tour of Mindline AU</p>

        <div class="guide-step">
          <h4>Search for information about mental health.</h4>
          <img src="images/guide/guide-page-white-bg-360.webp" class="responsive-img" >
        </div>

        <div class="guide-step">
          <h4>Save articles, audio and video to Bookmarks.</h4>
          <img src="images/guide/guide-page-pink-bg-360.webp" class="responsive-img">
        </div>

        <div class="guide-step">
          <h4>Find resources and other options for assistance and support.</h4>
          <img src="images/guide/guide-page-yellow-bg-360.webp" class="responsive-img" >
        </div>

        <sl-animation name="jello" duration="2000" play iterations="10"><sl-button type="primary" @click=${() => gotoRoute('/')}>Okay got it!</sl-button></sl-animation>
        
        <p></p>

      </div>      
    `;
    render(template, App.rootEl);
  }
}

export default new GuideView();