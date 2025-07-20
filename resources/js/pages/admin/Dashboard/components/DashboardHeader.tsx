import React from 'react';
import { Clock, Calendar } from 'lucide-react';
import { Calendar as CustomCalendar } from '../../../../components/ui/Calendar';
import { GreetingData } from '../types';

interface DashboardHeaderProps {
  greeting: GreetingData;
  currentTime: Date;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  greeting,
  currentTime,
  selectedDate,
  setSelectedDate
}) => {
  // Pastikan selectedDate valid, jika tidak gunakan tanggal hari ini
  const ensureValidDate = () => {
    try {
      if (!selectedDate) return formatDate(new Date());
      const date = new Date(selectedDate);
      if (isNaN(date.getTime())) return formatDate(new Date());
      return selectedDate;
    } catch (e) {
      return formatDate(new Date());
    }
  };
  
  // Format tanggal ke YYYY-MM-DD
  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  
  // Pastikan selectedDate valid
  const validSelectedDate = ensureValidDate();
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 rounded-3xl p-8 shadow-xl border border-white/20">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-400/10 to-orange-400/10 rounded-full blur-2xl"></div>

      <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-3 mb-2">
            <div className="text-2xl animate-pulse">{greeting.icon}</div>
            <span className={`text-lg font-medium bg-gradient-to-r ${greeting.color} bg-clip-text text-transparent`}>
              {greeting.text}
            </span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            Semoga Harimu Menyenangkan
          </p>
          <div className="flex items-center space-x-4 mt-4">
            <div className="flex items-center space-x-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/20">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                {currentTime.toLocaleTimeString('id-ID')}
              </span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/20">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">
                {(() => {
                  try {
                    return selectedDate 
                      ? new Date(selectedDate).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long'
                        }) 
                      : new Date().toLocaleDateString('id-ID', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long'
                        });
                  } catch (e) {
                    return new Date().toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long'
                    });
                  }
                })()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <CustomCalendar
            selectedDate={validSelectedDate}
            onDateChange={setSelectedDate}
          />
        </div>
      </div>
    </div>
  );
};
