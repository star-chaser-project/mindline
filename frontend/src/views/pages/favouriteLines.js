
import App from '../../App';
import {html, render } from 'lit-html';
import {gotoRoute, anchorRoute} from '../../Router';
import Auth from '../../Auth';
import Utils from '../../Utils';
import Toast from '../../Toast';
import UserAPI from '../../UserAPI';

// bookmarks = previously favourites
// favouriteBookmarks = previously favouriteProducts
class FavouriteLinesView {
  init() {
    document.title = 'Favourite Lines';
    this.favBookmarks = null;    
    this.render();    
    Utils.pageIntroAnim();
    this.getFavBookmarks();
}

async getFavBookmarks() {
    try {
      const currentUser = await UserAPI.getUser(Auth.currentUser._id);
      this.favBookmarks = currentUser.favouriteBookmarks; // Make sure this is the correct property name
      console.log(this.favBookmarks);
      this.render();
    } catch(err) {
      Toast.show(err, 'error');
    }
}

render() {
    const template = html`
      <va-app-header title="" user="${JSON.stringify(Auth.currentUser)}">
      </va-app-header>
      <div class="page-content favourites-page">   
        <div class="fav-container"> 
          <h1>Bookmarks</h1>     
        </div> 
        <div class="favourites-grid">
          ${this.favBookmarks == null 
            ? html`<sl-spinner></sl-spinner>`  // Show spinner while loading
            : this.favBookmarks.length === 0 
              ? html`<p>No bookmarks added</p>` // Show message if there are no bookmarks
              : html`
                <ul>
                  ${this.favBookmarks.map(bookmark => html`
                    <li>
                      <p>${bookmark.content}</p> <!-- Assuming bookmarks store some text content -->
                    </li>
                  `)}
                </ul>
              ` // Display the bookmarked content$
          }
        </div>
      </div>
    `;
    render(template, App.rootEl);
}

}

export default new FavouriteLinesView();
