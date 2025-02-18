import App from './App';
import Auth from './Auth';
import Toast from './Toast';

class FavouriteAPI {

  async newFavourite(formData){
    // send fetch request
    const response = await fetch(`${App.apiBase}/order`, {
      method: 'POST',
      headers: { "Authorization": `Bearer ${localStorage.accessToken}`},
      body: formData
    });

    // if response not ok
    if(!response.ok){ 
      let message = 'Problem adding favourites';
      if(response.status == 400){
        const err = await response.json();
        message = err.message;
      }      
      // throw error (exit this function)      
      throw new Error(message);
    }
    
    // convert response payload into json - store as data--
    const data = await response.json();
    
    // return data
    return data;
  }



  async getFavourites(){
    
    // fetch the json data
    const response = await fetch(`${App.apiBase}/favourite`, {
      headers: { "Authorization": `Bearer ${localStorage.accessToken}`}
    });

    // if response not ok
    if(!response.ok){ 
      // console log error
      const err = await response.json();
      if(err) //console.log(err);
      // throw error (exit this function)      
      throw new Error('Problem getting favourites');
    }
    
    // convert response payload into json - store as data
    const data = await response.json();
    
    // return data
    return data;
  }
}

export default new FavouriteAPI();