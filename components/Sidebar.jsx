"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wind, CloudSunRain, LayoutList, Map, Sliders } from "lucide-react";

export default function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { name: "Weather", icon: <CloudSunRain size={26} />, path: "/" },
        { name: "Cities", icon: <LayoutList size={26} />, path: "/cities" },
        { name: "Map", icon: <Map size={26} />, path: "/map" },
        { name: "Settings", icon: <Sliders size={26} />, path: "/settings" },
    ];

    return (
        <nav className="sidebar">
            <div className="logo">
                <Wind size={38} />
            </div>
            <ul className="nav-links">
                {navItems.map((item) => (
                    <li key={item.path} className={pathname === item.path ? "active" : ""}>
                        <Link href={item.path} className="nav-item-link">
                            {item.icon}
                            <span>{item.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
