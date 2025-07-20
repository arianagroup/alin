import React from 'react';
import {
  CalendarDays, CheckCircle, UserCheck, Table,
  TrendingUp, Award, Coffee, Zap, Sparkles
} from 'lucide-react';
import { StatsData } from '../types';

interface StatsCardsProps {
  animatedStats: StatsData;
  totalTables: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ animatedStats, totalTables }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 p-6 rounded-3xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 transform hover:-translate-y-2">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-4 h-4 text-blue-200" />
              <p className="text-sm font-medium text-blue-100">Total Reservasi</p>
            </div>
            <p className="text-4xl font-bold text-white mb-2">{animatedStats.totalReservations}</p>
            <div className="flex items-center space-x-2 text-xs text-blue-200">
              <TrendingUp className="w-3 h-3" />
              <span>Hari ini</span>
              <div className="w-1 h-1 bg-blue-300 rounded-full"></div>
              <span>+12% dari kemarin</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-2xl blur-sm"></div>
            <div className="relative p-4 bg-white/10 backdrop-blur-sm rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <CalendarDays className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-300 to-blue-100"></div>
      </div>

      <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 p-6 rounded-3xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-500 transform hover:-translate-y-2">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Award className="w-4 h-4 text-emerald-200" />
              <p className="text-sm font-medium text-emerald-100">Terkonfirmasi</p>
            </div>
            <p className="text-4xl font-bold text-white mb-2">{animatedStats.confirmed}</p>
            <div className="flex items-center space-x-2 text-xs text-emerald-200">
              <CheckCircle className="w-3 h-3" />
              <span>Siap dilayani</span>
              <div className="w-1 h-1 bg-emerald-300 rounded-full"></div>
              <span>Prioritas tinggi</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-2xl blur-sm"></div>
            <div className="relative p-4 bg-white/10 backdrop-blur-sm rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-300 to-emerald-100"></div>
      </div>

      <div className="group relative overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 p-6 rounded-3xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 transform hover:-translate-y-2">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Coffee className="w-4 h-4 text-purple-200" />
              <p className="text-sm font-medium text-purple-100">Sedang Makan</p>
            </div>
            <p className="text-4xl font-bold text-white mb-2">{animatedStats.seated}</p>
            <div className="flex items-center space-x-2 text-xs text-purple-200">
              <UserCheck className="w-3 h-3" />
              <span>Aktif sekarang</span>
              <div className="w-1 h-1 bg-purple-300 rounded-full"></div>
              <span>Rata-rata 90 menit</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-2xl blur-sm"></div>
            <div className="relative p-4 bg-white/10 backdrop-blur-sm rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <UserCheck className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-300 to-purple-100"></div>
      </div>

      <div className="group relative overflow-hidden bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 p-6 rounded-3xl shadow-2xl hover:shadow-indigo-500/25 transition-all duration-500 transform hover:-translate-y-2">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-4 h-4 text-indigo-200" />
              <p className="text-sm font-medium text-indigo-100">Meja Tersedia</p>
            </div>
            <p className="text-4xl font-bold text-white mb-2">{animatedStats.available}</p>
            <div className="flex items-center space-x-2 text-xs text-indigo-200">
              <Table className="w-3 h-3" />
              <span>Dari {totalTables} meja</span>
              <div className="w-1 h-1 bg-indigo-300 rounded-full"></div>
              <span>Kapasitas optimal</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-2xl blur-sm"></div>
            <div className="relative p-4 bg-white/10 backdrop-blur-sm rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <Table className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-300 to-indigo-100"></div>
      </div>
    </div>
  );
};