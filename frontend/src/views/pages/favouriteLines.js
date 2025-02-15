import App from '../../App';
import {html, render} from 'lit-html';
import {gotoRoute, anchorRoute} from '../../Router';
import Auth from '../../Auth';
import Utils from '../../Utils';
import Toast from '../../Toast';
import UserAPI from '../../UserAPI';

class FavouriteLinesView {
  constructor() {
    this.favBookmarks = new Set(); // Initialize Set to store bookmarked article IDs
    this.articles = new Map(); // Initialize Map to store article data
  }

  async fetchArticle(id) {
    try {
      console.log('Fetching article:', id);
      const response = await fetch(`${App.apiBase}/article/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched data:', data);
      return data;
    } catch (err) {
      console.error('Fetch error:', err);
      return null;
    }
  }

  async init() {
    document.title = 'Favourite Lines';
    this.render();
    Utils.pageIntroAnim();
    await this.getFavBookmarks();
  }

  async getFavBookmarks() {
    try {
      const currentUser = await UserAPI.getUser(Auth.currentUser._id);
      console.log('Fetched user data:', currentUser);
      this.favBookmarks = new Set(currentUser.favouriteBookmarks); // need to Make sure this is the correct property name
      console.log('User bookmarks:', this.favBookmarks);
      await this.fetchFavArticles();
      this.render();
    } catch (err) {
      Toast.show(err, 'error');
    }
  }

  async fetchFavArticles() {
    try {
      await Promise.all(
        Array.from(this.favBookmarks).map(async (id) => {
          const article = await this.fetchArticle(id);
          if (article) {
            this.articles.set(id, article);
            console.log(`Set article ${id}:`, article);
          }
        })
      );
    } catch (err) {
      console.error('Fetch articles error:', err);
    }
  }

  render() {
    console.log('Auth.currentUser:', Auth.currentUser);
    console.log('User bookmarks:', Array.from(this.favBookmarks));
    const template = html`
      <va-app-header user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
      <div class="page-content favourites-page">   
        <div class="fav-container"> 
          <h1>Bookmarks</h1>     
        </div> 
        <div class="favourites-grid">
          ${this.favBookmarks.size === 0 
            ? html`<p>No bookmarks added</p>` // Show message if there are no bookmarks
            : html`
              <ul>
                ${Array.from(this.articles.values()).map(article => html`
                  <li>
                    <h2>${article.title}</h2>
                    <p>${article.bodyContent}</p> <!-- Assuming articles have a bodyContent property -->
                  </li>
                `)}
              </ul>
            ` // Display the bookmarked articles
          }
        </div>
      </div>
    `;
    render(template, App.rootEl);
  }
}

export default new FavouriteLinesView();