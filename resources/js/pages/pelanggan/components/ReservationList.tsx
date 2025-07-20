import React from 'react';
import { Reservation } from '../types/reservation';
import { Calendar, Clock, Users, Phone, Mail, MessageSquare, CheckCircle, XCircle } from 'lucide-react';

interface ReservationListProps {
    reservations: Reservation[];
    onCancelReservation: (id: string) => void;
}

const ReservationList: React.FC<ReservationListProps> = ({ reservations, onCancelReservation }) => {
    const getStatusColor = (status: Reservation['status']) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: Reservation['status']) => {
        switch (status) {
            case 'confirmed':
                return 'Terkonfirmasi';
            case 'pending':
                return 'Menunggu';
            case 'cancelled':
                return 'Dibatalkan';
            default:
                return 'Unknown';
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

    if (reservations.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-gray-400 mb-4">
                    <Calendar className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada reservasi</h3>
                <p className="text-gray-500">Reservasi yang dibuat akan muncul di sini</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Daftar Reservasi</h2>

            <div className="space-y-4">
                {reservations.map((reservation) => (
                    <div
                        key={reservation.id}
                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{reservation.customerName}</h3>
                                <div className="flex items-center space-x-2 mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                    {reservation.status === 'confirmed' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {reservation.status === 'cancelled' && <XCircle className="h-3 w-3 mr-1" />}
                      {getStatusText(reservation.status)}
                  </span>
                                    <span className="text-sm text-gray-500">Meja {reservation.tableNumber}</span>
                                </div>
                            </div>

                            {reservation.status === 'confirmed' && (
                                <button
                                    onClick={() => onCancelReservation(reservation.id)}
                                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                                >
                                    Batalkan
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center space-x-2 text-gray-600">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(reservation.date)}</span>
                            </div>

                            <div className="flex items-center space-x-2 text-gray-600">
                                <Clock className="h-4 w-4" />
                                <span>{reservation.time}</span>
                            </div>

                            <div className="flex items-center space-x-2 text-gray-600">
                                <Users className="h-4 w-4" />
                                <span>{reservation.guests} orang</span>
                            </div>

                            <div className="flex items-center space-x-2 text-gray-600">
                                <Phone className="h-4 w-4" />
                                <span>{reservation.customerPhone}</span>
                            </div>

                            <div className="flex items-center space-x-2 text-gray-600">
                                <Mail className="h-4 w-4" />
                                <span>{reservation.customerEmail}</span>
                            </div>
                        </div>

                        {reservation.specialRequests && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-md">
                                <div className="flex items-start space-x-2">
                                    <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-700">Permintaan Khusus:</div>
                                        <div className="text-sm text-gray-600">{reservation.specialRequests}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReservationList;
