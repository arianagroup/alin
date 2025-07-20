import React from 'react';
import { Table } from '../types/reservation';
import { Users } from 'lucide-react';

interface TableLayoutProps {
    tables: Table[];
    selectedTable: Table | null;
    onTableSelect: (table: Table) => void;
}

const TableLayout: React.FC<TableLayoutProps> = ({ tables, selectedTable, onTableSelect }) => {
    const getTableColor = (status: Table['status'], isSelected: boolean) => {
        if (isSelected) return 'bg-amber-500 border-amber-600';

        switch (status) {
            case 'available':
                return 'bg-green-100 border-green-300 hover:bg-green-200';
            case 'occupied':
                return 'bg-red-100 border-red-300 cursor-not-allowed';
            case 'reserved':
                return 'bg-yellow-100 border-yellow-300 cursor-not-allowed';
            default:
                return 'bg-gray-100 border-gray-300';
        }
    };

    const getStatusText = (status: Table['status']) => {
        switch (status) {
            case 'available':
                return 'Tersedia';
            case 'occupied':
                return 'Terisi';
            case 'reserved':
                return 'Dipesan';
            default:
                return 'Unknown';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Layout Meja Restaurant</h2>

            <div className="relative bg-gray-50 rounded-lg p-8 min-h-96">
                <div className="absolute top-4 left-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
                            <span>Tersedia</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded"></div>
                            <span>Terisi</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-300 rounded"></div>
                            <span>Dipesan</span>
                        </div>
                    </div>
                </div>

                {tables.map((table) => (
                    <div
                        key={table.id}
                        className={`absolute w-20 h-20 rounded-lg border-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 ${getTableColor(
                            table.status,
                            selectedTable?.id === table.id
                        )}`}
                        style={{
                            // left: `${table.position.x}px`,
                            // top: `${table.position.y}px`,
                        }}
                        onClick={() => table.status === 'available' && onTableSelect(table)}
                    >
                        <div className="text-lg font-bold text-gray-800">
                            {table.number}
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-600">
                            <Users className="h-3 w-3" />
                            <span>{table.capacity}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            {getStatusText(table.status)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TableLayout;
