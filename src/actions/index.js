import axios from 'axios';
//import Key from '../env-google';     remove comment after changing env-google-sample to env-google
import querystring from 'querystring';

//grabs from server
//const ROOT_URL = 'localhost://3000'
const API_KEY = "AIzaSyAUpKh2acbg-j_j4aRr-DGjeF7NXwCK_J4";    //This will be imported from env-google but it's not working now so just put your key here and remove before push
//import API_KEY from '../../keys.js';


export const FETCH_TOILETZ = 'FETCH_TOILETZ';
export const FETCH_REVIEWS = 'FETCH_REVIEWS';
export const SELECT_TOILETZ = 'SELECT_TOILETZ';
export const CREATE_TOILET = 'CREATE_TOILET';
export const CREATE_REVIEW = 'CREATE_REVIEW';
export const SEARCH_CENTER = 'SEARCH_CENTER';

export function search(endpoint) {
  let lat;
  let lng;
  return convertAddress(endpoint)
		.then(function(response) {
      console.log('response to convertAddress:', response);
      console.log('response to convertAddress, latitude:', response.latitude);
      console.log('response to convertAddress, longitude:', response.longitude);
      lat = response.latitude;
      lng = response.longitude;
      //setSearchCenter(dispatch, lat, lng);
      return axios.post('./api/toilet/location', {
          latitude: response.latitude,
          longitude: response.longitude,
          address: response.address
        });
      })
      .then ( (response) => {
        console.log('response in search:', response);
        return function(dispatch) {
          dispatch({
            type: FETCH_TOILETZ,
            payload: response
          });
          dispatch({
            type: SEARCH_CENTER,
            payload: {latitude: lat, longitude: lng}
          });
          }
        })
    		.catch( (response) => {
    			console.log("ENTER A VALID LOCATION")
    			return {
    				type: FETCH_TOILETZ,
    				payload: "ENTER A VALID LOCATION"
    			};
    		});

}

export function convertAddress(address) {
	let response;
	return axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + API_KEY)
		.then(function(payload) {
			//console.log(payload, "PAYLOAD (GOOGLE API) IN ACTIONS, CONVERTADDRESS");
			response = payload.data.results[0].geometry.location;
			return Promise.resolve({
				latitude: response.lat,
			  longitude: response.lng,
			  address: address
			});

		})
		.catch(function(response) {
			console.log(response, "ERROR INSIDE ACTIONS, IN CONVERTADDRESS");
		})
}
// export function convertAddress(address) {
// 	return new Promise(function(resolve, reject) {
// 	let response;
// 	let coords;
// 	resolve(axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + API_KEY)
// 		.then(function(payload) {
// 			//console.log(payload, "PAYLOAD (GOOGLE API) IN ACTIONS, CONVERTADDRESS");
// 			response = payload.data.results[0].geometry.location;
// 			coords = {
// 				latitude: response.lat,
// 			    longitude: response.lng,
// 			    address: address
// 			};
// 			return {
// 				data: coords
// 			}
// 		}))
// 		.catch(function(response) {
// 			console.log(response, "ERROR INSIDE ACTIONS, IN CONVERTADDRESS");
// 		})
// 	})
// }

export function setSearchCenter(dispatch, lat, lng) {
  console.log('payload=', {latitude: lat, longitude: lng})
  dispatch( {
    type: SEACH_CENTER,
    payload: {latitude: lat, longitude: lng}
  });
}

export function SelectToilet(toilet){
	//SelectToilet is an ActionCreator, it needs to return an action,
	// an object with a type property.

	return {
		type: 'TOILET_SELECTED', //always uppercase
		//piece of data that describe the action
		payload: toilet

	};
}

export function selectToiletFromMap(toilet) {
  let latlng = `${toilet.latitude},${toilet.longitude}`;
  return axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
    params: {
      key: API_KEY,
      latlng: latlng
    }
  }).then( (response) => {
    const currentToilet = Object.assign({}, toilet, {address: response.data.results[0].formatted_address})
    return {
      type: 'TOILET_MAP_CURRENT',
      payload: currentToilet
    }
  })
}

export function getReviews (toiletId){
	//SelectToilet is an ActionCreator, it needs to return an action,
	// an object with a type property.

	const request = axios.get('./api/review/toilet/'+toiletId)
		return {
			type: FETCH_REVIEWS,
			payload: request
		};
}



export function createToilet(props,userId) {
console.log('props inside action', props)

 	return convertAddress(props.address)
		.then(function(payload) {



			let params = {
	        name:props.name,
	        description:props.description,
          img: props.img,
	        id_users: userId,
	        latitude: payload.data.latitude,
			    longitude: payload.data.longitude,
			    address: payload.data.address,
			    token: localStorage.getItem('token')
			};

			const request = axios.post('./api/toilet/',params);
					return {
						type: CREATE_TOILET,
						payload: request
					};

			})
		.catch(function(response) {
			return {
						type: FETCH_TOILETZ,
						payload: "ENTER A VALID LOCATION"
					};
		})
}

export function createReview(props,toilet,userId) {
	let params = {
	    description:props.description,
	    rating:props.rating,
	    recommend: true,
	    id_Users: userId,
	    id_Toiletz: toilet.id,
	    token: localStorage.getItem('token')
	};

	console.log("inside actions", params)

	const request = axios.post('./api/review/',params);

	return {
		type: CREATE_REVIEW,
		payload: request
	};
}
