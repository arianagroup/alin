import React, { useState } from 'react';
import { X, User, Phone, Mail, Calendar, Clock, Users, Table, MessageSquare, Star, Sparkles } from 'lucide-react';
import { Toast, useToast } from '../../../components/ui/toast';

interface Table {
    id: string;
    number: number;
    capacity: number;
    location: string;
    status: 'available' | 'occupied' | 'reserved' | 'maintenance';
}

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

interface ReservationFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reservation: Omit<Reservation, 'id' | 'createdAt' | 'status'>) => Promise<void> | void;
    tables: Table[];
    editingReservation?: Reservation | null;
}

const ReservationForm: React.FC<ReservationFormProps> = ({
                                                             isOpen,
                                                             onClose,
                                                             onSubmit,
                                                             tables,
                                                             editingReservation
                                                         }) => {
    const [formData, setFormData] = useState({
        customerName: editingReservation?.customerName || '',
        customerPhone: editingReservation?.customerPhone || '',
        customerEmail: editingReservation?.customerEmail || '',
        date: editingReservation?.date || new Date().toISOString().split('T')[0],
        time: editingReservation?.time || '',
        duration: editingReservation?.duration || 120,
        guests: editingReservation?.guests || 2,
        tableId: editingReservation?.tableId || '',
        specialRequests: editingReservation?.specialRequests || '',
        notes: editingReservation?.notes || ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast, showToast, hideToast } = useToast();

    const availableTables = tables.filter(table => {
        // Check capacity first
        if (table.capacity < formData.guests) {
            return false;
        }

        // If editing existing reservation, allow same table
        if (editingReservation && table.id === editingReservation.tableId) {
            return true;
        }

        // Only show available tables (not reserved, occupied, or maintenance)
        return table.status === 'available';
    });

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.customerName.trim()) {
            newErrors.customerName = 'Nama pelanggan wajib diisi';
        }

        if (!formData.customerPhone.trim()) {
            newErrors.customerPhone = 'Nomor telepon wajib diisi';
        } else if (!/^(\+62|62|0)[0-9]{9,13}$/.test(formData.customerPhone.replace(/\s/g, ''))) {
            newErrors.customerPhone = 'Format nomor telepon tidak valid';
        }

        if (!formData.customerEmail.trim()) {
            newErrors.customerEmail = 'Email wajib diisi';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
            newErrors.customerEmail = 'Format email tidak valid';
        }

        if (!formData.date) {
            newErrors.date = 'Tanggal reservasi wajib dipilih';
        }

        if (!formData.time) {
            newErrors.time = 'Waktu reservasi wajib dipilih';
        }

        if (formData.guests < 1) {
            newErrors.guests = 'Jumlah tamu minimal 1 orang';
        }

        if (!formData.tableId) {
            newErrors.tableId = 'Meja wajib dipilih';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            console.log('Submitting form data:', formData);

            // Call the parent onSubmit which handles the API call
            await onSubmit(formData);

            console.log('Form submitted successfully');

            showToast(
                editingReservation ? 'Reservasi berhasil diperbarui!' : 'Reservasi berhasil ditambahkan!',
                'success'
            );

            // Reset form
            setFormData({
                customerName: '',
                customerPhone: '',
                customerEmail: '',
                date: new Date().toISOString().split('T')[0],
                time: '',
                duration: 120,
                guests: 2,
                tableId: '',
                specialRequests: '',
                notes: ''
            });

            // Close form after a short delay to show success toast
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (error) {
            console.error('Error submitting form:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            if (errorMessage.includes('already reserved') || errorMessage.includes('sudah dipesan')) {
                showToast('Meja sudah dipesan untuk waktu tersebut. Silakan pilih waktu atau meja lain.', 'error');
            } else {
                showToast('Gagal menambahkan reservasi: ' + errorMessage, 'error');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="relative flex items-center justify-between">
                        <div>
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="p-2 bg-white/20 rounded-xl">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold text-white">
                                    {editingReservation ? 'Edit Reservasi' : 'Reservasi Baru'}
                                </h2>
                            </div>
                            <p className="text-blue-100 font-medium">
                                Buat reservasi baru dengan mudah dan cepat
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200 group"
                        >
                            <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-200" />
                        </button>
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)] custom-scrollbar">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Customer Information */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-2 bg-blue-100 rounded-xl">
                                    <User className="w-5 h-5 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Informasi Pelanggan</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Nama Lengkap *
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={formData.customerName}
                                            onChange={(e) => handleInputChange('customerName', e.target.value)}
                                            className={`pl-11 pr-4 py-3 w-full border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                                                errors.customerName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                            }`}
                                            placeholder="Masukkan nama lengkap"
                                        />
                                    </div>
                                    {errors.customerName && (
                                        <p className="text-sm text-red-600 flex items-center space-x-1">
                                            <span>⚠️</span>
                                            <span>{errors.customerName}</span>
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Nomor Telepon *
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            value={formData.customerPhone}
                                            onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                                            className={`pl-11 pr-4 py-3 w-full border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                                                errors.customerPhone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                            }`}
                                            placeholder="+62 812 3456 7890"
                                        />
                                    </div>
                                    {errors.customerPhone && (
                                        <p className="text-sm text-red-600 flex items-center space-x-1">
                                            <span>⚠️</span>
                                            <span>{errors.customerPhone}</span>
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Email *
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="email"
                                            value={formData.customerEmail}
                                            onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                                            className={`pl-11 pr-4 py-3 w-full border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                                                errors.customerEmail ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                            }`}
                                            placeholder="nama@email.com"
                                        />
                                    </div>
                                    {errors.customerEmail && (
                                        <p className="text-sm text-red-600 flex items-center space-x-1">
                                            <span>⚠️</span>
                                            <span>{errors.customerEmail}</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Reservation Details */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-2 bg-purple-100 rounded-xl">
                                    <Calendar className="w-5 h-5 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Detail Reservasi</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Tanggal *
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => handleInputChange('date', e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            className={`pl-11 pr-4 py-3 w-full border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                                                errors.date ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                            }`}
                                        />
                                    </div>
                                    {errors.date && (
                                        <p className="text-sm text-red-600 flex items-center space-x-1">
                                            <span>⚠️</span>
                                            <span>{errors.date}</span>
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Waktu *
                                    </label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="time"
                                            value={formData.time}
                                            onChange={(e) => handleInputChange('time', e.target.value)}
                                            className={`pl-11 pr-4 py-3 w-full border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                                                errors.time ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                            }`}
                                        />
                                    </div>
                                    {errors.time && (
                                        <p className="text-sm text-red-600 flex items-center space-x-1">
                                            <span>⚠️</span>
                                            <span>{errors.time}</span>
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Durasi (menit)
                                    </label>
                                    <select
                                        value={formData.duration}
                                        onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                                        className="px-4 py-3 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    >
                                        <option value={60}>1 Jam</option>
                                        <option value={90}>1.5 Jam</option>
                                        <option value={120}>2 Jam</option>
                                        <option value={150}>2.5 Jam</option>
                                        <option value={180}>3 Jam</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Jumlah Tamu *
                                    </label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="number"
                                            min="1"
                                            max="20"
                                            value={formData.guests}
                                            onChange={(e) => handleInputChange('guests', parseInt(e.target.value) || 1)}
                                            className={`pl-11 pr-4 py-3 w-full border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                                                errors.guests ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                            }`}
                                            placeholder="Jumlah tamu"
                                        />
                                    </div>
                                    {errors.guests && (
                                        <p className="text-sm text-red-600 flex items-center space-x-1">
                                            <span>⚠️</span>
                                            <span>{errors.guests}</span>
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Pilih Meja *
                                    </label>
                                    <div className="relative">
                                        <Table className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <select
                                            value={formData.tableId}
                                            onChange={(e) => handleInputChange('tableId', e.target.value)}
                                            className={`pl-11 pr-4 py-3 w-full border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                                                errors.tableId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                            }`}
                                        >
                                            <option value="">Pilih meja</option>
                                            {availableTables.map(table => (
                                                <option key={table.id} value={table.id}>
                                                    Meja {table.number} - {table.location} (Kapasitas: {table.capacity})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.tableId && (
                                        <p className="text-sm text-red-600 flex items-center space-x-1">
                                            <span>⚠️</span>
                                            <span>{errors.tableId}</span>
                                        </p>
                                    )}
                                    {availableTables.length === 0 && (
                                        <p className="text-sm text-amber-600 flex items-center space-x-1">
                                            <span>⚠️</span>
                                            <span>Tidak ada meja tersedia untuk {formData.guests} orang</span>
                                        </p>
                                    )}
                                    {/*{formData.tableId && formData.date && formData.time && (*/}
                                    {/*    <p className="text-xs text-blue-600 mt-1">*/}
                                    {/*        💡 Tip: Jika meja tidak tersedia, coba ubah waktu reservasi*/}
                                    {/*    </p>*/}
                                    {/*)}*/}
                                    {/*{formData.tableId && formData.date && formData.time && (*/}
                                    {/*    <p className="text-xs text-blue-600 mt-1">*/}
                                    {/*        💡 Tip: Jika meja tidak tersedia, coba ubah waktu reservasi*/}
                                    {/*    </p>*/}
                                    {/*)}*/}
                                </div>
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-2 bg-emerald-100 rounded-xl">
                                    <MessageSquare className="w-5 h-5 text-emerald-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Informasi Tambahan</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Permintaan Khusus
                                    </label>
                                    <textarea
                                        value={formData.specialRequests}
                                        onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                                        rows={4}
                                        className="px-4 py-3 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200"
                                        placeholder="Contoh: Ulang tahun, vegetarian, alergi makanan, dll."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Catatan Internal
                                    </label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) => handleInputChange('notes', e.target.value)}
                                        rows={4}
                                        className="px-4 py-3 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200"
                                        placeholder="Catatan untuk staff restoran..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || availableTables.length === 0}
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Menyimpan...</span>
                                    </>
                                ) : (
                                    <>
                                        <Star className="w-5 h-5" />
                                        <span>{editingReservation ? 'Update Reservasi' : 'Buat Reservasi'}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={hideToast}
            />
        </div>
    );
};

export default ReservationForm;
