import React, { useState } from 'react';
import Header from './components/Header';
import TableGrid from './components/TableGrid';
import ReservationForm from './components/ReservationForm';
import ReservationSuccess from './components/ReservationSuccess';
import { usePelangganData } from '@/hooks/usePelangganData';

interface Table {
    id: string;
    number: string;
    capacity: number;
    location: string;
    status: 'available' | 'occupied' | 'reserved';
}

interface Reservation {
    id?: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    date: string;
    time: string;
    duration: number;
    guests: number;
    tableId: string | number;
    specialRequests?: string;
    notes?: string;
    createdAt?: string;
    tableNumber?: string;
    status?: string;
}

type AppState = 'tables' | 'reservation' | 'success';

function Home() {
    const [appState, setAppState] = useState<AppState>('tables');
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [lastReservation, setLastReservation] = useState<Reservation | null>(null);

    const { tables, loading, addReservation, fetchTables } = usePelangganData();

    const handleTableSelect = (table: Table) => {
        setSelectedTable(table);
        setAppState('reservation');
    };

    const handleReservationSubmit = async (reservationData: Reservation) => {
        try {
            const newReservation = await addReservation({
                ...reservationData,
                tableId: selectedTable?.id
            });

            setLastReservation({
                ...reservationData,
                id: newReservation.id,
                createdAt: newReservation.created_at,
                tableNumber: selectedTable?.number,
                status: newReservation.status || 'pending'
            });

            setAppState('success');
        } catch {
            alert('Gagal membuat reservasi. Silakan coba lagi.');
        }
    };

    const handleNewReservation = () => {
        setSelectedTable(null);
        setLastReservation(null);
        fetchTables(); // Refresh tables to get updated statuses
        setAppState('tables');
    };

    const handleBackToTables = () => {
        setSelectedTable(null);
        setAppState('tables');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {appState === 'tables' && (
                    <div className="space-y-8">


                        {loading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-4 text-gray-600">Memuat data meja...</p>
                            </div>
                        ) : (
                            <TableGrid
                                tables={tables}
                                onTableSelect={handleTableSelect}
                            />
                        )}
                    </div>
                )}

                {appState === 'reservation' && selectedTable && (
                    <div className="space-y-8">
                        <ReservationForm
                            selectedTable={selectedTable}
                            onReservationSubmit={handleReservationSubmit}
                            onBack={handleBackToTables}
                        />
                    </div>
                )}

                {appState === 'success' && lastReservation && (
                    <div className="space-y-8">
                        <ReservationSuccess
                            reservation={lastReservation}
                            onNewReservation={handleNewReservation}
                        />
                    </div>
                )}
            </main>
        </div>
    );
}

export default Home;
