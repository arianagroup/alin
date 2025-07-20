import React from 'react';
import {
    Search, Plus, Filter, Download, Phone, Mail, Gift,
    Users, Clock, Table, CheckCircle, UserCheck, Star, Edit, Trash2, Timer
} from 'lucide-react';
import { Reservation, Table as TableType } from '../../../types/restaurant';
import { getStatusColor } from '../../../utils/statusColors';
import { ConfirmationModal } from './ConfirmationModal';

interface ReservationsTabProps {
    reservations: Reservation[];
    tables: TableType[];
    selectedDate: string;
    setSelectedDate: (date: string) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    statusFilter: string;
    setStatusFilter: (filter: string) => void;
    filteredReservations: Reservation[];
    getTableById: (id: string) => TableType | undefined;
    updateReservationStatus: (id: string, status: Reservation['status']) => void;
    setEditingReservation: (reservation: Reservation) => void;
    setShowAddReservation: (show: boolean) => void;
    setShowAnalytics: (show: boolean) => void;
    showReservationDeleteModal: boolean;
    setShowReservationDeleteModal: (show: boolean) => void;
    reservationToDelete: string | null;
    setReservationToDelete: (id: string | null) => void;
    deleteReservation: (id: string) => void;
}

// ✅ Helper function untuk format durasi
const formatDuration = (durationInMinutes: number): string => {
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;

    if (hours === 0) return `${minutes} menit`;
    if (minutes === 0) return `${hours} jam`;
    return `${hours}j ${minutes}m`;
};

// ✅ Helper function untuk menghitung waktu selesai
const calculateEndTime = (startTime: string, durationInMinutes: number): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);

    const endDate = new Date(startDate.getTime() + durationInMinutes * 60 * 1000);
    return endDate.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
};

// ✅ Helper function untuk status durasi (normal, panjang, sangat panjang)
const getDurationStatus = (durationInMinutes: number): { color: string; label: string } => {
    if (durationInMinutes <= 90) {
        return { color: 'text-green-600 bg-green-100', label: 'Normal' };
    } else if (durationInMinutes <= 180) {
        return { color: 'text-blue-600 bg-blue-100', label: 'Panjang' };
    } else {
        return { color: 'text-purple-600 bg-purple-100', label: 'Event' };
    }
};

