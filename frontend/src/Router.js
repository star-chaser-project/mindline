// import views
import homeView from './views/pages/home';
import fourOFourView from './views/pages/404';
import signinView from './views/pages/signin';
import signupView from './views/pages/signup';
import profileView from './views/pages/profile';
import editProfileView from './views/pages/editProfile';
import guideView from './views/pages/guide';
import mentalHealthView from './views/pages/mentalHealth';
import mentalHealthExpandedView from './views/pages/mentalHealthExpanded';
import mindfulnessView from './views/pages/mindfulness';
import mindfulnessExpandedView from './views/pages/mindfulnessExpanded';
import resourcesView from './views/pages/resources';
import resourcesExpandedView from './views/pages/resourcesExpanded';
import favouriteLinesView from './views/pages/favouriteLines';
import aboutView from './views/pages/about';

import productsView from './views/pages/products';
import favouriteProductsView from './views/pages/favouriteProducts';
import newProductView from './views/pages/newProduct';
import locationView from './views/pages/location';
import hairdressersView from './views/pages/hairdressers';

// define routes
const routes = {
	'/': homeView,	
	'404' : fourOFourView,
	'/signin': signinView,
	'/signup': signupView,
	'/profile': profileView,
	'/editProfile': editProfileView,
	'/guide': guideView,
	'/mentalHealth': mentalHealthView,
	'/mentalHealthExpanded': mentalHealthExpandedView,
	'/mindfulness': mindfulnessView,
	'/mindfulnessExpanded': mindfulnessExpandedView,
	'/resources': resourcesView,
	'/resourcesExpanded': resourcesExpandedView,
	'/favouriteLines': favouriteLinesView,
	'/about': aboutView,

	'/products': productsView,
	'/newProduct': newProductView,
	'/favouriteProducts': favouriteProductsView,
	'/location': locationView,
	'/hairdressers': hairdressersView
	
	
};

class Router {
	constructor(){
		this.routes = routes;
	}
	
	init(){
		// initial call
		this.route(window.location.pathname);

		// on back/forward
		window.addEventListener('popstate', () => {
			this.route(window.location.pathname);
		});
	}
	
	route(fullPathname){
		// extract path without params
		const pathname = fullPathname.split('?')[0];
		const route = this.routes[pathname];
		
		if(route){
			// if route exists, run init() of the view
			this.routes[window.location.pathname].init();
		}else{			
			// show 404 view instead
			this.routes['404'].init();		
		}
	}

	gotoRoute(pathname){
		window.history.pushState({}, pathname, window.location.origin + pathname);
		this.route(pathname);
	}	
}

// create appRouter instance and export
const AppRouter = new Router();
export default AppRouter;


// programmatically load any route
export function gotoRoute(pathname){
	AppRouter.gotoRoute(pathname);
}


// allows anchor <a> links to load routes
export function anchorRoute(e){
	e.preventDefault();	
	const pathname = e.target.closest('a').pathname;
	AppRouter.gotoRoute(pathname);
}
