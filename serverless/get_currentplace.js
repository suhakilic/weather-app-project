const fetch = require("node-fetch");

const { WEATHER_API_KEY } = process.env;

exports.handler = async (event, context) => {
  const params = JSON.parse(event.body);
  const { latitude, longitude } = params;
  const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}`;

  try {
    const placeStream = await fetch(url);
    const placeJson = await placeStream.json();
    return {
      statusCode: 200,
      body: JSON.stringify(placeJson),
    };
  } catch (err) {
    return { statusCode: 422, body: err.stack };
  }
};
