import App from '../../App'
import {html, render } from 'lit-html'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../Auth'
import Utils from '../../Utils'
import Toast from '../../Toast'
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js'

 // Image adapted from Canva – Accessed on December 18, 2024
class resourcesExpandedView {
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
    document.title = 'Resources Expanded'    
    this.articleIds = {
      // Support - articles for the first tab group "support" //
      ask: '67b04497e84a5c439b2b52c7', // It's Ok to Ask for Support
      talk: '67b0453ee84a5c439b2b52c8', // Talking Can Help
      how_support: '67b045b2e84a5c439b2b52c9', // How to Ask for Help
      tips_support: '67b04613e84a5c439b2b52ca', // Tips When Things Get Tough
      what_support: '67b04673e84a5c439b2b52cb', // What gets in the way of asking for help?
      help_support: '67b046f1e84a5c439b2b52cc', // Where & When to Find Help?
      mindset: '67b04836e84a5c439b2b52cd', // Change the Way you Think

      // Services - articles for the second tab group "Services" //
      crisis: '67b04ed6e84a5c439b2b52ce', // Crisis & Suicide Services
      kids: '67b04f1ce84a5c439b2b52cf', // Kids Helpline
      mental_serv: '67b04f5fe84a5c439b2b52d0', // Mental Health Services
      counsel: '67b04f8fe84a5c439b2b52d1', // Counselling Services
      substance: '67b04fcce84a5c439b2b52d2', // Services for Substance Use
      indigl: '67b05711e84a5c439b2b52d4', // Helplines for Indigenous Peoples & LBQTQ
      help_serv: '67b0502ee84a5c439b2b52d3', // Where to Get Help 

      // Guides - articles fr the third tab group "guides" //
      mental_guides: '67b062ece84a5c439b2b52d5', // Looking After Your Mental Health
      digital: '67b063b6e84a5c439b2b52d6', // Digital Mental Health Resources
      parent: '67b0646ce84a5c439b2b52d7', // Getting Help When Your Parent is Mentally Ill
      depression_guides: '67b064ebe84a5c439b2b52d8', // A Guide to What Works for Depression
      self: '67b06522e84a5c439b2b52d9', // Guide to Looking After Yourself
      toolkit: '67b066bbe84a5c439b2b52da', // Mental Health Toolkits
      tips_guides: '67b06718e84a5c439b2b52db' // Tips & Factsheets
    };
    
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
    <style>
    .expanded-page  {
     background: var(--background-resources);
    }
    </style>
   ${Auth.isLoggedIn() ? 
              html`<va-app-header user=${JSON.stringify(Auth.currentUser)}></va-app-header>` : 
              html`<va-public-header></va-public-header>`
            }
              <a href="/" @click="${anchorRoute}"><img class="header-logo" src="/images/logo/logo-mindline-no-wording-white-125.png"></a>      
              <div class="page-content expanded-page"> 
                <section class="banner expanded">
                <h1>Resources </h1>
                <div class="banner-content">     
                  <div id="bento-tabs">
                    <sl-tab-group .active="${activeTab}">
                      <sl-tab slot="nav" panel="stress" .active="${activeTab === 'stress'}">Support</sl-tab>
                      <sl-tab slot="nav" panel="anxiety" .active="${activeTab === 'anxiety'}">Services</sl-tab>
                      <sl-tab slot="nav" panel="depression" .active="${activeTab === 'depression'}">Guides</sl-tab>
        
                      <!-- this is the first tab content of the mental health page -->
                      <sl-tab-panel name="stress">
                        
               
                        <div class="support">
                        
