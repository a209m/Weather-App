"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const WeatherContext = createContext();

export function WeatherProvider({ children }) {
    const [settings, setSettings] = useState({
        temp_unit: 'celsius',
        wind_unit: 'kmh',
        pressure_unit: 'hpa',
        precip_unit: 'mm',
        dist_unit: 'km',
        time_format_12h: true,
        location_enabled: true
    });

    const [activeCity, setActiveCity] = useState('Madrid');
    const [savedCities, setSavedCities] = useState(["Madrid", "Vienna", "Athens"]);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Load from localStorage
        try {
            const storedSettings = localStorage.getItem('weather_settings');
            if (storedSettings) setSettings(JSON.parse(storedSettings));

            const storedCity = localStorage.getItem('active_city');
            if (storedCity) setActiveCity(storedCity);

            const storedCities = localStorage.getItem('saved_cities');
            if (storedCities) {
                const parsed = JSON.parse(storedCities);
                // Sanitize: only keep valid non-empty strings, cap at 6
                const clean = Array.isArray(parsed)
                    ? parsed.filter(c => typeof c === 'string' && c.trim().length > 0).slice(0, 6)
                    : [];
                setSavedCities(clean.length > 0 ? clean : ["Madrid", "Vienna", "Athens"]);
            }
        } catch (e) {
            console.error("Failed to parse settings from localStorage", e);
        }
    }, []);


    const updateSettings = (newSettings) => {
        const updated = { ...settings, ...newSettings };
        setSettings(updated);
        localStorage.setItem('weather_settings', JSON.stringify(updated));
    };

    const updateActiveCity = (city) => {
        setActiveCity(city);
        localStorage.setItem('active_city', city);

        // update saved cities list (persist like the original logic)
        setSavedCities(prev => {
            const filtered = prev.filter(c => c.toLowerCase() !== city.toLowerCase());
            const updated = [city, ...filtered].slice(0, 6);
            localStorage.setItem('saved_cities', JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <WeatherContext.Provider value={{ settings, updateSettings, activeCity, updateActiveCity, savedCities }}>
            {children}
        </WeatherContext.Provider>
    );
}

export function useWeather() {
    return useContext(WeatherContext);
}
