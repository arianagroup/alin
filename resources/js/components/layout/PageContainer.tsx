import React from 'react';

interface PageContainerProps {
    children: React.ReactNode;
    className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children, className = '' }) => {
    return (
        <div className={`space-y-6 animate-fadeIn ${className}`}>
            {children}
        </div>
    );
};

interface CardProps {
    children: React.ReactNode;
    className?: string;
    glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', glass = false }) => {
    const baseClasses = "rounded-2xl shadow-soft transition-smooth";
    const glassClasses = glass ? "glass-card" : "bg-white";
    
    return (
        <div className={`${baseClasses} ${glassClasses} ${className}`}>
            {children}
        </div>
    );
};

interface HeaderProps {
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
    gradient?: boolean;
}

export const PageHeader: React.FC<HeaderProps> = ({ title, subtitle, children, gradient = false }) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
                <h1 className={`text-3xl font-bold ${gradient ? 'gradient-text' : 'text-gray-900'}`}>
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-gray-600 mt-1">{subtitle}</p>
                )}
            </div>
            {children && (
                <div className="flex items-center gap-3">
                    {children}
                </div>
            )}
        </div>
    );
};