                          <div class="ask" @click=${this.openDialog}>
                            <img src="/images/mindfulness/meditation/meditation-what-is-meditation.webp" class="why-img">
                            <p>${this.articles.get('ask')?.title || 'Loading...'}</p>
                            ${this.userBookmarks && this.articles.get('ask') && this.userBookmarks.has(this.articles.get('ask')._id)
                              ? html`
                                <img 
                                  src="/images/bookmark/bookmark-full.svg" 
                                  class="bookmark"
                                  style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                                >`
                              : ''
                            }
                            <sl-dialog label="${this.articles.get('ask')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                              <div style="white-space: pre-line;">
                              ${this.articles.get('ask')?.bodyContent || 'Loading content...'}
                              </div>
                              <sl-button slot="footer" variant="primary" 
                                @click=${(e) => {
                                  const articleId = this.articles.get('ask')?._id;
                                  console.log("Bookmarking article ID:", articleId);
                                  this.bookmarkArticle(e, articleId);
                                }}>
                                ${this.userBookmarks.has(this.articles.get('ask')?._id) ? 'Remove Bookmark' : 'Bookmark'}
                              </sl-button>
                              <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                            </sl-dialog>
                          </div>
                          
                          <div class="talk" @click=${this.openDialog}>
                            <img src="/images/mindfulness/meditation/meditation-why-meditate.webp" class="stress-img">
                            <p>${this.articles.get('talk')?.title || 'Loading...'}</p>
                            ${this.userBookmarks && this.articles.get('talk') && this.userBookmarks.has(this.articles.get('talk')._id)
                              ? html`
                                <img 
                                  src="/images/bookmark/bookmark-full.svg" 
                                  class="bookmark"
                                  style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                                >`
                              : ''
                            }
                            <sl-dialog label="${this.articles.get('talk')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
        
                            <div style="white-space: pre-line;">
                              ${this.articles.get('talk')?.bodyContent || 'Loading content...'}
                            </div>
        
                              <sl-button slot="footer" variant="primary" 
                                @click=${(e) => {
                                  const articleId = this.articles.get('talk')?._id;
                                  console.log("Bookmarking article ID:", articleId);
                                  this.bookmarkArticle(e, articleId);
                                }}>
                                ${this.userBookmarks.has(this.articles.get('talk')?._id) ? 'Remove Bookmark' : 'Bookmark'}
                              </sl-button>
                              <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                          </div>
        
                          <div class="how_support" @click=${this.openDialog}>
                            <img src="/images/mindfulness/meditation/meditation-mental-health-benefits.webp" class="signs-img">
                            <p>${this.articles.get('how_support')?.title || 'Loading...'}</p>
                            ${this.userBookmarks && this.articles.get('how_support') && this.userBookmarks.has(this.articles.get('how_support')._id)
                              ? html`
                                <img 
                                  src="/images/bookmark/bookmark-full.svg" 
                                  class="bookmark"
                                  style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                                >`
                              : ''
                            }
                            <sl-dialog label="${this.articles.get('how_support')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                            <div style="white-space: pre-line;">
                              ${this.articles.get('how_support')?.bodyContent || 'Loading content...'}
                            </div>
                            <sl-button slot="footer" variant="primary" 
                              @click=${(e) => {
                                const articleId = this.articles.get('benefits')?._id;
                                console.log("Bookmarking article ID:", articleId);
                                this.bookmarkArticle(e, articleId);
                              }}>
                              ${this.userBookmarks.has(this.articles.get('how_support')?._id) ? 'Remove Bookmark' : 'Bookmark'}
                            </sl-button>
                            <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                          </div>
                        
                        
                          <div class="tips_support" @click=${this.openDialog}>
                            <img src="/images/mindfulness/meditation/meditation-physical-benefits.webp" class="triggers-img">
                            <p>${this.articles.get('tips_support')?.title || 'Loading...'}</p>
                            ${this.userBookmarks && this.articles.get('tips_support') && this.userBookmarks.has(this.articles.get('tips_support')._id)
                              ? html`
                                <img 
                                  src="/images/bookmark/bookmark-full.svg" 
                                  class="bookmark"
                                  style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                                >`
                              : ''
                            }
                            <sl-dialog label="${this.articles.get('tips_support')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
        
