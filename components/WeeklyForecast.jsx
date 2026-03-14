"use client";

import React from 'react';
import { useWeather } from '@/lib/context';
import { Cloud, Sun, CloudRain, Snowflake, CloudLightning } from 'lucide-react';

const iconMap = {
    '01': { icon: Sun, status: 'Sunny', color: '#FDB813' },
    '02': { icon: Cloud, status: 'Partly Cloudy', color: '#9399A2' },
    '03': { icon: Cloud, status: 'Cloudy', color: '#9399A2' },
    '04': { icon: Cloud, status: 'Cloudy', color: '#9399A2' },
    '09': { icon: CloudRain, status: 'Rainy', color: '#0095FF' },
    '10': { icon: CloudRain, status: 'Rainy', color: '#0095FF' },
    '11': { icon: CloudLightning, status: 'Stormy', color: '#0095FF' },
    '13': { icon: Snowflake, status: 'Snowy', color: '#9399A2' },
    '50': { icon: Cloud, status: 'Misty', color: '#9399A2' },
};

export default function WeeklyForecast({ forecast }) {
    const { settings } = useWeather();

    if (!forecast) return null;

    // Group by day
    const dailyData = {};
    forecast.list.forEach(item => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!dailyData[date]) {
            dailyData[date] = {
                high: item.main.temp_max,
                low: item.main.temp_min,
                icon: item.weather[0].icon.substring(0, 2),
                dt: item.dt
            };
        } else {
            dailyData[date].high = Math.max(dailyData[date].high, item.main.temp_max);
            dailyData[date].low = Math.min(dailyData[date].low, item.main.temp_min);
        }
    });

    const weeklyItems = Object.values(dailyData).map((data, index) => {
        const date = new Date(data.dt * 1000);
        const dayName = index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
        const info = iconMap[data.icon] || { icon: Cloud, status: 'Cloudy', color: '#9399A2' };

        const high = settings.temp_unit === 'fahrenheit' ? Math.round((data.high * 9 / 5) + 32) : Math.round(data.high);
        const low = settings.temp_unit === 'fahrenheit' ? Math.round((data.low * 9 / 5) + 32) : Math.round(data.low);

        return { dayName, ...info, high, low };
    });

    return (
        <div className="weekly-forecast">
            <h2 className="section-title">5-DAY FORECAST</h2>
            <ul className="forecast-list">
                {weeklyItems.map((item, index) => (
                    <li key={index} className="day-item">
                        <span className="day-name">{item.dayName}</span>
                        <div className="day-icon">
                            <item.icon size={24} style={{ color: item.color }} />
                            <span className="status">{item.status}</span>
                        </div>
                        <div className="day-temp">
                            {item.high}&deg; <span>/{item.low}&deg;</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
