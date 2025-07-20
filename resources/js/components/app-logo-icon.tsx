import React from 'react';

interface AppLogoIconProps {
    className?: string;
    size?: number;
}

export default function AppLogoIcon({ className = "", size = 40 }: AppLogoIconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                {/* Brighter turquoise gradient */}
                <linearGradient id="circleGradient" cx="0.3" cy="0.3" r="0.8">
                    <stop offset="0%" stopColor="#00F5C4" />
                    <stop offset="50%" stopColor="#00E6B8" />
                    <stop offset="100%" stopColor="#00D7AA" />
                </linearGradient>

                {/* Subtle shadow */}
                <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.2" floodColor="#000"/>
                </filter>
            </defs>

            {/* Main circle */}
            <circle
                cx="50"
                cy="50"
                r="45"
                fill="url(#circleGradient)"
                filter="url(#dropShadow)"
            />

            {/* Letter N - simple and clean */}
            <g fill="#2C3E50">
                {/* Left vertical line */}
                <rect x="30" y="30" width="6" height="40" />

                {/* Right vertical line */}
                <rect x="64" y="30" width="6" height="40" />

                {/* Diagonal line */}
                <polygon points="36,30 42,30 70,58 70,70 64,70 36,42" />
            </g>
        </svg>
    );
}