                            <div style="white-space: pre-line;">
                              ${this.articles.get('tips_support')?.bodyContent || 'Loading content...'}
                            </div>
                            <sl-button slot="footer" variant="primary" 
                              @click=${(e) => {
                                const articleId = this.articles.get('tips_support')?._id;
                                console.log("Bookmarking article ID:", articleId);
                                this.bookmarkArticle(e, articleId);
                              }}>
                              ${this.userBookmarks.has(this.articles.get('tips_support')?._id) ? 'Remove Bookmark' : 'Bookmark'}
                            </sl-button>
                            <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                          </div>
        
                          <div class="what_support" @click=${this.openDialog}>
                          <img src="/images/mindfulness/meditation/meditation-clock-guided-meditation-253.webp" class="what-sup-img">
                          <p>${this.articles.get('what_support')?.title || 'Loading...'}</p>
                              ${this.userBookmarks && this.articles.get('what_support') && this.userBookmarks.has(this.articles.get('what_support')._id)
                                  ? html`
                                    <img 
                                      src="/images/bookmark/bookmark-full.svg" 
                                    class="bookmark"
                                    style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                                    >`
                                  : ''
                                }
                            <sl-dialog label="${this.articles.get('what_support')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                            <div style="white-space: pre-line;">
                              ${this.articles.get('what_support')?.bodyContent || 'Loading content...'}
                            </div>
                             <div class="video-group">
                                 <div class="video-embed">
                                   ${this.articles.get('what_support')?.mediaUrl
                                     ? html`${unsafeHTML(this.articles.get('practices')?.mediaUrl)}`
                                     : null
                                   }
                                 </div>
                                
                             </div>
                            <sl-button slot="footer" variant="primary" 
                                @click=${(e) => {
                                  const articleId = this.articles.get('what_support')?._id;
                                  console.log("Bookmarking article ID:", articleId);
                                  this.bookmarkArticle(e, articleId);
                                }}>
                                ${this.userBookmarks.has(this.articles.get('what_support')?._id) ? 'Remove Bookmark' : 'Bookmark'}
                              </sl-button>
        
                            <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                          </div>
                        
                          <div class="help_support" @click=${this.openDialog}>
                          <img src="/images/mindfulness/meditation/meditation-common-questions.webp" class="seek-img">
        
                          <p>${this.articles.get('help_support')?.title || 'Loading...'}</p>
                              ${this.userBookmarks && this.articles.get('help_support') && this.userBookmarks.has(this.articles.get('help_support')._id)
                                ? html`
                                  <img 
                                    src="/images/bookmark/bookmark-full.svg" 
                                    class="bookmark"
                                    style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                                  >`
                                : ''
                              }
                            <sl-dialog label="${this.articles.get('help_support')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                            <div style="white-space: pre-line;">
                              ${this.articles.get('help_support')?.bodyContent || 'Loading content...'}
                            </div>
                            <sl-button slot="footer" variant="primary" 
                                @click=${(e) => {
                                  const articleId = this.articles.get('help_support')?._id;
                                  console.log("Bookmarking article ID:", articleId);
                                  this.bookmarkArticle(e, articleId);
                                }}>
                                ${this.userBookmarks.has(this.articles.get('help_support')?._id) ? 'Remove Bookmark' : 'Bookmark'}
                              </sl-button>
                            <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                          </div>
        
