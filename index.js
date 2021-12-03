// index.js
//const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes } = require('./iss');

// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }

//   console.log('It worked! Returned IP:' , ip, typeof(ip));
// });
// let ip;
// fetchCoordsByIP(ip, (error, data) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }
//   console.log('Here are the coords:' , data);
// });

// fetchISSFlyOverTimes({ lat: '49.27670', long: '-123.13000' }, (error, data) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }
//   console.log('Here is the risetime and duration:' , data);
// });

// index.js

const { nextISSTimesForMyLocation } = require('./iss');

//use this: https://stackoverflow.com/questions/4631928/convert-utc-epoch-to-local-date
const epochMsToUTC = (utcSeconds) => {
  const d = new Date(0); // The 0 there is the key, which sets the date to the epoch
  d.setUTCSeconds(utcSeconds);
  return d;
};

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  //console.log(passTimes);
  for (let eachTime of passTimes) {
    //console.log(eachTime.risetime, eachTime.duration);
    let dateInCorrectFormat = epochMsToUTC(eachTime.risetime);
    console.log(`Next pass at ${dateInCorrectFormat} for ${eachTime.duration} seconds!`);
  }

  //output should look like:
  //Next pass at Fri Jun 01 2021 13:01:35 GMT-0700 (Pacific Daylight Time) for 465 seconds!

});