import App from '../../App'
import {html, render } from 'lit-html'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../Auth'
import Utils from '../../Utils'

class TemplateView {
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
        
      </div>      
    `
    render(template, App.rootEl)
  }
}


export default new TemplateView()