                          <div class="mindset" @click=${this.openDialog}>
                          <img src="/images/mindfulness/meditation/meditation-tips-light-globe.webp" class="questions-img">
                              <p>${this.articles.get('mindset')?.title || 'Loading...'}</p>
                              ${this.userBookmarks && this.articles.get('mindset') && this.userBookmarks.has(this.articles.get('mindset')._id)
                                ? html`
                                  <img 
                                    src="/images/bookmark/bookmark-full.svg" 
                                  class="bookmark"
                                  style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                                  >`
                                : ''
                              }
                            <sl-dialog label="${this.articles.get('mindset')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                            <div style="white-space: pre-line;">
                              ${this.articles.get('mindset')?.bodyContent || 'Loading content...'}
                            </div>
                            <sl-button slot="footer" variant="primary" 
                              @click=${(e) => {
                                const articleId = this.articles.get('mindset')?._id;
                                console.log("Bookmarking article ID:", articleId);
                                this.bookmarkArticle(e, articleId);
                              }}>
                              ${this.userBookmarks.has(this.articles.get('mindset')?._id) ? 'Remove Bookmark' : 'Bookmark'}
                            </sl-button>
                            <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                          </div>
                        </div>
                      </sl-tab-panel>
        
        
        
        
                       <!-- this is the second tab content of the mental health page -->
                      <sl-tab-panel name="anxiety">
                        <div class="support">
                        
                          <div class="ask" @click=${this.openDialog}>
                           <img src="/images/mental-health/anxiety/anxiety-why.webp" class="why-img">
                            <p>${this.articles.get('crisis')?.title || 'Loading...'}</p>
                             ${this.userBookmarks && this.articles.get('crisis') && this.userBookmarks.has(this.articles.get('crisis')._id)
                              ? html`
                                <img 
                                  src="/images/bookmark/bookmark-full.svg" 
                                  class="bookmark"
                                  style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                                >
                              `
                              : ''
                            }
                            <sl-dialog label="${this.articles.get('crisis')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                              <div style="white-space: pre-line;">
                                ${this.articles.get('crisis')?.bodyContent || 'Loading content...'}
                              </div>
                              <sl-button slot="footer" variant="primary" 
                              @click=${(e) => {
                                const articleId = this.articles.get('crisis')?._id;
                                console.log("Bookmarking article ID:", articleId);
                                this.bookmarkArticle(e, articleId);
                              }}>
                              ${this.userBookmarks.has(this.articles.get('crisis')?._id) ? 'Remove Bookmark' : 'Bookmark'}
                            </sl-button>
                              <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                            </sl-dialog>
                          </div>
        
                          <div class="talk" @click=${this.openDialog}>
                           <img src="/images/mental-health/anxiety/anxiety-deal-360.webp">
        
                            <p>${this.articles.get('kids')?.title || 'Loading...'}</p>
                            ${this.userBookmarks && this.articles.get('kids') && this.userBookmarks.has(this.articles.get('kids')._id)
                              ? html`
                                <img 
                                  src="/images/bookmark/bookmark-full.svg" 
                                  class="bookmark"
                                  style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                                >`
                              : ''
                            }
                            <sl-dialog label="${this.articles.get('kids')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                            <div style="white-space: pre-line;">
                              ${this.articles.get('kids')?.bodyContent || 'Loading content...'}
                            </div>
                              <sl-button
                                  slot="footer"
                                  variant="primary"
                                  @click=${(e) => {
                                    const articleId = this.articles.get('kids')?._id;
                                    console.log("Bookmarking article ID:", articleId);
                                    this.bookmarkArticle(e, articleId);
                                  }}
                                >
                                  ${this.userBookmarks.has(this.articles.get('kids')?._id)
                                    ? 'Remove Bookmark'
                                    : 'Bookmark'
                                  }
                                </sl-button>
        
                              <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                          </div>
        
                          <div class="how_support" @click=${this.openDialog}>
                           <img src="/images/mental-health/anxiety/anxiety-signs-360.webp" class="signs-img">
        
