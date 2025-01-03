import App from './../../App';
import {html, render } from 'lit-html';
import {gotoRoute, anchorRoute} from './../../Router';
import Auth from './../../Auth';
import Utils from './../../Utils';
import moment from 'moment';

class ProfileView {
  init(){
    console.log('ProfileView.init');
    document.title = 'Profile'    ;
    this.render()    ;
    Utils.pageIntroAnim();
  }

  render(){
    const template = html`
      <va-app-header title="Profile" user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
      <div class="page-content calign">  
        <br>
        <p></p>
        <br>      
        ${Auth.currentUser && Auth.currentUser.avatar ? html`
          <sl-avatar style="--size: 200px; margin-bottom: 3em;" image=${(Auth.currentUser && Auth.currentUser.avatar) ? `${App.apiBase}/images/${Auth.currentUser.avatar}` : ''}></sl-avatar>
        `:html`
        <sl-avatar style="--size: 200px; margin-bottom: 3em;"></sl-avatar>
        `}
        <h2>${Auth.currentUser.firstName} ${Auth.currentUser.lastName}</h2>
        <p>${Auth.currentUser.email}</p>
        
        <p>Updated: ${moment(Auth.currentUser.updatedAt).format('D MMMM YYYY @ h:mm a')}</p>

        ${Auth.currentUser.bio ? html`
          <h3>Bio</h3>
          <p>${Auth.currentUser.bio}</p>
        ` : html``}

        <sl-button @click=${() => gotoRoute('/editProfile')}>Edit Profile</sl-button>
      </div>      
    `;
    render(template, App.rootEl);
  }
}


export default new ProfileView();