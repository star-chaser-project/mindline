import App from './../../App';
import {html, render } from 'lit-html';


// Image - adapted from Microsoft PowerPoint – Accessed on 18 November 2024
class FourOFourView{
  init(){
    console.log('FourOFourView.init');    
    document.title = '404 File not found';    
    this.render();
  }

  render(){
    const template = html`;    
      <div class="calign">
        <p></p>
        <h1>Oops!</h1>
        <p>Sorry, we couldn't find that.</p>
        <img src="/images/404-error-dinosaur-1024.png">
      </div>
    `;
    render(template, App.rootEl);
  }
}

export default new FourOFourView();