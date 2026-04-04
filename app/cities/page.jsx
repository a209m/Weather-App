"use client";

import React, { useState, useEffect } from "react";
import { useWeather } from "@/lib/context";
import { getWeatherData, getForecastData } from "@/lib/weather";
import SearchBar from "@/components/SearchBar";
import { Cloud, Sun, CloudRain, Snowflake, CloudLightning, MapPin } from 'lucide-react';

const iconMap = {
    '01': { icon: Sun, color: '#FDB813', status: 'Sunny' },
    '02': { icon: Cloud, color: '#9399A2', status: 'Cloudy' },
    '03': { icon: Cloud, color: '#9399A2', status: 'Cloudy' },
    '04': { icon: Cloud, color: '#9399A2', status: 'Cloudy' },
    '09': { icon: CloudRain, color: '#0095FF', status: 'Rainy' },
    '10': { icon: CloudRain, color: '#0095FF', status: 'Rainy' },
    '11': { icon: CloudLightning, color: '#0095FF', status: 'Stormy' },
    '13': { icon: Snowflake, color: '#FFFFFF', status: 'Snowy' },
    '50': { icon: Cloud, color: '#9399A2', status: 'Misty' },
};

export default function Cities() {
    const { savedCities, activeCity, updateActiveCity, settings } = useWeather();
    const [citiesWeather, setCitiesWeather] = useState([]);
    const [selectedWeather, setSelectedWeather] = useState(null);
    const [selectedForecast, setSelectedForecast] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAllCities() {
            setLoading(true);

            // Guard: filter out any null/undefined/empty city names
            const validCities = savedCities.filter(name => typeof name === 'string' && name.trim().length > 0);

            const weatherPromises = validCities.map(name =>
                getWeatherData(name).catch(() => ({ data: null, error: 'failed' }))
            );
            const responses = await Promise.all(weatherPromises);
            const data = responses.filter(r => r.data).map(r => r.data);
            setCitiesWeather(data);

            const selected = data.find(c => c.name.toLowerCase() === activeCity.toLowerCase()) || data[0];
            if (selected) {
                setSelectedWeather(selected);
                const f = await getForecastData(selected.name).catch(() => ({ data: null }));
                setSelectedForecast(f?.data || null);
            }
            setLoading(false);
        }
        fetchAllCities();
    }, [savedCities, activeCity]);

    const convertTemp = (c) => settings.temp_unit === 'fahrenheit' ? Math.round((c * 9 / 5) + 32) : Math.round(c);

    if (loading) {
        return (
            <main className="main-content">
                <div className="loading-wrapper">
                    <span className="loader"></span>
                    <span className="loading-text">Loading Cities</span>
                </div>
            </main>
        );
    }

    return (
        <main className="main-content">
            <SearchBar />

            <div className="cities-layout">
                {/* Left Column: Cities List */}
                <div className="cities-list-section">
                    {citiesWeather.map((city, index) => {
                        const iconCode = city.weather[0].icon.substring(0, 2);
                        const { icon: Icon, color } = iconMap[iconCode] || { icon: Cloud, color: '#9399A2' };
                        const isActive = activeCity.toLowerCase() === city.name.toLowerCase();

                        return (
                            <div
                                key={index}
                                className={`city-card-new ${isActive ? 'active' : ''}`}
                                onClick={() => updateActiveCity(city.name)}
                            >
                                <div className="city-card-left" style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                                    <Icon size={36} color={color} />
                                    <div className="city-info">
                                        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {city.name}
                                            {isActive && <MapPin size={12} style={{ transform: 'rotate(-45deg)', color: '#FFF' }} />}
                                        </h3>
                                        <div className="time" style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                                            {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false })}
                                        </div>
                                    </div>
                                </div>
                                <div className="city-temp" style={{ fontSize: '30px', fontWeight: '700' }}>
                                    {convertTemp(city.main.temp)}&deg;
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Right Column: Details */}
                <div className="city-detail-section">
                    {selectedWeather && (
                        <>
                            <div className="detail-main">
                                <div className="detail-name-section">
                                    <h2 style={{ fontSize: '28px', fontWeight: '700' }}>{selectedWeather.name}</h2>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Humidity: {selectedWeather.main.humidity}%</p>
                                    <div className="big-temp" style={{ fontSize: '52px', fontWeight: '700', marginTop: '12px' }}>
                                        {convertTemp(selectedWeather.main.temp)}&deg;
                                    </div>
                                </div>
                                <div className="detail-icon-section">
                                    {(() => {
                                        const iconCode = selectedWeather.weather[0].icon.substring(0, 2);
                                        const { icon: Icon, color } = iconMap[iconCode] || { icon: Cloud, color: '#9399A2' };
                                        return <Icon size={64} color={color} style={{ filter: 'drop-shadow(0 0 15px rgba(253, 184, 19, 0.4))' }} />;
                                    })()}
                                </div>
                            </div>

                            {/* Today's Forecast */}
                            <div className="forecast-section" style={{ marginBottom: '25px' }}>
                                <div className="section-header" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '12px', marginBottom: '16px', color: '#5a6675', fontWeight: '800', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Today's Forecast</div>
                                <div className="mini-forecast-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    {selectedForecast?.list.slice(0, 3).map((item, idx) => {
                                        const iconCode = item.weather[0].icon.substring(0, 2);
                                        const { icon: Icon, color } = iconMap[iconCode] || { icon: Cloud, color: '#9399A2' };
                                        return (
                                            <div key={idx} className="mini-forecast-item" style={{ textAlign: 'center' }}>
                                                <div className="m-time" style={{ fontSize: '11px', fontWeight: '700', color: '#5a6675' }}>
                                                    {new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                                                </div>
                                                <Icon size={22} color={color} style={{ margin: '10px 0' }} />
                                                <div className="m-temp" style={{ fontSize: '16px', fontWeight: '700' }}>{convertTemp(item.main.temp)}&deg;</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 3-Day Forecast */}
                            <div className="forecast-section">
                                <div className="section-header" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '12px', marginBottom: '16px', color: '#5a6675', fontWeight: '800', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>3-Day Forecast</div>
                                <ul className="daily-list" style={{ listStyle: 'none' }}>
                                    {(() => {
                                        const daily = [];
                                        selectedForecast?.list.forEach(item => {
                                            const d = new Date(item.dt * 1000).toDateString();
                                            if (!daily.find(x => x.day === d)) {
                                                daily.push({ day: d, high: item.main.temp_max, low: item.main.temp_min, icon: item.weather[0].icon.substring(0, 2) });
                                            } else {
                                                const existing = daily.find(x => x.day === d);
                                                existing.high = Math.max(existing.high, item.main.temp_max);
                                                existing.low = Math.min(existing.low, item.main.temp_min);
                                            }
                                        });
                                        return daily.slice(0, 3).map((d, i) => {
                                            const dayLabel = i === 0 ? 'Today' : (i === 1 ? 'Tomorrow' : new Date(d.day).toLocaleDateString('en-US', { weekday: 'short' }));
                                            const { icon: Icon, color, status } = iconMap[d.icon] || { icon: Cloud, color: '#9399A2', status: 'Cloudy' };
                                            return (
                                                <li key={i} className="daily-item-new" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                    <div className="daily-day" style={{ color: 'var(--text-muted)', fontSize: '12px', width: '65px' }}>{dayLabel}</div>
                                                    <div className="daily-status" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '600', fontSize: '13px' }}>
                                                        <Icon size={18} color={color} />
                                                        {status}
                                                    </div>
                                                    <div className="daily-temp-range" style={{ fontWeight: '700', fontSize: '13px', color: '#7d8999' }}>
                                                        <span style={{ color: 'var(--text-main)' }}>{convertTemp(d.high)}</span>/{convertTemp(d.low)}
                                                    </div>
                                                </li>
                                            );
                                        });
                                    })()}
                                </ul>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