                            <p>${this.articles.get('mental_serv')?.title || 'Loading...'}</p>
                             ${this.userBookmarks && this.articles.get('mental_serv') && this.userBookmarks.has(this.articles.get('mental_serv')._id)
                              ? html`
                                <img 
                                  src="/images/bookmark/bookmark-full.svg" 
                                  class="bookmark"
                                  style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                                >`
                              : ''
                            }
                            <sl-dialog label="${this.articles.get('mental_serv')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                            <div style="white-space: pre-line;">
                              ${this.articles.get('mental_serv')?.bodyContent || 'Loading content...'}
                            </div>
                            <sl-button
                              slot="footer"
                              variant="primary"
                              @click=${(e) => {
                                const articleId = this.articles.get('mental_serv')?._id;
                                console.log("Bookmarking article ID:", articleId);
                                this.bookmarkArticle(e, articleId);
                              }}
                            >
                              ${this.userBookmarks.has(this.articles.get('mental_serv')?._id)
                                ? 'Remove Bookmark'
                                : 'Bookmark'
                              }
                            </sl-button>
        
                            <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                          </div>
                        
                        
                          <div class="tips_support" @click=${this.openDialog}>
                           <img src="/images/mental-health/anxiety/anxiety-triggers-360.webp" class="triggers-img">
        
                            <p>${this.articles.get('counsel')?.title || 'Loading...'}</p>
                             ${this.userBookmarks && this.articles.get('counsel') && this.userBookmarks.has(this.articles.get('counsel')._id)
                              ? html`
                                <img 
                                  src="/images/bookmark/bookmark-full.svg" 
                                  class="bookmark"
                                  style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                                >`
                              : ''
                            }
                            <sl-dialog label="${this.articles.get('counsel')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                            <div style="white-space: pre-line;">
                              ${this.articles.get('counsel')?.bodyContent || 'Loading content...'}
                            </div>
        
                            <sl-button
                              slot="footer"
                              variant="primary"
                              @click=${(e) => {
                                const articleId = this.articles.get('counsel')?._id;
                                console.log("Bookmarking article ID:", articleId);
                                this.bookmarkArticle(e, articleId);
                              }}
                            >
                              ${this.userBookmarks.has(this.articles.get('counsel')?._id)
                                ? 'Remove Bookmark'
                                : 'Bookmark'
                              }
                            </sl-button>
                            <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                          </div>
        
                          <div class="what_support" @click=${this.openDialog}>
                           <img src="/images/mental-health/anxiety/anxiety-practices-360.webp" class="practices-img">
        
                              <p>${this.articles.get('substance')?.title || 'Loading...'}</p>
                             ${this.userBookmarks && this.articles.get('substance') && this.userBookmarks.has(this.articles.get('substance')._id)
                              ? html`
                                <img 
                                  src="/images/bookmark/bookmark-full.svg" 
                                  class="bookmark"
                                  style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                                >`
                              : ''
                            }
                            <sl-dialog label="${this.articles.get('substance')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                            <div style="white-space: pre-line;">
                              ${this.articles.get('substance')?.bodyContent || 'Loading content...'}
                            </div>
                            <div class="video-group">
                                 <div class="video-embed">
                                   ${this.articles.get('substance')?.mediaUrl
                                     ? html`${unsafeHTML(this.articles.get('substance')?.mediaUrl)}`
                                     : null
                                   }
                                 </div>
                                 <div class="video-embed">
                                   ${this.articles.get('practices_breath_2')?.mediaUrl
                                     ? html`${unsafeHTML(this.articles.get('practices_breath_2')?.mediaUrl)}`
                                     : null
                                   }
                                 </div>
                                 
                             </div>
                            <sl-button
                              slot="footer"
                              variant="primary"
                              @click=${(e) => {
                                const articleId = this.articles.get('substance')?._id;
                                console.log("Bookmarking article ID:", articleId);
                                this.bookmarkArticle(e, articleId);
                              }}
                            >
                              ${this.userBookmarks.has(this.articles.get('substance')?._id)
                                ? 'Remove Bookmark'
                                : 'Bookmark'
                              }
                            </sl-button>
        
                            <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                          </div>
                        
