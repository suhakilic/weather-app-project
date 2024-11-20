export const getCurrentWeatherData = async (latitude, longitude) => {
  /*   const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&units=metric&exclude={part}&appid=${WEATHER_API_KEY}`;
    try {
    const weatherStream = await fetch(url);
    const weatherJson = await weatherStream.json();
    return weatherJson;
  } catch (err) {
    console.error("Failed to fetch weather data:", err);
    return null;
  } */
  const urlDataObj = {
    lat: latitude,
    lon: longitude,
  };
  try {
    const weatherStream = await fetch("./.netlify/functions/get_weather", {
      method: "POST",
      body: JSON.stringify(urlDataObj),
    });
    const weatherJson = await weatherStream.json();
    return weatherJson;
  } catch (err) {
    console.error("Failed to fetch weather data:", err);
    return null;
  }
};

export const getCurrentPlaceName = async (latitude, longitude) => {
  /*   const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}`;
  try {
    const data = await fetch(url);
    const placeNameJson = await data.json();
    const currentPlace = {
      city: placeNameJson[0].name,
      country: placeNameJson[0].country,
    };
    return currentPlace;
  } catch (err) {
    console.error("Failed to fetch place name data:", err);
    return null;
  } */
  const urlDataObj = {
    lat: latitude,
    lon: longitude,
  };
  try {
    const placeStream = await fetch("./.netlify/functions/get_current_place", {
      method: "POST",
      body: JSON.stringify(urlDataObj),
    });
    const placeNameJson = await placeStream.json();
    const currentPlace = {
      city: placeNameJson[0].name,
      country: placeNameJson[0].country,
    };
    return currentPlace;
  } catch (err) {
    console.error("Failed to fetch weather data:", err);
    return null;
  }
};

export const getCoordsFromCityName = async (city) => {
  /*   const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${WEATHER_API_KEY}`;
  try {
    const data = await fetch(url);
    const dataJson = await data.json();
    const dataObj = {
      lat: dataJson[0].lat,
      lon: dataJson[0].lon,
      city: dataJson[0].name,
      country: dataJson[0].country,
    };
    return dataObj;
  } catch (err) {
    console.error("Failed to fetch weather data:", err);
    return null;
  } */
  try {
    const coordsStream = await fetch("./.netlify/functions/get_coords", {
      method: "POST",
      body: JSON.stringify(city),
    });
    const dataObj = {
      lat: coordsStream[0].lat,
      lon: coordsStream[0].lon,
      city: coordsStream[0].name,
      country: coordsStream[0].country,
    };
    return dataObj;
  } catch (err) {
    console.error("Failed to fetch weather data:", err);
    return null;
  }
};
