import App from '../../App';
import {html, render} from 'lit-html';
// Removed gotoRoute and anchorRoute if not used
import Auth from '../../Auth';
import Utils from '../../Utils';
import Toast from '../../Toast';
import UserAPI from '../../UserAPI';
// Removed unsafeHTML since it's not used

class FavouriteLinesView {
  constructor() {
    this.userBookmarks = new Set(); // Initialize Set to store bookmarked article IDs
    this.articles = new Map(); // Initialize Map to store article data
  }

  async fetchArticle(id) {
    try {
      //console.log('Fetching article:', id);
      const response = await fetch(`${App.apiBase}/article/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      //console.log('Fetched data:', data);
      return data;
    } catch (err) {
      console.error('Fetch error:', err);
      return null;
    }
  }

  async init() {
    if (Auth.currentUser) {
      try {
        const response = await fetch(`${App.apiBase}/user/${Auth.currentUser._id}`, {
          headers: {
            'Authorization': `Bearer ${Auth.currentUser.token}`
          }
        });
        const userData = await response.json();
        //console.log('Fetched user data:', userData);
        
        if (userData.bookmarkArticle && userData.bookmarkArticle.length > 0) {
          if (userData.bookmarkArticle[0]._id) {
            this.userBookmarks = new Set(userData.bookmarkArticle.map(item => item._id.toString()));
          } else {
            this.userBookmarks = new Set(userData.bookmarkArticle.map(item => item.toString()));
          }
          //console.log('User bookmarks set:', Array.from(this.userBookmarks));
        } else {
          //console.log('No bookmarks found for the current user.');
        }
      } catch (err) {
        console.error('Error fetching bookmarks:', err);
        this.userBookmarks = new Set();
      }
    }
  
    document.title = 'Bookmarks';
  
    try {
      if (this.userBookmarks.size > 0) {
        await Promise.all(
          Array.from(this.userBookmarks).map(async (id) => {
            const article = await this.fetchArticle(id);
            if (article) {
              this.articles.set(id, article);
              //console.log(`Set article ${id}:`, article);
            }
          })
        );
      }
      this.render();
      Utils.pageIntroAnim();
    } catch (err) {
      console.error('Init error:', err);
    }
  }

  async removeBookmark(e, articleId) {
    // Prevent the click from also triggering the article dialog
    e.stopPropagation();
  
    if (!Auth.currentUser || !Auth.currentUser.token) {
      Toast.show("You must be logged in to update bookmarks!");
      return;
    }
  
    try {
      // Call your API to remove the bookmark (adjust endpoint/method as needed)
      const response = await fetch(`${App.apiBase}/bookmark/${articleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Auth.currentUser.token}`
        },
        body: JSON.stringify({ action: 'remove' })
      });
  
      if (response.ok) {
        // Update local state: remove from the userBookmarks set
        this.userBookmarks.delete(articleId);
        // Optionally, remove the article from this.articles map if you don't want to display it anymore
        this.articles.delete(articleId);
        Toast.show("Bookmark removed");
        this.render();
      } else {
        Toast.show("Failed to remove bookmark");
      }
    } catch (err) {
      console.error("Remove bookmark error:", err);
      Toast.show("Error removing bookmark");
    }
  }

  render() {
    //console.log('Auth.currentUser:', Auth.currentUser);
    //console.log('User bookmarks:', Array.from(this.userBookmarks));
    const template = html`
      <va-app-header user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
      <div class="bookmarks-page">
        <div class="page-content favourites-page">   
          <div class="fav-container"> 
            <h1>Bookmarks</h1>     
          </div> 
          <div class="favourites-grid">
            ${this.userBookmarks.size === 0 
              ? html`<p>No bookmarks added</p>` 
              : html`
                ${this.articles.size > 0 
                  ? html`
                    <ul>
                      ${Array.from(this.articles.values()).map(article => html`
                        <li style="display: flex; align-items: center; justify-content: space-between;">
                          <div class="bookmark-item" @click="${() => this.openArticleDialog(article)}">
                            <h3>${article.title}</h3>
                            <p>
                              ${article.bodyContent ? article.bodyContent.substring(0, 100) + '...' : ''}
                            </p>
                          </div>
                          <sl-button class="edit-btn"  @click="${(e) => this.removeBookmark(e, article._id)}">
                            Remove Bookmark
                          </sl-button>
                        </li>
                      `)}
                    </ul>
                  `
                  : html`<p>Loading bookmarks...</p>`
                }
              `
            }
          </div>
        </div>
      </div>
    `;
    render(template, App.rootEl);
  }
}

export default new FavouriteLinesView();