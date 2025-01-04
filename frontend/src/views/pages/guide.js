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
    this.updateCurrentUser();
  }

  async updateCurrentUser(){
    try{
      const updatedUser = await UserAPI.updateUser(Auth.currentUser._id, { newUser: false}); 'json';
      console.log('user updated');
      console.log(updatedUser);
    }catch(err){
        Toast.show(err, 'error');
    }
  }
  // Animation - from https://shoelace.style/components/animation/
  render(){
    const template = html`
      <va-app-header title="Guide" user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
      <div class="page-content calign">     
      <br>
      <p></p>   
      <h2 class="--base-txt-color">Welcome ${Auth.currentUser.firstName}!</h2>
        <p>Here's a quick tour of Mindline AU</p>

        <div class="guide-step">
          <h4>Search wellbeing information</h4>
          <img src="images/coffee-making.png" class="responsive-img" >
        </div>

        <div class="guide-step">
          <h4>Save articles, audio and video to favourites</h4>
          <img src="images/coffee-fav.png" class="responsive-img">
        </div>

        <div class="guide-step">
          <h4>Find a resources</h4>
          <img src="images/coffee-types.png" class="responsive-img" >
        </div>

        <sl-animation name="jello" duration="2000" play iterations="10"><sl-button type="primary" @click=${() => gotoRoute('/')}>Okay got it!</sl-button></sl-animation>
        
        <p></p>

      </div>      
    `;
    render(template, App.rootEl);
  }
}

export default new GuideView();