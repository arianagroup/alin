import React, { useState } from 'react';
import { Head } from '@inertiajs/react'; // ✅ Tambahkan Head dari Inertia
import { X } from 'lucide-react';
import Dashboard from './Dashboard';
import ReservationForm from '../admin/components/ReservationForm';
import TableForm from '../admin/components/TableForm';
import Analytics from '../admin/components/Analytics';
import { ReservationsTab } from './components/ReservationsTab';
import { TablesTab } from './components/TablesTab';
import { CustomersTab } from './components/CustomersTab';

import { Sidebar } from './components/Sidebar';
import { useRestaurantData } from '../../hooks/useRestaurantData';
import { Reservation, Table, Customer } from '../../types/restaurant'; // ✅ Tambahkan Customer import
import { PageContainer } from '../../components/layout/PageContainer';

// ✅ Tambahkan interface untuk props dari Laravel
interface HomeProps {
    customers?: Customer[];
    reservations?: Reservation[];
    tables?: Table[];
    auth?: {
        user: any;
    };
}

// ✅ Update function signature untuk menerima props
function Home({ customers: initialCustomers, reservations: initialReservations, tables: initialTables, auth }: HomeProps = {}) {
    const [activeTab, setActiveTab] = useState('dashboard');
    // Set tanggal default ke hari ini dalam format YYYY-MM-DD
    const getTodayFormatted = () => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    };
    const [selectedDate, setSelectedDate] = useState(getTodayFormatted()); // Default tanggal hari ini
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showAddReservation, setShowAddReservation] = useState(false);
    const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
    const [showAddTable, setShowAddTable] = useState(false);
    const [editingTable, setEditingTable] = useState<Table | null>(null);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [showTableDeleteModal, setShowTableDeleteModal] = useState(false);
    const [showReservationDeleteModal, setShowReservationDeleteModal] = useState(false);
    const [tableToDelete, setTableToDelete] = useState<string | null>(null);
    const [reservationToDelete, setReservationToDelete] = useState<string | null>(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // ✅ Update useRestaurantData untuk menerima initial data
    const {
        reservations,
        tables,
        customers, // ✅ Sekarang customers tersedia
        loading,
        getTableById,
        updateReservationStatus,
        deleteReservation,
        updateTableStatus,
        addReservation,
        updateReservation,
        addTable,
        updateTable,
        deleteTable,
        refreshCustomers // ✅ Function untuk refresh customers
    } = useRestaurantData({
        initialCustomers: initialCustomers || [],
        initialReservations: initialReservations || [],
        initialTables: initialTables || []
    });

    const filteredReservations = reservations.filter(reservation => {
        const matchesSearch = reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reservation.customerPhone.includes(searchTerm) ||
            reservation.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
        // Hanya filter berdasarkan tanggal jika tanggal dipilih (bukan kosong)
        // Jika selectedDate kosong, semua reservasi harus ditampilkan
        const matchesDate = selectedDate === '' ? true :
            reservation.date.split('T')[0] === selectedDate.split('T')[0];
        return matchesSearch && matchesStatus && matchesDate;
    });

    // Debug: log data when they change
    React.useEffect(() => {
        console.log('Tables updated:', tables);
    }, [tables]);

    React.useEffect(() => {
        console.log('Reservations updated:', reservations);
        console.log('Selected date:', selectedDate);
        console.log('Filtered reservations:', filteredReservations);

        // Debug each reservation's date with normalized format
        reservations.forEach(res => {
            const resDateNormalized = res.date.split('T')[0];
            const selectedDateNormalized = selectedDate.split('T')[0];
            console.log(`Reservation ${res.id}: date=${res.date}, normalized=${resDateNormalized}, selectedDate=${selectedDate}, normalized=${selectedDateNormalized}, matches=${resDateNormalized === selectedDateNormalized}`);
        });
    }, [reservations, filteredReservations, selectedDate]);

    // ✅ Debug customers data
    React.useEffect(() => {
        console.log('Customers updated:', customers);
    }, [customers]);

    const handleDeleteReservation = async (id: string) => {
        await deleteReservation(id);
        setReservationToDelete(null);
        setShowReservationDeleteModal(false);
    };

    const handleDeleteTable = async (id: string) => {
        await deleteTable(id);
        setTableToDelete(null);
        setShowTableDeleteModal(false);
    };

    const handleUpdateReservation = async (id: string, data: Omit<Reservation, 'id' | 'createdAt' | 'status'>) => {
        await updateReservation(id, data);
        setEditingReservation(null);
    };

    const handleUpdateTable = async (id: string, data: Omit<Table, 'id' | 'status'>) => {
        await updateTable(id, data);
        setEditingTable(null);
    };

    return (
        <>
            {/* ✅ Tambahkan Head untuk SEO */}
            <Head title="Admin Dashboard - Restaurant Management" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50">
                <Sidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    isCollapsed={sidebarCollapsed}
                    setIsCollapsed={setSidebarCollapsed}
                />

                <div className={`${sidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300`}>
                    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
                        <PageContainer>

                            {activeTab === 'dashboard' && (
                                <Dashboard
                                    reservations={reservations}
                                    tables={tables}
                                    selectedDate={selectedDate}
                                    setSelectedDate={setSelectedDate}
                                    updateReservationStatus={updateReservationStatus}
                                    setShowAddReservation={setShowAddReservation}
                                    setActiveTab={setActiveTab}
                                    setShowAnalytics={setShowAnalytics}
                                />
                            )}

                            {activeTab === 'reservations' && (
                                <ReservationsTab
                                    reservations={reservations}
                                    tables={tables}
                                    selectedDate={selectedDate}
                                    setSelectedDate={setSelectedDate}
                                    searchTerm={searchTerm}
                                    setSearchTerm={setSearchTerm}
                                    statusFilter={statusFilter}
                                    setStatusFilter={setStatusFilter}
                                    filteredReservations={filteredReservations}
                                    getTableById={getTableById}
                                    updateReservationStatus={updateReservationStatus}
                                    setEditingReservation={setEditingReservation}
                                    setShowAddReservation={setShowAddReservation}
                                    setShowAnalytics={setShowAnalytics}
                                    showReservationDeleteModal={showReservationDeleteModal}
                                    setShowReservationDeleteModal={setShowReservationDeleteModal}
                                    reservationToDelete={reservationToDelete}
                                    setReservationToDelete={setReservationToDelete}
                                    deleteReservation={handleDeleteReservation}
                                />
                            )}

                            {activeTab === 'tables' && (
                                <TablesTab
                                    tables={tables}
                                    loading={loading}
                                    updateTableStatus={updateTableStatus}
                                    setEditingTable={setEditingTable}
                                    setShowAddTable={setShowAddTable}
                                    showTableDeleteModal={showTableDeleteModal}
                                    setShowTableDeleteModal={setShowTableDeleteModal}
                                    tableToDelete={tableToDelete}
                                    setTableToDelete={setTableToDelete}
                                    deleteTable={handleDeleteTable}
                                />
                            )}

                            {/* ✅ CustomersTab dengan data customers */}
                            {activeTab === 'customers' && (
                                <CustomersTab
                                    customers={customers}
                                />
                            )}
                        </PageContainer>
                    </div>
                </div>

                {/* Enhanced Modals */}
                <div className="modal-backdrop">
                    <ReservationForm
                        isOpen={showAddReservation}
                        onClose={() => setShowAddReservation(false)}
                        onSubmit={addReservation}
                        tables={tables}
                    />

                    <ReservationForm
                        isOpen={!!editingReservation}
                        onClose={() => setEditingReservation(null)}
                        onSubmit={(data) => handleUpdateReservation(editingReservation!.id, data)}
                        tables={tables}
                        editingReservation={editingReservation}
                    />

                    <TableForm
                        isOpen={showAddTable}
                        onClose={() => setShowAddTable(false)}
                        onSubmit={async (data) => {
                            try {
                                await addTable(data);
                                setShowAddTable(false);
                            } catch (error) {
                                console.error('Error in Home component when adding table:', error);
                                // Error will be handled in TableForm
                                throw error;
                            }
                        }}
                    />

                    <TableForm
                        isOpen={!!editingTable}
                        onClose={() => setEditingTable(null)}
                        onSubmit={(data) => editingTable ? handleUpdateTable(editingTable.id, data) : Promise.resolve()}
                        editingTable={editingTable}
                    />
                </div>

                {/* Analytics Modal */}
                {showAnalytics && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-7xl max-h-[90vh] overflow-hidden">
                            <div className="flex items-center justify-between p-6 border-b border-gray-200/50 bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm">
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Analytics & Reports</h2>
                                <button
                                    onClick={() => setShowAnalytics(false)}
                                    className="p-2 bg-white/80 hover:bg-white rounded-xl transition-all duration-200 shadow-sm border border-gray-200/50"
                                >
                                    <X className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)] custom-scrollbar">
                                <Analytics reservations={reservations} tables={tables} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default Home;
