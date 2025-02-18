import App from './App';
import Auth from './Auth';
import Toast from './Toast';

class OrderAPI {

  async newOrder(formData){
    // send fetch request
    const response = await fetch(`${App.apiBase}/order`, {
      method: 'POST',
      headers: { "Authorization": `Bearer ${localStorage.accessToken}`},
      body: formData
    });

    // if response not ok
    if(!response.ok){ 
      let message = 'Problem adding order';
      if(response.status == 400){
        const err = await response.json();
        message = err.message;
      }      
      // throw error (exit this function)      
      throw new Error(message);
    }
    
    // convert response payload into json - store as data
    const data = await response.json();
    
    // return data
    return data;
  }

  async addFavProduct(productId, favourite){
      // validate
      if(!productId) return;
  
      // fetch the json data
      const response = await fetch(`${App.apiBase}/order/addFavProduct/${productId}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${localStorage.accessToken}`, "Content-Type": 'application/json'},
        body: JSON.stringify({ favourite })
      });
  
      // if response not ok
      if(!response.ok){ 
        // console log error
        const err = await response.json();
        if(err) ////console.log(err);
        // throw error (exit this function)      
        throw new Error('Problem adding product to favourites');
      }
      
      // convert response payload into json - store as data
      const data = await response.json();
      
      // return data
      return data;
  
    }

  async getOrders(){
    //console.log("calling orders beginning")
    // fetch the json data
    const response = await fetch(`${App.apiBase}/order`, {
      headers: { "Authorization": `Bearer ${localStorage.accessToken}`}
    });
    //console.log("calling orders")
    // if response not ok
    if(!response.ok){ 
      // console log error
      const err = await response.json();
      if(err) //console.log(err);
      // throw error (exit this function)      
      throw new Error('Problem getting orders');
    }
    
    // convert response payload into json - store as data
    const data = await response.json();
    //console.log("data", data)
    
    // return data
    return data;
  }
}

export default new OrderAPI();