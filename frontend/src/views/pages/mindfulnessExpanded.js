import App from '../../App'
import {html, render } from 'lit-html'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../Auth'
import Utils from '../../Utils'



 // Image adapted from Canva – Accessed on December 18, 2024
class mindfulnessExpandedView {
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
    document.title = 'Mindfulness Expanded'    
    this.articleIds = {
      // Meditation - articles for the first tab group "meditation" //
      what: '679dd9db640ec34e3c22a2a1', // 679dd9db640ec34e3c22a2a1 What is Meditation
      why: '679ddae8640ec34e3c22a2a2', // 679ddae8640ec34e3c22a2a2 Why Meditate
      benefits: '679ddd11640ec34e3c22a2a4', // Mental Health Benefits of Meditation
      guided: '679ddf6e640ec34e3c22a2a5', // 679ddf6e640ec34e3c22a2a5 Guided Meditation
      practices: '679de245640ec34e3c22a2a7, 679de3f7640ec34e3c22a2a8, 679de47f640ec34e3c22a2a9', // 679de245640ec34e3c22a2a7 Walking it, 679de3f7640ec34e3c22a2a8 Time out, 679de47f640ec34e3c22a2a9 candle gazing
      questions: '679deda0640ec34e3c22a2b9', // FAQs About Meditation
      tips: '679ddb6f640ec34e3c22a2a3', // 679ddb6f640ec34e3c22a2a3 When to Meditate

      // Breathing - articles for the second tab group "breathing" //
      why_breath: '67ab274607163965f66e57f7', // 67ab274607163965f66e57f7 Why Breath Awareness Matters for Mental Health 
      how_breath: '67ab40c807163965f66e57fa', // 67ab40c807163965f66e57fa How Does Breathing Consciously help
      benefits_breath: '67ab38cf07163965f66e57f9', // 67ab38cf07163965f66e57f9 Benefits of Breath Awareness
      practice_breath: '679b567904f7c1b1216d5410, 679dc065640ec34e3c22a28a', // Breathing Techniques for Calm and Clarity: 679b567904f7c1b1216d5410 A pep me up for mind and body, 679dc065640ec34e3c22a28a A practice to clear your headspace 
      seek_breath: '679dcac3640ec34e3c22a291', // ?
      questions_breath: '67ab47da07163965f66e57fc', // 67ab47da07163965f66e57fc Common Questions About Breathing Techniques
      tips_breath: '67ab44b707163965f66e57fb', // 67ab44b707163965f66e57fb Breath Awareness Tips

      // Motivation - articles fr the thrid tab group "motivation" //
      why_mot: '679de5c7640ec34e3c22a2ab', // 679de5c7640ec34e3c22a2ab Why is Motivation Important
      ways_mot: '679de645640ec34e3c22a2ac', // 679de645640ec34e3c22a2ac Ways to Gain Motivation
      how_mot: '679dea10640ec34e3c22a2af, 679dea63640ec34e3c22a2b0', // 679dea10640ec34e3c22a2af How To Get Motivated, 679dea63640ec34e3c22a2b0 How to Stay on Track
      practices_mot: '679dc9da640ec34e3c22a290, 679de97c640ec34e3c22a2ae', // Motivational Practices To Expore - 679dc9da640ec34e3c22a290 Sunshine, 679de97c640ec34e3c22a2ae Reset & Go, 
      what_mot: '679deb6c640ec34e3c22a2b3', // 679deb6c640ec34e3c22a2b3 What to do if You Lose Motivation
      tips_mot: '679debbe640ec34e3c22a2b4' // 679debbe640ec34e3c22a2b4 Still Putting Things Off?
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
    const urlParams = new URLSearchParams(window.location.search);
    const activeTab = urlParams.get('tab') || 'meditation'; // default to stress if no tab specified
    const template = html`
    <style>
      .banner.mental-health-expanded {
      height: 100vh; 
      background-color: #30AAF5;
      /*padding-top: 15%;*/
    }

    .banner-content {
      height: 80%;
      width: 60%;
    }

    sl-tab-group::part(base) {
      display: flex;
      align-items: center;
      gap: 32px;
    
    }

  
    sl-tab-group::part(nav) {
    border-bottom: none;
  }

  sl-tab-group::part(active-tab-indicator) {
    display: none !important;
    opacity: 0;
    visibility: hidden;
  }

  sl-tab-group::part(tabs) {
    border-bottom: none;
  }

  sl-tab::part(base) {
    border-bottom: none;
    margin: 0 12px;
    padding: 12px 24px;
    font-size: 18px;
  font-weight: 500;
  transition: all 0.2s ease;
  }

  sl-tab:not([active])::part(base):hover {
  font-size: 20px;
}

sl-tab[active]::part(base) {
  font-size: 20px;
  color: #F3C728 !important;
}

    #bento-tabs {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: left;
    }
    
    h1 {
      margin-bottom: 50px !important;
      width: 50% !important;
      margin-left: 13% !important;
    }
    

    .why {
      grid-area: why;
      width: 193px;
      height: 193px;
      border-radius: 35px;
      background-color: #FFFFFF;
      position: relative;
      display: flex;
      overflow: hidden;
      cursor: pointer;
    }
    
    .deal {
      grid-area: deal;
      width: 361px;
      height: 193px;
      border-radius: 35px;
      background-color: #FFFFFF;
      position: relative;
      display: flex;
      overflow: hidden;
      cursor: pointer;
    }
    
    .signs {
      grid-area: signs;
      width: 193px;
      height: 411px;
      border-radius: 35px;
      background-color: #FFFFFF;
      position: relative;
      display: flex;
      overflow: hidden;
      cursor: pointer;
    }
    
    .triggers {
      grid-area: triggers;
      width: 361px;
      height: 193px;
      border-radius: 35px;
      background-color: #FFFFFF;
      position: relative;
      display: flex;
      overflow: hidden;
      cursor: pointer;
    }
    
    .practices {
      grid-area: practices;
      width: 193px;
      height: 411px;
      border-radius: 35px;
      background-color: #FFFFFF;
      margin-left: 168px;
      position: relative;
      display: flex;
      overflow: hidden;
      cursor: pointer;
    }
    
    .seek {
      grid-area: seek;
      width: 361px;
      height: 193px;
      border-radius: 35px;
      background-color: #FFFFFF;
      position: relative;
      display: flex;
      overflow: hidden;
      cursor: pointer;
    }
    
    .questions {
      grid-area: questions;
      width: 193px;
      height: 193px;
      border-radius: 35px;
      background-color: #FFFFFF;
      margin-left: 385px;
      position: relative;
      display: flex;
      overflow: hidden;
      cursor: pointer;
    }

.stress {
  display: grid;
  grid-template-areas: 
    "why deal signs"
    "triggers practices practices"
    "seek questions questions";
  grid-template-columns: 193px 361px 193px; /* Explicit column widths */
  grid-template-rows: 193px 193px 193px; /* Fixed row heights */
  gap: 24px; /* Minimal gap */
  align-items: start; /* Align items to top */
  margin-top: 8px;
}


    p {
      color: #000000;
    }

    .bookmark, .bookmark-full {
    position: absolute;
    width: auto;
    height: 30px;
    top: -0.5px;
    right: 35px;
    filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.3));
  }
    

  sl-dialog::part(base) {
    color: #000000;
  }

  sl-dialog::part(overlay) {
    backdrop-filter: blur(8px);
    background-color: rgba(0, 0, 0, 0.5);
  }


  sl-dialog::part(panel) {
    border-radius: 35px;
    z-index: 1000;
  }

  sl-dialog::part(close-button) {
    display: none;
  }

    .why-img {
      width: 400px; /* Much larger than parent */
      height: 400px; /* Much larger than parent */
      position: absolute;
      z-index: 0;
      object-fit: cover;
      transform: translate(-50%, -50%);
      top: 60%;
      left: 60%;
      border-radius: 35px;
      transition: transform 0.3s ease;
    }

    .why:hover .why-img {
      transform: translate(-50%, -50%) scale(1.1);
    }

    .why p {
      width: 30%;
      font-size: 20px;
      font-weight: 300;
      margin-left: 10%;
      z-index: 1;
    }

    </style>

    

    ${Auth.isLoggedIn() ? 
      html`<va-app-header user=${JSON.stringify(Auth.currentUser)}></va-app-header>` : 
      html`<va-public-header></va-public-header>`
    }
      <a href="/" @click="${anchorRoute}"><img class="header-logo" src="/images/logo/logo-mindline-no-wording-white-125.png"></a>      
      <div class="page-content"> 
        <section class="banner mental-health-expanded">
        
        <div class="banner-content">     
          <h1>Mindfulness</h1>
          <div id="bento-tabs">
            <sl-tab-group ?active="${activeTab}">
              <sl-tab slot="nav" panel="meditation" ?active="${activeTab === 'meditation'}">Meditation</sl-tab>
              <sl-tab slot="nav" panel="breathing" ?active="${activeTab === 'breathing'}">Breathing</sl-tab>
              <sl-tab slot="nav" panel="motivation" ?active="${activeTab === 'motivation'}">Motivation</sl-tab>

              <!-- this is the first tab content of the menal health page -->
              <sl-tab-panel name="meditation">
                
       
                <div class="stress">
                
                  <div class="why" @click=${this.openDialog}>
                    <img src="/images/why-box.png" class="why-img">
                    <p>${this.articles.get('why')?.title || 'Loading...'}</p>
                    <img src="/images/bookmark/bookmark-4.svg" class="bookmark">
                    <sl-dialog label="${this.articles.get('why')?.title}" class="dialog-width" style="--width: 50vw; --height: 60vh;">
                      ${this.articles.get('why')?.bodyContent || 'Loading content...'}
                      <sl-button 
                        slot="footer" 
                        variant="primary" 
                        @click=${(e) => {
                          const articleId = this.articles.get('why')?._id;
                          console.log("Bookmarking article ID:", articleId);
                          this.bookmarkArticle(e, articleId);
                        }}>
                                              Bookmark
                      </sl-button>
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

               <!-- this is the second tab content of the menal health page -->
              <sl-tab-panel name="breathing">
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
              <sl-tab-panel name="motivation">
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

export default new mindfulnessExpandedView()