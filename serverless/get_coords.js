const fetch = require("node-fetch");

const { WEATHER_API_KEY } = process.env;

exports.handler = async (event, context) => {
  const params = JSON.parse(event.body);
  const {city} = params;
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${WEATHER_API_KEY}`;

  try {
    const coordsStream = await fetch(url);
    const coordsJson = await coordsStream.json();
    return {
      statusCode: 200,
      body: JSON.stringify(coordsJson),
    };
  } catch (err) {
    return { statusCode: 422, body: err.stack };
  }
};
