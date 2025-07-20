import React, { useState } from 'react';
import { Calendar, Clock, Users, MessageSquare, ArrowLeft, Sparkles, User, Mail, Phone, Timer } from 'lucide-react';

const timeSlots = ['11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'];

// ✅ Opsi durasi yang user-friendly
const durationOptions = [
    { value: 60, label: '1 jam', description: 'Cocok untuk makan cepat' },
    { value: 90, label: '1.5 jam', description: 'Waktu standar makan' },
    { value: 120, label: '2 jam', description: 'Recommended - santai' },
    { value: 150, label: '2.5 jam', description: 'Untuk acara khusus' },
    { value: 180, label: '3 jam', description: 'Gathering & perayaan' },
    { value: 240, label: '4 jam', description: 'Event besar' }
];

interface Table {
    id: string;
    number: string;
    capacity: number;
    location: string;
}

interface Reservation {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    date: string;
    time: string;
    duration: number;
    guests: number;
    tableId: number;
    specialRequests: string;
    notes: string;
}

interface ReservationFormProps {
    selectedTable: Table;
    onReservationSubmit: (reservation: Reservation) => void;
    onBack: () => void;
}

interface FormData {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    date: string;
    time: string;
    duration: number; // ✅ Tambahkan duration ke FormData
    guests: number;
    specialRequests: string;
}

const ReservationForm: React.FC<ReservationFormProps> = ({
                                                             selectedTable,
                                                             onReservationSubmit,
                                                             onBack
                                                         }) => {
    const [formData, setFormData] = useState<FormData>({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        date: '',
        time: '',
        duration: 120, // ✅ Default 2 jam
        guests: 1,
        specialRequests: ''
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const reservation: Reservation = {
            customerName: formData.customerName,
            customerPhone: formData.customerPhone,
            customerEmail: formData.customerEmail,
            date: formData.date,
            time: formData.time,
            duration: formData.duration, // ✅ Gunakan durasi dari form
            guests: formData.guests,
            tableId: parseInt(selectedTable.id),
            specialRequests: formData.specialRequests || '',
            notes: ''
        };

        console.log('Form data being submitted:', reservation);
        onReservationSubmit(reservation);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'guests' || name === 'duration' ? parseInt(value) : value
        }));
    };

    // ✅ Get selected duration info for display
    const selectedDurationInfo = durationOptions.find(option => option.value === formData.duration);

    const today = new Date().toISOString().split('T')[0];
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    const maxDateStr = maxDate.toISOString().split('T')[0];

    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
            <div className="flex items-center mb-8">
                <button
                    onClick={onBack}
                    className="mr-4 p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-2xl transition-all duration-200 group"
                >
                    <ArrowLeft className="h-6 w-6 group-hover:scale-110 transition-transform" />
                </button>
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Reservasi Meja {selectedTable.number}
                    </h2>
                    <p className="text-gray-600 mt-1">Lengkapi detail reservasi Anda</p>
                </div>
            </div>

            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200/50">
                <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
                        <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center space-x-6 text-sm">
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold text-gray-700">Meja:</span>
                                <span className="text-gray-900 font-bold">{selectedTable.number}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4 text-gray-500" />
                                <span className="text-gray-700">Kapasitas: <span className="font-semibold">{selectedTable.capacity} orang</span></span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-700">Lokasi: <span className="font-semibold">{selectedTable.location}</span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                            <User className="h-4 w-4 mr-2 text-blue-500" />
                            Nama Lengkap
                        </label>
                        <input
                            type="text"
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-4 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                            placeholder="Masukkan nama lengkap Anda"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                            <Mail className="h-4 w-4 mr-2 text-green-500" />
                            Alamat Email
                        </label>
                        <input
                            type="email"
                            name="customerEmail"
                            value={formData.customerEmail}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-4 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
                            placeholder="email@anda.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                            <Phone className="h-4 w-4 mr-2 text-purple-500" />
                            Nomor Telepon
                        </label>
                        <input
                            type="tel"
                            name="customerPhone"
                            value={formData.customerPhone}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-4 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                            placeholder="+62 812 3456 7890"
                        />
                    </div>
                </div>

                {/* Reservation Details - Now with 4 columns including Duration */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                            <Calendar className="h-4 w-4 mr-2 text-orange-500" />
                            Tanggal
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            min={today}
                            max={maxDateStr}
                            className="w-full px-4 py-4 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                            <Clock className="h-4 w-4 mr-2 text-red-500" />
                            Waktu
                        </label>
                        <select
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-4 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
                        >
                            <option value="">Pilih waktu</option>
                            {timeSlots.map(time => (
                                <option key={time} value={time}>{time}</option>
                            ))}
                        </select>
                    </div>

                    {/* ✅ New Duration Dropdown */}
                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                            <Timer className="h-4 w-4 mr-2 text-indigo-500" />
                            Durasi
                        </label>
                        <select
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-4 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                        >
                            {durationOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {/* ✅ Show description for selected duration */}
                        {selectedDurationInfo && (
                            <p className="text-xs text-indigo-600 mt-1 font-medium">
                                {selectedDurationInfo.description}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                            <Users className="h-4 w-4 mr-2 text-emerald-500" />
                            Jumlah Tamu
                        </label>
                        <select
                            name="guests"
                            value={formData.guests}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-4 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                        >
                            {Array.from({ length: selectedTable.capacity }, (_, i) => i + 1).map(num => (
                                <option key={num} value={num}>{num} orang</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* ✅ Duration Summary Card */}
                {formData.time && formData.duration && (
                    <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200/50">
                        <div className="flex items-center space-x-3">
                            <Timer className="h-5 w-5 text-indigo-600" />
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-indigo-900">
                                    Waktu Reservasi: {formData.time} - {(() => {
                                    // ✅ Perbaiki perhitungan waktu selesai
                                    const startTime = new Date(`2000-01-01T${formData.time}:00`);
                                    const endTime = new Date(startTime.getTime() + formData.duration * 60 * 1000); // formData.duration dalam menit
                                    return endTime.toLocaleTimeString('id-ID', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false
                                    });
                                })()}
                                </p>
                                <p className="text-xs text-indigo-700">
                                    Durasi: {selectedDurationInfo?.label} • {selectedDurationInfo?.description}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                        <MessageSquare className="h-4 w-4 mr-2 text-amber-500" />
                        Permintaan Khusus (Opsional)
                    </label>
                    <textarea
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-4 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all resize-none"
                        placeholder="Ada permintaan khusus? (contoh: kursi dekat jendela, kursi bayi, pantangan makanan)"
                    />
                </div>

                <div className="flex space-x-4 pt-6">
                    <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    >
                        Konfirmasi Reservasi
                    </button>
                    <button
                        type="button"
                        onClick={onBack}
                        className="flex-1 bg-gray-200 text-gray-800 py-4 px-6 rounded-xl hover:bg-gray-300 transition-all duration-300 font-semibold"
                    >
                        Kembali
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReservationForm;
