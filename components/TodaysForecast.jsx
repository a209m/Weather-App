"use client";

import React from 'react';
import { useWeather } from '@/lib/context';
import { Cloud, Sun, CloudRain, Snowflake, CloudLightning } from 'lucide-react';

const iconMap = {
    '01': Sun,
    '02': Cloud,
    '03': Cloud,
    '04': Cloud,
    '09': CloudRain,
    '10': CloudRain,
    '11': CloudLightning,
    '13': Snowflake,
    '50': Cloud,
};

export default function TodaysForecast({ forecast }) {
    const { settings } = useWeather();

    if (!forecast) return null;

    const hourlyItems = forecast.list.slice(0, 6).map(item => {
        const date = new Date(item.dt * 1000);
        const time = date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: settings.time_format_12h
        });

        const iconCode = item.weather[0].icon.substring(0, 2);
        const IconComponent = iconMap[iconCode] || Cloud;

        const temp = settings.temp_unit === 'fahrenheit'
            ? Math.round((item.main.temp * 9 / 5) + 32)
            : Math.round(item.main.temp);

        return { time, IconComponent, temp, iconCode };
    });

    return (
        <div className="todays-forecast">
            <h2 className="section-title">TODAY'S FORECAST</h2>
            <div className="forecast-scroller">
                {hourlyItems.map((item, index) => (
                    <React.Fragment key={index}>
                        <div className={`hourly-item ${['09', '10', '11'].includes(item.iconCode) ? 'rain' : (['01', '02'].includes(item.iconCode) ? 'sun' : 'cloud')}`}>
                            <span className="time">{item.time}</span>
                            <item.IconComponent size={32} />
                            <span className="temp">{item.temp}&deg;</span>
                        </div>
                        {index < hourlyItems.length - 1 && <div className="vertical-divider" />}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
