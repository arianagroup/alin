import React from 'react';
import { Plus, Users, Table, MapPin, Edit, Trash2 } from 'lucide-react';
import { Table as TableType } from '../../../types/restaurant';
import { getTableStatusColor } from '../../../utils/statusColors';
import { ConfirmationModal } from './ConfirmationModal';

interface TablesTabProps {
    tables: TableType[];
    loading?: boolean;
    updateTableStatus: (id: string, status: TableType['status']) => void;
    setEditingTable: (table: TableType) => void;
    setShowAddTable: (show: boolean) => void;
    showTableDeleteModal: boolean;
    setShowTableDeleteModal: (show: boolean) => void;
    tableToDelete: string | null;
    setTableToDelete: (id: string | null) => void;
    deleteTable: (id: string) => void;
}

export const TablesTab: React.FC<TablesTabProps> = ({
    tables,
    loading = false,
    updateTableStatus,
    setEditingTable,
    setShowAddTable,
    showTableDeleteModal,
    setShowTableDeleteModal,
    tableToDelete,
    setTableToDelete,
    deleteTable
}) => (
    <div className="space-y-8 animate-fadeIn">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Manajemen Meja
                </h1>
                <p className="text-gray-600 font-medium mt-2">Kelola layout dan status meja restoran</p>
            </div>
            <button
                onClick={() => setShowAddTable(true)}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-teal-700 flex items-center space-x-2 font-semibold shadow-lg hover:shadow-emerald-500/25 transition-all duration-200"
            >
                <Plus className="w-4 h-4" />
                <span>Tambah Meja</span>
            </button>
        </div>

        {/* Table Layout */}
        {loading ? (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                <span className="ml-3 text-gray-600">Loading tables...</span>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tables.map((table) => (
                <div key={table.id} className="relative bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-500 transform hover:-translate-y-2">
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    Meja {table.number}
                                </h3>
                                <div className="flex items-center space-x-1 mt-1">
                                    <MapPin className="w-3 h-3 text-gray-400" />
                                    <p className="text-sm text-gray-600">{table.location}</p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-xl text-sm font-bold border shadow-sm ${getTableStatusColor(table.status)}`}>
                                {table.status}
                            </span>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center text-sm text-gray-700 bg-gray-50 p-3 rounded-xl">
                                <Users className="w-4 h-4 mr-2" />
                                <span className="font-medium">Kapasitas: {table.capacity} orang</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-700 bg-gray-50 p-3 rounded-xl">
                                <Table className="w-4 h-4 mr-2" />
                                <span className="font-medium">ID: {table.id}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {table.status === 'available' && (
                                <>
                                    <button
                                        onClick={() => updateTableStatus(table.id, 'occupied')}
                                        className="bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-3 rounded-xl text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 active:scale-95 relative z-20"
                                    >
                                        Set Occupied
                                    </button>
                                    <button
                                        onClick={() => updateTableStatus(table.id, 'maintenance')}
                                        className="bg-gradient-to-r from-gray-500 to-gray-600 text-white py-2 px-3 rounded-xl text-sm font-medium hover:from-gray-600 hover:to-gray-700 transition-all duration-200 active:scale-95 relative z-20"
                                    >
                                        Maintenance
                                    </button>
                                </>
                            )}
                            {table.status === 'occupied' && (
                                <>
                                    <button
                                        onClick={() => updateTableStatus(table.id, 'available')}
                                        className="bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-3 rounded-xl text-sm font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 active:scale-95 relative z-20"
                                    >
                                        Set Available
                                    </button>
                                    <button
                                        onClick={() => updateTableStatus(table.id, 'maintenance')}
                                        className="bg-gradient-to-r from-gray-500 to-gray-600 text-white py-2 px-3 rounded-xl text-sm font-medium hover:from-gray-600 hover:to-gray-700 transition-all duration-200 active:scale-95 relative z-20"
                                    >
                                        Maintenance
                                    </button>
                                </>
                            )}
                            {table.status === 'reserved' && (
                                <>
                                    <button
                                        onClick={() => updateTableStatus(table.id, 'occupied')}
                                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-3 rounded-xl text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 active:scale-95 relative z-20"
                                    >
                                        Check In
                                    </button>
                                    <button
                                        onClick={() => updateTableStatus(table.id, 'available')}
                                        className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-2 px-3 rounded-xl text-sm font-medium hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 active:scale-95 relative z-20"
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}
                            {table.status === 'maintenance' && (
                                <>
                                    <button
                                        onClick={() => updateTableStatus(table.id, 'available')}
                                        className="bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-3 rounded-xl text-sm font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 active:scale-95 relative z-20"
                                    >
                                        Set Ready
                                    </button>
                                    <button
                                        onClick={() => updateTableStatus(table.id, 'occupied')}
                                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-3 rounded-xl text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 active:scale-95 relative z-20"
                                    >
                                        Force Occupy
                                    </button>
                                </>
                            )}
                        </div>

                        <div className="flex space-x-2 pt-4 border-t border-gray-200">
                            <button
                                onClick={() => setEditingTable(table)}
                                className="flex-1 bg-blue-100 text-blue-600 py-2 px-3 rounded-xl text-sm font-medium hover:bg-blue-200 transition-colors duration-200 flex items-center justify-center space-x-1 relative z-20"
                            >
                                <Edit className="w-3 h-3" />
                                <span>Edit</span>
                            </button>
                            <button
                                onClick={() => {
                                    setTableToDelete(table.id);
                                    setShowTableDeleteModal(true);
                                }}
                                className="flex-1 bg-red-100 text-red-600 py-2 px-3 rounded-xl text-sm font-medium hover:bg-red-200 transition-colors duration-200 flex items-center justify-center space-x-1 relative z-20"
                            >
                                <Trash2 className="w-3 h-3" />
                                <span>Hapus</span>
                            </button>
                        </div>
                    </div>
                </div>
                ))}
            </div>
        )}
        
        <ConfirmationModal
            isOpen={showTableDeleteModal}
            onClose={() => {
                setShowTableDeleteModal(false);
                setTableToDelete(null);
            }}
            onConfirm={() => {
                if (tableToDelete) {
                    deleteTable(tableToDelete);
                }
            }}
            title="Konfirmasi Penghapusan"
            message={`Apakah Anda yakin ingin menghapus Meja ${tables.find(t => t.id === tableToDelete)?.number || ''}?`}
            confirmText="Hapus"
            cancelText="Batal"
            type="danger"
        />
    </div>
);