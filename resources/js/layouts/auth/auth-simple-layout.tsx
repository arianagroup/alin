import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren, useState, useEffect } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Enhanced Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>

            {/* Animated floating orbs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-400/10 to-orange-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-indigo-400/5 to-cyan-400/5 rounded-full blur-3xl animate-pulse delay-2000"></div>

            {/* Additional floating elements */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-emerald-400/8 to-teal-400/8 rounded-full blur-2xl animate-pulse delay-500"></div>
            <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-gradient-to-br from-violet-400/8 to-fuchsia-400/8 rounded-full blur-2xl animate-pulse delay-1500"></div>

            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent animate-pulse opacity-50"></div>

            {/* Main Content */}
            <div className={`relative w-full max-w-md transition-all duration-1000 ${
                isLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
            }`}>
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
                    {/* Card glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 rounded-3xl"></div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl blur-lg opacity-50"></div>

                    {/* Animated border effect */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 p-[1px] animate-pulse">
                        <div className="h-full w-full rounded-3xl bg-white/80 backdrop-blur-xl"></div>
                    </div>

                    <div className="relative flex flex-col gap-8">
                        <div className={`flex flex-col items-center gap-6 transition-all duration-700 delay-200 ${
                            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}>
                            <Link href={route('home')} className="flex flex-col items-center gap-3 font-medium group">
                                <div className="relative">
                                    {/* Enhanced logo glow effects dengan warna yang lebih cerah */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 to-emerald-400/30 rounded-full blur-xl animate-pulse"></div>
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-emerald-400/20 rounded-full blur-lg animate-pulse delay-500"></div>
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/10 to-emerald-300/10 rounded-full blur-2xl animate-pulse delay-1000"></div>

                                    {/* Logo dengan enhanced animations */}
                                    <div className="relative group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 animate-bounce hover:animate-none">
                                        {/* Inner glow effect around logo */}
                                        <div className="absolute inset-2 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>

                                        <AppLogoIcon
                                            size={64}
                                            className="relative z-10 transition-all duration-300 group-hover:scale-105 drop-shadow-lg"
                                        />

                                        {/* Floating shimmer effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-500"></div>
                                    </div>

                                    {/* Enhanced sparkle effects */}
                                    <div className="absolute -top-2 -right-2 w-3 h-3 bg-cyan-200 rounded-full animate-ping shadow-lg shadow-cyan-200/50"></div>
                                    <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-emerald-200 rounded-full animate-ping delay-700 shadow-lg shadow-emerald-200/50"></div>
                                    <div className="absolute top-1 -left-3 w-1.5 h-1.5 bg-white rounded-full animate-ping delay-300"></div>
                                    <div className="absolute -top-3 left-1 w-1 h-1 bg-cyan-100 rounded-full animate-ping delay-1200"></div>

                                    {/* Multiple orbital rings dengan warna yang sesuai */}
                                    <div className="absolute inset-0 w-16 h-16 border border-cyan-300/40 rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
                                    <div className="absolute inset-1 w-14 h-14 border border-emerald-300/30 rounded-full animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}></div>
                                    <div className="absolute inset-2 w-12 h-12 border border-cyan-200/20 rounded-full animate-spin" style={{ animationDuration: '10s' }}></div>

                                    {/* Breathing glow effect */}
                                    <div className="absolute inset-0 w-20 h-20 -m-2 border-2 border-cyan-300/20 rounded-full animate-pulse" style={{ animationDuration: '3s' }}></div>
                                    <div className="absolute inset-0 w-24 h-24 -m-4 border border-emerald-300/10 rounded-full animate-pulse delay-1000" style={{ animationDuration: '4s' }}></div>
                                </div>
                                <span className="sr-only">{title}</span>
                            </Link>

                            <div className={`space-y-4 text-center transition-all duration-700 delay-400 ${
                                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                            }`}>
                                {/* Enhanced title with better gradient */}
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent relative">
                                    {title}
                                    {/* Subtle text glow */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent blur-sm opacity-50 -z-10">
                                        {title}
                                    </div>
                                </h1>

                                {/* Enhanced description */}
                                <div className="text-gray-600 font-medium relative">
                                    {description}
                                    {/* Decorative elements */}
                                    <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                                    <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-500"></div>
                                </div>
                            </div>
                        </div>

                        {/* Children content with staggered animation */}
                        <div className={`transition-all duration-700 delay-600 ${
                            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}>
                            {children}
                        </div>
                    </div>

                    {/* Bottom decoration */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-b-3xl"></div>
                </div>

                {/* External card effects */}
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-xl opacity-50 animate-pulse -z-10"></div>
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl blur-2xl opacity-30 animate-pulse delay-1000 -z-20"></div>
            </div>

            {/* Floating particles */}
            <div className="absolute top-1/4 left-1/3 w-1 h-1 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
            <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
            <div className="absolute top-1/2 left-1/4 w-0.5 h-0.5 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '2.5s' }}></div>
            <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3.5s' }}></div>
        </div>
    );
}
