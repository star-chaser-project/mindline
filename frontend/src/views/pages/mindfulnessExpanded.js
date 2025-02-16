import App from '../../App'
import { html, render } from 'lit-html'
import { gotoRoute, anchorRoute } from '../../Router'
import Auth from '../../Auth'
import Utils from '../../Utils'
import Toast from '../../Toast'
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js'

class mindfulnessExpandedView {
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
    document.title = 'Mindfulness Expanded';
    this.articleIds = {
      // Meditation articles
      what: '679dd9db640ec34e3c22a2a1', // What is Meditation
      why: '679ddae8640ec34e3c22a2a2', // Why Meditate
      benefits: '679ddd11640ec34e3c22a2a4', // Mental Health Benefits of Meditation
      guided: '679ddf6e640ec34e3c22a2a5', // Guided Meditation
      practices: '679de245640ec34e3c22a2a7', //  Meditation Practics + Walking It audio & other audio info
      practices_2: '679de3f7640ec34e3c22a2a8', // Time out audio 
      practices_3: '679de47f640ec34e3c22a2a9', // Candle gazing audio
      questions: '679deda0640ec34e3c22a2b9', // 
      tips: '679ddb6f640ec34e3c22a2a3', // Tips When to Meditate

      // Breathing articles
      why_breath: '67ab274607163965f66e57f7', // Why is Motivation Important
      how_breath: '67ab40c807163965f66e57fa',
      benefits_breath: '67ab38cf07163965f66e57f9',
      practices_breath: '679b567904f7c1b1216d5410',
      practices_breath_2: '679dc065640ec34e3c22a28a',
      seek_breath: '679dcac3640ec34e3c22a291',
      questions_breath: '67ab47da07163965f66e57fc',
      tips_breath: '67ab44b707163965f66e57fb',

      // Motivation articles
      why_mot: '679de5c7640ec34e3c22a2ab',
      ways_mot: '679de645640ec34e3c22a2ac',
      how_mot: '679dea10640ec34e3c22a2af',
      how_mot_2: '679dea63640ec34e3c22a2b0',
      practices_mot: '679dc9da640ec34e3c22a290',
      practices_mot_2: '679de97c640ec34e3c22a2ae',
      what_mot: '679deb6c640ec34e3c22a2b3',
      tips_mot: '679debbe640ec34e3c22a2b4'
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
        .expanded-page {
          background: var(--background-mindfulness);
        }
      </style>
      ${Auth.isLoggedIn() ? 
           html`<va-app-header user=${JSON.stringify(Auth.currentUser)}></va-app-header>` : 
           html`<va-public-header></va-public-header>`
         }
           <a href="/" @click="${anchorRoute}"><img class="header-logo" src="/images/logo/logo-mindline-no-wording-white-125.png"></a>      
           <div class="page-content expanded-page"> 
             <section class="banner expanded">
             <h1>Mindfulness</h1>
             <div class="banner-content">     
               <div id="bento-tabs">
                 <sl-tab-group .active="${activeTab}">
                   <sl-tab slot="nav" panel="stress" .active="${activeTab === 'stress'}">Meditation</sl-tab>
                   <sl-tab slot="nav" panel="anxiety" .active="${activeTab === 'anxiety'}">Breathing</sl-tab>
                   <sl-tab slot="nav" panel="depression" .active="${activeTab === 'depression'}">Motivation</sl-tab>
     
                   <!-- this is the first tab content of the menal health page -->
                   <sl-tab-panel name="stress">
                     
            
                     <div class="meditation">
                     
                       <div class="what-med" @click=${this.openDialog}>
                         <img src="/images/mindfulness/meditation/meditation-what-is-meditation.webp" class="why-img">
                         <p>${this.articles.get('what')?.title || 'Loading...'}</p>
                         ${this.userBookmarks && this.articles.get('what') && this.userBookmarks.has(this.articles.get('what')._id)
                           ? html`
                             <img 
                               src="/images/bookmark/bookmark-full.svg" 
                               class="bookmark"
                               style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                             >`
                           : ''
                         }
                         <sl-dialog label="${this.articles.get('what')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                           <div style="white-space: pre-line;">
                           ${this.articles.get('what')?.bodyContent || 'Loading content...'}
                           </div>
                           <sl-button slot="footer" variant="primary" 
                             @click=${(e) => {
                               const articleId = this.articles.get('what')?._id;
                               console.log("Bookmarking article ID:", articleId);
                               this.bookmarkArticle(e, articleId);
                             }}>
                             ${this.userBookmarks.has(this.articles.get('what')?._id) ? 'Remove Bookmark' : 'Bookmark'}
                           </sl-button>
                           <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                         </sl-dialog>
                       </div>
                       
                       <div class="why-med" @click=${this.openDialog}>
                         <img src="/images/mindfulness/meditation/meditation-why-meditate.webp" class="stress-img">
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
                       </div>
     
                       <div class="benefit-med" @click=${this.openDialog}>
                         <img src="/images/mindfulness/meditation/meditation-mental-health-benefits.webp" class="signs-img">
                         <p>${this.articles.get('benefits')?.title || 'Loading...'}</p>
                         ${this.userBookmarks && this.articles.get('benefits') && this.userBookmarks.has(this.articles.get('benefits')._id)
                           ? html`
                             <img 
                               src="/images/bookmark/bookmark-full.svg" 
                               class="bookmark"
                               style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                             >`
                           : ''
                         }
                         <sl-dialog label="${this.articles.get('benefits')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                         <div style="white-space: pre-line;">
                           ${this.articles.get('benefits')?.bodyContent || 'Loading content...'}
                         </div>
                         <sl-button slot="footer" variant="primary" 
                           @click=${(e) => {
                             const articleId = this.articles.get('benefits')?._id;
                             console.log("Bookmarking article ID:", articleId);
                             this.bookmarkArticle(e, articleId);
                           }}>
                           ${this.userBookmarks.has(this.articles.get('benefits')?._id) ? 'Remove Bookmark' : 'Bookmark'}
                         </sl-button>
                         <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                       </div>
                     
                     
                       <div class="physical-med" @click=${this.openDialog}>
                         <img src="/images/mindfulness/meditation/meditation-physical-benefits.webp" class="triggers-img">
                         <p>${this.articles.get('guided')?.title || 'Loading...'}</p>
                         ${this.userBookmarks && this.articles.get('guided') && this.userBookmarks.has(this.articles.get('guided')._id)
                           ? html`
                             <img 
                               src="/images/bookmark/bookmark-full.svg" 
                               class="bookmark"
                               style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                             >`
                           : ''
                         }
                         <sl-dialog label="${this.articles.get('guided')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
     
                         <div style="white-space: pre-line;">
                           ${this.articles.get('guided')?.bodyContent || 'Loading content...'}
                         </div>
                         <sl-button slot="footer" variant="primary" 
                           @click=${(e) => {
                             const articleId = this.articles.get('guided')?._id;
                             console.log("Bookmarking article ID:", articleId);
                             this.bookmarkArticle(e, articleId);
                           }}>
                           ${this.userBookmarks.has(this.articles.get('guided')?._id) ? 'Remove Bookmark' : 'Bookmark'}
                         </sl-button>
                         <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                       </div>
     
                       <div class="guided-med" @click=${this.openDialog}>
                       <img src="/images/mindfulness/meditation/meditation-clock-guided-meditation-253.webp" class="practices-img">
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
                         <div style="white-space: pre-line;">
                           ${this.articles.get('practices')?.bodyContent || 'Loading content...'}
                         </div>
                          <div class="video-group">
                              <div class="video-embed">
                                ${this.articles.get('practices')?.mediaUrl
                                  ? html`${unsafeHTML(this.articles.get('practices')?.mediaUrl)}`
                                  : null
                                }
                              </div>
                              <div class="video-embed">
                                ${this.articles.get('practices_2')?.mediaUrl
                                  ? html`${unsafeHTML(this.articles.get('practices_2')?.mediaUrl)}`
                                  : null
                                }
                              </div>
                              <div class="video-embed">
                                ${this.articles.get('practices_3')?.mediaUrl
                                  ? html`${unsafeHTML(this.articles.get('practices_3')?.mediaUrl)}`
                                  : null
                                }
                              </div>
                          </div>
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
                     
                       <div class="questions-med" @click=${this.openDialog}>
                       <img src="/images/mindfulness/meditation/meditation-common-questions.webp" class="seek-img">
     
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
                         <div style="white-space: pre-line;">
                           ${this.articles.get('seek')?.bodyContent || 'Loading content...'}
                         </div>
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
     
                       <div class="tips-med" @click=${this.openDialog}>
                       <img src="/images/mindfulness/meditation/meditation-tips-light-globe.webp" class="questions-img">
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
                         <div style="white-space: pre-line;">
                           ${this.articles.get('questions')?.bodyContent || 'Loading content...'}
                         </div>
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
                     <div class="meditation">
                     
                       <div class="what-med" @click=${this.openDialog}>
                        <img src="/images/mental-health/anxiety/anxiety-why.webp" class="why-img">
                         <p>${this.articles.get('why_breath')?.title || 'Loading...'}</p>
                          ${this.userBookmarks && this.articles.get('why_breath') && this.userBookmarks.has(this.articles.get('why_breath')._id)
                           ? html`
                             <img 
                               src="/images/bookmark/bookmark-full.svg" 
                               class="bookmark"
                               style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                             >
                           `
                           : ''
                         }
                         <sl-dialog label="${this.articles.get('why_breath')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                           <div style="white-space: pre-line;">
                             ${this.articles.get('why_breath')?.bodyContent || 'Loading content...'}
                           </div>
                           <sl-button slot="footer" variant="primary" 
                           @click=${(e) => {
                             const articleId = this.articles.get('why_breath')?._id;
                             console.log("Bookmarking article ID:", articleId);
                             this.bookmarkArticle(e, articleId);
                           }}>
                           ${this.userBookmarks.has(this.articles.get('why_breath')?._id) ? 'Remove Bookmark' : 'Bookmark'}
                         </sl-button>
                           <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                         </sl-dialog>
                       </div>
     
                       <div class="why-med" @click=${this.openDialog}>
                        <img src="/images/mental-health/anxiety/anxiety-deal-360.webp">
     
                         <p>${this.articles.get('how_breath')?.title || 'Loading...'}</p>
                         ${this.userBookmarks && this.articles.get('how_breath') && this.userBookmarks.has(this.articles.get('how_breath')._id)
                           ? html`
                             <img 
                               src="/images/bookmark/bookmark-full.svg" 
                               class="bookmark"
                               style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                             >`
                           : ''
                         }
                         <sl-dialog label="${this.articles.get('how_breath')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                         <div style="white-space: pre-line;">
                           ${this.articles.get('how_breath')?.bodyContent || 'Loading content...'}
                         </div>
                           <sl-button
                               slot="footer"
                               variant="primary"
                               @click=${(e) => {
                                 const articleId = this.articles.get('how_breath')?._id;
                                 console.log("Bookmarking article ID:", articleId);
                                 this.bookmarkArticle(e, articleId);
                               }}
                             >
                               ${this.userBookmarks.has(this.articles.get('how_breath')?._id)
                                 ? 'Remove Bookmark'
                                 : 'Bookmark'
                               }
                             </sl-button>
     
                           <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                       </div>
     
                       <div class="benefit-med" @click=${this.openDialog}>
                        <img src="/images/mental-health/anxiety/anxiety-signs-360.webp" class="signs-img">
     
                         <p>${this.articles.get('benefits_breath')?.title || 'Loading...'}</p>
                          ${this.userBookmarks && this.articles.get('benefits_breath') && this.userBookmarks.has(this.articles.get('benefits_breath')._id)
                           ? html`
                             <img 
                               src="/images/bookmark/bookmark-full.svg" 
                               class="bookmark"
                               style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                             >`
                           : ''
                         }
                         <sl-dialog label="${this.articles.get('benefits_breath')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                         <div style="white-space: pre-line;">
                           ${this.articles.get('benefits_breath')?.bodyContent || 'Loading content...'}
                         </div>
                         <sl-button
                           slot="footer"
                           variant="primary"
                           @click=${(e) => {
                             const articleId = this.articles.get('benefits_breath')?._id;
                             console.log("Bookmarking article ID:", articleId);
                             this.bookmarkArticle(e, articleId);
                           }}
                         >
                           ${this.userBookmarks.has(this.articles.get('benefits_breath')?._id)
                             ? 'Remove Bookmark'
                             : 'Bookmark'
                           }
                         </sl-button>
     
                         <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                       </div>
                     
                     
                       <div class="physical-med" @click=${this.openDialog}>
                        <img src="/images/mental-health/anxiety/anxiety-triggers-360.webp" class="triggers-img">
     
                         <p>${this.articles.get('seek_breath')?.title || 'Loading...'}</p>
                          ${this.userBookmarks && this.articles.get('seek_breath') && this.userBookmarks.has(this.articles.get('seek_breath')._id)
                           ? html`
                             <img 
                               src="/images/bookmark/bookmark-full.svg" 
                               class="bookmark"
                               style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                             >`
                           : ''
                         }
                         <sl-dialog label="${this.articles.get('seek_breath')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                         <div style="white-space: pre-line;">
                           ${this.articles.get('seek_breath')?.bodyContent || 'Loading content...'}
                         </div>
     
                         <sl-button
                           slot="footer"
                           variant="primary"
                           @click=${(e) => {
                             const articleId = this.articles.get('seek_breath')?._id;
                             console.log("Bookmarking article ID:", articleId);
                             this.bookmarkArticle(e, articleId);
                           }}
                         >
                           ${this.userBookmarks.has(this.articles.get('seek_breath')?._id)
                             ? 'Remove Bookmark'
                             : 'Bookmark'
                           }
                         </sl-button>
                         <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                       </div>
     
                       <div class="guided-med" @click=${this.openDialog}>
                        <img src="/images/mental-health/anxiety/anxiety-practices-360.webp" class="practices-img">
     
                           <p>${this.articles.get('practices_breath')?.title || 'Loading...'}</p>
                          ${this.userBookmarks && this.articles.get('practices_breath') && this.userBookmarks.has(this.articles.get('practices_breath')._id)
                           ? html`
                             <img 
                               src="/images/bookmark/bookmark-full.svg" 
                               class="bookmark"
                               style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                             >`
                           : ''
                         }
                         <sl-dialog label="${this.articles.get('practices_breath')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                         <div style="white-space: pre-line;">
                           ${this.articles.get('practices_breath')?.bodyContent || 'Loading content...'}
                         </div>
                         <div class="video-group">
                              <div class="video-embed">
                                ${this.articles.get('practices_breath')?.mediaUrl
                                  ? html`${unsafeHTML(this.articles.get('practices_breath')?.mediaUrl)}`
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
                             const articleId = this.articles.get('practices_breath')?._id;
                             console.log("Bookmarking article ID:", articleId);
                             this.bookmarkArticle(e, articleId);
                           }}
                         >
                           ${this.userBookmarks.has(this.articles.get('practices_breath')?._id)
                             ? 'Remove Bookmark'
                             : 'Bookmark'
                           }
                         </sl-button>
     
