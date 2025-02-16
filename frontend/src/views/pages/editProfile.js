import App from './../../App';
import {html, render } from 'lit-html';
import {gotoRoute, anchorRoute} from './../../Router';
import Auth from './../../Auth';
import Utils from './../../Utils';
import UserAPI from './../../UserAPI';
import Toast from '../../Toast';
import moment from 'moment';

class EditProfileView {
    init(){
      console.log('EditProfileView.init');
      document.title = 'Edit Profile';
      this.user = null;
      this.render();
      Utils.pageIntroAnim();
      this.getUser()    ;
    }
  
    async getUser(){
      try {
        this.user = await UserAPI.getUser(Auth.currentUser._id);
        this.render();
      }catch(err){
        Toast.show(err, 'error');
      }
    }
  
    async updateProfileSubmitHandler(e){
      e.preventDefault();
      const formData = e.detail.formData;
      const submitBtn = document.querySelector('.submit-btn');
      submitBtn.setAttribute('loading', '');
      try {
        const updatedUser = await UserAPI.updateUser(Auth.currentUser._id, formData);  
        delete updatedUser.password;
        this.user = updatedUser;
        Auth.currentUser = updatedUser;
        this.render();
        Toast.show('profile updated');
      }catch(err){      
        Toast.show(err, 'error');
      }
      submitBtn.removeAttribute('loading');
    }
  
  render(){
    const template = html`
 ${Auth.isLoggedIn() ? 
      html`<va-app-header user=${JSON.stringify(Auth.currentUser)}></va-app-header>` : 
      html`<va-public-header></va-public-header>`
    }  
        ${this.user == null ? html`
          <sl-spinner></sl-spinner>
        ` : html`
          <!-- Left Section -->
        <div class="page-content page-centered">
            <div class="signon2-container profile-container">
              <!-- Left Section -->
              <div class="profile-left">
                <div class="signinup-box">
                  <sl-avatar style="--size: 150px; margin-bottom: 1em;" image="${Auth.currentUser.avatar ? `${App.apiBase}/images/${Auth.currentUser.avatar}` : ''}"></sl-avatar>
                  <h1>My Details</h1>
                  <p>Updated: ${moment(Auth.currentUser.updatedAt).format('D MMMM YYYY @ h:mm a')}</p>
                  <sl-form class="page-form" @sl-submit=${this.updateProfileSubmitHandler.bind(this)}>
                    <div class="input-group">
                      <sl-input size="large" pill style="padding-bottom: 1em;" type="text" name="firstName" value="${this.user.firstName}" placeholder="First Name"></sl-input>
                    </div>
                    <div class="input-group">
                      <sl-input size="large" pill style="padding-bottom: 1em;" type="text" name="lastName" value="${this.user.lastName}" placeholder="Last Name"></sl-input>
                    </div>
                    <div class="input-group">
                      <sl-input size="large" pill style="padding-bottom: 1em;" type="text" name="email" value="${this.user.email}" placeholder="Email Address"></sl-input>
                    </div>
                    <div class="input-group">
                    <sl-button size="large" pill class="edit-btn" type="primary" style="width: 100%;">
                    <label for="file-upload">Change Avatar</label>
                    <input id="file-upload" type="file" name="avatar" style="display: none;">
                    </sl-button><br>
                        <sl-button size="large" pill type="primary" style="width: 100%;" class="submit-btn edit-btn edit-button" submit>Update Profile</sl-button></sl-form>
                    </div>
                  </div>
                </div>
                <!-- Right Section -->
                <div class="profile-right">
                    <div class="welcome-box">
                        <h1>Need an Update?</h1>
                    </div>
            </div>
        </div>
        `}
    </div>
    `;
    render(template, App.rootEl);  
  }
}

export default new EditProfileView();