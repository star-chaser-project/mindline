import App from '../../App'
import {html, render } from 'lit-html'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../Auth'
import Utils from '../../Utils'

 // Image adapted from Canva – Accessed on December 18, 2024
class mindfulnessView {
  init(){
    document.title = 'Mindfulness'    
    this.render()    
    Utils.pageIntroAnim()
  }

  render(){
    const template = html`
      <va-app-header title="Mindfulness" user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
      <div class="page-content">        
        <h1>Mindfulness</h1>
        <p>Be Present</p>
        <p>Be Peaceful</p>
        <p>Be You</p>
        <div>
          <img src="images/mindfulness-hero-image-837.png" class="responsive-img" >    
        </div>

      </div>      
    `
    render(template, App.rootEl)
  }
}


export default new mindfulnessView()