                          <div class="help_support" @click=${this.openDialog}>
                         <img src="/images/mental-health/anxiety/anxiety-when-to-seek-help-360.webp" class="seek-img">
        
                         <p>${this.articles.get('indigl')?.title || 'Loading...'}</p>
                             ${this.userBookmarks && this.articles.get('indigl') && this.userBookmarks.has(this.articles.get('indigl')._id)
                              ? html`
                                <img 
                                  src="/images/bookmark/bookmark-full.svg" 
                                  class="bookmark"
                                  style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                                >`
                              : ''
                            }
                            <sl-dialog label="${this.articles.get('indigl')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                            <div style="white-space: pre-line;">
                              ${this.articles.get('indigl')?.bodyContent || 'Loading content...'}
                            </div>
        
                            
                            <sl-button
                              slot="footer"
                              variant="primary"
                              @click=${(e) => {
                                const articleId = this.articles.get('indigl')?._id;
                                console.log("Bookmarking article ID:", articleId);
                                this.bookmarkArticle(e, articleId);
                              }}
                            >
                              ${this.userBookmarks.has(this.articles.get('indigl')?._id)
                                ? 'Remove Bookmark'
                                : 'Bookmark'
                              }
                            </sl-button>
                            <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                          </div>
        
                          <div class="mindset" @click=${this.openDialog}>
                         <img src="/images/mental-health/anxiety/anxiety-questions-360.webp" class="questions-img">
        
                              <p>${this.articles.get('help_serv')?.title || 'Loading...'}</p>
                             ${this.userBookmarks && this.articles.get('help_serv') && this.userBookmarks.has(this.articles.get('help_serv')._id)
                              ? html`
                                <img 
                                  src="/images/bookmark/bookmark-full.svg" 
                                  class="bookmark"
                                  style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                                >`
                              : ''
                            }
                            <sl-dialog label="${this.articles.get('help_serv')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
        
                            <div style="white-space: pre-line;">
                              ${this.articles.get('help_serv')?.bodyContent || 'Loading content...'}
                            </div>
                            <sl-button
                              slot="footer"
                              variant="primary"
                              @click=${(e) => {
                                const articleId = this.articles.get('help_serv')?._id;
                                console.log("Bookmarking article ID:", articleId);
                                this.bookmarkArticle(e, articleId);
                              }}
                            >
                              ${this.userBookmarks.has(this.articles.get('help_serv')?._id)
                                ? 'Remove Bookmark'
                                : 'Bookmark'
                              }
                            </sl-button>
                            <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                          </div>
                        </div>
                      </sl-tab-panel>
        
        
        
        
                      
                       <!-- this is the third tab content of the menal health page -->
                      <sl-tab-panel name="depression">
                        <div class="support">
                        
                          <div class="ask" @click=${this.openDialog}>
                           <img src="/images/mental-health/depression/depression-why-depression-matters.webp" class="why-img">
        
                            <p>${this.articles.get('mental_guides')?.title || 'Loading...'}</p>
                             ${this.userBookmarks && this.articles.get('mental_guides') && this.userBookmarks.has(this.articles.get('mental_guides')._id)
                              ? html`
                                <img 
                                  src="/images/bookmark/bookmark-full.svg" 
                                  class="bookmark"
                                  style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                                >`
                              : ''
                            }
                            <sl-dialog label="${this.articles.get('mental_guides')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                              <div style="white-space: pre-line;">
                                ${this.articles.get('mental_guides')?.bodyContent || 'Loading content...'}
                              </div>
        
                              <sl-button
                                slot="footer"
                                variant="primary"
                                @click=${(e) => {
                                  const articleId = this.articles.get('mental_guides')?._id;
                                  console.log("Bookmarking article ID:", articleId);
                                  this.bookmarkArticle(e, articleId);
                                }}
                              >
                                ${this.userBookmarks.has(this.articles.get('mental_guides')?._id)
                                  ? 'Remove Bookmark'
                                  : 'Bookmark'
                                }
                              </sl-button>
                              <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                            </sl-dialog>
                          </div>
        
