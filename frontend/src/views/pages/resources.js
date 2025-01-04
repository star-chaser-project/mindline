import App from '../../App'
import {html, render } from 'lit-html'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../Auth'
import Utils from '../../Utils'

class TemplateView {
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
        
      </div>      
    `
    render(template, App.rootEl)
  }
}


export default new TemplateView()