import App from '../../App'
import {html, render } from 'lit-html'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../Auth'
import Utils from '../../Utils'

 // Image adapted from Canva – Accessed on December 18, 2024
class mentalHealthView {
  init(){
    document.title = 'Mental Health'    
    this.render()    
    Utils.pageIntroAnim()
  }

  render(){
    const template = html`
      <va-app-header title="Mental Health" user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
      <div class="page-content">        
        <h1>Mental Health</h1>
        <p>Because it Matters</p>
        <div>
          <img src="images/mental-health-hero-image.png" class="responsive-img" >    
        </div>

      </div>
        
      

    `
    render(template, App.rootEl)
  }
}


export default new mentalHealthView()