                         <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                       </div>
                     
                       <div class="questions-med" @click=${this.openDialog}>
                      <img src="/images/mental-health/anxiety/anxiety-when-to-seek-help-360.webp" class="seek-img">
     
                      <p>${this.articles.get('questions_breath')?.title || 'Loading...'}</p>
                          ${this.userBookmarks && this.articles.get('questions_breath') && this.userBookmarks.has(this.articles.get('questions_breath')._id)
                           ? html`
                             <img 
                               src="/images/bookmark/bookmark-full.svg" 
                               class="bookmark"
                               style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                             >`
                           : ''
                         }
                         <sl-dialog label="${this.articles.get('questions_breath')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                         <div style="white-space: pre-line;">
                           ${this.articles.get('questions_breath')?.bodyContent || 'Loading content...'}
                         </div>
     
                         
                         <sl-button
                           slot="footer"
                           variant="primary"
                           @click=${(e) => {
                             const articleId = this.articles.get('questions_breath')?._id;
                             console.log("Bookmarking article ID:", articleId);
                             this.bookmarkArticle(e, articleId);
                           }}
                         >
                           ${this.userBookmarks.has(this.articles.get('questions_breath')?._id)
                             ? 'Remove Bookmark'
                             : 'Bookmark'
                           }
                         </sl-button>
                         <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                       </div>
     