export const ReservationsTab: React.FC<ReservationsTabProps> = ({
                                                                    reservations,
                                                                    selectedDate,
                                                                    setSelectedDate,
                                                                    searchTerm,
                                                                    setSearchTerm,
                                                                    statusFilter,
                                                                    setStatusFilter,
                                                                    filteredReservations,
                                                                    getTableById,
                                                                    updateReservationStatus,
                                                                    setEditingReservation,
                                                                    setShowAddReservation,
                                                                    setShowAnalytics,
                                                                    showReservationDeleteModal,
                                                                    setShowReservationDeleteModal,
                                                                    reservationToDelete,
                                                                    setReservationToDelete,
                                                                    deleteReservation
                                                                }) => (
    <div className="space-y-8 animate-fadeIn">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Manajemen Reservasi
                </h1>
                <p className="text-gray-600 font-medium mt-2">Kelola semua reservasi dengan mudah dan efisien</p>
            </div>
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => setShowAnalytics(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 flex items-center space-x-2 font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
                >
                    <span>Analytics</span>
                </button>
                <button
                    onClick={() => setShowAddReservation(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 flex items-center space-x-2 font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
                >
                    <Plus className="w-5 h-5" />
                    <span>Tambah Reservasi</span>
                </button>
            </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-2xl border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-xl">
                    <Filter className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Filter & Pencarian</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari nama, telepon, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-3 w-full h-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                </div>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-4 py-3 h-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 w-full"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 h-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                    <option value="all">Semua Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="seated">Seated</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="no-show">No Show</option>
                </select>
                <button className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-4 py-3 h-12 rounded-xl hover:from-gray-200 hover:to-gray-300 flex items-center justify-center space-x-2 font-medium transition-all duration-200">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                </button>
            </div>
        </div>

        {/* ✅ Enhanced Reservations Table with Duration */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            Customer
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            Tanggal & Waktu
                        </th>
                        {/* ✅ New Duration Column */}
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            Durasi
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            Tamu
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            Meja
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            Aksi
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {filteredReservations.map((reservation) => {
                        const table = getTableById(reservation.tableId);
                        const durationStatus = getDurationStatus(reservation.duration);

                        return (
                            <tr key={reservation.id} className="hover:bg-blue-50 transition-colors duration-200">
                                <td className="px-6 py-6 whitespace-nowrap">
                                    <div>
                                        <div className="text-sm font-bold text-gray-900">{reservation.customerName}</div>
                                        <div className="text-sm text-gray-600 flex items-center space-x-1 mt-1">
                                            <Phone className="w-3 h-3" />
                                            <span>{reservation.customerPhone}</span>
                                        </div>
                                        <div className="text-sm text-gray-600 flex items-center space-x-1 mt-1">
                                            <Mail className="w-3 h-3" />
                                            <span>{reservation.customerEmail}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-6 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{reservation.date}</div>
                                    <div className="text-sm text-gray-600 flex items-center space-x-1 mt-1">
                                        <Clock className="w-3 h-3" />
                                        <span>{reservation.time}</span>
                                    </div>
                                </td>

                                {/* ✅ Duration Column */}
                                <td className="px-6 py-6 whitespace-nowrap">
                                    <div className="flex items-center space-x-2">
                                        <Timer className="w-4 h-4 text-indigo-500" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {formatDuration(reservation.duration)}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {reservation.time} - {calculateEndTime(reservation.time, reservation.duration)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-1">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${durationStatus.color}`}>
                                                {durationStatus.label}
                                            </span>
                                    </div>
                                </td>

                                <td className="px-6 py-6 whitespace-nowrap">
                                    <div className="flex items-center space-x-2">
                                        <Users className="w-4 h-4 text-blue-500" />
                                        <span className="text-sm font-medium text-gray-900">{reservation.guests} orang</span>
                                    </div>
                                </td>
                                <td className="px-6 py-6 whitespace-nowrap">
                                    <div className="flex items-center space-x-2">
                                        <Table className="w-4 h-4 text-purple-500" />
                                        <span className="text-sm font-medium text-gray-900">Meja {table?.number}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">{table?.location}</div>
                                </td>
                                <td className="px-6 py-6 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-lg text-xs font-medium border shadow-sm ${getStatusColor(reservation.status)}`}>
                                            {reservation.status}
                                        </span>
                                    {reservation.specialRequests && (
                                        <div className="flex items-center space-x-1 mt-2">
                                            <Gift className="w-3 h-3 text-amber-500" />
                                            <span className="text-xs text-amber-600">Permintaan khusus</span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-6 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center space-x-2">
                                        {reservation.status === 'pending' && (
                                            <button
                                                onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                                                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors duration-200"
                                                title="Konfirmasi"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                            </button>
                                        )}
                                        {reservation.status === 'confirmed' && (
                                            <button
                                                onClick={() => updateReservationStatus(reservation.id, 'seated')}
                                                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                                                title="Check In"
                                            >
                                                <UserCheck className="w-4 h-4" />
                                            </button>
                                        )}
                                        {reservation.status === 'seated' && (
                                            <button
                                                onClick={() => updateReservationStatus(reservation.id, 'completed')}
                                                className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors duration-200"
                                                title="Selesai"
                                            >
                                                <Star className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setEditingReservation(reservation)}
                                            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                                            title="Edit"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setReservationToDelete(reservation.id);
                                                setShowReservationDeleteModal(true);
                                            }}
                                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200"
                                            title="Hapus"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>

        <ConfirmationModal
            isOpen={showReservationDeleteModal}
            onClose={() => {
                setShowReservationDeleteModal(false);
                setReservationToDelete(null);
            }}
            onConfirm={() => {
                if (reservationToDelete) {
                    deleteReservation(reservationToDelete);
                }
            }}
            title="Konfirmasi Penghapusan"
            message={`Apakah Anda yakin ingin menghapus reservasi untuk ${reservations.find(r => r.id === reservationToDelete)?.customerName || ''}?`}
            confirmText="Hapus"
            cancelText="Batal"
            type="danger"
        />
    </div>
);
