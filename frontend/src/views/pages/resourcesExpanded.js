import App from '../../App'
import {html, render } from 'lit-html'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../Auth'
import Utils from '../../Utils'
import Toast from '../../Toast';

 // Image adapted from Canva – Accessed on December 18, 2024
class resourcesExpandedView {
  constructor() {
    this.articles = new Map() // Initialize Map
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
    document.title = 'Resources Expanded'    
    this.articleIds = {
      // Support - articles for the first tab group "support" //
      ask: '67b04497e84a5c439b2b52c7', // It's Ok to Ask for Support
      talk: '67b0453ee84a5c439b2b52c8', // Talking Can Help
      how_support: '67b045b2e84a5c439b2b52c9', // How to Ask for Help
      tips_support: '67b04613e84a5c439b2b52ca', // Tips When Things Get Tough
      what_support: '67b04673e84a5c439b2b52cb', // What gets in the way of asking for help?
      help_support: '67b046f1e84a5c439b2b52cc', // Where & When to Find Help?
      mindset: '67b04836e84a5c439b2b52cd', // Change Your Mindset

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
    
    console.log("Current user:", Auth.currentUser);
    console.log("Using token:", Auth.currentUser.token);
    if (!Auth.currentUser || !Auth.currentUser.token) {
      Toast.show("You must be logged in to bookmark articles!");
      return;
    }
    
    
    
    try {
      const response = await fetch(`${App.apiBase}/bookmark/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Auth.currentUser.token}`
        }
      });
    
      const result = await response.json();
      if (response.ok) {
        Toast.show("Article bookmarked!");
      } else {
        const errMsg = result.message || result.error || "Bookmark failed";
        console.error("Bookmark failed:", errMsg);
        Toast.show(errMsg);
      }
    } catch (err) {
      console.error("Bookmark error:", err);
      Toast.show("An error occurred while bookmarking the article.");
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

  closeDialog(e) {
    e.stopPropagation();
    
    // Get the closest sl-dialog to the button clicked
    const dialog = e.target.closest('sl-dialog');
    
    if (dialog) dialog.hide();
  }

  

  render(){
    console.log('Auth.currentUser:', Auth.currentUser);
    const urlParams = new URLSearchParams(window.location.search);
    const activeTab = urlParams.get('tab') || 'meditation'; // default to stress if no tab specified
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
        <h1>Resources</h1>
        <div class="banner-content">     
          <div id="bento-tabs">
            <sl-tab-group ?active="${activeTab}">
              <sl-tab slot="nav" panel="support" ?active="${activeTab === 'support'}">Support</sl-tab>
              <sl-tab slot="nav" panel="services" ?active="${activeTab === 'services'}">Services</sl-tab>
              <sl-tab slot="nav" panel="guides" ?active="${activeTab === 'guides'}">Guides</sl-tab>

              <!-- Support - first tab content of the resources page -->
              <sl-tab-panel name="support">
                
       
                <div class="stress">
                
                  <div class="why ask" @click=${this.openDialog}>
                    <img src="/images/why-box.png" class="why-img">
                    <p>${this.articles.get('ask')?.title || 'Loading...'}</p>
                    <img src="/images/bookmark/bookmark-4.svg" class="bookmark">
                    <sl-dialog label="${this.articles.get('ask')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    <div style="white-space: pre-line;">
                    <div style="white-space: pre-line;">
                    ${this.articles.get('resources_support')?.bodyContent || 'Loading content...'}
                    </div>
                    </div>
                    <sl-button 
                      slot="footer" 
                      variant="primary" 
                      @click=${(e) => {
                        const articleId = this.articles.get('ask')?._id;
                        console.log("Bookmarking article ID:", articleId);
                        this.bookmarkArticle(e, articleId);
                      }}>
                      Bookmark
                    </sl-button>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                    </sl-dialog>
                  </div>

                  <div class="deal talk" @click=${this.openDialog}>
                    <img src="/images/stress-box.png" class="stress-img">
                    <p>${this.articles.get('detalkal')?.title || 'Loading...'}</p>
                    <img src="/images/bookmark/bookmark-full.svg" class="bookmark">
                    <sl-dialog label="${this.articles.get('talk')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    <div style="white-space: pre-line;">
                    ${this.articles.get('talk')?.bodyContent || 'Loading content...'}
                    </div>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Bookmark</sl-button>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>

                  <div class="signs how_support" @click=${this.openDialog}>
                    <img src="/images/signs-box.png" class="signs-img">
                    <p>${this.articles.get('how_support')?.title || 'Loading...'}</p>
                    <img src="/images/bookmark/bookmark-4.svg" class="bookmark">
                    <sl-dialog label="${this.articles.get('how_support')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    <div style="white-space: pre-line;">
                    ${this.articles.get('how_support')?.bodyContent || 'Loading content...'}
                    </div>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Bookmark</sl-button>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>
                
                
                  <div class="triggers tips_support" @click=${this.openDialog}>
                    <img src="/images/triggers-box.png" class="triggers-img">
                    <p>${this.articles.get('tips_support')?.title || 'Loading...'}</p>
                    <img src="/images/bookmark/bookmark-4.svg" class="bookmark">
                    <sl-dialog label="${this.articles.get('tips_support')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    <div style="white-space: pre-line;">
                    ${this.articles.get('tips_support')?.bodyContent || 'Loading content...'}
                    </div>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Bookmark</sl-button>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>

                  <div class="practices what_support" @click=${this.openDialog}>
                    <img src="/images/practices-box.png" class="practices-img">
                      <p>${this.articles.get('what_support')?.title || 'Loading...'}</p>
                    <img src="/images/bookmark/bookmark-4.svg" class="bookmark">
                    <sl-dialog label="${this.articles.get('what_support')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    <div style="white-space: pre-line;">
                    ${this.articles.get('what_support')?.bodyContent || 'Loading content...'}
                    </div>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Bookmark</sl-button>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>
                
                  <div class="seek help_support" @click=${this.openDialog}>
                    <img src="/images/seek-box.png" class="seek-img">
                    <p>${this.articles.get('help_support')?.title || 'Loading...'}</p>
                    <img src="/images/bookmark/bookmark-4.svg" class="bookmark">
                    <sl-dialog label="${this.articles.get('help_support')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    <div style="white-space: pre-line;">
                    ${this.articles.get('help_support')?.bodyContent || 'Loading content...'}
                    </div>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Bookmark</sl-button>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>

                  <div class="questions mindset" @click=${this.openDialog}>
                    <img src="/images/questions-box.png" class="questions-img">
                    <p>${this.articles.get('mindset')?.title || 'Loading...'}</p>
                    <img src="/images/bookmark/bookmark-4.svg" class="bookmark">
                    <sl-dialog label="${this.articles.get('mindset')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    <div style="white-space: pre-line;">
                    ${this.articles.get('mindset')?.bodyContent || 'Loading content...'}
                    </div>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Bookmark</sl-button>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>
                </div>



              </sl-tab-panel>

               <!-- Services - second tab content of the resources page -->
              <sl-tab-panel name="services">
                <div class="stress">
                
                  <div class="why crisis" @click=${this.openDialog}>
                    <img src="/images/" class="why-img">
                    <p>${this.articles.get('crisis')?.title || 'Loading...'}</p>
                    <img src="/images/bookmark/bookmark-4.svg" class="bookmark">
                    <sl-dialog label="${this.articles.get('crisis')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    <div style="white-space: pre-line;">
                    ${this.articles.get('crisis')?.bodyContent || 'Loading content...'}
                    </div>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Bookmark</sl-button>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                    </sl-dialog>
                  </div>

                  <div class="deal kids" @click=${this.openDialog}>
                    <img src="/images/" class="stress-img">
                    <p>${this.articles.get('kids')?.title || 'Loading...'}</p>
                    <img src="/images/bookmark/bookmark-full.svg" class="bookmark">
                    <sl-dialog label="${this.articles.get('kids')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    <div style="white-space: pre-line;">
                    ${this.articles.get('kids')?.bodyContent || 'Loading content...'}
                    </div>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Bookmark</sl-button>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>

                  <div class="signs mental_serv" @click=${this.openDialog}>
                    <img src="/images/" class="signs-img">
                    <p>${this.articles.get('mental_serv')?.title || 'Loading...'}</p>
                    <img src="/images/bookmark/bookmark-4.svg" class="bookmark">
                    <sl-dialog label="${this.articles.get('mental_serv')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    <div style="white-space: pre-line;">
                    ${this.articles.get('mental_serv')?.bodyContent || 'Loading content...'}
                    </div>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Bookmark</sl-button>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>
                
                
                  <div class="triggers counsel" @click=${this.openDialog}>
                    <img src="/images/" class="triggers-img">
                    <p>${this.articles.get('counsel')?.title || 'Loading...'}</p>
                    <img src="/images/bookmark/bookmark-4.svg" class="bookmark">
                    <sl-dialog label="${this.articles.get('counsel')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    <div style="white-space: pre-line;">
                    ${this.articles.get('counsel')?.bodyContent || 'Loading content...'}
                    </div>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Bookmark</sl-button>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>

                  <div class="practices substance" @click=${this.openDialog}>
                    <img src="/images/" class="practices-img">
                    <p>${this.articles.get('substance')?.title || 'Loading...'}</p>
                    <img src="/images/bookmark/bookmark-4.svg" class="bookmark">
                    <sl-dialog label="${this.articles.get('substance')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    <div style="white-space: pre-line;">
                    ${this.articles.get('substance')?.bodyContent || 'Loading content...'}
                    </div>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Bookmark</sl-button>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>
                
                  <div class="seek indgl" @click=${this.openDialog}>
                    <img src="/images/" class="seek-img">
                    <p>${this.articles.get('indgl')?.title || 'Loading...'}</p>
                    <img src="/images/bookmark/bookmark-4.svg" class="bookmark">
                    <sl-dialog label="${this.articles.get('indgl')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    <div style="white-space: pre-line;">
                    ${this.articles.get('indgl')?.bodyContent || 'Loading content...'}
                    </div>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Bookmark</sl-button>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>

                  <div class="questions help_serv" @click=${this.openDialog}>
                    <img src="/images/" class="questions-img">
                    <p>${this.articles.get('help_serv')?.title || 'Loading...'}</p>
                    <img src="/images/bookmark/bookmark-4.svg" class="bookmark">
                    <sl-dialog label="${this.articles.get('help_serv')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    <div style="white-space: pre-line;">
                    ${this.articles.get('help_serv')?.bodyContent || 'Loading content...'}
                    </div>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Bookmark</sl-button>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>
                </div>
              </sl-tab-panel>

               <!-- Guides - third tab content of the resources page -->
              <sl-tab-panel name="guides">
                <div class="stress">
                
                  <div class="why mental_guides" @click=${this.openDialog}>
                    <img src="/images/why-box.png" class="why-img">
                    <p>${this.articles.get('mental_guides')?.title || 'Loading...'}</p>
                    <img src="/images/bookmark/bookmark-4.svg" class="bookmark">
                    <sl-dialog label="${this.articles.get('mental_guides')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    <div style="white-space: pre-line;">
                    ${this.articles.get('mental_guides')?.bodyContent || 'Loading content...'}
                    </div>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Bookmark</sl-button>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                    </sl-dialog>
                  </div>

                  <div class="deal digital" @click=${this.openDialog}>
                    <img src="/images/stress-box.png" class="stress-img">
                    <p>${this.articles.get('digital')?.title || 'Loading...'}</p>
                    <img src="/images/bookmark/bookmark-full.svg" class="bookmark">
                    <sl-dialog label="${this.articles.get('digital')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    <div style="white-space: pre-line;">
                    ${this.articles.get('digital')?.bodyContent || 'Loading content...'}
                    </div>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Bookmark</sl-button>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>

                  <div class="signs parent" @click=${this.openDialog}>
                    <img src="/images/signs-box.png" class="signs-img">
                    <p>${this.articles.get('parent')?.title || 'Loading...'}</p>
                    <img src="/images/bookmark/bookmark-4.svg" class="bookmark">
                    <sl-dialog label="${this.articles.get('parent')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    <div style="white-space: pre-line;">
                    ${this.articles.get('parent')?.bodyContent || 'Loading content...'}
                    </div>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Bookmark</sl-button>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>
                
                
                  <div class="triggers depression_guides" @click=${this.openDialog}>
                    <img src="/images/triggers-box.png" class="triggers-img">
                    <p>${this.articles.get('depression_guides')?.title || 'Loading...'}</p>
                    <img src="/images/bookmark/bookmark-4.svg" class="bookmark">
                    <sl-dialog label="${this.articles.get('depression_guides')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    <div style="white-space: pre-line;">
                    ${this.articles.get('depression_guides')?.bodyContent || 'Loading content...'}
                    </div>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Bookmark</sl-button>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>

                  <div class="practices self" @click=${this.openDialog}>
                    <img src="/images/practices-box.png" class="practices-img">
                    <p>${this.articles.get('self')?.title || 'Loading...'}</p>
                    <img src="/images/bookmark/bookmark-4.svg" class="bookmark">
                    <sl-dialog label="${this.articles.get('self')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    <div style="white-space: pre-line;">
                    ${this.articles.get('self')?.bodyContent || 'Loading content...'}
                    </div>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Bookmark</sl-button>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>
                
                  <div class="seek toolkit" @click=${this.openDialog}>
                    <img src="/images/seek-box.png" class="seek-img">
                    <p>${this.articles.get('toolkit')?.title || 'Loading...'}</p>
                    <img src="/images/bookmark/bookmark-4.svg" class="bookmark">
                    <sl-dialog label="${this.articles.get('toolkit')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    <div style="white-space: pre-line;">
                    ${this.articles.get('toolkit')?.bodyContent || 'Loading content...'}
                    </div>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Bookmark</sl-button>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>

                  <div class="questions tips_guides" @click=${this.openDialog}>
                    <img src="/images/questions-box.png" class="questions-img">
                    <p>${this.articles.get('tips_guides')?.title || 'Loading...'}</p>
                    <img src="/images/bookmark/bookmark-4.svg" class="bookmark">
                    <sl-dialog label="${this.articles.get('tips_guides')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    <div style="white-space: pre-line;">
                    ${this.articles.get('tips_guides')?.bodyContent || 'Loading content...'}
                    </div>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Bookmark</sl-button>
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