import App from './../../App';
import { html, render } from 'lit-html';
import { gotoRoute, anchorRoute } from './../../Router';
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
    this.avatarPreview = null;
    this.render();
    Utils.pageIntroAnim();
    this.getUser();
  }

  async getUser(){
    try {
      this.user = await UserAPI.getUser(Auth.currentUser._id);
      this.render();
    } catch(err) {
      Toast.show(err, 'error');
    }
  }

  // Called when a file is selected.
  handleAvatarChange(e) {
    const file = e.target.files[0];
    console.log('File selected:', file);
    if (file) {
      // Create a preview URL for the selected image.
      this.avatarPreview = URL.createObjectURL(file);
      console.log('Preview URL:', this.avatarPreview);
      this.render();
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
      Toast.show('Profile Updated');
      gotoRoute('/profile');
    }catch(err){      
      Toast.show(err, 'error');
    }
    submitBtn.removeAttribute('loading');
  }

  render(){
    const currentAvatar = Auth.currentUser.avatar 
      ? `${App.apiBase}/images/${Auth.currentUser.avatar}` 
      : '';
    const avatarURL = this.avatarPreview || currentAvatar;
  
    // Conditionally render a template based on whether a preview is available.
    const avatarTemplate = this.avatarPreview
      ? html`
        <sl-avatar 
          key="preview" 
          style="--size: 150px; margin-bottom: 1em;" 
          .image=${this.avatarPreview}>
        </sl-avatar>
      `
      : html`
        <sl-avatar 
          key="current" 
          style="--size: 150px; margin-bottom: 1em;" 
          .image=${currentAvatar}>
        </sl-avatar>
      `;
  
    const template = html`
      ${Auth.isLoggedIn() ? 
        html`<va-app-header user=${JSON.stringify(Auth.currentUser)}></va-app-header>` : 
        html`<va-public-header></va-public-header>`
      }  
      ${this.user == null ? html`
        <sl-spinner></sl-spinner>
      ` : html`
        <div class="page-content page-centered">
          <div class="signon2-container profile-container">
            <div class="profile-left">
              <div class="signinup-box">
                ${avatarTemplate}
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
                      <label for="file-upload" style="cursor: pointer;">Change Avatar</label>
                      <input 
                        id="file-upload" 
                        type="file" 
                        name="avatar" 
                        style="display: none;" 
                        @change=${this.handleAvatarChange.bind(this)}>
                    </sl-button>
                    <br>
                    <sl-button size="large" pill type="primary" style="width: 100%;" class="submit-btn edit-btn edit-button" submit>
                      Update Profile
                    </sl-button>
                  </div>
                </sl-form>
              </div>
            </div>
            <div class="profile-right">
              <div class="welcome-box">
                <h1>Need an Update?</h1>
              </div>
            </div>
          </div>
        </div>
      `}
    `;
    render(template, App.rootEl);  
  }
}

export default new EditProfileView();