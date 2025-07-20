import React, { useState } from 'react';
import { X, Table, Users, MapPin, Settings, Sparkles, AlertCircle } from 'lucide-react';

interface Table {
    id: string;
    number: number;
    capacity: number;
    location: string;
    status: 'available' | 'occupied' | 'reserved' | 'maintenance';
}

interface TableFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (table: Omit<Table, 'id' | 'status'>) => Promise<void> | void;
    editingTable?: Table | null;
}

const TableForm: React.FC<TableFormProps> = ({
                                                 isOpen,
                                                 onClose,
                                                 onSubmit,
                                                 editingTable
                                             }) => {
    const [formData, setFormData] = useState({
        number: editingTable?.number || 0,
        capacity: editingTable?.capacity || 2,
        location: editingTable?.location || ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const locations = [
        'Window', 'Center', 'Corner', 'Private', 'Bar', 'Terrace',
        'Garden', 'VIP', 'Balcony', 'Main Hall'
    ];

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.number || formData.number < 1) {
            newErrors.number = 'Nomor meja harus diisi dan lebih dari 0';
        }

        if (!formData.capacity || formData.capacity < 1) {
            newErrors.capacity = 'Kapasitas harus diisi dan lebih dari 0';
        }

        if (!formData.location.trim()) {
            newErrors.location = 'Lokasi meja wajib dipilih';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Call the parent onSubmit which handles the API call
            console.log('Submitting table data:', formData);
            await onSubmit(formData);
            
            console.log('Table added successfully');
            
            // Reset form
            setFormData({
                number: 0,
                capacity: 2,
                location: ''
            });
            
            onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
            
            // Check for specific errors
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            
            // Check for JSON error message format
            if (typeof errorMsg === 'string' && errorMsg.includes('number has already been taken')) {
                setErrors(prev => ({ ...prev, number: 'Nomor meja sudah digunakan. Pilih nomor lain.' }));
            } else if (errorMsg.includes('SQLSTATE[23000]') || errorMsg.includes('Duplicate entry') || 
                errorMsg.includes('unique')) {
                setErrors(prev => ({ ...prev, number: 'Nomor meja sudah digunakan. Pilih nomor lain.' }));
            } else {
                try {
                    // Try to parse JSON error message
                    const parsedError = JSON.parse(errorMsg);
                    if (parsedError.message && parsedError.message.includes('number has already been taken')) {
                        setErrors(prev => ({ ...prev, number: 'Nomor meja sudah digunakan. Pilih nomor lain.' }));
                    } else {
                        setErrorMessage('Gagal menambahkan meja. Silakan coba lagi.');
                    }
                } catch {
                    // If not JSON or other error
                    setErrorMessage('Gagal menambahkan meja. Silakan coba lagi.');
                }
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
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/90 to-teal-600/90"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="relative flex items-center justify-between">
                        <div>
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="p-2 bg-white/20 rounded-xl">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold text-white">
                                    {editingTable ? 'Edit Meja' : 'Tambah Meja Baru'}
                                </h2>
                            </div>
                            <p className="text-emerald-100 font-medium">
                                Kelola pengaturan meja restoran dengan mudah
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
                <div className="p-8">
                    {errorMessage && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start">
                            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium">Terjadi kesalahan</p>
                                <p className="text-sm">{errorMessage}</p>
                            </div>
                            <button 
                                onClick={() => setErrorMessage(null)}
                                className="ml-auto text-red-400 hover:text-red-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Table Information */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="p-2 bg-emerald-100 rounded-xl">
                                    <Table className="w-5 h-5 text-emerald-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Informasi Meja</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Nomor Meja *
                                    </label>
                                    <div className="relative">
                                        <Table className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.number || ''}
                                            onChange={(e) => handleInputChange('number', parseInt(e.target.value) || 0)}
                                            className={`pl-11 pr-4 py-3 w-full border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ${
                                                errors.number ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                            }`}
                                            placeholder="Contoh: 1, 2, 3..."
                                        />
                                    </div>
                                    {errors.number && (
                                        <p className="text-sm text-red-600 flex items-center space-x-1">
                                            <span>⚠️</span>
                                            <span>{errors.number}</span>
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Kapasitas *
                                    </label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="number"
                                            min="1"
                                            max="20"
                                            value={formData.capacity || ''}
                                            onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
                                            className={`pl-11 pr-4 py-3 w-full border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ${
                                                errors.capacity ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                            }`}
                                            placeholder="Jumlah kursi"
                                        />
                                    </div>
                                    {errors.capacity && (
                                        <p className="text-sm text-red-600 flex items-center space-x-1">
                                            <span>⚠️</span>
                                            <span>{errors.capacity}</span>
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Lokasi *
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <select
                                            value={formData.location}
                                            onChange={(e) => handleInputChange('location', e.target.value)}
                                            className={`pl-11 pr-4 py-3 w-full border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ${
                                                errors.location ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                            }`}
                                        >
                                            <option value="">Pilih lokasi meja</option>
                                            {locations.map(location => (
                                                <option key={location} value={location}>
                                                    {location}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.location && (
                                        <p className="text-sm text-red-600 flex items-center space-x-1">
                                            <span>⚠️</span>
                                            <span>{errors.location}</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-200">
                            <h4 className="text-lg font-bold text-emerald-800 mb-4 flex items-center space-x-2">
                                <Settings className="w-5 h-5" />
                                <span>Preview Meja</span>
                            </h4>
                            <div className="bg-white p-4 rounded-xl border border-emerald-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h5 className="text-lg font-bold text-gray-900">
                                            Meja {formData.number || '?'}
                                        </h5>
                                        <p className="text-sm text-gray-600">{formData.location || 'Lokasi belum dipilih'}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <Users className="w-4 h-4" />
                                            <span>Kapasitas: {formData.capacity || 0} orang</span>
                                        </div>
                                        <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      Available
                    </span>
                                    </div>
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
                                disabled={isSubmitting}
                                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Menyimpan...</span>
                                    </>
                                ) : (
                                    <>
                                        <Table className="w-5 h-5" />
                                        <span>{editingTable ? 'Update Meja' : 'Tambah Meja'}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TableForm;
