import App from './../../App';
import {html, render } from 'lit-html';
import {gotoRoute, anchorRoute} from './../../Router';
import Auth from './../../Auth';
import Utils from './../../Utils';
import moment from 'moment';

class ProfileView {
  init(){
    //console.log('ProfileView.init');
    document.title = 'Profile'    ;
    this.render()    ;
    Utils.pageIntroAnim();
  }

    render() {
    const template = html`
      <va-app-header user="${JSON.stringify(Auth.currentUser)}"></va-app-header>

      <div class="profile-container">

        <!-- Left Section -->
        <div class="profile-left">
        
          ${Auth.currentUser && Auth.currentUser.avatar
            ? html`
                <sl-avatar
                  image="${App.apiBase}/images/${Auth.currentUser.avatar}"
                ></sl-avatar>
              `
            : html`<sl-avatar></sl-avatar>`}
          <h2>${Auth.currentUser.firstName} ${Auth.currentUser.lastName}</h2>
          <p>${Auth.currentUser.email}</p>
          <p>
            Updated:
            ${moment(Auth.currentUser.updatedAt).format(
              'D MMMM YYYY @ h:mm a'
            )}
          </p>
         <sl-button size="large" pill="" class="edit-btn hydrated edit-button" type="primary" 
            class="edit-button"
            @click=${() => gotoRoute('/editProfile')}
           >EDIT PROFILE</sl-button>
        </div>

        <!-- Right Section -->
        <div class="profile-right" >
          <h1>Hi ${Auth.currentUser.firstName}</h1>
          <p>All about you</p>
        </div>
      </div>
    `;
    render(template, App.rootEl);
  }
}

export default new ProfileView();