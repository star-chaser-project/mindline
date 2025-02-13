import App from '../../App'
import {html, render } from 'lit-html'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../Auth'
import Utils from '../../Utils'
import Toast from '../../Toast';



 // Image adapted from Canva – Accessed on December 18, 2024
class mentalHealthExpandedView {
  constructor() {
    this.articles = new Map() // Initialize Map
    this.userBookmarks = new Set()
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
    // Store the article id in localStorage
    localStorage.setItem(`article-${id}`, data._id);
    return data;
  } catch(err) {
    console.error('Fetch error:', err);
    return null;
  }
}

  async init(){
    if (Auth.currentUser) {
      try {
        const response = await fetch(`${App.apiBase}/user/${Auth.currentUser._id}`, {
          headers: {
            'Authorization': `Bearer ${Auth.currentUser.token}`
          }
        });
        const userData = await response.json();
        console.log('Fetched user data:', userData);
        
        if (userData.bookmarkArticle && userData.bookmarkArticle.length > 0) {
          if (userData.bookmarkArticle[0]._id) {
            this.userBookmarks = new Set(userData.bookmarkArticle.map(item => item._id.toString()));
          } else {
            this.userBookmarks = new Set(userData.bookmarkArticle.map(item => item.toString()));
          }
        }
      } catch(err) {
        console.error('Error fetching bookmarks:', err);
        this.userBookmarks = new Set();
      }
    }
    document.title = 'Mental Health Expanded'    
    this.articleIds = {
      // Stress - articles for the first tab group "stress" //
      why: '679dc4c5640ec34e3c22a28b', // Why Mental Health Matters
      deal: '679dc7cc640ec34e3c22a28d', // Ways to Deal with Stress
      signs: '679dc8c8640ec34e3c22a28e', // Signs & Symptoms of Stress
      practices: '679dc9da640ec34e3c22a290', // Daily Practices for Stress
      triggers: '679dc964640ec34e3c22a28f', // Common Triggers of Stress
      seek: '679dcac3640ec34e3c22a291', // When to Seek Help for Stress
      questions: '679dce00640ec34e3c22a292', // Common Questions About Stress

      // Anxiety - articles for the second tab group "anxiety" //
      why_anxiety: '67a9aadc1fbc4cadae86e685', // Why Anxiety Matters
      deal_anxiety: '679dce85640ec34e3c22a293', // Ways to Deal with Feeling Anxious
      signs_anxiety: '679dcf0f640ec34e3c22a294', // Signs & Symptoms of Anxiety
      practices_anxiety: '679dcfe7640ec34e3c22a296', // Daily Practices for Anxiety
      triggers_anxiety: '679dcf93640ec34e3c22a295', // Common Triggers of Anxiety
      seek_anxiety: '679dd040640ec34e3c22a297', // When to Seek Help for Anxiety
      questions_anxiety: '679dd099640ec34e3c22a298', // Common Questions About Anxiety

      // Depression - articles fr the third tab group "Depression" //
      why_depression: '679dd307640ec34e3c22a299', // Why Depression Matters
      deal_depression: '679dd573640ec34e3c22a29a', // Ways to Deal with Feeling Depressed
      signs_depression: '679dd6ae640ec34e3c22a29c', // Signs & Symptoms of Depression
      practices_depression: '679dd719640ec34e3c22a29d', // Daily Practices to help with Depression
      triggers_depression: '679dd653640ec34e3c22a29b', // Common Triggers of Depression 
      seek_depression: '679dd80d640ec34e3c22a29e', // When to Seek Help about Depression
      questions_depression: '679dd864640ec34e3c22a29f' // Common Questions About Depression

    } 
    
    try {
      await Promise.all(
        Object.entries(this.articleIds)
          .filter(([_, id]) => id)
          .map(async ([key, id]) => {
            const article = await this.fetchArticle(id)
            if (article) {
              this.articles.set(key, article)
              console.log(`Set ${key} article:`, article)
            }
          })
      )

      this.render()    
      Utils.pageIntroAnim()
      this.setupDialogHandlers()
    } catch(err) {
      console.error('Init error:', err)
    }
  }

  async bookmarkArticle(e, id) {
    e.preventDefault();
    e.stopPropagation();
    
    if (!Auth.currentUser || !Auth.currentUser.token) {
      Toast.show("You must be logged in to bookmark articles!");
      return;
    }
    
    try {
      // Determine if we're adding or removing
      const action = this.userBookmarks.has(id) ? 'remove' : 'add';
      
      const response = await fetch(`${App.apiBase}/bookmark/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Auth.currentUser.token}`,
        },
        body: JSON.stringify({ action }) // Send action to backend
      });
  
      if (response.ok) {
        // Update local bookmarks set
        if (action === 'remove') {
          this.userBookmarks.delete(id);
        } else {
          this.userBookmarks.add(id);
        }
        
        Toast.show(`Article ${action === 'remove' ? 'removed from' : 'added to'} bookmarks`);
        this.render();
      }
    } catch(err) {
      console.error("Bookmark error:", err);
      Toast.show("Failed to update bookmark");
    }
  }

  

  setupDialogHandlers() {
    document.querySelectorAll('.dialog-width').forEach(dialog => {
      dialog.addEventListener('sl-request-close', () => {
        dialog.hide();
      });
  
      dialog.addEventListener('sl-after-hide', () => {
        const closeButton = dialog.querySelector('sl-button[slot="footer"]');
        if (closeButton) {
          closeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            dialog.hide();
          });
        }
      });
    });
  }

  openDialog(e) {
    e.stopPropagation();
    
    // Find the closest sl-dialog inside the clicked element
    const dialog = e.currentTarget.querySelector('sl-dialog');
  
    if (dialog) {
      dialog.show();
    }
  }

  async closeDialog(e) {
    e.stopPropagation();
    const dialog = e.target.closest('sl-dialog');
    if (dialog) {
      // Hide the dialog
      dialog.hide();
      // Wait for the dialog to finish hiding
      await new Promise(resolve => {
        dialog.addEventListener('sl-after-hide', resolve, { once: true });
      });
      // Refresh the bookmark data from the backend
      await this.refreshBookmarks();
      // Re-render the view
      this.render();
    }
  }

  
  
  render(){
    console.log('Auth.currentUser:', Auth.currentUser);
    console.log('User bookmarks:', Array.from(this.userBookmarks));
     // Get tab from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const activeTab = urlParams.get('tab') || 'stress'; // default to stress if no tab specified
    const template = html`

    ${Auth.isLoggedIn() ? 
      html`<va-app-header user=${JSON.stringify(Auth.currentUser)}></va-app-header>` : 
      html`<va-public-header></va-public-header>`
    }
      <a href="/" @click="${anchorRoute}"><img class="header-logo" src="/images/logo/logo-mindline-no-wording-white-125.png"></a>      
      <div class="page-content mental-health-expanded-page"> 
        <section class="banner mental-health-expanded">
        <div class="banner-content">     
        <h1>Mental Health</h1>
          <div id="bento-tabs">
            <sl-tab-group ?active="${activeTab}">
              <sl-tab slot="nav" panel="stress" ?active="${activeTab === 'stress'}">Stress</sl-tab>
              <sl-tab slot="nav" panel="anxiety" ?active="${activeTab === 'anxiety'}">Anxiety</sl-tab>
              <sl-tab slot="nav" panel="depression" ?active="${activeTab === 'depression'}">Depression</sl-tab>

              <!-- this is the first tab content of the menal health page -->
              <sl-tab-panel name="stress">
                
       
                <div class="stress">
                
                  <div class="why why-stress" @click=${this.openDialog}>
                    <img src="/images/mental-health/stress/stress-why-mental-health-matters-360.webp" class="why-img">
                    <p>${this.articles.get('why')?.title || 'Loading...'}</p>
                    ${this.userBookmarks && this.articles.get('why') && this.userBookmarks.has(this.articles.get('why')._id)
                      ? html`
                        <img 
                          src="/images/bookmark/bookmark-full.svg" 
                          class="bookmark"
                          style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                        >`
                      : ''
                    }
                    <sl-dialog label="${this.articles.get('why')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                      <div style="white-space: pre-line;">
                        ${this.articles.get('why')?.bodyContent || 'Loading content...'}
                      </div>
                      <sl-button slot="footer" variant="primary" 
                        @click=${(e) => {
                          const articleId = this.articles.get('why')?._id;
                          console.log("Bookmarking article ID:", articleId);
                          this.bookmarkArticle(e, articleId);
                        }}>
                        ${this.userBookmarks.has(this.articles.get('why')?._id) ? 'Remove Bookmark' : 'Bookmark'}
                      </sl-button>
                      <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                    </sl-dialog>
                  </div>

                  <div class="deal deal-stress" @click=${this.openDialog}>
                    <img src="/images/stress-box.png" class="stress-img">
                    <p>${this.articles.get('deal')?.title || 'Loading...'}</p>
                    ${this.userBookmarks && this.articles.get('deal') && this.userBookmarks.has(this.articles.get('deal')._id)
                      ? html`
                        <img 
                          src="/images/bookmark/bookmark-full.svg" 
                          class="bookmark"
                          style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                        >`
                      : ''
                    }
                    <sl-dialog label="${this.articles.get('deal')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    ${this.articles.get('deal')?.bodyContent || 'Loading content...'}

                      <sl-button slot="footer" variant="primary" 
                        @click=${(e) => {
                          const articleId = this.articles.get('deal')?._id;
                          console.log("Bookmarking article ID:", articleId);
                          this.bookmarkArticle(e, articleId);
                        }}>
                        ${this.userBookmarks.has(this.articles.get('deal')?._id) ? 'Remove Bookmark' : 'Bookmark'}
                      </sl-button>
                      <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>

                  <div class="signs signs-stress" @click=${this.openDialog}>
                    <img src="/images/mental-health/stress/stress-signs_symptoms-360.webp" class="signs-img">
                    <p>${this.articles.get('signs')?.title || 'Loading...'}</p>
                    ${this.userBookmarks && this.articles.get('signs') && this.userBookmarks.has(this.articles.get('signs')._id)
                      ? html`
                        <img 
                          src="/images/bookmark/bookmark-full.svg" 
                          class="bookmark"
                          style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                        >`
                      : ''
                    }
                    <sl-dialog label="${this.articles.get('signs')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    ${this.articles.get('signs')?.bodyContent || 'Loading content...'}
                    <sl-button slot="footer" variant="primary" 
                      @click=${(e) => {
                        const articleId = this.articles.get('signs')?._id;
                        console.log("Bookmarking article ID:", articleId);
                        this.bookmarkArticle(e, articleId);
                      }}>
                      ${this.userBookmarks.has(this.articles.get('signs')?._id) ? 'Remove Bookmark' : 'Bookmark'}
                    </sl-button>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>
                
                
                  <div class="triggers triggers-stress" @click=${this.openDialog}>
                    <img src="/images/triggers-box.png" class="triggers-img">
                    <p>${this.articles.get('triggers')?.title || 'Loading...'}</p>
                    ${this.userBookmarks && this.articles.get('triggers') && this.userBookmarks.has(this.articles.get('triggers')._id)
                      ? html`
                        <img 
                          src="/images/bookmark/bookmark-full.svg" 
                          class="bookmark"
                          style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                        >`
                      : ''
                    }
                    <sl-dialog label="${this.articles.get('triggers')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    ${this.articles.get('triggers')?.bodyContent || 'Loading content...'}
                    <sl-button slot="footer" variant="primary" 
                      @click=${(e) => {
                        const articleId = this.articles.get('triggers')?._id;
                        console.log("Bookmarking article ID:", articleId);
                        this.bookmarkArticle(e, articleId);
                      }}>
                      ${this.userBookmarks.has(this.articles.get('triggers')?._id) ? 'Remove Bookmark' : 'Bookmark'}
                    </sl-button>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>

                  <div class="practices practices-stress" @click=${this.openDialog}>
                    <img src="/images/practices-box.png" class="practices-img">
                      <p>${this.articles.get('practices')?.title || 'Loading...'}</p>
                      ${this.userBookmarks && this.articles.get('practices') && this.userBookmarks.has(this.articles.get('practices')._id)
                        ? html`
                          <img 
                            src="/images/bookmark/bookmark-full.svg" 
                          class="bookmark"
                          style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                          >`
                        : ''
                      }
                    <sl-dialog label="${this.articles.get('practices')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    ${this.articles.get('practices')?.bodyContent || 'Loading content...'}
                    <sl-button slot="footer" variant="primary" 
                        @click=${(e) => {
                          const articleId = this.articles.get('practices')?._id;
                          console.log("Bookmarking article ID:", articleId);
                          this.bookmarkArticle(e, articleId);
                        }}>
                        ${this.userBookmarks.has(this.articles.get('practices')?._id) ? 'Remove Bookmark' : 'Bookmark'}
                      </sl-button>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>
                
                  <div class="seek seek-stress" @click=${this.openDialog}>
                  <img src="/images/seek-box.png" class="seek-img">
                    <p>${this.articles.get('seek')?.title || 'Loading...'}</p>
                    ${this.userBookmarks && this.articles.get('seek') && this.userBookmarks.has(this.articles.get('seek')._id)
                      ? html`
                        <img 
                          src="/images/bookmark/bookmark-full.svg" 
                          class="bookmark"
                          style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                        >`
                      : ''
                    }
                    <sl-dialog label="${this.articles.get('seek')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    ${this.articles.get('seek')?.bodyContent || 'Loading content...'}
                    <sl-button slot="footer" variant="primary" 
                        @click=${(e) => {
                          const articleId = this.articles.get('seek')?._id;
                          console.log("Bookmarking article ID:", articleId);
                          this.bookmarkArticle(e, articleId);
                        }}>
                        ${this.userBookmarks.has(this.articles.get('seek')?._id) ? 'Remove Bookmark' : 'Bookmark'}
                      </sl-button>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>

                  <div class="questions" @click=${this.openDialog}>
                  <img src="/images/questions-box.png" class="questions-img">
                      <p>${this.articles.get('questions')?.title || 'Loading...'}</p>
                      ${this.userBookmarks && this.articles.get('questions') && this.userBookmarks.has(this.articles.get('questions')._id)
                        ? html`
                          <img 
                            src="/images/bookmark/bookmark-full.svg" 
                          class="bookmark"
                          style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                          >`
                        : ''
                      }
                    <sl-dialog label="${this.articles.get('questions')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    ${this.articles.get('questions')?.bodyContent || 'Loading content...'}
                    <sl-button slot="footer" variant="primary" 
                      @click=${(e) => {
                        const articleId = this.articles.get('questions')?._id;
                        console.log("Bookmarking article ID:", articleId);
                        this.bookmarkArticle(e, articleId);
                      }}>
                      ${this.userBookmarks.has(this.articles.get('questions')?._id) ? 'Remove Bookmark' : 'Bookmark'}
                    </sl-button>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>
                </div>



              </sl-tab-panel>

               <!-- this is the second tab content of the mental health page -->
              <sl-tab-panel name="anxiety">
                <div class="stress">
                
                  <div class="why why-anxiety" @click=${this.openDialog}>
                    <img src="/images/" class="why-img">

                    <p>${this.articles.get('why')?.title || 'Loading...'}</p>
                     ${this.userBookmarks && this.articles.get('why') && this.userBookmarks.has(this.articles.get('why')._id)
                      ? html`
                        <img 
                          src="/images/bookmark/bookmark-full.svg" 
                          class="bookmark"
                          style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                        >`
                      : ''
                    }
                    <sl-dialog label="${this.articles.get('why')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                      ${this.articles.get('why')?.bodyContent || 'Loading content...'}
                      <sl-button slot="footer" variant="primary" 
                        @click=${(e) => {
                          const articleId = this.articles.get('why')?._id;
                          console.log("Bookmarking article ID:", articleId);
                          this.bookmarkArticle(e, articleId);
                        }}>Bookmark</sl-button>

                      <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                    </sl-dialog>
                  </div>

                  <div class="deal deal-anxiety" @click=${this.openDialog}>
                    <img src="/images/" class="stress-img">

                    <p>${this.articles.get('deal')?.title || 'Loading...'}</p>
                    ${this.userBookmarks && this.articles.get('deal') && this.userBookmarks.has(this.articles.get('deal')._id)
                      ? html`
                        <img 
                          src="/images/bookmark/bookmark-full.svg" 
                          class="bookmark"
                          style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                        >`
                      : ''
                    }
                    <sl-dialog label="${this.articles.get('deal')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    ${this.articles.get('deal')?.bodyContent || 'Loading content...'}
                      <sl-button slot="footer" variant="primary" 
                        @click=${(e) => {
                          const articleId = this.articles.get('deal')?._id;
                          console.log("Bookmarking article ID:", articleId);
                          this.bookmarkArticle(e, articleId);
                        }}>Bookmark</sl-button>

                      <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>

                  <div class="signs signs-anxiety" @click=${this.openDialog}>
                    <img src="/images/" class="signs-img">

                    <p>${this.articles.get('signs')?.title || 'Loading...'}</p>
                     ${this.userBookmarks && this.articles.get('signs') && this.userBookmarks.has(this.articles.get('signs')._id)
                      ? html`
                        <img 
                          src="/images/bookmark/bookmark-full.svg" 
                          class="bookmark"
                          style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                        >`
                      : ''
                    }
                    <sl-dialog label="${this.articles.get('signs')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    ${this.articles.get('signs')?.bodyContent || 'Loading content...'}
                    <sl-button slot="footer" variant="primary" 
                        @click=${(e) => {
                          const articleId = this.articles.get('signs')?._id;
                          console.log("Bookmarking article ID:", articleId);
                          this.bookmarkArticle(e, articleId);
                        }}>Bookmark</sl-button>

                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>
                
                
                  <div class="triggers triggers-anxiety" @click=${this.openDialog}>
                    <img src="/images/" class="triggers-img">

                    <p>${this.articles.get('triggers')?.title || 'Loading...'}</p>
                     ${this.userBookmarks && this.articles.get('triggers') && this.userBookmarks.has(this.articles.get('triggers')._id)
                      ? html`
                        <img 
                          src="/images/bookmark/bookmark-full.svg" 
                          class="bookmark"
                          style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                        >`
                      : ''
                    }
                    <sl-dialog label="${this.articles.get('triggers')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    ${this.articles.get('triggers')?.bodyContent || 'Loading content...'}
                    <sl-button slot="footer" variant="primary" 
                        @click=${(e) => {
                          const articleId = this.articles.get('triggers')?._id;
                          console.log("Bookmarking article ID:", articleId);
                          this.bookmarkArticle(e, articleId);
                        }}>Bookmark</sl-button>

                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>

                  <div class="practices practices-anxiety" @click=${this.openDialog}>
                    <img src="/images/" class="practices-img">

                      <p>${this.articles.get('practices')?.title || 'Loading...'}</p>
                     ${this.userBookmarks && this.articles.get('practices') && this.userBookmarks.has(this.articles.get('practices')._id)
                      ? html`
                        <img 
                          src="/images/bookmark/bookmark-full.svg" 
                          class="bookmark"
                          style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                        >`
                      : ''
                    }
                    <sl-dialog label="${this.articles.get('practices')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    ${this.articles.get('practices')?.bodyContent || 'Loading content...'}
                    <sl-button slot="footer" variant="primary" 
                        @click=${(e) => {
                          const articleId = this.articles.get('practices')?._id;
                          console.log("Bookmarking article ID:", articleId);
                          this.bookmarkArticle(e, articleId);
                        }}>Bookmark</sl-button>

                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>
                
                  <div class="seek seek-anxiety" @click=${this.openDialog}>
                  <img src="/images/" class="seek-img">

                 <p>${this.articles.get('seek')?.title || 'Loading...'}</p>
                     ${this.userBookmarks && this.articles.get('seek') && this.userBookmarks.has(this.articles.get('seek')._id)
                      ? html`
                        <img 
                          src="/images/bookmark/bookmark-full.svg" 
                          class="bookmark"
                          style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                        >`
                      : ''
                    }
                    <sl-dialog label="${this.articles.get('seek')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    ${this.articles.get('seek')?.bodyContent || 'Loading content...'}
                    <sl-button slot="footer" variant="primary" 
                        @click=${(e) => {
                          const articleId = this.articles.get('seek')?._id;
                          console.log("Bookmarking article ID:", articleId);
                          this.bookmarkArticle(e, articleId);
                        }}>Bookmark</sl-button>

                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>

                  <div class="questions questions-anxiety" @click=${this.openDialog}>
                  <img src="/images/" class="questions-img">

                      <p>${this.articles.get('questions')?.title || 'Loading...'}</p>
                     ${this.userBookmarks && this.articles.get('questions') && this.userBookmarks.has(this.articles.get('questions')._id)
                      ? html`
                        <img 
                          src="/images/bookmark/bookmark-full.svg" 
                          class="bookmark"
                          style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                        >`
                      : ''
                    }
                    <sl-dialog label="${this.articles.get('questions')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    ${this.articles.get('questions')?.bodyContent || 'Loading content...'}
                    <sl-button slot="footer" variant="primary" 
                        @click=${(e) => {
                          const articleId = this.articles.get('questions')?._id;
                          console.log("Bookmarking article ID:", articleId);
                          this.bookmarkArticle(e, articleId);
                        }}>Bookmark</sl-button>

                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>
                </div>
              </sl-tab-panel>

               <!-- this is the third tab content of the menal health page -->
              <sl-tab-panel name="depression">
                <div class="stress">
                
                  <div class="why" @click=${this.openDialog}>
                    <img src="/images/why-box.png" class="why-img">

                    <p>${this.articles.get('why')?.title || 'Loading...'}</p>
                     ${this.userBookmarks && this.articles.get('why') && this.userBookmarks.has(this.articles.get('why')._id)
                      ? html`
                        <img 
                          src="/images/bookmark/bookmark-full.svg" 
                          class="bookmark"
                          style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                        >`
                      : ''
                    }
                    <sl-dialog label="${this.articles.get('why')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                      ${this.articles.get('why')?.bodyContent || 'Loading content...'}
                      <sl-button slot="footer" variant="primary" 
                        @click=${(e) => {
                          const articleId = this.articles.get('why')?._id;
                          console.log("Bookmarking article ID:", articleId);
                          this.bookmarkArticle(e, articleId);
                        }}>Bookmark</sl-button>

                      <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                    </sl-dialog>
                  </div>

                  <div class="deal" @click=${this.openDialog}>
                    <img src="/images/stress-box.png" class="stress-img">

                    <p>${this.articles.get('deal')?.title || 'Loading...'}</p>
                    ${this.userBookmarks && this.articles.get('deal') && this.userBookmarks.has(this.articles.get('deal')._id)
                      ? html`
                        <img 
                          src="/images/bookmark/bookmark-full.svg" 
                          class="bookmark"
                          style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                        >`
                      : ''
                    }
                    <sl-dialog label="${this.articles.get('deal')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    ${this.articles.get('deal')?.bodyContent || 'Loading content...'}
                      <sl-button slot="footer" variant="primary" 
                        @click=${(e) => {
                          const articleId = this.articles.get('deal')?._id;
                          console.log("Bookmarking article ID:", articleId);
                          this.bookmarkArticle(e, articleId);
                        }}>Bookmark</sl-button>

                      <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>

                  <div class="signs" @click=${this.openDialog}>
                    <img src="/images/signs-box.png" class="signs-img">

                    <p>${this.articles.get('signs')?.title || 'Loading...'}</p>
                     ${this.userBookmarks && this.articles.get('signs') && this.userBookmarks.has(this.articles.get('signs')._id)
                      ? html`
                        <img 
                          src="/images/bookmark/bookmark-full.svg" 
                          class="bookmark"
                          style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                        >`
                      : ''
                    }
                    <sl-dialog label="${this.articles.get('signs')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    ${this.articles.get('signs')?.bodyContent || 'Loading content...'}
                    <sl-button slot="footer" variant="primary" 
                        @click=${(e) => {
                          const articleId = this.articles.get('signs')?._id;
                          console.log("Bookmarking article ID:", articleId);
                          this.bookmarkArticle(e, articleId);
                        }}>Bookmark</sl-button>

                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>
                
                
                  <div class="triggers" @click=${this.openDialog}>
                    <img src="/images/triggers-box.png" class="triggers-img">

                    <p>${this.articles.get('triggers')?.title || 'Loading...'}</p>
                     ${this.userBookmarks && this.articles.get('triggers') && this.userBookmarks.has(this.articles.get('triggers')._id)
                      ? html`
                        <img 
                          src="/images/bookmark/bookmark-full.svg" 
                          class="bookmark"
                          style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                        >`
                      : ''
                    }
                    <sl-dialog label="${this.articles.get('triggers')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    ${this.articles.get('triggers')?.bodyContent || 'Loading content...'}
                    <sl-button slot="footer" variant="primary" 
                        @click=${(e) => {
                          const articleId = this.articles.get('triggers')?._id;
                          console.log("Bookmarking article ID:", articleId);
                          this.bookmarkArticle(e, articleId);
                        }}>Bookmark</sl-button>

                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>

                  <div class="practices" @click=${this.openDialog}>
                    <img src="/images/practices-box.png" class="practices-img">

                      <p>${this.articles.get('practices')?.title || 'Loading...'}</p>
                     ${this.userBookmarks && this.articles.get('practices') && this.userBookmarks.has(this.articles.get('practices')._id)
                      ? html`
                        <img 
                          src="/images/bookmark/bookmark-full.svg" 
                          class="bookmark"
                          style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                        >`
                      : ''
                    }
                    <sl-dialog label="${this.articles.get('practices')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    ${this.articles.get('practices')?.bodyContent || 'Loading content...'}
                    <sl-button slot="footer" variant="primary" 
                        @click=${(e) => {
                          const articleId = this.articles.get('practices')?._id;
                          console.log("Bookmarking article ID:", articleId);
                          this.bookmarkArticle(e, articleId);
                        }}>Bookmark</sl-button>

                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>
                
                  <div class="seek" @click=${this.openDialog}>
                  <img src="/images/seek-box.png" class="seek-img">

                 <p>${this.articles.get('seek')?.title || 'Loading...'}</p>
                     ${this.userBookmarks && this.articles.get('seek') && this.userBookmarks.has(this.articles.get('seek')._id)
                      ? html`
                        <img 
                          src="/images/bookmark/bookmark-full.svg" 
                          class="bookmark"
                          style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                        >`
                      : ''
                    }
                    <sl-dialog label="${this.articles.get('seek')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    ${this.articles.get('seek')?.bodyContent || 'Loading content...'}
                    <sl-button slot="footer" variant="primary" 
                        @click=${(e) => {
                          const articleId = this.articles.get('seek')?._id;
                          console.log("Bookmarking article ID:", articleId);
                          this.bookmarkArticle(e, articleId);
                        }}>Bookmark</sl-button>

                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>

                  <div class="questions" @click=${this.openDialog}>
                  <img src="/images/questions-box.png" class="questions-img">

                      <p>${this.articles.get('questions')?.title || 'Loading...'}</p>
                     ${this.userBookmarks && this.articles.get('questions') && this.userBookmarks.has(this.articles.get('questions')._id)
                      ? html`
                        <img 
                          src="/images/bookmark/bookmark-full.svg" 
                          class="bookmark"
                          style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                        >`
                      : ''
                    }
                    <sl-dialog label="${this.articles.get('questions')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    ${this.articles.get('questions')?.bodyContent || 'Loading content...'}
                    <sl-button slot="footer" variant="primary" 
                        @click=${(e) => {
                          const articleId = this.articles.get('questions')?._id;
                          console.log("Bookmarking article ID:", articleId);
                          this.bookmarkArticle(e, articleId);
                        }}>Bookmark</sl-button>

                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>
                </div>
              </sl-tab-panel>

            </sl-tab-group>
          </div>
        </div>
        </section>
          
      
      </div>  
    `
    render(template, App.rootEl)
  }
}

export default new mentalHealthExpandedView()