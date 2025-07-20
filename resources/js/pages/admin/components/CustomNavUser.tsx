import React, { useState, useRef, useEffect } from 'react';
import { Settings, LogOut, ChevronDown, User, Shield } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { type SharedData } from '@/types';

interface CustomNavUserProps {
    isCollapsed: boolean;
}

export const CustomNavUser: React.FC<CustomNavUserProps> = ({ isCollapsed }) => {
    const { auth } = usePage<SharedData>().props;
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!auth.user) return null;

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleLogout = () => {
        setIsOpen(false);
        router.post('/logout');
    };

    if (isCollapsed) {
        return (
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-center rounded-2xl font-medium transition-all duration-300 text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:shadow-lg group transform hover:scale-[1.02] px-3 py-4 relative"
                    title={auth.user.name}
                >
                    <div className="relative">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-lg">
                            {getInitials(auth.user.name)}
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
                    </div>
                </button>

                {isOpen && (
                    <div className="absolute left-full bottom-0 ml-2 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 min-w-64 z-50 animate-in slide-in-from-left-2 duration-200">
                        <div className="px-4 py-4 border-b border-gray-100">
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-lg">
                                        {getInitials(auth.user.name)}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-gray-900 text-sm">{auth.user.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{auth.user.email}</p>
                                    <div className="flex items-center space-x-1 mt-1">
                                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                        <span className="text-xs text-green-600 font-medium">Online</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="py-2">
                            <button
                                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-blue-50 transition-all duration-200 group"
                                onClick={() => setIsOpen(false)}
                            >
                                <User className="w-4 h-4 group-hover:text-blue-600" />
                                <span className="text-sm font-medium">Profile</span>
                            </button>
                            <button
                                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-purple-50 transition-all duration-200 group"
                                onClick={() => setIsOpen(false)}
                            >
                                <Settings className="w-4 h-4 group-hover:text-purple-600" />
                                <span className="text-sm font-medium">Settings</span>
                            </button>
                        </div>
                        <div className="border-t border-gray-100 pt-2">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 group"
                            >
                                <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`${
                    isCollapsed ? 'flex justify-center' : 'flex items-center space-x-3'
                } w-full p-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 group hover:shadow-lg ${isOpen ? 'from-blue-50 to-blue-100 border-blue-300 shadow-lg' : ''}`}
            >
                <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg transition-all duration-300">
                        <span className="text-white font-semibold text-sm">{getInitials(auth.user.name)}</span>
                    </div>
                    {/* Online indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                </div>
                {!isCollapsed && (
                    <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-900 transition-colors duration-300">
                            {auth.user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate group-hover:text-blue-600 transition-colors duration-300">
                            {auth.user.email}
                        </p>
                    </div>
                )}
                {!isCollapsed && (
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                )}
            </button>

            {isOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-50 animate-in slide-in-from-bottom-2 duration-200">
                    <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Shield className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-bold text-gray-900">Admin Panel</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-xs text-green-600 font-medium">Active</span>
                            </div>
                        </div>
                    </div>
                    <div className="py-2">
                        <button
                            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-blue-50 transition-all duration-200 group"
                            onClick={() => setIsOpen(false)}
                        >
                            <User className="w-4 h-4 group-hover:text-blue-600 transition-colors" />
                            <span className="text-sm font-medium">Profile</span>
                        </button>
                        <button
                            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-purple-50 transition-all duration-200 group"
                            onClick={() => setIsOpen(false)}
                        >
                            <Settings className="w-4 h-4 group-hover:text-purple-600 transition-colors" />
                            <span className="text-sm font-medium">Settings</span>
                        </button>
                    </div>
                    <div className="border-t border-gray-100 pt-2">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 group"
                        >
                            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
