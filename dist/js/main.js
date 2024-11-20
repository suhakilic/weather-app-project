// #region imports
import {
  getCurrentPlaceName,
  getCurrentWeatherData,
  getCoordsFromCityName,
} from "./dataFunctions.js";
import {
  displayCurrentFavData,
  displayCurrentWeatherData,
} from "./domFunctions.js";
// #endregion

const textMsg = document.getElementById("textMsg");
const currentWeatherSection = document.getElementById("current_weather");
const dailytWeatherSection = document.getElementById("daily_weather");
const additionalButtons = document.getElementById("additional_buttons");
const favSection = document.getElementById("fav_section");
const favPlaces = JSON.parse(localStorage.getItem("favPlaces")) || [];
let myCurrentLocObj = {};

// #region navigation homeButton
const homePosButton = document.getElementById("homePos_btn");
homePosButton.addEventListener("click", async function () {
  const city = localStorage.getItem("homeCity");
  const country = localStorage.getItem("homeCountry");
  if (city && country) {
    await handleDataWithCityName(city);
    checkSavePosButton();
  } else {
    myCurrentLocObj = {};
    checkSavePosButton();
    console.log("myCurrentLocObj", myCurrentLocObj);
    cleanScreen();
    const errorMsg =
      "Home location is not set yet.\n\nPlease search for a city, then save it as your home.\n\nOr, click the position icon, then save your current location as home.";
    textMsg.innerText = errorMsg;
    textMsg.classList.remove("hide");
  }
});
// #endregion

// #region navigation currentPositionButton
const currentPosButton = document.getElementById("currentPos_button");
currentPosButton.addEventListener("click", async function () {
  try {
    await getCurrentLocation(); // Wait for getCurrentLocation to complete
    // #region Explanation of Location Handling
    /* With getCurrentLocation function, we get latitude and longitude from the browser's geolocation. However, if we set this location as the home location and then display the home location and current location, it can lead to slight differences. This is because we retrieve home location data using values stored in localStorage. Over time, while the lat and lon data in localStorage remain the same, the current location data may show small changes due to minor variations in geolocation coordinates. To avoid this, we first get the city name using geolocation's lat and lon values. Then, we use this city name to obtain the city's default lat and lon. This allows us to display consistent data for both the current location and home location, using the city's default lat and lon values. This approach helps maintain stability in displayed location data without minor discrepancies from GPS precision. */
    // #endregion
    const city = myCurrentLocObj.city;
    if (city != null) {
      handleDataWithCityName(city);
      checkSavePosButton();
    }
  } catch (error) {
    console.error("Failed to retrieve current location:", error.message);
    myCurrentLocObj = {};
    checkSavePosButton();
    console.log("myCurrentLocObj", myCurrentLocObj);
  }
});
// #endregion

// #region navigation savePosButton
const savePosButton = document.getElementById("savePos_button");
savePosButton.addEventListener("click", function () {
  additionalButtons.classList.toggle("hide");
});
//#endregion

// #region savePosButton>>>saveAsHomeButton
const saveAsHome = document.getElementById("saveAsHomeDiv");
saveAsHome.addEventListener("click", function () {
  if (myCurrentLocObj.city && myCurrentLocObj.country) {
    localStorage.setItem("homeCity", myCurrentLocObj.city);
    localStorage.setItem("homeCountry", myCurrentLocObj.country);
    additionalButtons.classList.toggle("hide");
  }
});
//#endregion

// #region savePosButton>>>saveAsFavButton
const saveAsFav = document.getElementById("saveAsFavDiv");
saveAsFav.addEventListener("click", function () {
  const favPlaceObj = {
    city: myCurrentLocObj.city,
    country: myCurrentLocObj.country,
  };

  const placeExist = favPlaces.some(
    (obj) =>
      obj.city === favPlaceObj.city && obj.country === favPlaceObj.country
  );

  if (!placeExist) {
    favPlaces.push(favPlaceObj);
  } else {
    alert("You have already added this city to favourites.");
  }
  additionalButtons.classList.toggle("hide");
  const stringifiedFavPlaces = JSON.stringify(favPlaces);
  localStorage.setItem("favPlaces", stringifiedFavPlaces);
});
//#endregion

// #region navigation favourites button
const favPosButton = document.getElementById("favPos_button");
favPosButton.addEventListener("click", async function () {
  myCurrentLocObj = {};
  checkSavePosButton();
  console.log("myCurrentLocObj", myCurrentLocObj);
  cleanScreen();
  currentWeatherSection.classList = "hide";
  dailytWeatherSection.classList = "hide";
  const infoArray = [];
  const favPositions = favPlaces;
  if (favPositions) {
    for (const position of favPositions) {
      const locationData = await getCoordsFromCityName(position.city);
      // getCoordsFromCityName returns >>> lat,lon,city,country
      const favWeatherData = await getCurrentWeatherData(
        locationData.lat,
        locationData.lon
      );
      favWeatherData.city = position.city;
      favWeatherData.country = position.country;
      infoArray.push(favWeatherData);
    }

    const abc = displayCurrentFavData(infoArray);
    console.log(abc);
    // handleDataWithCityName(abc)
  }
});
//#endregion

// #region searchButton event
const searchButton = document.getElementById("search_button");
searchButton.addEventListener("click", function () {
  additionalButtons.classList.add("hide");

  setTimeout(() => {
    const city = prompt("Enter a city name to look up the weather:");
    if (city != null && city.length > 0) {
      handleDataWithCityName(city);
    }
  }, 0);
});
// #endregion

// getCurrentLocation
function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(geoSuccess(position)); // Resolve the Promise when geoSuccess is done
        },
        (error) => {
          geoFail();
          reject(error); // Reject the Promise if there's an error
        }
      );
    } else {
      geoFail();
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });
}

// geoSuccess
async function geoSuccess(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  myCurrentLocObj.lat = lat;
  myCurrentLocObj.lon = lon;

  // Fetch city and country name after setting lat and lon
  try {
    const placeData = await getCurrentPlaceName(lat, lon);
    myCurrentLocObj.city = placeData.city;
    myCurrentLocObj.country = placeData.country;
  } catch (error) {
    console.error(error.message);
    const errorMsg =
      "Geolocation is not supported by this browser. Please use a modern browser or check your browser settings to enable geolocation.";
    textMsg.innerText = errorMsg;
  }
}

// geoFail
function geoFail() {
  cleanScreen();
  showError();
  const errorMsg =
    "Geolocation is not supported by this browser. Please use a modern browser or check your browser settings to enable geolocation.";
  textMsg.innerText = errorMsg;
}

// cleanScreen()
export function cleanScreen() {
  textMsg.classList.add("hide");
  currentWeatherSection.innerHTML = "";
  dailytWeatherSection.innerHTML = "";
  favSection.innerHTML = "";
  additionalButtons.classList.add("hide");
}

// showError()
function showError() {
  textMsg.classList.remove("hide");
  console.log("Showing an error message now.");
}

// handle data with city name
async function handleDataWithCityName(city) {
  const locationData = await getCoordsFromCityName(city);
  // getCoordsFromCityName returns >>> lat,lon,city,country
  const weatherData = await getCurrentWeatherData(
    locationData.lat,
    locationData.lon
  );
  myCurrentLocObj = locationData;
  cleanScreen();
  displayCurrentWeatherData(weatherData, locationData);
  console.log("myCurrentLocObj", myCurrentLocObj);
}

// checkSavePosButton
function checkSavePosButton() {
  if (myCurrentLocObj.city && myCurrentLocObj.country) {
    savePosButton.disabled = false;
  } else {
    savePosButton.disabled = true;
  }
}
