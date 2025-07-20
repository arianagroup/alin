import React, { useState } from 'react';
import {
    Calendar,
    Clock,
    Users,
    MapPin,
    CheckCircle,
    XCircle,
    AlertCircle,
    Edit3,
    Trash2,
    Phone,
    MessageSquare,
    ArrowLeft,
    AlertTriangle,
    X
} from 'lucide-react';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import Layout from './Layout';
import { Reservation, Table } from '@/types/restaurant';

interface ReservationWithTable extends Reservation {
    table?: Table;
}

// ✅ Custom Modal Components
interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
                                                       isOpen,
                                                       onClose,
                                                       onConfirm,
                                                       title,
                                                       message,
                                                       confirmText = 'Ya, Lanjutkan',
                                                       cancelText = 'Batal',
                                                       type = 'danger'
                                                   }) => {
    if (!isOpen) return null;

    const getTypeStyles = () => {
        switch (type) {
            case 'danger':
                return {
                    icon: <AlertTriangle className="h-8 w-8 text-red-500" />,
                    iconBg: 'bg-red-100',
                    confirmBtn: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                };
            case 'warning':
                return {
                    icon: <AlertCircle className="h-8 w-8 text-yellow-500" />,
                    iconBg: 'bg-yellow-100',
                    confirmBtn: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
                };
            default:
                return {
                    icon: <AlertCircle className="h-8 w-8 text-blue-500" />,
                    iconBg: 'bg-blue-100',
                    confirmBtn: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                };
        }
    };

    const styles = getTypeStyles();

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop - Soft dan friendly */}
            <div
                className="fixed inset-0 bg-gradient-to-br from-gray-100/60 to-gray-300/40 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* Modal dengan shadow yang lebih soft */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md w-full transform transition-all animate-in fade-in-0 zoom-in-95 duration-200">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="p-6">
                        {/* Icon */}
                        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${styles.iconBg} mb-4`}>
                            {styles.icon}
                        </div>

                        {/* Content */}
                        <div className="text-center">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {title}
                            </h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {message}
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col-reverse sm:flex-row gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
                            >
                                {cancelText}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className={`w-full px-4 py-3 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors font-medium ${styles.confirmBtn}`}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ✅ Success/Error Toast Component
interface ToastProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
    type: 'success' | 'error';
}

const Toast: React.FC<ToastProps> = ({ isOpen, onClose, message, type }) => {
    React.useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                onClose();
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
            <div className={`flex items-center p-4 rounded-xl shadow-lg border ${
                type === 'success'
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : 'bg-red-50 border-red-200 text-red-800'
            }`}>
                <div className="flex items-center">
                    {type === 'success' ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    ) : (
                        <XCircle className="h-5 w-5 text-red-600 mr-3" />
                    )}
                    <p className="font-medium">{message}</p>
                </div>
                <button
                    onClick={onClose}
                    className="ml-4 text-gray-500 hover:text-gray-700"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

const CustomerReservations: React.FC<PageProps> = ({ auth }) => {
    const [reservations, setReservations] = useState<ReservationWithTable[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState<string>('all');

    // ✅ Modal states
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedReservationId, setSelectedReservationId] = useState<string>('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');

    React.useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            console.log('Fetching reservations...');
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

            const response = await fetch('/api/pelanggan/reservations', {
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'same-origin'
            });

            console.log('Response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('Reservations data:', data);
                setReservations(data);
            } else {
                const errorText = await response.text();
                console.error('Failed to fetch reservations:', response.status, errorText);

                if (response.status === 401 || response.status === 419) {
                    console.log('Authentication issue, refreshing page...');
                    window.location.reload();
                }
            }
        } catch (error) {
            console.error('Error fetching reservations:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: Reservation['status']) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'cancelled':
            case 'no-show':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'completed':
            case 'seated':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: Reservation['status']) => {
        switch (status) {
            case 'confirmed':
                return <CheckCircle className="h-5 w-5 text-green-600" />;
            case 'pending':
                return <AlertCircle className="h-5 w-5 text-yellow-600" />;
            case 'cancelled':
            case 'no-show':
                return <XCircle className="h-5 w-5 text-red-600" />;
            case 'completed':
            case 'seated':
                return <CheckCircle className="h-5 w-5 text-blue-600" />;
            default:
                return null;
        }
    };

    const getStatusText = (status: Reservation['status']) => {
        switch (status) {
            case 'confirmed':
                return 'Dikonfirmasi';
            case 'pending':
                return 'Menunggu Konfirmasi';
            case 'cancelled':
                return 'Dibatalkan';
            case 'completed':
                return 'Selesai';
            case 'seated':
                return 'Sedang Berlangsung';
            case 'no-show':
                return 'Tidak Hadir';
            default:
                return status;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (time: string) => {
        return time + ' WIB';
    };

    const isUpcoming = (date: string, status: Reservation['status']) => {
        return new Date(date) > new Date() &&
            status !== 'cancelled' &&
            status !== 'completed' &&
            status !== 'no-show';
    };

    const canEdit = (reservation: ReservationWithTable) => {
        return isUpcoming(reservation.date, reservation.status) &&
            reservation.status !== 'seated';
    };

    const canCancel = (reservation: ReservationWithTable) => {
        return isUpcoming(reservation.date, reservation.status) &&
            reservation.status !== 'cancelled' &&
            reservation.status !== 'no-show';
    };

    const filteredReservations = reservations.filter(reservation => {
        if (selectedFilter === 'all') return true;
        if (selectedFilter === 'upcoming') return isUpcoming(reservation.date, reservation.status);
        return reservation.status === selectedFilter;
    });

    const handleEdit = (reservationId: string) => {
        console.log('Edit reservation:', reservationId);
        // Implement edit logic
    };

    // ✅ Show custom cancel modal instead of browser confirm
    const handleCancelClick = (reservationId: string) => {
        setSelectedReservationId(reservationId);
        setShowCancelModal(true);
    };

    // ✅ Actual cancel function
    const handleCancelConfirm = async () => {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            console.log('Cancelling reservation:', selectedReservationId, 'with token:', csrfToken);

            const response = await fetch(`/api/pelanggan/reservations/${selectedReservationId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'same-origin',
                body: JSON.stringify({ status: 'cancelled' })
            });

            if (response.ok) {
                fetchReservations();
                setToastMessage('Reservasi berhasil dibatalkan');
                setToastType('success');
                setShowToast(true);
            } else {
                const errorText = await response.text();
                console.error('Failed to cancel reservation:', response.status, errorText);
                setToastMessage('Gagal membatalkan reservasi');
                setToastType('error');
                setShowToast(true);
            }
        } catch (error) {
            console.error('Error cancelling reservation:', error);
            setToastMessage('Terjadi kesalahan saat membatalkan reservasi');
            setToastType('error');
            setShowToast(true);
        }
    };

    const handleCallRestaurant = () => {
        const whatsappNumber = '6282175972892';
        const message = encodeURIComponent('Halo, saya ingin menanyakan tentang reservasi meja. Terima kasih.');
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    };

    const handleBack = () => {
        window.location.href = '/reservasi';
    };

    return (
        <Layout>
            <Head title="Riwayat Reservasi" />

            <div className="min-h-screen bg-gray-50">
                {/* Header dengan gradient background */}
                <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 py-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <button
                                    onClick={handleBack}
                                    className="mr-4 p-3 text-white/80 hover:text-white hover:bg-white/20 rounded-2xl transition-all duration-200 group backdrop-blur-sm"
                                >
                                    <ArrowLeft className="h-6 w-6 group-hover:scale-110 transition-transform" />
                                </button>
                                <div>
                                    <h1 className="text-3xl font-bold text-white drop-shadow-sm">Reservasi Saya</h1>
                                    <p className="text-orange-100 mt-1 font-medium">Kelola dan lihat riwayat reservasi meja Anda</p>
                                </div>
                            </div>
                            <button
                                onClick={handleCallRestaurant}
                                className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-200 border border-white/30 shadow-lg"
                            >
                                <Phone className="h-5 w-5" />
                                <span className="font-semibold">Chat WhatsApp</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Filter Tabs */}
                    <div className="mb-8">
                        <div className="flex flex-wrap gap-2">
                            {[
                                { id: 'all', label: 'Semua', count: reservations.length },
                                { id: 'upcoming', label: 'Akan Datang', count: reservations.filter(r => isUpcoming(r.date, r.status)).length },
                                { id: 'confirmed', label: 'Dikonfirmasi', count: reservations.filter(r => r.status === 'confirmed').length },
                                { id: 'pending', label: 'Pending', count: reservations.filter(r => r.status === 'pending').length },
                                { id: 'completed', label: 'Selesai', count: reservations.filter(r => r.status === 'completed').length }
                            ].map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => setSelectedFilter(filter.id)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        selectedFilter === filter.id
                                            ? 'bg-orange-500 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                    }`}
                                >
                                    {filter.label} ({filter.count})
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Reservations List */}
                    <div className="space-y-6">
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                                <p className="text-gray-600">Memuat reservasi...</p>
                            </div>
                        ) : filteredReservations.length === 0 ? (
                            <div className="text-center py-12">
                                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">Tidak ada reservasi</h3>
                                <p className="text-gray-500">Belum ada reservasi untuk filter yang dipilih</p>
                            </div>
                        ) : (
                            filteredReservations.map((reservation) => (
                                <div key={reservation.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                                    <span className="text-2xl font-bold text-orange-600">
                                                        {reservation.table?.number || '?'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-semibold text-gray-900">
                                                        Meja {reservation.table?.number || '?'}
                                                    </h3>
                                                    <p className="text-gray-600">Reservasi #{reservation.id}</p>
                                                </div>
                                            </div>

                                            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(reservation.status)}`}>
                                                {getStatusIcon(reservation.status)}
                                                <span className="font-medium text-sm">
                                                    {getStatusText(reservation.status)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                            {/* Date & Time */}
                                            <div className="space-y-3">
                                                <div className="flex items-center space-x-3">
                                                    <Calendar className="h-5 w-5 text-gray-500" />
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {formatDate(reservation.date)}
                                                        </p>
                                                        <p className="text-sm text-gray-600">Tanggal reservasi</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <Clock className="h-5 w-5 text-gray-500" />
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {formatTime(reservation.time)}
                                                        </p>
                                                        <p className="text-sm text-gray-600">Durasi {reservation.duration} menit</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Guests & Location */}
                                            <div className="space-y-3">
                                                <div className="flex items-center space-x-3">
                                                    <Users className="h-5 w-5 text-gray-500" />
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {reservation.guests} orang
                                                        </p>
                                                        <p className="text-sm text-gray-600">Jumlah tamu</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <MapPin className="h-5 w-5 text-gray-500" />
                                                    <div>
                                                        <p className="font-medium text-gray-900">{reservation.table?.location || 'Unknown'}</p>
                                                        <p className="text-sm text-gray-600">Lokasi meja</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Special Requests */}
                                            <div>
                                                {reservation.specialRequests && (
                                                    <div className="flex items-start space-x-3">
                                                        <MessageSquare className="h-5 w-5 text-gray-500 mt-1" />
                                                        <div>
                                                            <p className="font-medium text-gray-900 mb-1">Permintaan khusus:</p>
                                                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                                                {reservation.specialRequests}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <p className="text-sm text-gray-500">
                                                Dibuat pada {formatDate(reservation.createdAt)}
                                            </p>
                                            <div className="flex space-x-3">
                                                {canEdit(reservation) && (
                                                    <button
                                                        onClick={() => handleEdit(reservation.id)}
                                                        className="flex items-center space-x-2 px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                                    >
                                                        <Edit3 className="h-4 w-4" />
                                                        <span>Edit</span>
                                                    </button>
                                                )}
                                                {canCancel(reservation) && (
                                                    <button
                                                        onClick={() => handleCancelClick(reservation.id)}
                                                        className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        <span>Batalkan</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Butuh bantuan?</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={handleCallRestaurant}
                                className="flex items-center space-x-3 p-4 text-left hover:bg-gray-50 rounded-xl transition-colors"
                            >
                                <Phone className="h-6 w-6 text-orange-500" />
                                <div>
                                    <p className="font-medium text-gray-900">Chat WhatsApp</p>
                                    <p className="text-sm text-gray-600">+6282175972892</p>
                                </div>
                            </button>
                            <button className="flex items-center space-x-3 p-4 text-left hover:bg-gray-50 rounded-xl transition-colors">
                                <MessageSquare className="h-6 w-6 text-orange-500" />
                                <div>
                                    <p className="font-medium text-gray-900">Kirim Pesan</p>
                                    <p className="text-sm text-gray-600">Chat dengan customer service</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ✅ Custom Modals */}
            <ConfirmModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={handleCancelConfirm}
                title="Batalkan Reservasi"
                message="Apakah Anda yakin ingin membatalkan reservasi ini? Tindakan ini tidak dapat dibatalkan dan meja akan tersedia untuk pelanggan lain."
                confirmText="Ya, Batalkan"
                cancelText="Tidak"
                type="danger"
            />

            <Toast
                isOpen={showToast}
                onClose={() => setShowToast(false)}
                message={toastMessage}
                type={toastType}
            />
        </Layout>
    );
};

export default CustomerReservations;
