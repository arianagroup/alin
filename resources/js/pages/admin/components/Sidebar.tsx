import React, { useState, useEffect } from 'react';
import { BarChart3, Calendar, Table, Users, ChevronLeft } from 'lucide-react';
import { CustomNavUser } from './CustomNavUser';
import Logo from '../../../components/ui/Logo';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    isCollapsed?: boolean;
    setIsCollapsed?: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
                                                    activeTab,
                                                    setActiveTab,
                                                    isCollapsed: externalIsCollapsed,
                                                    setIsCollapsed: externalSetIsCollapsed
                                                }) => {
    const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);
    const isCollapsed = externalIsCollapsed ?? internalIsCollapsed;
    const setIsCollapsed = externalSetIsCollapsed ?? setInternalIsCollapsed;

    // Auto-close sidebar after refresh
    useEffect(() => {
        const handlePageRefresh = () => {
            // Set sidebar to expanded state first
            setIsCollapsed(false);

            // Then close it after 1 second
            const timer = setTimeout(() => {
                setIsCollapsed(true);
            }, 1000);

            // Cleanup timer if component unmounts
            return () => clearTimeout(timer);
        };

        // Check if this is a fresh page load/refresh
        const isPageRefresh = performance.navigation?.type === 1 ||
            performance.getEntriesByType('navigation')[0]?.type === 'reload';

        if (isPageRefresh) {
            handlePageRefresh();
        }

        // Alternative approach using sessionStorage to detect refresh
        const wasRefreshed = sessionStorage.getItem('pageRefreshed');
        if (!wasRefreshed) {
            sessionStorage.setItem('pageRefreshed', 'true');
            handlePageRefresh();
        }

    }, [setIsCollapsed]);

    // Alternative approach: Listen for beforeunload to detect refresh
    useEffect(() => {
        const handleBeforeUnload = () => {
            // Mark that page is being refreshed
            localStorage.setItem('sidebarRefreshed', Date.now().toString());
        };

        const handleLoad = () => {
            const refreshTime = localStorage.getItem('sidebarRefreshed');
            if (refreshTime) {
                const timeDiff = Date.now() - parseInt(refreshTime);
                // If less than 5 seconds, consider it a refresh
                if (timeDiff < 5000) {
                    setIsCollapsed(false);
                    setTimeout(() => {
                        setIsCollapsed(true);
                    }, 1000);
                }
                localStorage.removeItem('sidebarRefreshed');
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('load', handleLoad);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('load', handleLoad);
        };
    }, [setIsCollapsed]);

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
        { id: 'reservations', label: 'Reservasi', icon: Calendar },
        { id: 'tables', label: 'Meja', icon: Table },
        { id: 'customers', label: 'Pelanggan', icon: Users }
    ];

    return (
        <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white shadow-xl border-r border-gray-100 h-screen fixed left-0 top-0 z-40 transition-all duration-300`}>
            {/* Header Section */}
            <div className={`${isCollapsed ? 'p-4' : 'p-6'} border-b border-gray-100 relative transition-all duration-300`}>
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-4'}`}>
                    <Logo
                        size="large"
                        showText={!isCollapsed}
                        className={isCollapsed ? '' : 'pr-10'}
                    />
                </div>

                {/* Toggle Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={`absolute transition-all duration-200 ${
                        isCollapsed
                            ? '-right-3 top-1/2 transform -translate-y-1/2 p-1.5 bg-white rounded-full shadow-lg hover:shadow-xl border border-gray-200'
                            : 'top-6 right-6 p-2 rounded-xl hover:bg-gray-100'
                    }`}
                >
                    <ChevronLeft className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {/* Navigation */}
            <nav className={`mt-8 ${isCollapsed ? 'px-2' : 'px-4'} transition-all duration-300`}>
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center rounded-2xl font-medium transition-all duration-300 mb-3 relative group transform hover:scale-[1.02] ${
                                isCollapsed ? 'justify-center px-3 py-4' : 'space-x-4 px-4 py-4'
                            } ${
                                activeTab === tab.id
                                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-md border border-blue-200'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:shadow-lg'
                            }`}
                            title={isCollapsed ? tab.label : ''}
                        >
                            {/* Active indicator */}
                            {activeTab === tab.id && (
                                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full"></div>
                            )}

                            {/* Hover glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 to-blue-500/0 group-hover:from-blue-400/10 group-hover:to-blue-500/5 rounded-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>

                            <Icon className={`w-5 h-5 flex-shrink-0 transition-all duration-300 relative z-10 ${
                                activeTab === tab.id
                                    ? 'text-blue-600'
                                    : 'group-hover:text-blue-600 group-hover:scale-110'
                            }`} />
                            {!isCollapsed && <span className="truncate relative z-10">{tab.label}</span>}
                        </button>
                    );
                })}
            </nav>

            {/* User Menu */}
            <div className={`absolute bottom-6 ${isCollapsed ? 'left-2 right-2' : 'left-4 right-4'} transition-all duration-300`}>
                <CustomNavUser isCollapsed={isCollapsed} />
            </div>
        </div>
    );
};
