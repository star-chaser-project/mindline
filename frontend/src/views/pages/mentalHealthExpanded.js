import App from '../../App'
import {html, render } from 'lit-html'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../Auth'
import Utils from '../../Utils'



 // Image adapted from Canva – Accessed on December 18, 2024
class mentalHealthExpandedView {
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
    document.title = 'Mental Health Expanded'    
    this.articleIds = {
      // these are the articles for the first tab group "stress" //
      why: '677dcb34a6cdde9083351d76',
      deal: '677dcc1c4aea9c354dbd3103',
      signs: '677e60b05c759160209d1111',
      practices: '679af473ccbfff59ce1a142e',
      triggers: '679af4330b0bab1805167cae', 
      seek: '679af494ccbfff59ce1a1430',
      questions: '679af4b9ccbfff59ce1a1432'

      // these are the articles for the second tab group "anxiety" //


      // these are te articles fr the thrid tab group "Depression" //
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
      alert("You must be logged in to bookmark articles!");
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
        alert("Article bookmarked!");
      } else {
        const errMsg = result.message || result.error || "Bookmark failed";
        console.error("Bookmark failed:", errMsg);
        alert(errMsg);
      }
    } catch (err) {
      console.error("Bookmark error:", err);
      alert("An error occurred while bookmarking the article.");
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
     // Get tab from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const activeTab = urlParams.get('tab') || 'stress'; // default to stress if no tab specified
    const template = html`
   

    ${Auth.isLoggedIn() ? 
      html`<va-app-header user=${JSON.stringify(Auth.currentUser)}></va-app-header>` : 
      html`<va-public-header></va-public-header>`
    }
      <a href="/" @click="${anchorRoute}"><img class="header-logo" src="/images/logo/logo-mindline-no-wording-white-125.png"></a>      
      
      <div class="page-content"> 
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
                
                  <div class="why" @click=${this.openDialog}>
                    <img src="/images/why-box.png" class="why-img">
                    <p>${this.articles.get('why')?.title || 'Loading...'}</p>
                    <img src="/images/bookmark/bookmark-4.svg" class="bookmark">
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
                    <img src="/images/bookmark/bookmark-full.svg" class="bookmark">
                    <sl-dialog label="${this.articles.get('deal')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    ${this.articles.get('deal')?.bodyContent || 'Loading content...'}
                      <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Bookmark</sl-button>
                      <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>

                  <div class="signs" @click=${this.openDialog}>
                    <img src="/images/signs-box.png" class="signs-img">
                    <p>${this.articles.get('signs')?.title || 'Loading...'}</p>
                    <img src="/images/bookmark/bookmark-4.svg" class="bookmark">
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
                    <img src="/images/bookmark/bookmark-4.svg" class="bookmark">
                    <sl-dialog label="${this.articles.get('triggers')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    ${this.articles.get('triggers')?.bodyContent || 'Loading content...'}
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Bookmark</sl-button>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>

                  <div class="practices" @click=${this.openDialog}>
                    <img src="/images/practices-box.png" class="practices-img">
                      <p>${this.articles.get('practices')?.title || 'Loading...'}</p>
                    <img src="/images/bookmark/bookmark-4.svg" class="bookmark">
                    <sl-dialog label="${this.articles.get('practices')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    ${this.articles.get('practices')?.bodyContent || 'Loading content...'}
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Bookmark</sl-button>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>
                
                  <div class="seek" @click=${this.openDialog}>
                  <img src="/images/seek-box.png" class="seek-img">
                 <p>${this.articles.get('seek')?.title || 'Loading...'}</p>
                    <img src="/images/bookmark/bookmark-4.svg" class="bookmark">
                    <sl-dialog label="${this.articles.get('seek')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    ${this.articles.get('seek')?.bodyContent || 'Loading content...'}
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Bookmark</sl-button>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>

                  <div class="questions" @click=${this.openDialog}>
                  <img src="/images/questions-box.png" class="questions-img">
                      <p>${this.articles.get('questions')?.title || 'Loading...'}</p>
                    <img src="/images/bookmark/bookmark-4.svg" class="bookmark">
                    <sl-dialog label="${this.articles.get('questions')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    ${this.articles.get('questions')?.bodyContent || 'Loading content...'}
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Bookmark</sl-button>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>
                </div>



              </sl-tab-panel>

               <!-- this is the second tab content of the menal health page -->
              <sl-tab-panel name="anxiety">
                <div class="stress">
                
                  <div class="why" @click=${this.openDialog}>
                    <img src="/images/" class="why-img">
                    <p>${this.articles.get('why')?.title || 'Loading...'}</p>
                    <img src="/images/bookmark/bookmark-4.svg" class="bookmark">
                    <sl-dialog label="${this.articles.get('why')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                      ${this.articles.get('why')?.bodyContent || 'Loading content...'}
                      <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Bookmark</sl-button>
                      <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                    </sl-dialog>
                  </div>

                  <div class="deal" @click=${this.openDialog}>
                    <img src="/images/" class="stress-img">
                    <p>${this.articles.get('deal')?.title || 'Loading...'}</p>
                    <img src="/images/bookmark/bookmark-full.svg" class="bookmark">
                    <sl-dialog label="${this.articles.get('deal')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    ${this.articles.get('deal')?.bodyContent || 'Loading content...'}
                      <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Bookmark</sl-button>
                      <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>

                  <div class="signs" @click=${this.openDialog}>
                    <img src="/images/" class="signs-img">
                    <p>${this.articles.get('signs')?.title || 'Loading...'}</p>
                    <img src="/images/bookmark/bookmark-4.svg" class="bookmark">
                    <sl-dialog label="${this.articles.get('signs')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    ${this.articles.get('signs')?.bodyContent || 'Loading content...'}
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Bookmark</sl-button>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>
                
                
                  <div class="triggers" @click=${this.openDialog}>
                    <img src="/images/" class="triggers-img">
                    <p>${this.articles.get('triggers')?.title || 'Loading...'}</p>
                    <img src="/images/bookmark/bookmark-4.svg" class="bookmark">
                    <sl-dialog label="${this.articles.get('triggers')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    ${this.articles.get('triggers')?.bodyContent || 'Loading content...'}
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Bookmark</sl-button>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>

                  <div class="practices" @click=${this.openDialog}>
                    <img src="/images/" class="practices-img">
                      <p>${this.articles.get('practices')?.title || 'Loading...'}</p>
                    <img src="/images/bookmark/bookmark-4.svg" class="bookmark">
                    <sl-dialog label="${this.articles.get('practices')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    ${this.articles.get('practices')?.bodyContent || 'Loading content...'}
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Bookmark</sl-button>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>
                
                  <div class="seek" @click=${this.openDialog}>
                  <img src="/images/" class="seek-img">
                 <p>${this.articles.get('seek')?.title || 'Loading...'}</p>
                    <img src="/images/bookmark/bookmark-4.svg" class="bookmark">
                    <sl-dialog label="${this.articles.get('seek')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    ${this.articles.get('seek')?.bodyContent || 'Loading content...'}
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Bookmark</sl-button>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>

                  <div class="questions" @click=${this.openDialog}>
                  <img src="/images/" class="questions-img">
                      <p>${this.articles.get('questions')?.title || 'Loading...'}</p>
                    <img src="/images/bookmark/bookmark-4.svg" class="bookmark">
                    <sl-dialog label="${this.articles.get('questions')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    ${this.articles.get('questions')?.bodyContent || 'Loading content...'}
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Bookmark</sl-button>
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
                    <img src="/images/bookmark/bookmark-4.svg" class="bookmark">
                    <sl-dialog label="${this.articles.get('why')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                      ${this.articles.get('why')?.bodyContent || 'Loading content...'}
                      <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Bookmark</sl-button>
                      <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                    </sl-dialog>
                  </div>

                  <div class="deal" @click=${this.openDialog}>
                    <img src="/images/stress-box.png" class="stress-img">
                    <p>${this.articles.get('deal')?.title || 'Loading...'}</p>
                    <img src="/images/bookmark/bookmark-full.svg" class="bookmark">
                    <sl-dialog label="${this.articles.get('deal')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    ${this.articles.get('deal')?.bodyContent || 'Loading content...'}
                      <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Bookmark</sl-button>
                      <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>

                  <div class="signs" @click=${this.openDialog}>
                    <img src="/images/signs-box.png" class="signs-img">
                    <p>${this.articles.get('signs')?.title || 'Loading...'}</p>
                    <img src="/images/bookmark/bookmark-4.svg" class="bookmark">
                    <sl-dialog label="${this.articles.get('signs')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    ${this.articles.get('signs')?.bodyContent || 'Loading content...'}
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Bookmark</sl-button>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>
                
                
                  <div class="triggers" @click=${this.openDialog}>
                    <img src="/images/triggers-box.png" class="triggers-img">
                    <p>${this.articles.get('triggers')?.title || 'Loading...'}</p>
                    <img src="/images/bookmark/bookmark-4.svg" class="bookmark">
                    <sl-dialog label="${this.articles.get('triggers')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    ${this.articles.get('triggers')?.bodyContent || 'Loading content...'}
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Bookmark</sl-button>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>

                  <div class="practices" @click=${this.openDialog}>
                    <img src="/images/practices-box.png" class="practices-img">
                      <p>${this.articles.get('practices')?.title || 'Loading...'}</p>
                    <img src="/images/bookmark/bookmark-4.svg" class="bookmark">
                    <sl-dialog label="${this.articles.get('practices')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    ${this.articles.get('practices')?.bodyContent || 'Loading content...'}
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Bookmark</sl-button>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>
                
                  <div class="seek" @click=${this.openDialog}>
                  <img src="/images/seek-box.png" class="seek-img">
                 <p>${this.articles.get('seek')?.title || 'Loading...'}</p>
                    <img src="/images/bookmark/bookmark-4.svg" class="bookmark">
                    <sl-dialog label="${this.articles.get('seek')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    ${this.articles.get('seek')?.bodyContent || 'Loading content...'}
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Bookmark</sl-button>
                    <sl-button slot="footer" variant="primary" @click=${this.closeDialog}>Close</sl-button>
                  </div>

                  <div class="questions" @click=${this.openDialog}>
                  <img src="/images/questions-box.png" class="questions-img">
                      <p>${this.articles.get('questions')?.title || 'Loading...'}</p>
                    <img src="/images/bookmark/bookmark-4.svg" class="bookmark">
                    <sl-dialog label="${this.articles.get('questions')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                    ${this.articles.get('questions')?.bodyContent || 'Loading content...'}
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

export default new mentalHealthExpandedView()