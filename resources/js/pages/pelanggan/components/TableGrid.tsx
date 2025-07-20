import React from 'react';
import { Users, CheckCircle, XCircle, Clock } from 'lucide-react';

interface TableGridProps {
    tables: any[];
    onTableSelect: (table: any) => void;
}

const TableGrid: React.FC<TableGridProps> = ({ tables, onTableSelect }) => {
    const getTableStyle = (status: string) => {
        switch (status) {
            case 'available':
                return 'bg-gradient-to-br from-emerald-100 to-green-100 border-emerald-300 hover:from-emerald-200 hover:to-green-200 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105';
            case 'occupied':
                return 'bg-gradient-to-br from-red-100 to-rose-100 border-red-300 cursor-not-allowed opacity-75';
            case 'reserved':
                return 'bg-gradient-to-br from-amber-100 to-yellow-100 border-amber-300 cursor-not-allowed opacity-75';
            default:
                return 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'available':
                return <CheckCircle className="h-4 w-4 text-emerald-600" />;
            case 'occupied':
                return <XCircle className="h-4 w-4 text-red-600" />;
            case 'reserved':
                return <Clock className="h-4 w-4 text-amber-600" />;
            default:
                return null;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'available':
                return 'Tersedia';
            case 'occupied':
                return 'Terisi';
            case 'reserved':
                return 'Dipesan';
            default:
                return 'Tidak Diketahui';
        }
    };

    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
            <div className="mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
                    Pilih Meja Anda
                </h2>
                <div className="flex items-center space-x-8 text-sm">
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-gradient-to-br from-emerald-400 to-green-400 rounded-full shadow-sm"></div>
                        <span className="text-gray-700 font-medium">Tersedia</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-gradient-to-br from-red-400 to-rose-400 rounded-full shadow-sm"></div>
                        <span className="text-gray-700 font-medium">Terisi</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-gradient-to-br from-amber-400 to-yellow-400 rounded-full shadow-sm"></div>
                        <span className="text-gray-700 font-medium">Dipesan</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {tables.map((table) => (
                    <div
                        key={table.id}
                        className={`relative p-6 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-300 ${getTableStyle(table.status)}`}
                        onClick={() => table.status === 'available' && onTableSelect(table)}
                    >
                        <div className="absolute top-3 right-3">
                            {getStatusIcon(table.status)}
                        </div>

                        <div className="text-3xl font-bold text-gray-800 mb-3">
                            {table.number}
                        </div>

                        <div className="flex items-center space-x-2 text-gray-600 mb-2">
                            <Users className="h-5 w-5" />
                            <span className="font-medium">{table.capacity} orang</span>
                        </div>

                        <div className="text-xs text-gray-500 mb-3 font-medium">
                            📍 {table.location}
                        </div>

                        <div className="px-3 py-1 rounded-full text-xs font-semibold">
              <span className={`${
                  table.status === 'available' ? 'text-emerald-700' :
                      table.status === 'occupied' ? 'text-red-700' :
                          'text-amber-700'
              }`}>
                {getStatusText(table.status)}
              </span>
                        </div>

                        {table.status === 'available' ? (
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 to-purple-500/0 hover:from-blue-500/10 hover:to-purple-500/10 transition-all duration-300"></div>
                        ) : (
                            <div className="absolute bottom-0 left-0 right-0 bg-black/10 py-1 text-center text-xs font-medium text-gray-700 rounded-b-xl">
                                {table.status === 'occupied' ? 'Sedang digunakan' : 'Sudah dipesan'}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TableGrid;
