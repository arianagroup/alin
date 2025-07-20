import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarProps {
    selectedDate: string;
    onDateChange: (date: string) => void;
    className?: string;
}

export const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateChange, className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(() => {
        // Jika selectedDate kosong atau invalid, gunakan tanggal hari ini
        try {
            const date = selectedDate ? new Date(selectedDate) : today;
            // Cek apakah tanggal valid
            if (isNaN(date.getTime())) throw new Error('Invalid date');
            return new Date(date.getFullYear(), date.getMonth(), 1);
        } catch (e) {
            return new Date(today.getFullYear(), today.getMonth(), 1);
        }
    });

    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }
        
        return days;
    };

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getFullYear() === today.getFullYear() &&
               date.getMonth() === today.getMonth() &&
               date.getDate() === today.getDate();
    };

    const isSelected = (date: Date) => {
        return formatDate(date) === selectedDate;
    };

    const handleDateClick = (date: Date) => {
        onDateChange(formatDate(date));
        setIsOpen(false);
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentMonth(prev => {
            const newDate = new Date(prev);
            if (direction === 'prev') {
                newDate.setMonth(prev.getMonth() - 1);
            } else {
                newDate.setMonth(prev.getMonth() + 1);
            }
            return newDate;
        });
    };

    // Tangani kasus ketika selectedDate kosong atau invalid
    let displayDate;
    try {
        if (!selectedDate) throw new Error('Empty date');
        const selectedDateObj = new Date(selectedDate);
        
        // Cek apakah tanggal valid
        if (isNaN(selectedDateObj.getTime())) throw new Error('Invalid date');
        
        displayDate = selectedDateObj.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    } catch (e) {
        // Jika tanggal tidak valid, gunakan tanggal hari ini
        const today = new Date();
        displayDate = today.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group relative overflow-hidden bg-white/95 backdrop-blur-sm border border-white/30 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <CalendarIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tanggal Terpilih</p>
                        <p className="text-sm font-bold text-gray-900 truncate max-w-48">{displayDate}</p>
                    </div>
                </div>
            </button>

            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
                    onClick={() => setIsOpen(false)}
                >
                    <div 
                        className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 w-96 max-w-md animate-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <button
                                onClick={() => navigateMonth('prev')}
                                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <h3 className="text-lg font-bold text-gray-900">
                                {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                            </h3>
                            <button
                                onClick={() => navigateMonth('next')}
                                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 mb-3">
                            {days.map(day => (
                                <div key={day} className="p-2 text-center">
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        {day}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-2">
                            {getDaysInMonth(currentMonth).map((date, index) => (
                                <div key={index} className="aspect-square">
                                    {date ? (
                                        <button
                                            onClick={() => handleDateClick(date)}
                                            className={`w-full h-full rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden group ${
                                                isSelected(date)
                                                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                                                    : isToday(date)
                                                    ? 'bg-gradient-to-br from-blue-100 to-purple-100 text-blue-700 border-2 border-blue-300'
                                                    : 'hover:bg-gray-100 text-gray-700 hover:scale-105'
                                            }`}
                                        >
                                            {!isSelected(date) && (
                                                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-purple-500/0 group-hover:from-blue-400/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
                                            )}
                                            <span className="relative z-10">{date.getDate()}</span>
                                            {isToday(date) && !isSelected(date) && (
                                                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
                                            )}
                                        </button>
                                    ) : (
                                        <div className="w-full h-full"></div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => {
                                    const today = new Date();
                                    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
                                    handleDateClick(today);
                                }}
                                className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-xl transition-colors duration-200"
                            >
                                Hari Ini
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors duration-200"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};