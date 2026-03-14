"use client";

import React, { useState } from 'react';
import { Search, Loader } from 'lucide-react';
import { useWeather } from '@/lib/context';
import { getWeatherData } from '@/lib/weather';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('idle'); // idle | loading | error
    const { updateActiveCity } = useWeather();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmed = query.trim();
        if (!trimmed) return;

        setStatus('loading');
        const result = await getWeatherData(trimmed);

        if (result.data) {
            // Use the canonical city name returned by the API
            updateActiveCity(result.data.name);
            setQuery('');
            setStatus('idle');
        } else {
            // City not found - show error shake
            setStatus('error');
            setTimeout(() => setStatus('idle'), 1500);
        }
    };

    return (
        <form
            className={`search-bar ${status === 'error' ? 'search-bar--error' : ''}`}
            onSubmit={handleSubmit}
        >
            <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                {status === 'loading'
                    ? <Loader size={18} style={{ animation: 'rotation 1s linear infinite', color: 'var(--text-blue)' }} />
                    : <Search size={18} style={{ color: status === 'error' ? '#ff6b6b' : 'var(--text-muted)' }} />
                }
            </button>
            <input
                type="text"
                placeholder={status === 'error' ? 'City not found – try again' : 'Search for cities'}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ color: status === 'error' ? '#ff6b6b' : undefined }}
            />
        </form>
    );
}
