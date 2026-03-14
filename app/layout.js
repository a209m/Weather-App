import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import StatusBar from "@/components/StatusBar";
import { WeatherProvider } from "@/lib/context";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Weather Dashboard",
    description: "Modern Weather Dashboard built with Next.js",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <WeatherProvider>
                    <div className="app-wrapper">
                        <div className="app-container">
                            <Sidebar />
                            {children}
                        </div>
                        <StatusBar />
                    </div>
                </WeatherProvider>
            </body>
        </html>
    );
}
