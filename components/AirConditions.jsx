"use client";

import React from 'react';
import { useWeather } from '@/lib/context';
import { Thermometer, Wind, Gauge, Cloud } from 'lucide-react';

export default function AirConditions({ weather }) {
    const { settings } = useWeather();

    if (!weather) return null;

    const feelsLike = settings.temp_unit === 'fahrenheit'
        ? Math.round((weather.main.feels_like * 9 / 5) + 32)
        : Math.round(weather.main.feels_like);

    const windSpeed = settings.wind_unit === 'kmh'
        ? `${(weather.wind.speed * 3.6).toFixed(1)} km/h`
        : settings.wind_unit === 'knots'
            ? `${(weather.wind.speed * 1.94).toFixed(1)} kn`
            : `${weather.wind.speed.toFixed(1)} m/s`;

    const conditions = [
        { label: 'Real Feel', value: `${feelsLike}°`, icon: <Thermometer /> },
        { label: 'Wind', value: windSpeed, icon: <Wind /> },
        { label: 'Pressure', value: `${weather.main.pressure} hPa`, icon: <Gauge /> },
        { label: 'Cloudiness', value: `${weather.clouds.all}%`, icon: <Cloud /> },
    ];

    return (
        <div className="air-conditions">
            <div className="air-header">
                <h2 className="section-title">AIR CONDITIONS</h2>
            </div>
            <div className="air-grid">
                {conditions.map((item, index) => (
                    <div key={index} className="air-item">
                        {item.icon}
                        <div className="air-data">
                            <label>{item.label}</label>
                            <div className="value">{item.value}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
