import App from './App';
import Router, { gotoRoute } from './Router';
import splash from './views/partials/splash';
import {html, render} from 'lit-html';
import Toast from './Toast';

class Auth {
  constructor() {
    // 1. Initialize currentUser from localStorage
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
  }

  // Store userData in currentUser and localStorage
  setCurrentUser(userData) {
    this.currentUser = userData;
    localStorage.setItem('currentUser', JSON.stringify(userData));
  }

  clearCurrentUser() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  isLoggedIn() {
    return this.currentUser && Object.keys(this.currentUser).length > 0;
  }
  
  async signUp(userData, fail = false){  
    const response = await fetch(`${App.apiBase}/user`, {
      method: 'POST',
      body: userData
    });

    if(!response.ok){
      const err = await response.json();
      if(err) console.log(err);
      Toast.show(`Problem getting user: ${response.status}`);
      if(typeof fail == 'function') fail();
    }

    Toast.show('Account created, please sign in');
    gotoRoute('/signin');
  }

  async signIn(userData, fail = false){
    console.log('userData being sent:', userData); // Debug log
    const response = await fetch(`${App.apiBase}/auth/signin`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(userData)
    });

    if(!response.ok){
      const err = await response.json();
      if(err) console.log(err);
      Toast.show(`Problem signing in: ${err.message}`, 'error');
      if(typeof fail == 'function') fail();
      return;
    }

    // sign in success
    const data = await response.json();
    Toast.show(`Welcome ${data.user.firstName}`);

    // 2. Save access token to localStorage
    localStorage.setItem('accessToken', data.accessToken);

    // 3. Set currentUser to include both user details AND the token
    this.setCurrentUser({
      ...data.user,
      token: data.accessToken, // <--- Include the token property
    });

    Router.init();
    if(data.user.newUser === true){
      gotoRoute('/');
    } else {
      gotoRoute('/');
    }
  }

  async check(success){
    // 4. Show splash screen while loading
    render(splash, App.rootEl);

    // 5. If there's no accessToken in localStorage, redirect to home
    if(!localStorage.accessToken){
      gotoRoute('/');
      return;
    }

    // 6. Validate token via backend
    const response = await fetch(`${App.apiBase}/auth/validate`, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${localStorage.accessToken}`
      }
    });

    if(!response.ok){
      const err = await response.json();
      if(err) console.log(err);
      localStorage.removeItem('accessToken');
      Toast.show("session expired, please sign in");
      gotoRoute('/signin');
      return;
    }

    // 7. Token is valid; get user data
    const data = await response.json();

    // 8. Merge user data with the existing token from localStorage
    //    so currentUser still has the token.
    this.currentUser = {
      ...data.user,
      token: localStorage.getItem('accessToken')
    } || null;

    // 9. Run success callback
    success();
  }

  signOut(){
    Toast.show("You are signed out");
    this.currentUser = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser'); // Make sure the stored user data is removed
    gotoRoute('/');
    window.location.reload(); // Force a full reload of the application
  }
}

export default new Auth();