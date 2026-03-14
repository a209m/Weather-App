"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function StatusBar() {
    const [times, setTimes] = useState({
        london: "",
        newYork: "",
        hongKong: "",
    });

    useEffect(() => {
        const updateTimes = () => {
            const now = new Date();
            const options = { hour: "numeric", minute: "2-digit", hour12: true };

            setTimes({
                london: new Intl.DateTimeFormat("en-GB", {
                    timeZone: "Europe/London",
                    ...options,
                }).format(now),
                newYork: new Intl.DateTimeFormat("en-US", {
                    timeZone: "America/New_York",
                    ...options,
                }).format(now),
                hongKong: new Intl.DateTimeFormat("en-HK", {
                    timeZone: "Asia/Hong_Kong",
                    ...options,
                }).format(now),
            });
        };

        updateTimes();
        const interval = setInterval(updateTimes, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="status-bar">
            <div className="close-btn">
                <X size={16} />
            </div>
            <div className="clock">
                <span className="flag">🇬🇧</span>
                <span>{times.london}</span>
            </div>
            <div className="clock">
                <span className="flag">🇺🇸</span>
                <span>{times.newYork}</span>
            </div>
            <div className="clock">
                <span className="flag">🇭🇰</span>
                <span>{times.hongKong}</span>
            </div>
        </div>
    );
}