                          <div class="talk" @click=${this.openDialog}>
                            <img src="/images/mental-health/depression/depression-deal-360r.webp" class="stress-img">
        
                            <p>${this.articles.get('digital')?.title || 'Loading...'}</p>
                            ${this.userBookmarks && this.articles.get('digital') && this.userBookmarks.has(this.articles.get('digital')._id)
                              ? html`
                                <img 
                                  src="/images/bookmark/bookmark-full.svg" 
                                  class="bookmark"
                                  style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                                >`
                              : ''
                            }
                            <sl-dialog label="${this.articles.get('digital')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                            <div style="white-space: pre-line;">
                              ${this.articles.get('digital')?.bodyContent || 'Loading content...'}
                            </div>
                              <sl-button
                                slot="footer"
                                variant="primary"
                                @click=${(e) => {
                                  const articleId = this.articles.get('digital')?._id;
                                  console.log("Bookmarking article ID:", articleId);
                                  this.bookmarkArticle(e, articleId);
                                }}
                              >
                                ${this.userBookmarks.has(this.articles.get('digital')?._id)
                                  ? 'Remove Bookmark'
                                  : 'Bookmark'
                                }
                              </sl-button>
        
        
                              <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                          </div>
        
                          <div class="how_support" @click=${this.openDialog}>
                            <img src="/images/mental-health/depression/depression-signs.webp" class="signs-img">
        
                            <p>${this.articles.get('parent')?.title || 'Loading...'}</p>
                             ${this.userBookmarks && this.articles.get('parent') && this.userBookmarks.has(this.articles.get('parent')._id)
                              ? html`
                                <img 
                                  src="/images/bookmark/bookmark-full.svg" 
                                  class="bookmark"
                                  style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                                >`
                              : ''
                            }
                            <sl-dialog label="${this.articles.get('parent')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
        
                            <div style="white-space: pre-line;">
                              ${this.articles.get('parent')?.bodyContent || 'Loading content...'}
                            </div>
                       
                            <sl-button
                              slot="footer"
                              variant="primary"
                              @click=${(e) => {
                                const articleId = this.articles.get('parent')?._id;
                                console.log("Bookmarking article ID:", articleId);
                                this.bookmarkArticle(e, articleId);
                              }}
                            >
                              ${this.userBookmarks.has(this.articles.get('parent')?._id)
                                ? 'Remove Bookmark'
                                : 'Bookmark'
                              }
                            </sl-button>
        
                            <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                          </div>
                        
                        
                          <div class="tips_support" @click=${this.openDialog}>
                            <img src="/images/mental-health/depression/depression-triggers-360.webp" class="triggers-img">
        
                            <p>${this.articles.get('depression_guides')?.title || 'Loading...'}</p>
                             ${this.userBookmarks && this.articles.get('depression_guides') && this.userBookmarks.has(this.articles.get('depression_guides')._id)
                              ? html`
                                <img 
                                  src="/images/bookmark/bookmark-full.svg" 
                                  class="bookmark"
                                  style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                                >`
                              : ''
                            }
                            <sl-dialog label="${this.articles.get('depression_guides')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
        
                            <div style="white-space: pre-line;">
                              ${this.articles.get('depression_guides')?.bodyContent || 'Loading content...'}
                            </div>
                            <sl-button
                              slot="footer"
                              variant="primary"
                              @click=${(e) => {
                                const articleId = this.articles.get('depression_guides')?._id;
                                console.log("Bookmarking article ID:", articleId);
                                this.bookmarkArticle(e, articleId);
                              }}
                            >
                              ${this.userBookmarks.has(this.articles.get('depression_guides')?._id)
                                ? 'Remove Bookmark'
                                : 'Bookmark'
                              }
                            </sl-button>
        
        
                            <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                          </div>
        
