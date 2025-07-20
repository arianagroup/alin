import React from 'react';
import { Settings } from 'lucide-react';

export const Header: React.FC = () => (
    <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-end items-center h-16">
                <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-600">
                        {new Date().toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    </header>
);
