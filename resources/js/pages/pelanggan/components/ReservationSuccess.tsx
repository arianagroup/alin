import React from 'react';
import { CheckCircle, Calendar, Clock, Users, MapPin, Sparkles, PartyPopper } from 'lucide-react';
interface ReservationSuccessProps {
    reservation: any;
    onNewReservation: () => void;
}

const ReservationSuccess: React.FC<ReservationSuccessProps> = ({ reservation, onNewReservation }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-center border border-white/20 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-32 h-32 bg-green-500/10 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10">
                <div className="mb-8">
                    <div className="bg-gradient-to-r from-emerald-500 to-green-500 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl animate-bounce">
                        <CheckCircle className="h-12 w-12 text-white" />
                    </div>
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <PartyPopper className="h-6 w-6 text-yellow-500" />
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                            Reservasi Terkonfirmasi!
                        </h2>
                        <PartyPopper className="h-6 w-6 text-yellow-500" />
                    </div>
                    <p className="text-gray-600 text-lg">Meja Anda telah berhasil direservasi</p>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 mb-8 border border-gray-200/50">
                    <div className="flex items-center justify-center mb-6">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
                            <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 ml-3">Detail Reservasi</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                            <div className="flex items-center space-x-3">
                                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
                                    <MapPin className="h-5 w-5 text-white" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm text-gray-500 font-medium">Meja</p>
                                    <p className="text-xl font-bold text-gray-900">{reservation.tableNumber}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                            <div className="flex items-center space-x-3">
                                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg">
                                    <Calendar className="h-5 w-5 text-white" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm text-gray-500 font-medium">Tanggal</p>
                                    <p className="text-lg font-bold text-gray-900">{formatDate(reservation.date)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                            <div className="flex items-center space-x-3">
                                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                                    <Clock className="h-5 w-5 text-white" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm text-gray-500 font-medium">Waktu</p>
                                    <p className="text-xl font-bold text-gray-900">{reservation.time}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                            <div className="flex items-center space-x-3">
                                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-lg">
                                    <Users className="h-5 w-5 text-white" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm text-gray-500 font-medium">Tamu</p>
                                    <p className="text-xl font-bold text-gray-900">{reservation.guests}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {reservation.specialRequests && (
                        <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200/50">
                            <p className="text-sm font-semibold text-amber-800 mb-2">Permintaan Khusus:</p>
                            <p className="text-sm text-amber-700">{reservation.specialRequests}</p>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <button
                        onClick={onNewReservation}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    >
                        Buat Reservasi Lain
                    </button>

                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200/50">
                        <p className="text-sm text-gray-600">
                            <span className="font-semibold">📍 Penting:</span> Harap datang 15 menit sebelum waktu reservasi Anda
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReservationSuccess;