                          <div class="what_support" @click=${this.openDialog}>
                            <img src="/images/mental-health/depression/depression-practices-360.webp" class="practices-img">
        
                              <p>${this.articles.get('self')?.title || 'Loading...'}</p>
                             ${this.userBookmarks && this.articles.get('self') && this.userBookmarks.has(this.articles.get('self')._id)
                              ? html`
                                <img 
                                  src="/images/bookmark/bookmark-full.svg" 
                                  class="bookmark"
                                  style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                                >`
                              : ''
                            }
                            <sl-dialog label="${this.articles.get('self')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
        
                            <div style="white-space: pre-line;">
                              ${this.articles.get('self')?.bodyContent || 'Loading content...'}
                            </div>
                            <sl-button
                              slot="footer"
                              variant="primary"
                              @click=${(e) => {
                                const articleId = this.articles.get('self')?._id;
                                console.log("Bookmarking article ID:", articleId);
                                this.bookmarkArticle(e, articleId);
                              }}
                            >
                              ${this.userBookmarks.has(this.articles.get('self')?._id)
                                ? 'Remove Bookmark'
                                : 'Bookmark'
                              }
                            </sl-button>
        
                            <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                          </div>
                        
                          <div class="help_support" @click=${this.openDialog}>
                            <img src="/images/mental-health/depression/depression-seek-360.webp" class="seek-img">
        
                            <p>${this.articles.get('toolkit')?.title || 'Loading...'}</p>
                              ${this.userBookmarks && this.articles.get('toolkit') && this.userBookmarks.has(this.articles.get('toolkit')._id)
                                ? html`
                                  <img 
                                    src="/images/bookmark/bookmark-full.svg" 
                                    class="bookmark"
                                    style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                                  >`
                                : ''
                              }
                              <sl-dialog label="${this.articles.get('toolkit')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                              <div style="white-space: pre-line;">
                                ${this.articles.get('toolkit')?.bodyContent || 'Loading content...'}
                              </div>
                              <sl-button
                                slot="footer"
                                variant="primary"
                                @click=${(e) => {
                                  const articleId = this.articles.get('toolkit')?._id;
                                  console.log("Bookmarking article ID:", articleId);
                                  this.bookmarkArticle(e, articleId);
                                }}
                              >
                                ${this.userBookmarks.has(this.articles.get('toolkit')?._id)
                                  ? 'Remove Bookmark'
                                  : 'Bookmark'
                                }
                              </sl-button>
                              <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                          </div>
        
                          <div class="mindset" @click=${this.openDialog}>
                            <img src="/images/mental-health/depression/depression-questions.webp" class="questions-img">
                            <p>${this.articles.get('tips_guides')?.title || 'Loading...'}</p>
                              ${this.userBookmarks && this.articles.get('tips_guides') && this.userBookmarks.has(this.articles.get('tips_guides')._id)
                                ? html`
                                  <img 
                                    src="/images/bookmark/bookmark-full.svg" 
                                    class="bookmark"
                                    style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                                  >`
                                : ''
                              }
                              <sl-dialog label="${this.articles.get('tips_guides')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                              <div style="white-space: pre-line;">
                                ${this.articles.get('tips_guides')?.bodyContent || 'Loading content...'}
                              </div>
                              <sl-button
                                slot="footer"
                                variant="primary"
                                @click=${(e) => {
                                  const articleId = this.articles.get('tips_guides')?._id;
                                  console.log("Bookmarking article ID:", articleId);
                                  this.bookmarkArticle(e, articleId);
                                }}
                              >
                                ${this.userBookmarks.has(this.articles.get('tips_guides')?._id)
                                  ? 'Remove Bookmark'
                                  : 'Bookmark'
                                }
                              </sl-button>
        
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


export default new resourcesExpandedView()