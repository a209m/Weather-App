"use client";

import React from 'react';
import { useWeather } from '@/lib/context';
import { Github, Facebook, Linkedin, Mail } from 'lucide-react';

export default function Settings() {
    const { settings, updateSettings } = useWeather();

    const handleToggle = (key) => {
        updateSettings({ [key]: !settings[key] });
    };

    const handleSegmentClick = (key, value) => {
        updateSettings({ [key]: value });
    };

    return (
        <main className="main-content">
            <div className="settings-content">
                {/* Units Section */}
                <div className="settings-section">
                    <h2>Units</h2>
                    <div className="settings-card">
                        {/* Temperature */}
                        <div className="unit-group">
                            <label>Temperature</label>
                            <div className="segmented-control">
                                <div
                                    className={`segment-btn ${settings.temp_unit === 'celsius' ? 'active' : ''}`}
                                    onClick={() => handleSegmentClick('temp_unit', 'celsius')}
                                >
                                    Celsius
                                </div>
                                <div
                                    className={`segment-btn ${settings.temp_unit === 'fahrenheit' ? 'active' : ''}`}
                                    onClick={() => handleSegmentClick('temp_unit', 'fahrenheit')}
                                >
                                    Fahrenheit
                                </div>
                            </div>
                        </div>

                        {/* Wind Speed */}
                        <div className="unit-group">
                            <label>Wind Speed</label>
                            <div className="segmented-control">
                                <div
                                    className={`segment-btn ${settings.wind_unit === 'kmh' ? 'active' : ''}`}
                                    onClick={() => handleSegmentClick('wind_unit', 'kmh')}
                                >
                                    km/h
                                </div>
                                <div
                                    className={`segment-btn ${settings.wind_unit === 'ms' ? 'active' : ''}`}
                                    onClick={() => handleSegmentClick('wind_unit', 'ms')}
                                >
                                    m/s
                                </div>
                                <div
                                    className={`segment-btn ${settings.wind_unit === 'knots' ? 'active' : ''}`}
                                    onClick={() => handleSegmentClick('wind_unit', 'knots')}
                                >
                                    Knots
                                </div>
                            </div>
                        </div>

                        {/* Pressure */}
                        <div className="unit-group">
                            <label>Pressure</label>
                            <div className="segmented-control">
                                <div
                                    className={`segment-btn ${settings.pressure_unit === 'hpa' ? 'active' : ''}`}
                                    onClick={() => handleSegmentClick('pressure_unit', 'hpa')}
                                >
                                    hPa
                                </div>
                                <div
                                    className={`segment-btn ${settings.pressure_unit === 'inches' ? 'active' : ''}`}
                                    onClick={() => handleSegmentClick('pressure_unit', 'inches')}
                                >
                                    Inches
                                </div>
                                <div
                                    className={`segment-btn ${settings.pressure_unit === 'kpa' ? 'active' : ''}`}
                                    onClick={() => handleSegmentClick('pressure_unit', 'kpa')}
                                >
                                    kPa
                                </div>
                                <div
                                    className={`segment-btn ${settings.pressure_unit === 'mm' ? 'active' : ''}`}
                                    onClick={() => handleSegmentClick('pressure_unit', 'mm')}
                                >
                                    mm
                                </div>
                            </div>
                        </div>

                        {/* Precipitation */}
                        <div className="unit-group">
                            <label>Precipitation</label>
                            <div className="segmented-control">
                                <div
                                    className={`segment-btn ${settings.precip_unit === 'mm' ? 'active' : ''}`}
                                    onClick={() => handleSegmentClick('precip_unit', 'mm')}
                                >
                                    Millimeters
                                </div>
                                <div
                                    className={`segment-btn ${settings.precip_unit === 'inches' ? 'active' : ''}`}
                                    onClick={() => handleSegmentClick('precip_unit', 'inches')}
                                >
                                    Inches
                                </div>
                            </div>
                        </div>

                        {/* Distance */}
                        <div className="unit-group">
                            <label>Distance</label>
                            <div className="segmented-control">
                                <div
                                    className={`segment-btn ${settings.dist_unit === 'km' ? 'active' : ''}`}
                                    onClick={() => handleSegmentClick('dist_unit', 'km')}
                                >
                                    Kilometers
                                </div>
                                <div
                                    className={`segment-btn ${settings.dist_unit === 'miles' ? 'active' : ''}`}
                                    onClick={() => handleSegmentClick('dist_unit', 'miles')}
                                >
                                    Miles
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* General Section */}
                <div className="settings-section">
                    <h2>General</h2>
                    <div className="settings-card">
                        <div className="setting-item">
                            <div className="setting-info">
                                <h3>12-Hour Time</h3>
                            </div>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={settings.time_format_12h}
                                    onChange={() => handleToggle('time_format_12h')}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className="setting-item">
                            <div className="setting-info">
                                <h3>Location</h3>
                                <p>Get weather of your location</p>
                            </div>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={settings.location_enabled}
                                    onChange={() => handleToggle('location_enabled')}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Social Media Section */}
                <div className="settings-section">
                    <h2>Connect with me</h2>
                    <div className="settings-card social-links">
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-item github">
                            <Github />
                            <span>GitHub</span>
                        </a>
                        <a href="https://www.facebook.com/share/1HjR1W3Wt2/" target="_blank" rel="noopener noreferrer" className="social-item facebook">
                            <Facebook />
                            <span>Facebook</span>
                        </a>
                        <a href="https://www.linkedin.com/in/a209m?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" className="social-item linkedin">
                            <Linkedin />
                            <span>LinkedIn</span>
                        </a>
                        <a href="mailto:amrmansour217@gmail.com" className="social-item gmail">
                            <Mail />
                            <span>Gmail</span>
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
}
