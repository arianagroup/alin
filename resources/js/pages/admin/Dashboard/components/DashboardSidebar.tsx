import React from 'react';
import {
    Zap, CalendarDays, Table, BarChart3, ArrowRight,
    Clock, User, Users,
} from 'lucide-react';
import { Reservation, Table as TableType } from '../types';
import { getStatusColor, getStatusIcon, getTableById } from '../utils';

interface DashboardSidebarProps {
    upcomingReservations: Reservation[];
    tables: TableType[];
    setShowAddReservation: (show: boolean) => void;
    setActiveTab?: (tab: string) => void;
    setShowAnalytics?: (show: boolean) => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
                                                                      upcomingReservations,
                                                                      tables,
                                                                      setShowAddReservation,
                                                                      setActiveTab,
                                                                      setShowAnalytics
                                                                  }) => {

    const handleNavigateToTables = () => {
        console.log('Navigating to tables tab...'); // Debug log
        if (setActiveTab) {
            console.log('setActiveTab found, switching to tables'); // Debug log
            setActiveTab('tables'); // Nama tab sesuai dengan Home.tsx
        } else {
            console.log('setActiveTab not provided!'); // Debug log
        }
    };

    const handleNavigateToReservations = () => {
        console.log('Navigating to reservations tab...'); // Debug log
        if (setActiveTab) {
            setActiveTab('reservations');
        }
    };

    // ✅ Handler untuk membuka Analytics Modal
    const handleShowAnalytics = () => {
        console.log('Opening analytics modal...'); // Debug log
        if (setShowAnalytics) {
            setShowAnalytics(true);
        }
    };

    return (
        <div className="space-y-6">
            {/* Quick Actions */}
            <div className="relative overflow-hidden bg-white rounded-3xl shadow-2xl border border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50"></div>
                <div className="relative p-6">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-purple-100 rounded-xl">
                            <Zap className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Aksi Cepat
                        </h3>
                    </div>
                    <div className="space-y-3">
                        <button
                            onClick={() => setShowAddReservation(true)}
                            className="w-full group relative overflow-hidden p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                        >
                            <div className="absolute inset-0 bg-white/10"></div>
                            <div className="relative flex items-center justify-between text-white">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-white/20 rounded-xl">
                                        <CalendarDays className="w-5 h-5" />
                                    </div>
                                    <span className="font-semibold">Tambah Reservasi</span>
                                </div>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                            </div>
                        </button>

                        {/* ✅ Button Kelola Meja dengan onClick handler */}
                        <button
                            onClick={handleNavigateToTables}
                            className="w-full group relative overflow-hidden p-4 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/25"
                        >
                            <div className="absolute inset-0 bg-white/10"></div>
                            <div className="relative flex items-center justify-between text-white">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-white/20 rounded-xl">
                                        <Table className="w-5 h-5" />
                                    </div>
                                    <span className="font-semibold">Kelola Meja</span>
                                </div>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                            </div>
                        </button>

                        {/* ✅ Button Lihat Laporan dengan onClick handler untuk Analytics Modal */}
                        <button
                            onClick={handleShowAnalytics}
                            className="w-full group relative overflow-hidden p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                        >
                            <div className="absolute inset-0 bg-white/10"></div>
                            <div className="relative flex items-center justify-between text-white">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-white/20 rounded-xl">
                                        <BarChart3 className="w-5 h-5" />
                                    </div>
                                    <span className="font-semibold">Lihat Laporan</span>
                                </div>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Upcoming Reservations */}
            <div className="relative overflow-hidden bg-white rounded-3xl shadow-2xl border border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-blue-50/50"></div>
                <div className="relative p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-indigo-100 rounded-xl">
                                <Clock className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                                Reservasi Mendatang
                            </h3>
                        </div>
                        <div className="flex items-center space-x-2 px-3 py-1 bg-indigo-50 rounded-full">
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                            <span className="text-xs font-medium text-indigo-600">{upcomingReservations.length} mendatang</span>
                        </div>
                    </div>
                    {upcomingReservations.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Clock className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">Tidak ada reservasi mendatang</p>
                            <p className="text-gray-400 text-sm mt-1">Reservasi baru akan muncul di sini</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {upcomingReservations.map((reservation, index) => {
                                const table = getTableById(tables, reservation.tableId);
                                return (
                                    <div
                                        key={reservation.id}
                                        className="group relative overflow-hidden p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="relative">
                                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                    <User className="w-6 h-6 text-indigo-600" />
                                                </div>
                                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200">
                                                    {getStatusIcon(reservation.status)}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors duration-200">
                                                    {reservation.customerName}
                                                </p>
                                                <div className="flex items-center space-x-3 mt-1">
                                                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{reservation.time}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                                                        <Table className="w-3 h-3" />
                                                        <span>Meja {table?.number}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                                                        <Users className="w-3 h-3" />
                                                        <span>{reservation.guests}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(reservation.status)}`}>
                        {reservation.status}
                      </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/*/!* Performance Metrics *!/*/}
            {/*<div className="relative overflow-hidden bg-white rounded-3xl shadow-2xl border border-gray-100">*/}
            {/*    <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 to-rose-50/50"></div>*/}
            {/*    <div className="relative p-6">*/}
            {/*        <div className="flex items-center space-x-3 mb-6">*/}
            {/*            <div className="p-2 bg-pink-100 rounded-xl">*/}
            {/*                <PieChart className="w-6 h-6 text-pink-600" />*/}
            {/*            </div>*/}
            {/*            <h3 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">*/}
            {/*                Performa Hari Ini*/}
            {/*            </h3>*/}
            {/*        </div>*/}
            {/*        <div className="space-y-4">*/}
            {/*            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">*/}
            {/*                <div className="flex items-center space-x-3">*/}
            {/*                    <div className="p-2 bg-green-200 rounded-lg">*/}
            {/*                        <Heart className="w-4 h-4 text-green-600" />*/}
            {/*                    </div>*/}
            {/*                    <span className="text-sm font-medium text-green-800">Tingkat Kepuasan</span>*/}
            {/*                </div>*/}
            {/*                <span className="text-lg font-bold text-green-600">98%</span>*/}
            {/*            </div>*/}
            {/*            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">*/}
            {/*                <div className="flex items-center space-x-3">*/}
            {/*                    <div className="p-2 bg-blue-200 rounded-lg">*/}
            {/*                        <TrendingUp className="w-4 h-4 text-blue-600" />*/}
            {/*                    </div>*/}
            {/*                    <span className="text-sm font-medium text-blue-800">Okupansi Meja</span>*/}
            {/*                </div>*/}
            {/*                <span className="text-lg font-bold text-blue-600">85%</span>*/}
            {/*            </div>*/}
            {/*            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200">*/}
            {/*                <div className="flex items-center space-x-3">*/}
            {/*                    <div className="p-2 bg-purple-200 rounded-lg">*/}
            {/*                        <DollarSign className="w-4 h-4 text-purple-600" />*/}
            {/*                    </div>*/}
            {/*                    <span className="text-sm font-medium text-purple-800">Pendapatan</span>*/}
            {/*                </div>*/}
            {/*                <span className="text-lg font-bold text-purple-600">Rp 2.4M</span>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    );
};
