import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, User, X, History, LogOut } from 'lucide-react';
import Logo from '../../../components/ui/Logo';
import { Link } from '@inertiajs/react';

const Header: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    // Close profile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    return (
        <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo Section */}
                    <Logo size="medium" />


                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                        {/* Notification */}
                        <button className="hidden sm:flex p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all">
                            <Bell className="h-5 w-5" />
                        </button>

                        {/* User Profile */}
                        <div
                            className="hidden sm:block relative"
                            ref={profileRef}
                            onMouseEnter={() => setProfileMenuOpen(true)}
                            onMouseLeave={() => setProfileMenuOpen(false)}
                        >
                            <button
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                            >
                                <User className="h-5 w-5" />
                            </button>

                            {/* Profile Dropdown with Animation */}
                            <div
                                className={`absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 transform transition-all duration-300 origin-top-right ${profileMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                            >
                                {/* Arrow */}
                                <div className="absolute -top-2 right-4 w-4 h-4 bg-white transform rotate-45 border-t border-l border-gray-100"></div>

                                <div className="p-3 relative z-10 bg-white rounded-xl">
                                    <Link
                                        href="/profile"
                                        className="flex items-center space-x-3 p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-lg transition-all group"
                                    >
                                        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                                            <User className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <span className="font-medium">Profile</span>
                                    </Link>
                                    <Link
                                        href="/pelanggan/reservations"
                                        className="flex items-center space-x-3 p-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-lg transition-all group"
                                    >
                                        <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                                            <History className="h-4 w-4 text-purple-600" />
                                        </div>
                                        <span className="font-medium">Riwayat</span>
                                    </Link>
                                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-2"></div>
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="flex items-center space-x-3 p-3 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 rounded-lg transition-all w-full text-left group"
                                    >
                                        <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                                            <LogOut className="h-4 w-4 text-red-600" />
                                        </div>
                                        <span className="font-medium">Logout</span>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                        >
                            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>

                        {/* Mobile Menu Dropdown with Animation */}
                        <div
                            className={`absolute top-16 right-0 left-0 bg-white shadow-lg border-t border-gray-100 md:hidden z-50 transform transition-all duration-300 origin-top ${mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
                        >
                            <div className="p-3">
                                <Link
                                    href="/profile"
                                    className="flex items-center space-x-3 p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-lg transition-all group"
                                >
                                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                                        <User className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <span className="font-medium">Profile</span>
                                </Link>
                                <Link
                                    href="/pelanggan/reservations"
                                    className="flex items-center space-x-3 p-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-lg transition-all group"
                                >
                                    <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                                        <History className="h-4 w-4 text-purple-600" />
                                    </div>
                                    <span className="font-medium">Riwayat</span>
                                </Link>
                                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-2"></div>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="flex items-center space-x-3 p-3 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 rounded-lg transition-all w-full text-left group"
                                >
                                    <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                                        <LogOut className="h-4 w-4 text-red-600" />
                                    </div>
                                    <span className="font-medium">Logout</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
