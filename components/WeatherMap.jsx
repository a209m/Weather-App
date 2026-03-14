"use client";

import React, { useEffect, useRef } from 'react';
import { Cloud, Sun, CloudRain, Snowflake, CloudLightning } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

const iconMap = {
    '01': { icon: Sun, color: '#FDB813' },
    '02': { icon: Cloud, color: '#9399A2' },
    '03': { icon: Cloud, color: '#9399A2' },
    '04': { icon: Cloud, color: '#9399A2' },
    '09': { icon: CloudRain, color: '#0095FF' },
    '10': { icon: CloudRain, color: '#0095FF' },
    '11': { icon: CloudLightning, color: '#0095FF' },
    '13': { icon: Snowflake, color: '#FFFFFF' },
    '50': { icon: Cloud, color: '#9399A2' },
};

export default function WeatherMap({ cities, focusedCity }) {
    const mapRef = useRef(null);
    const leafletMap = useRef(null);

    useEffect(() => {
        if (focusedCity && leafletMap.current) {
            leafletMap.current.setView([focusedCity.lat, focusedCity.lon], 10, {
                animate: true,
                duration: 1
            });
        }
    }, [focusedCity]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Initialize Leaftlet
        const initMap = async () => {
            const L = (await import('leaflet')).default;

            if (!leafletMap.current && mapRef.current) {
                leafletMap.current = L.map(mapRef.current, {
                    zoomControl: false,
                    attributionControl: false
                }).setView([40.4637, -3.7492], 6);

                L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                    maxZoom: 19,
                }).addTo(leafletMap.current);

                L.control.zoom({ position: 'bottomright' }).addTo(leafletMap.current);
            }

            // Clear existing markers
            leafletMap.current.eachLayer((layer) => {
                if (layer instanceof L.Marker) {
                    leafletMap.current.removeLayer(layer);
                }
            });

            // Add markers
            if (cities && cities.length > 0) {
                const markers = [];
                cities.forEach(city => {
                    const iconCode = city.weather[0].icon.substring(0, 2);
                    const iconData = iconMap[iconCode] || { icon: Cloud, color: '#9399A2' };
                    const IconComponent = iconData.icon;

                    const markerHtml = renderToStaticMarkup(
                        <div className="custom-map-marker">
                            <div className="marker-city">{city.name}</div>
                            <div className="marker-icon">
                                <IconComponent color={iconData.color} size={20} />
                            </div>
                            <div className="marker-temp">{Math.round(city.main.temp)}&deg;</div>
                        </div>
                    );

                    const customIcon = L.divIcon({
                        className: 'clear-standard-marker',
                        html: markerHtml,
                        iconSize: [100, 120],
                        iconAnchor: [50, 60]
                    });

                    const marker = L.marker([city.coord.lat, city.coord.lon], { icon: customIcon }).addTo(leafletMap.current);
                    markers.push([city.coord.lat, city.coord.lon]);
                });

                if (markers.length > 1) {
                    leafletMap.current.fitBounds(markers, { padding: [50, 50] });
                } else if (markers.length === 1) {
                    leafletMap.current.setView(markers[0], 8);
                }
            }
        };

        initMap();

        return () => {
            /* Cleanup if needed */
        };
    }, [cities]);

    return <div ref={mapRef} className="map-container" />;
}
