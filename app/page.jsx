"use client";

import React, { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import Hero from "@/components/Hero";
import TodaysForecast from "@/components/TodaysForecast";
import AirConditions from "@/components/AirConditions";
import WeeklyForecast from "@/components/WeeklyForecast";
import { useWeather } from "@/lib/context";
import { getWeatherData, getForecastData } from "@/lib/weather";

export default function Home() {
    const { activeCity, settings } = useWeather();
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setError(null);

            let weatherData, forecastData;

            // Use Geolocation only if specifically requested via '__GEO__' sentinel
            if (activeCity === '__GEO__' && settings.location_enabled && navigator.geolocation) {
                try {
                    const position = await new Promise((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
                    });
                    const { latitude, longitude } = position.coords;
                    const [w, f] = await Promise.all([
                        getWeatherData(null, latitude, longitude),
                        getForecastData(null, latitude, longitude)
                    ]);
                    weatherData = w;
                    forecastData = f;
                } catch (geoError) {
                    console.warn("Geolocation failed or timed out, falling back to Madrid.");
                }
            }

            // Fetch activeCity if not using geolocation, or as fallback
            if (!weatherData || weatherData.error) {
                const cityToFetch = (activeCity && activeCity !== '__GEO__') ? activeCity : "Madrid";
                const [w, f] = await Promise.all([
                    getWeatherData(cityToFetch),
                    getForecastData(cityToFetch)
                ]);
                weatherData = w;
                forecastData = f;
            }

            if (weatherData.error) {
                console.error("Weather error:", weatherData.error);
                setError(weatherData.error);
            } else {
                setWeather(weatherData.data);
                setForecast(forecastData.data);
            }
            setLoading(false);
        }

        fetchData();
    }, [activeCity, settings.location_enabled]);

    if (loading) {
        return (
            <main className="main-content">
                <div className="loading-wrapper">
                    <span className="loader"></span>
                    <span className="loading-text">Fetching Weather</span>
                </div>
            </main>
        );
    }

    return (
        <>
            <main className="main-content">
                <SearchBar />
                {error ? (
                    <div className="hero">
                        <h1 className="city-name" style={{ color: '#ff6b6b' }}>{error}</h1>
                    </div>
                ) : (
                    <>
                        <Hero weather={weather} />
                        <TodaysForecast forecast={forecast} />
                        <AirConditions weather={weather} />
                    </>
                )}
            </main>
            <aside className="right-sidebar">
                <WeeklyForecast forecast={forecast} />
            </aside>
        </>
    );
}
