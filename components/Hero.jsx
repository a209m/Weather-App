"use client";

import React from 'react';
import { useWeather } from '@/lib/context';

export default function Hero({ weather }) {
    const { settings } = useWeather();

    if (!weather) return null;

    const temp = settings.temp_unit === 'fahrenheit'
        ? Math.round((weather.main.temp * 9 / 5) + 32)
        : Math.round(weather.main.temp);

    return (
        <div className="hero">
            <div className="hero-left">
                <h1 className="city-name">{weather.name}</h1>
                <p className="chance-rain">Humidity: <span>{weather.main.humidity}%</span></p>
                <div className="temp-display">{temp}&deg;</div>
            </div>
            <div className="hero-right">
                <div className="sun-illustration">
                    <img
                        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                        alt={weather.weather[0].description}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 0 20px rgba(253, 184, 19, 0.4))' }}
                    />
                </div>
            </div>
        </div>
    );
}
