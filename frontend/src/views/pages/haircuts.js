// code not currently in use //

import App from '../../App'
import {html, render } from 'lit-html'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../Auth'
import Utils from '../../Utils'
import HaircutAPI from './../../HaircutAPI'
import Toast from '../../Toast'

class HaircutsView {
  init(){
    document.title = 'Haircuts'
    this.haircuts = null    
    this.render()    
    Utils.pageIntroAnim()
    this.getHaircuts()
  }

  async getHaircuts(){
    try{
      this.haircuts = await HaircutAPI.getHaircuts()
      console.log(this.haircuts)
      this.render()
    }catch(err){
      Toast.show(err, 'error')
  }
}

// the map function = for each
render(){
  const template = html`
    <va-app-header title="Haircuts" user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
    <div class="page-content">        
        
      <div class="haircuts-grid">
      ${this.haircuts == null ? html`
        <sl-spinner></sl-spinner>
      ` : html`
        ${this.haircuts.map(haircut => html`
          <va-haircut class="haircut-card"  
            id="${haircut._id}"
            name="${haircut.name}" 
            description="${haircut.description}"
            price="$${haircut.price}"
            user="${JSON.stringify(haircut.user)}"
            image="${haircut.image}"
            gender="${haircut.gender}"
            length="${haircut.length}"
          >
          </va-haircut>

        `)}
      `}
      </div>

     </div>      
    `
    render(template, App.rootEl)
  }
}


export default new HaircutsView()