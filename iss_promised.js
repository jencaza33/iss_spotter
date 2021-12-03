// iss_promised.js
const request = require('request-promise-native');
const fetchMyIP = function() {
  // use request to fetch IP address from JSON API
  return request("https://api.ipify.org?format=json");
};

const fetchCoordsByIP = function(body) {
  // use request to fetch IP address from JSON API
  const ip = JSON.parse(body).ip;
  return request(`https://freegeoip.app/json/${ip}`);
};

const fetchISSFlyOverTimes = function(body) {
  //console.log('BBBBBB');
  const bodyJSON = JSON.parse(body);
  const lat = bodyJSON.latitude;
  const long = bodyJSON.longitude;
  //console.log("JSON.parse(body):", JSON.parse(body));
  let URL = "https://iss-pass.herokuapp.com/json/?lat=" + lat + "&lon=" + long;
  //console.log(URL);
  return request(URL);
};

const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const { response } = JSON.parse(data);
      return response;
    });
};

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };