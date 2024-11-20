import {
  getCurrentWeatherData,
  getCoordsFromCityName,
} from "./dataFunctions.js";
import { cleanScreen } from "./main.js";

export const displayCurrentWeatherData = (
  myCurrentWeatherJson,
  myCurrentPlaceJson
) => {
  const currentWeatherSection = document.getElementById("current_weather");
  currentWeatherSection.classList = "current_weather";
  const dailyWeatherSection = document.getElementById("daily_weather");
  dailyWeatherSection.classList = "daily_weather";

  const timezone = myCurrentWeatherJson.timezone;
  const place = myCurrentPlaceJson.city;
  const country = myCurrentPlaceJson.country;
  const time = getTimeFromUnix(myCurrentWeatherJson.current.dt, timezone);
  const day = getDateFromUnix(myCurrentWeatherJson.current.dt, timezone);
  const temp = Math.round(Number(myCurrentWeatherJson.current.temp));
  const feelsLike = Math.round(Number(myCurrentWeatherJson.current.feels_like));
  const icon = myCurrentWeatherJson.current.weather[0].icon;
  const description = myCurrentWeatherJson.current.weather[0].description;
  const sunrise = getTimeFromUnix(
    myCurrentWeatherJson.current.sunrise,
    timezone
  );
  const sunset = getTimeFromUnix(myCurrentWeatherJson.current.sunset, timezone);
  const maxTemp = Math.round(Number(myCurrentWeatherJson.daily[0].temp.max));
  const minTemp = Math.round(Number(myCurrentWeatherJson.daily[0].temp.min));
  const wind = Math.round(Number(myCurrentWeatherJson.current.wind_speed));
  const humidity = myCurrentWeatherJson.current.humidity;

  // #region placeDiv
  const placeDiv = createElement("div", "current_location");
  const placeDivIcon = createElement(
    "i",
    "current_location_icon fa-solid fa-location-dot"
  );
  const placeDivName = createElement(
    "div",
    "current_location_place",
    `${place}, ${country}`
  );
  const placeDivTime = createElement("div", "current_location_time", time);
  const placeDivDay = createElement("div", "current_location_day", day);
  placeDiv.append(placeDivIcon, placeDivName, placeDivDay, placeDivTime);
  // #endregion

  // currentDegreeDiv
  const currentDegreeDiv = createElement("div", "current_degree", `${temp}°`);

  // feelsLikeDiv
  const feelsLikeDiv = createElement(
    "div",
    "feels_like",
    `feels like ${feelsLike}°`
  );

  //  #region iconDiv
  const iconDiv = createElement("div", "current_description_icon");
  const iconDivImg = document.createElement("img");
  iconDivImg.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  iconDiv.appendChild(iconDivImg);
  // #endregion

  // descriptionDiv
  const descriptionDiv = createElement(
    "div",
    "current_description",
    `${description}`
  );

  // #region sunriseDiv
  const sunriseDiv = createElement("div", "sunrise");
  const sunriseDivText = createElement("div", "", "Sunrise");
  const sunriseDivValue = createElement("div", "", `${sunrise}`);
  sunriseDiv.append(sunriseDivText, sunriseDivValue);
  // #endregion

  // #region sunsetDiv
  const sunsetDiv = createElement("div", "sunset");
  const sunsetDivText = createElement("div", "", "Sunset");
  const sunsetDivValue = createElement("div", "", `${sunset}`);
  sunsetDiv.append(sunsetDivText, sunsetDivValue);
  // #endregion

  // #region maxDiv
  const maxDiv = createElement("div", "current_max_degree");
  const maxDivText = createElement("div", "", "Max");
  const maxDivValue = createElement("div", "", `${maxTemp}°`);
  maxDiv.append(maxDivText, maxDivValue);
  // #endregion

  // #region minDiv
  const minDiv = createElement("div", "current_min_degree");
  const minDivText = createElement("div", "", "Min");
  const minDivValue = createElement("div", "", `${minTemp}°`);
  minDiv.append(minDivText, minDivValue);
  // #endregion

  // #region windDiv
  const windDiv = createElement("div", "wind");
  const windText = createElement("div", "", "Wind");
  const windDivValue = createElement("div", "", `${wind} m/s`);
  windDiv.append(windText, windDivValue);
  // #endregion

  // #region humidityDiv
  const humidityDiv = createElement("div", "humidity");
  const humidityDivText = createElement("div", "", "Humidity");
  const humidityDivValue = createElement("div", "", `%${humidity}`);
  humidityDiv.append(humidityDivText, humidityDivValue);
  // #endregion

  currentWeatherSection.append(
    placeDiv,
    currentDegreeDiv,
    feelsLikeDiv,
    iconDiv,
    descriptionDiv,
    sunriseDiv,
    sunsetDiv,
    maxDiv,
    minDiv,
    windDiv,
    humidityDiv
  );

  // daily weather section
  for (let i = 1; i < 8; i++) {
    const dayDt = getDateFromUnix(myCurrentWeatherJson.daily[i].dt, timezone);
    const dayMax = `${Math.round(
      Number(myCurrentWeatherJson.daily[i].temp.max)
    )}°`;
    const dayMin = `${Math.round(
      Number(myCurrentWeatherJson.daily[i].temp.min)
    )}°  `;
    const dayIcon = myCurrentWeatherJson.daily[i].weather[0].icon;
    const dayDescription = myCurrentWeatherJson.daily[i].weather[0].description;

    const dailyDiv = createElement("div", "daily");
    const dailyDt = createElement("div", "daily-dt", dayDt);
    const dailyMaxMin = createElement(
      "div",
      "daily-max-min",
      `${dayMax} / ${dayMin}`
    );

    // daily icon
    const dailyIcon = createElement("div", "daily-icon");
    const dailyIconImg = document.createElement("img");
    dailyIconImg.src = `https://openweathermap.org/img/wn/${dayIcon}@2x.png`;
    dailyIcon.appendChild(dailyIconImg);

    const dailyDescription = createElement("div", "daily-desc", dayDescription);

    dailyDiv.append(dailyDt, dailyMaxMin, dailyIcon, dailyDescription);
    dailyWeatherSection.appendChild(dailyDiv);
  }
};

function createElement(type, className, text) {
  const element = document.createElement(type);
  element.className = className;

  if (text) {
    element.textContent = text;
  }
  return element;
}

const getTimeFromUnix = (unixTime, timezone) => {
  const date = new Date(unixTime * 1000);
  return date.toLocaleTimeString("en-GB", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getDateFromUnix = (unixTime, timezone) => {
  const date = new Date(unixTime * 1000);
  return date.toLocaleDateString("en-GB", {
    timeZone: timezone,
    day: "numeric",
    month: "short",
  });
};

// display favourite cities
export const displayCurrentFavData = (infoArray) => {
  const favDiv = document.getElementById("fav_section");
  let returnedCity;

  for (const info of infoArray) {
    const city = info.city;
    const country = info.country;
    const time = getTimeFromUnix(info.current.dt, info.timezone);
    const day = getDateFromUnix(info.current.dt, info.timezone);
    const temp = Math.round(Number(info.current.temp));
    const feelsLike = Math.round(Number(info.current.feels_like));
    const icon = info.current.weather[0].icon;
    const description = info.current.weather[0].description;
    console.log(city, country, time, day, temp, feelsLike, icon, description);
    const cityDiv = createElement("div", "fav-city", city);
    const countryDiv = createElement("div", "fav-country", country);
    const timeDiv = createElement("div", "fav-time", time);
    const dayDiv = createElement("div", "fav-day", day);
    const tempDiv = createElement("div", "fav-temp", `${temp}°`);
    const feelsLikeDiv = createElement(
      "div",
      "fav-feels-like",
      `Feels like ${feelsLike}°`
    );

    const iconDiv = createElement("div", "fav-icon");
    const iconDivImg = document.createElement("img");
    iconDivImg.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    iconDiv.appendChild(iconDivImg);

    const descriptionDiv = createElement("div", "fav-description", description);

    const favPlace = createElement("div", "fav-place");
    favPlace.append(cityDiv, countryDiv);

    const favTimeArea = createElement("div", "fav-time-area");
    favTimeArea.append(timeDiv, dayDiv);

    const detailButton = createElement("button", "detail-button", "Detail");
    const deleteButton = createElement("button", "delete-button", "Delete");

    detailButton.id = city;
    deleteButton.id = city;

    const favDivSub = createElement("div", "fav-div");
    favDivSub.append(
      favPlace,
      favTimeArea,
      tempDiv,
      feelsLikeDiv,
      iconDiv,
      descriptionDiv,
      detailButton,
      deleteButton
    );
    favDiv.appendChild(favDivSub);

    detailButton.addEventListener("click", function () {
      returnedCity = detailButton.id
    });
    deleteButton.addEventListener("click", function () {
      console.log(deleteButton.id);
    });
  }
  console.log(returnedCity)
  return "Utrecht"
};

// handle data with city name
export async function handleDataWithCityName(city) {
  const locationData = await getCoordsFromCityName(city);
  // getCoordsFromCityName returns >>> lat,lon,city,country
  const weatherData = await getCurrentWeatherData(
    locationData.lat,
    locationData.lon
  );
  cleanScreen();
  displayCurrentWeatherData(weatherData, locationData);
}
