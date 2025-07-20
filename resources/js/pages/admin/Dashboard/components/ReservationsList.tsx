import React from 'react';
import {
  CalendarDays, User, Clock, Users, Table, MapPin, Phone, Mail,
  UserCheck, Star, Gift, Bell, Activity, Sparkles
} from 'lucide-react';
import { Reservation, Table as TableType } from '../types';
import { getStatusColor, getStatusIcon, getTableById } from '../utils';

interface ReservationsListProps {
  todayReservations: Reservation[];
  tables: TableType[];
  updateReservationStatus: (id: string, status: Reservation['status']) => void;
  setShowAddReservation: (show: boolean) => void;
}

export const ReservationsList: React.FC<ReservationsListProps> = ({
  todayReservations,
  tables,
  updateReservationStatus,
  setShowAddReservation
}) => {
  return (
    <div className="xl:col-span-2">
      <div className="relative overflow-hidden bg-white rounded-3xl shadow-2xl border border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50"></div>
        <div className="relative p-8 bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                  Reservasi Hari Ini
                </h2>
              </div>
              <p className="text-gray-600 font-medium">Kelola dan pantau reservasi aktif dengan mudah</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-white/20 shadow-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">{todayReservations.length} aktif</span>
              </div>
              <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full border border-white/20 shadow-sm hover:shadow-md transition-all duration-200">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
        <div className="relative p-8">
          {todayReservations.length === 0 ? (
            <div className="text-center py-16">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <CalendarDays className="w-12 h-12 text-blue-500" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Tidak ada reservasi hari ini</h3>
              <p className="text-gray-500 mb-6">Reservasi baru akan muncul di sini secara real-time</p>
              <button 
                onClick={() => setShowAddReservation(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              >
                Tambah Reservasi Baru
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {todayReservations.map((reservation, index) => {
                const table = getTableById(tables, reservation.tableId);
                return (
                  <div
                    key={reservation.id}
                    className="group relative overflow-hidden bg-gradient-to-r from-white via-gray-50 to-white p-6 rounded-2xl border border-gray-200 hover:shadow-xl hover:border-gray-300 transition-all duration-500 transform hover:-translate-y-1"
                    style={{
                      animationDelay: `${index * 150}ms`,
                      animation: 'slideInUp 0.6s ease-out forwards'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-center space-x-4 lg:space-x-6">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 via-blue-200 to-purple-200 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                            <User className="w-8 h-8 text-blue-600" />
                          </div>
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-200">
                            {getStatusIcon(reservation.status)}
                          </div>
                          <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-white">{reservation.guests}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                            {reservation.customerName}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                            <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 rounded-full">
                              <Clock className="w-4 h-4 text-blue-500" />
                              <span className="font-medium">{reservation.time}</span>
                            </div>
                            <div className="flex items-center space-x-2 px-3 py-1 bg-purple-50 rounded-full">
                              <Users className="w-4 h-4 text-purple-500" />
                              <span className="font-medium">{reservation.guests} orang</span>
                            </div>
                            <div className="flex items-center space-x-2 px-3 py-1 bg-emerald-50 rounded-full">
                              <Table className="w-4 h-4 text-emerald-500" />
                              <span className="font-medium">Meja {table?.number}</span>
                            </div>
                            <div className="flex items-center space-x-2 px-3 py-1 bg-orange-50 rounded-full">
                              <MapPin className="w-4 h-4 text-orange-500" />
                              <span className="font-medium">{table?.location}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Phone className="w-3 h-3" />
                              <span className="truncate">{reservation.customerPhone}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Mail className="w-3 h-3" />
                              <span className="truncate">{reservation.customerEmail}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold border shadow-sm ${getStatusColor(reservation.status)}`}>
                          {getStatusIcon(reservation.status)}
                          <span className="ml-2 capitalize">{reservation.status}</span>
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {reservation.status === 'confirmed' && (
                            <button
                              onClick={() => updateReservationStatus(reservation.id, 'seated')}
                              className="group/btn px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-blue-500/25"
                            >
                              <UserCheck className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
                              <span>Check In</span>
                            </button>
                          )}
                          {reservation.status === 'seated' && (
                            <button
                              onClick={() => updateReservationStatus(reservation.id, 'completed')}
                              className="group/btn px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl text-sm font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-emerald-500/25"
                            >
                              <Star className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
                              <span>Selesai</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    {reservation.specialRequests && (
                      <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                        <div className="flex items-start space-x-3">
                          <div className="p-1 bg-amber-200 rounded-lg">
                            <Gift className="w-4 h-4 text-amber-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-amber-800 mb-1">Permintaan Khusus</p>
                            <p className="text-sm text-amber-700">{reservation.specialRequests}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};