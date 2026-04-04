"use client";

import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import { useWeather } from '@/lib/context';
import { getWeatherData } from '@/lib/weather';
import WeatherMap from '@/components/WeatherMap';

export default function MapPage() {
    const { activeCity } = useWeather();
    const [mapCities, setMapCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [focusedCity, setFocusedCity] = useState(null);

    useEffect(() => {
        async function fetchMapData() {
            setLoading(true);
            const defaultMapCities = ["Bilbao", "Barcelona", "Madrid", "Malaga"];
            const uniqueCities = Array.from(new Set([...defaultMapCities, activeCity]));

            const promises = uniqueCities.map(city => getWeatherData(city));
            const responses = await Promise.all(promises);
            setMapCities(responses.filter(r => r.data).map(r => r.data));
            setLoading(false);
        }
        fetchMapData();
    }, [activeCity]);

    const handleCityClick = (coords) => {
        setFocusedCity({ lat: coords.lat, lon: coords.lon, t: Date.now() });
    };

    return (
        <>
            <main className="main-content">
                <SearchBar />
                <div style={{ flex: 1, minHeight: '600px', width: '100%', position: 'relative' }}>
                    {loading ? (
                        <div className="loading-wrapper" style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)' }}>
                            <span className="loader"></span>
                            <span className="loading-text">Loading Map</span>
                        </div>
                    ) : (
                        <WeatherMap cities={mapCities} focusedCity={focusedCity} />
                    )}
                </div>
            </main>

            <aside className="right-sidebar">
                <h2 className="section-title">CITIES ON MAP</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
                    {mapCities.map((city, index) => {
                        return (
                            <div
                                key={index}
                                className="day-item"
                                onClick={() => handleCityClick(city.coord)}
                                style={{ border: 'none', background: 'var(--bg-card)', padding: '12px 15px', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                            >
                                <div className="day-icon" style={{ gap: '12px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>{city.name}</span>
                                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{city.weather[0].main}</span>
                                    </div>
                                </div>
                                <div className="day-temp" style={{ fontSize: '18px', fontWeight: '800' }}>
                                    {Math.round(city.main.temp)}&deg;
                                </div>
                            </div>
                        )
                    })}
                </div>
            </aside>
        </>
    );
}
