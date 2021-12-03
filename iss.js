/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const request = require('request');

const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  let URL = "https://api.ipify.org?format=json";

  request(URL, (error, response, body) => {
    //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    //console.log('body:', body, typeof(body)); // Print the HTML for the Google homepage.

    //Edge Case: Request Failed
    // inside the request callback ...
    // error can be set if invalid domain, user is offline, etc.
    if (error) {
      callback(error, null); //return with auto-generated error message
      return; //return to index.js
    }

    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    //the 'body' or IP address response is already returned in JSON format
    //use JSON.stringify to return IP address as a string
    //incorrect: callback(null, JSON.stringify(body));
    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};

const fetchCoordsByIP = function (IP, callback) {
  // use request to fetch IP address from JSON API
  let URL = "https://freegeoip.app/json/";
  //let URL = "https://freegeoip.app/json/162.245.144"; //invalid error test case

  request(URL, (error, response, body) => {
    //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    //console.log('body:', body, typeof(body)); // Print the HTML for the Google homepage.

    //Edge Case: Request Failed
    // inside the request callback ...
    // error can be set if invalid domain, user is offline, etc.
    if (error) {
      callback(error, null); //return with auto-generated error message
      return; //return to index.js
    }

    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    //the 'body' or coords response is already returned in JSON format
    const lat = JSON.parse(body).latitude.toString();
    const long = JSON.parse(body).longitude.toString();
    const coords = {
      lat,
      long
    };
    callback(null, coords);
  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  let URL = "https://iss-pass.herokuapp.com/json/?lat=" + coords.lat + "&lon=" + coords.long;
  //console.log(URL);
  //let URL = "https://freegeoip.app/json/162.245.144"; //invalid error test case

  request(URL, (error, response, body) => {
    //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    //console.log('body:', body, typeof(body)); // Print the HTML for the Google homepage.

    //Edge Case: Request Failed
    // inside the request callback ...
    // error can be set if invalid domain, user is offline, etc.
    if (error) {
      callback(error, null); //return with auto-generated error message
      return; //return to index.js
    }

    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when rise time and duration. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    //the 'body' returned is already returned in JSON format, but only want "response" array
    const oututRisetimeDuration = JSON.parse(body).response;

    callback(null, oututRisetimeDuration);
  });
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      console.log("It didn't work!", error);
      return;
    }

    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        console.log("It didn't work!", error);
        return;
      }

      fetchISSFlyOverTimes(coords, (error, finalOutput) => {
        if (error) {
          console.log("It didn't work!", error);
          return;
        }
        callback(null, finalOutput);
      });
    });
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };
