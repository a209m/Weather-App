import axios from 'axios';

const API_KEY = 'bac45e360793e4279a56c4250088d2ab';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function getWeatherData(city, lat, lon) {
    let queryParam = city ? `q=${city}` : `lat=${lat}&lon=${lon}`;
    const url = `${BASE_URL}/weather?${queryParam}&units=metric&appid=${API_KEY}`;

    try {
        const response = await axios.get(url);
        return { data: response.data, error: null };
    } catch (error) {
        console.warn("Weather API: city not found or request failed.", city || `${lat},${lon}`);
        return { data: null, error: "Location not found" };
    }
}

export async function getForecastData(city, lat, lon) {
    let queryParam = city ? `q=${city}` : `lat=${lat}&lon=${lon}`;
    const url = `${BASE_URL}/forecast?${queryParam}&units=metric&appid=${API_KEY}`;

    try {
        const response = await axios.get(url);
        return { data: response.data, error: null };
    } catch (error) {
        console.warn("Forecast API: city not found or request failed.", city || `${lat},${lon}`);
        return { data: null, error: "Forecast not found" };
    }
}
