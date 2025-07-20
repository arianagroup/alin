import React, { useState } from 'react';
import {
    BarChart3, TrendingUp, TrendingDown, Calendar, Users,
    DollarSign, Clock, Star, Award, Target, Zap,
    ArrowUp, ArrowDown, Eye, Filter, Download,
    PieChart, Activity, Heart, Coffee, MapPin
} from 'lucide-react';

interface Reservation {
    id: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    date: string;
    time: string;
    duration: number;
    guests: number;
    tableId: string;
    status: 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no-show';
    specialRequests: string;
    createdAt: string;
    notes: string;
}

interface Table {
    id: string;
    number: number;
    capacity: number;
    location: string;
    status: 'available' | 'occupied' | 'reserved' | 'maintenance';
}

interface AnalyticsProps {
    reservations: Reservation[];
    tables: Table[];
}

const Analytics: React.FC<AnalyticsProps> = ({ reservations, tables }) => {
    const [selectedPeriod, setSelectedPeriod] = useState('today');
    const [selectedMetric, setSelectedMetric] = useState('revenue');

    // Calculate analytics data
    const today = new Date().toISOString().split('T')[0];
    const thisWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const thisMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const getFilteredReservations = () => {
        switch (selectedPeriod) {
            case 'today':
                return reservations.filter(r => r.date === today);
            case 'week':
                return reservations.filter(r => r.date >= thisWeek);
            case 'month':
                return reservations.filter(r => r.date >= thisMonth);
            default:
                return reservations;
        }
    };

    const filteredReservations = getFilteredReservations();

    const analytics = {
        totalReservations: filteredReservations.length,
        completedReservations: filteredReservations.filter(r => r.status === 'completed').length,
        cancelledReservations: filteredReservations.filter(r => r.status === 'cancelled').length,
        noShowReservations: filteredReservations.filter(r => r.status === 'no-show').length,
        totalGuests: filteredReservations.reduce((sum, r) => sum + r.guests, 0),
        averagePartySize: filteredReservations.length > 0 ?
            (filteredReservations.reduce((sum, r) => sum + r.guests, 0) / filteredReservations.length).toFixed(1) : 0,
        revenue: filteredReservations.filter(r => r.status === 'completed').length * 150000, // Assuming average 150k per reservation
        occupancyRate: tables.filter(t => t.status === 'occupied' || t.status === 'reserved').length / tables.length * 100,
        popularTimes: getPopularTimes(filteredReservations),
        popularTables: getPopularTables(filteredReservations, tables),
        customerSatisfaction: 4.8,
        repeatCustomers: 65
    };

    function getPopularTimes(reservations: Reservation[]) {
        const timeSlots: Record<string, number> = {};
        reservations.forEach(r => {
            const hour = parseInt(r.time.split(':')[0]);
            const slot = `${hour}:00`;
            timeSlots[slot] = (timeSlots[slot] || 0) + 1;
        });
        return Object.entries(timeSlots)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);
    }

    function getPopularTables(reservations: Reservation[], tables: Table[]) {
        const tableCounts: Record<string, number> = {};
        reservations.forEach(r => {
            tableCounts[r.tableId] = (tableCounts[r.tableId] || 0) + 1;
        });
        return Object.entries(tableCounts)
            .map(([tableId, count]) => ({
                table: tables.find(t => t.id === tableId),
                count
            }))
            .filter(item => item.table)
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }

    const StatCard = ({
                          title,
                          value,
                          change,
                          icon: Icon,
                          color,
                          trend = 'up',
                          subtitle
                      }: {
        title: string;
        value: string | number;
        change?: string;
        icon: any;
        color: string;
        trend?: 'up' | 'down';
        subtitle?: string;
    }) => (
        <div className={`relative overflow-hidden bg-gradient-to-br ${color} p-6 rounded-3xl shadow-2xl hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            <div className="relative flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-white/80 mb-2">{title}</p>
                    <p className="text-4xl font-bold text-white mb-2">{value}</p>
                    {subtitle && (
                        <p className="text-xs text-white/70">{subtitle}</p>
                    )}
                    {change && (
                        <div className={`flex items-center space-x-1 text-xs ${
                            trend === 'up' ? 'text-green-200' : 'text-red-200'
                        }`}>
                            {trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                            <span>{change}</span>
                        </div>
                    )}
                </div>
                <div className="relative">
                    <div className="absolute inset-0 bg-white/20 rounded-2xl blur-sm"></div>
                    <div className="relative p-4 bg-white/10 backdrop-blur-sm rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        <Icon className="h-10 w-10 text-white" />
                    </div>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-white/30 to-white/10"></div>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50 to-pink-100 rounded-3xl p-8 shadow-xl border border-white/20">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-pink-600/5"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>

                <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="p-2 bg-purple-100 rounded-xl">
                                <BarChart3 className="w-6 h-6 text-purple-600" />
                            </div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Analytics & Reports
                            </h1>
                        </div>
                        <p className="text-xl text-gray-600 font-medium">
                            Analisis mendalam performa restoran Anda
                        </p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className="px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm focus:ring-2 focus:ring-purple-500 font-medium"
                        >
                            <option value="today">Hari Ini</option>
                            <option value="week">7 Hari Terakhir</option>
                            <option value="month">30 Hari Terakhir</option>
                            <option value="all">Semua Waktu</option>
                        </select>

                        <button className="flex items-center space-x-2 px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm hover:shadow-md transition-all duration-200">
                            <Download className="w-4 h-4 text-purple-600" />
                            <span className="font-medium text-gray-700">Export</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Reservasi"
                    value={analytics.totalReservations}
                    change="+12%"
                    icon={Calendar}
                    color="from-blue-500 via-blue-600 to-blue-700"
                    subtitle="Periode terpilih"
                />

                <StatCard
                    title="Pendapatan"
                    value={`Rp ${(analytics.revenue / 1000000).toFixed(1)}M`}
                    change="+8%"
                    icon={DollarSign}
                    color="from-emerald-500 via-emerald-600 to-emerald-700"
                    subtitle="Estimasi total"
                />

                <StatCard
                    title="Tingkat Okupansi"
                    value={`${analytics.occupancyRate.toFixed(1)}%`}
                    change="+5%"
                    icon={Target}
                    color="from-purple-500 via-purple-600 to-purple-700"
                    subtitle="Meja terisi"
                />

                <StatCard
                    title="Kepuasan Pelanggan"
                    value={analytics.customerSatisfaction}
                    change="+0.2"
                    icon={Star}
                    color="from-orange-500 via-orange-600 to-orange-700"
                    subtitle="Rating rata-rata"
                />
            </div>

            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Reservation Status Breakdown */}
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-indigo-100 rounded-xl">
                                <PieChart className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Status Reservasi</h3>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                            <div className="flex items-center space-x-3">
                                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                                <span className="font-medium text-green-800">Selesai</span>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-bold text-green-600">{analytics.completedReservations}</span>
                                <p className="text-sm text-green-600">
                                    {analytics.totalReservations > 0 ?
                                        ((analytics.completedReservations / analytics.totalReservations) * 100).toFixed(1) : 0}%
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
                            <div className="flex items-center space-x-3">
                                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                                <span className="font-medium text-red-800">Dibatalkan</span>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-bold text-red-600">{analytics.cancelledReservations}</span>
                                <p className="text-sm text-red-600">
                                    {analytics.totalReservations > 0 ?
                                        ((analytics.cancelledReservations / analytics.totalReservations) * 100).toFixed(1) : 0}%
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-200">
                            <div className="flex items-center space-x-3">
                                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                                <span className="font-medium text-orange-800">No Show</span>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-bold text-orange-600">{analytics.noShowReservations}</span>
                                <p className="text-sm text-orange-600">
                                    {analytics.totalReservations > 0 ?
                                        ((analytics.noShowReservations / analytics.totalReservations) * 100).toFixed(1) : 0}%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Popular Time Slots */}
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-xl">
                                <Clock className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Jam Populer</h3>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        {analytics.popularTimes.map(([time, count], index) => (
                            <div key={time} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                                        index === 0 ? 'bg-yellow-500' :
                                            index === 1 ? 'bg-gray-400' :
                                                index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                                    }`}>
                                        {index + 1}
                                    </div>
                                    <span className="font-medium text-gray-900">{time}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-32 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${(count / Math.max(...analytics.popularTimes.map(([,c]) => c))) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-lg font-bold text-blue-600">{count}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Users className="w-5 h-5 text-purple-600" />
                        </div>
                        <h4 className="font-bold text-gray-900">Total Tamu</h4>
                    </div>
                    <p className="text-3xl font-bold text-purple-600 mb-2">{analytics.totalGuests}</p>
                    <p className="text-sm text-gray-600">Rata-rata: {analytics.averagePartySize} orang/reservasi</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Heart className="w-5 h-5 text-green-600" />
                        </div>
                        <h4 className="font-bold text-gray-900">Pelanggan Setia</h4>
                    </div>
                    <p className="text-3xl font-bold text-green-600 mb-2">{analytics.repeatCustomers}%</p>
                    <p className="text-sm text-gray-600">Tingkat retensi pelanggan</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Activity className="w-5 h-5 text-blue-600" />
                        </div>
                        <h4 className="font-bold text-gray-900">Tingkat Konversi</h4>
                    </div>
                    <p className="text-3xl font-bold text-blue-600 mb-2">
                        {analytics.totalReservations > 0 ?
                            ((analytics.completedReservations / analytics.totalReservations) * 100).toFixed(1) : 0}%
                    </p>
                    <p className="text-sm text-gray-600">Reservasi yang selesai</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Coffee className="w-5 h-5 text-orange-600" />
                        </div>
                        <h4 className="font-bold text-gray-900">Durasi Rata-rata</h4>
                    </div>
                    <p className="text-3xl font-bold text-orange-600 mb-2">
                        {filteredReservations.length > 0 ?
                            Math.round(filteredReservations.reduce((sum, r) => sum + r.duration, 0) / filteredReservations.length) : 0} min
                    </p>
                    <p className="text-sm text-gray-600">Waktu makan pelanggan</p>
                </div>
            </div>

            {/* Popular Tables */}
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-emerald-100 rounded-xl">
                                <MapPin className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Meja Terpopuler</h3>
                        </div>
                        <span className="text-sm text-gray-600">Berdasarkan jumlah reservasi</span>
                    </div>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {analytics.popularTables.map((item, index) => (
                            <div key={item.table?.id} className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                                            index === 0 ? 'bg-yellow-500' :
                                                index === 1 ? 'bg-gray-400' :
                                                    index === 2 ? 'bg-orange-500' : 'bg-emerald-500'
                                        }`}>
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Meja {item.table?.number}</h4>
                                            <p className="text-sm text-gray-600">{item.table?.location}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-emerald-600">{item.count}</p>
                                        <p className="text-xs text-gray-500">reservasi</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <Users className="w-4 h-4" />
                                    <span>Kapasitas: {item.table?.capacity} orang</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
