import App from '../../App'
import {html, render } from 'lit-html'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../Auth'
import Utils from '../../Utils'

 // Image adapted from Canva – Accessed on December 18, 2024
class resourcesView {
  init(){
    document.title = 'Resources'    
    this.render()    
    Utils.pageIntroAnim()
  }

  render(){
    const template = html`
      <va-app-header title="Resources" user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
      <div class="page-content">        
        <h1>Resources</h1>
        <p>Supporting You Every Step of the Way.</p>
        <div>
          <img src="images/resources-hero-image-837.png" class="responsive-img" >    
        </div>
      </div>      
    `
    render(template, App.rootEl)
  }
}


export default new resourcesView()