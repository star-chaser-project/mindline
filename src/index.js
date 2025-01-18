import App from './App.js';

// components (custom web components), va is for 'vanilla'
// import makes these elements available on all other page view where rendering something
// ie can use <va-product></va-product> anywhere in the project
// everytime create a componment make sure to import into index.js otherwise will not work
import './components/va-app-header';
import './components/va-product';
import './components/va-order';
import './components/va-checkout';
import './components/va-favourite-line.js';
import './components/va-favourite-product.js';

// styles
import './scss/master.scss';

// app.init
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});