                       <div class="tips-med" @click=${this.openDialog}>
                      <img src="/images/mental-health/anxiety/anxiety-questions-360.webp" class="questions-img">
     
                           <p>${this.articles.get('tips_breath')?.title || 'Loading...'}</p>
                          ${this.userBookmarks && this.articles.get('tips_breath') && this.userBookmarks.has(this.articles.get('tips_breath')._id)
                           ? html`
                             <img 
                               src="/images/bookmark/bookmark-full.svg" 
                               class="bookmark"
                               style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                             >`
                           : ''
                         }
                         <sl-dialog label="${this.articles.get('tips_breath')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
     
                         <div style="white-space: pre-line;">
                           ${this.articles.get('tips_breath')?.bodyContent || 'Loading content...'}
                         </div>
                         <sl-button
                           slot="footer"
                           variant="primary"
                           @click=${(e) => {
                             const articleId = this.articles.get('tips_breath')?._id;
                             console.log("Bookmarking article ID:", articleId);
                             this.bookmarkArticle(e, articleId);
                           }}
                         >
                           ${this.userBookmarks.has(this.articles.get('tips_breath')?._id)
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
                     <div class="meditation">
                     
                       <div class="what-med" @click=${this.openDialog}>
                        <img src="/images/mental-health/depression/depression-why-depression-matters.webp" class="why-img">
     
                         <p>${this.articles.get('why_mot')?.title || 'Loading...'}</p>
                          ${this.userBookmarks && this.articles.get('why_mot') && this.userBookmarks.has(this.articles.get('why_mot')._id)
                           ? html`
                             <img 
                               src="/images/bookmark/bookmark-full.svg" 
                               class="bookmark"
                               style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                             >`
                           : ''
                         }
                         <sl-dialog label="${this.articles.get('why_mot')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                           <div style="white-space: pre-line;">
                             ${this.articles.get('why_mot')?.bodyContent || 'Loading content...'}
                           </div>
     
                           <sl-button
                             slot="footer"
                             variant="primary"
                             @click=${(e) => {
                               const articleId = this.articles.get('why_mot')?._id;
                               console.log("Bookmarking article ID:", articleId);
                               this.bookmarkArticle(e, articleId);
                             }}
                           >
                             ${this.userBookmarks.has(this.articles.get('why_mot')?._id)
                               ? 'Remove Bookmark'
                               : 'Bookmark'
                             }
                           </sl-button>
                           <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                         </sl-dialog>
                       </div>
     
                       <div class="why-med" @click=${this.openDialog}>
                         <img src="/images/mental-health/depression/depression-deal-360r.webp" class="stress-img">
     
                         <p>${this.articles.get('ways_mot')?.title || 'Loading...'}</p>
                         ${this.userBookmarks && this.articles.get('ways_mot') && this.userBookmarks.has(this.articles.get('ways_mot')._id)
                           ? html`
                             <img 
                               src="/images/bookmark/bookmark-full.svg" 
                               class="bookmark"
                               style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                             >`
                           : ''
                         }
                         <sl-dialog label="${this.articles.get('ways_mot')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                         <div style="white-space: pre-line;">
                           ${this.articles.get('ways_mot')?.bodyContent || 'Loading content...'}
                         </div>
                           <sl-button
                             slot="footer"
                             variant="primary"
                             @click=${(e) => {
                               const articleId = this.articles.get('ways_mot')?._id;
                               console.log("Bookmarking article ID:", articleId);
                               this.bookmarkArticle(e, articleId);
                             }}
                           >
                             ${this.userBookmarks.has(this.articles.get('ways_mot')?._id)
                               ? 'Remove Bookmark'
                               : 'Bookmark'
                             }
                           </sl-button>
     
     
                           <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                       </div>
     
                       <div class="benefit-med" @click=${this.openDialog}>
                         <img src="/images/mental-health/depression/depression-signs.webp" class="signs-img">
     
                         <p>${this.articles.get('how_mot')?.title || 'Loading...'}</p>
                          ${this.userBookmarks && this.articles.get('how_mot') && this.userBookmarks.has(this.articles.get('how_mot')._id)
                           ? html`
                             <img 
                               src="/images/bookmark/bookmark-full.svg" 
                               class="bookmark"
                               style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                             >`
                           : ''
                         }
                         <sl-dialog label="${this.articles.get('how_mot')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
     
                         <div style="white-space: pre-line;">
                           ${this.articles.get('how_mot')?.bodyContent || 'Loading content...'}
                         </div>
                    
                         <sl-button
                           slot="footer"
                           variant="primary"
                           @click=${(e) => {
                             const articleId = this.articles.get('how_mot')?._id;
                             console.log("Bookmarking article ID:", articleId);
                             this.bookmarkArticle(e, articleId);
                           }}
                         >
                           ${this.userBookmarks.has(this.articles.get('how_mot')?._id)
                             ? 'Remove Bookmark'
                             : 'Bookmark'
                           }
                         </sl-button>
     
                         <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                       </div>
                     
                     
                       <div class="physical-med" @click=${this.openDialog}>
                         <img src="/images/mental-health/depression/depression-triggers-360.webp" class="triggers-img">
     
                         <p>${this.articles.get('how_mot_2')?.title || 'Loading...'}</p>
                          ${this.userBookmarks && this.articles.get('how_mot_2') && this.userBookmarks.has(this.articles.get('how_mot_2')._id)
                           ? html`
                             <img 
                               src="/images/bookmark/bookmark-full.svg" 
                               class="bookmark"
                               style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                             >`
                           : ''
                         }
                         <sl-dialog label="${this.articles.get('how_mot_2')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
     
                         <div style="white-space: pre-line;">
                           ${this.articles.get('how_mot_2')?.bodyContent || 'Loading content...'}
                         </div>
                         <sl-button
                           slot="footer"
                           variant="primary"
                           @click=${(e) => {
                             const articleId = this.articles.get('how_mot_2')?._id;
                             console.log("Bookmarking article ID:", articleId);
                             this.bookmarkArticle(e, articleId);
                           }}
                         >
                           ${this.userBookmarks.has(this.articles.get('how_mot_2')?._id)
                             ? 'Remove Bookmark'
                             : 'Bookmark'
                           }
                         </sl-button>
     
     
                         <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                       </div>
     
                       <div class="guided-med" @click=${this.openDialog}>
                         <img src="/images/mental-health/depression/depression-practices-360.webp" class="practices-img">
     
                           <p>${this.articles.get('practices_mot')?.title || 'Loading...'}</p>
                          ${this.userBookmarks && this.articles.get('practices_mot') && this.userBookmarks.has(this.articles.get('practices_mot')._id)
                           ? html`
                             <img 
                               src="/images/bookmark/bookmark-full.svg" 
                               class="bookmark"
                               style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                             >`
                           : ''
                         }
                         <sl-dialog label="${this.articles.get('practices_mot')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
     
                         <div style="white-space: pre-line;">
                           ${this.articles.get('practices_mot')?.bodyContent || 'Loading content...'}
                         </div>
                         <div class="video-group">
                              <div class="video-embed">
                                ${this.articles.get('practices_mot_2')?.mediaUrl
                                  ? html`${unsafeHTML(this.articles.get('practices_mot_2')?.mediaUrl)}`
                                  : null
                                }
                              </div>
                              
                          </div>
                         <sl-button
                           slot="footer"
                           variant="primary"
                           @click=${(e) => {
                             const articleId = this.articles.get('practices_mot')?._id;
                             console.log("Bookmarking article ID:", articleId);
                             this.bookmarkArticle(e, articleId);
                           }}
                         >
                           ${this.userBookmarks.has(this.articles.get('practices_mot')?._id)
                             ? 'Remove Bookmark'
                             : 'Bookmark'
                           }
                         </sl-button>
     
                         <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                       </div>
                     
                       <div class="questions-med" @click=${this.openDialog}>
                         <img src="/images/mental-health/depression/depression-seek-360.webp" class="seek-img">
     
                         <p>${this.articles.get('what_mot')?.title || 'Loading...'}</p>
                           ${this.userBookmarks && this.articles.get('what_mot') && this.userBookmarks.has(this.articles.get('what_mot')._id)
                             ? html`
                               <img 
                                 src="/images/bookmark/bookmark-full.svg" 
                                 class="bookmark"
                                 style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                               >`
                             : ''
                           }
                           <sl-dialog label="${this.articles.get('what_mot')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                           <div style="white-space: pre-line;">
                             ${this.articles.get('what_mot')?.bodyContent || 'Loading content...'}
                           </div>
                           <sl-button
                             slot="footer"
                             variant="primary"
                             @click=${(e) => {
                               const articleId = this.articles.get('what_mot')?._id;
                               console.log("Bookmarking article ID:", articleId);
                               this.bookmarkArticle(e, articleId);
                             }}
                           >
                             ${this.userBookmarks.has(this.articles.get('what_mot')?._id)
                               ? 'Remove Bookmark'
                               : 'Bookmark'
                             }
                           </sl-button>
                           <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                       </div>
     
                       <div class="tips-med" @click=${this.openDialog}>
                         <img src="/images/mental-health/depression/depression-questions.webp" class="questions-img">
                         <p>${this.articles.get('tips_mot')?.title || 'Loading...'}</p>
                           ${this.userBookmarks && this.articles.get('tips_mot') && this.userBookmarks.has(this.articles.get('tips_mot')._id)
                             ? html`
                               <img 
                                 src="/images/bookmark/bookmark-full.svg" 
                                 class="bookmark"
                                 style="position: absolute; top: -7px; right: 32px; width: 25px; height: 50px; z-index: 9;"
                               >`
                             : ''
                           }
                           <sl-dialog label="${this.articles.get('tips_mot')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                           <div style="white-space: pre-line;">
                             ${this.articles.get('tips_mot')?.bodyContent || 'Loading content...'}
                           </div>
                           <sl-button
                             slot="footer"
                             variant="primary"
                             @click=${(e) => {
                               const articleId = this.articles.get('tips_mot')?._id;
                               console.log("Bookmarking article ID:", articleId);
                               this.bookmarkArticle(e, articleId);
                             }}
                           >
                             ${this.userBookmarks.has(this.articles.get('tips_mot')?._id)
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

export default new mindfulnessExpandedView();

