const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation } = require('./iss_promised');

fetchMyIP()
  .then(fetchCoordsByIP)
  .then(fetchISSFlyOverTimes);
//.then(body => console.log(body))

// see index.js for printPassTimes
// copy it from there, or better yet, moduralize and require it in both files

//use this: https://stackoverflow.com/questions/4631928/convert-utc-epoch-to-local-date
const epochMsToUTC = (utcSeconds) => {
  const d = new Date(0); // The 0 there is the key, which sets the date to the epoch
  d.setUTCSeconds(utcSeconds);
  return d;
};

const printPassTimes = (passTimes) => {
  for (let eachTime of passTimes) {
    //console.log(eachTime.risetime, eachTime.duration);
    let dateInCorrectFormat = epochMsToUTC(eachTime.risetime);
    console.log(`Next pass at ${dateInCorrectFormat} for ${eachTime.duration} seconds!`);
  }
};

// Call
nextISSTimesForMyLocation()
  .then((passTimes) => {
    printPassTimes(passTimes);
  })
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  });