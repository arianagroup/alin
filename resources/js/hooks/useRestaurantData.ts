import { useState, useEffect } from 'react';
import { Table, Reservation, Customer } from '../types/restaurant';
import { router } from '@inertiajs/react';

// ✅ Interface untuk initial data dari Laravel
interface UseRestaurantDataProps {
    initialCustomers?: Customer[];
    initialReservations?: Reservation[];
    initialTables?: Table[];
}

export const useRestaurantData = (props: UseRestaurantDataProps = {}) => {
    // ✅ Initialize dengan data dari Laravel jika ada
    const [reservations, setReservations] = useState<Reservation[]>(props.initialReservations || []);
    const [tables, setTables] = useState<Table[]>(props.initialTables || []);
    const [customers, setCustomers] = useState<Customer[]>(props.initialCustomers || []);
    const [loading, setLoading] = useState(true);

    // ✅ Fetch customers from API
    const fetchCustomers = async () => {
        try {
            const response = await fetch('/admin/api/customers');
            if (response.ok) {
                const data = await response.json();
                setCustomers(data);
                console.log('Fetched customers:', data);
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    // Fetch tables from API
    const fetchTables = async () => {
        try {
            const response = await fetch('/admin/api/tables');
            if (response.ok) {
                const data = await response.json();
                const formattedTables: Table[] = data.map((table: any) => ({
                    id: table.id.toString(),
                    number: table.number,
                    capacity: table.capacity,
                    location: table.location,
                    status: table.status
                }));
                setTables(formattedTables);
                console.log('Fetched tables:', formattedTables);
            }
        } catch (error) {
            console.error('Error fetching tables:', error);
        }
    };

    // Fetch reservations from API
    const fetchReservations = async (date?: string) => {
        try {
            const url = date ? `/admin/api/reservations?date=${date}` : '/admin/api/reservations';
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                const formattedReservations: Reservation[] = data.map((reservation: any) => ({
                    id: reservation.id.toString(),
                    customerName: reservation.customerName,
                    customerPhone: reservation.customerPhone,
                    customerEmail: reservation.customerEmail,
                    date: reservation.date.includes('T') ? reservation.date.split('T')[0] : reservation.date, // Normalize to YYYY-MM-DD
                    time: reservation.time, // Already formatted as HH:MM
                    duration: reservation.duration,
                    guests: reservation.guests,
                    tableId: reservation.tableId.toString(),
                    status: reservation.status,
                    specialRequests: reservation.specialRequests || '',
                    createdAt: reservation.created_at,
                    notes: reservation.notes || ''
                }));
                setReservations(formattedReservations);
                console.log('Fetched reservations:', formattedReservations);
            }
        } catch (error) {
            console.error('Error fetching reservations:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // ✅ Jika tidak ada initial data, fetch dari API
        if (!props.initialTables?.length) {
            fetchTables();
        }
        if (!props.initialReservations?.length) {
            fetchReservations();
        }
        if (!props.initialCustomers?.length) {
            fetchCustomers();
        }

        syncTableStatuses();

        // ✅ Set loading false jika ada initial data
        if (props.initialTables || props.initialReservations || props.initialCustomers) {
            setLoading(false);
        }
    }, []);

    // Sync table statuses based on reservations
    const syncTableStatuses = async () => {
        try {
            console.log('Syncing table statuses...');
            const response = await fetch('/admin/api/reservations/sync-table-statuses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });

            if (response.ok) {
                console.log('Table statuses synced successfully');
                await fetchTables();
            } else if (response.status === 419) {
                console.error('CSRF token expired or invalid');
                // alert('Your session has expired. The page will refresh automatically.');
                window.location.reload();
            } else {
                console.error('Failed to sync table statuses:', response.status);
                // Show user-friendly error message
                alert('Failed to sync table statuses. Please try again.');
            }
        } catch (error) {
            console.error('Network error while syncing table statuses:', error);
            alert('Network error. Please check your connection.');
        }
    };

    // ✅ Refresh customers function
    const refreshCustomers = async () => {
        try {
            setLoading(true);
            await fetchCustomers();
        } catch (error) {
            console.error('Error refreshing customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTableById = (id: string) => tables.find(table => table.id === id);

    const updateReservationStatus = async (id: string, status: Reservation['status']) => {
        try {
            const response = await fetch(`/admin/api/reservations/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                setReservations(prev => prev.map(res =>
                    res.id === id ? { ...res, status } : res
                ));

                // Sync table statuses after status update
                syncTableStatuses();
            }
        } catch (error) {
            console.error('Error updating reservation status:', error);
        }
    };

    const deleteReservation = async (id: string) => {
        try {
            const response = await fetch(`/admin/api/reservations/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });

            if (response.ok) {
                setReservations(prev => prev.filter(res => res.id !== id));

                // Sync table statuses after deletion
                syncTableStatuses();
            }
        } catch (error) {
            console.error('Error deleting reservation:', error);
        }
    };

    const updateTableStatus = async (id: string, status: Table['status']) => {
        try {
            const response = await fetch(`/admin/api/tables/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                setTables(prev => prev.map(table =>
                    table.id === id ? { ...table, status } : table
                ));
            }
        } catch (error) {
            console.error('Error updating table status:', error);
        }
    };

    const addReservation = async (reservationData: Omit<Reservation, 'id' | 'createdAt' | 'status'>) => {
        try {
            console.log('Sending reservation data:', reservationData);

            const response = await fetch('/admin/api/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify(reservationData)
            });

            console.log('Response status:', response.status);

            if (response.ok) {
                const newReservation = await response.json();
                console.log('API Response for new reservation:', newReservation);

                const formattedReservation: Reservation = {
                    id: newReservation.id.toString(),
                    customerName: newReservation.customerName,
                    customerPhone: newReservation.customerPhone,
                    customerEmail: newReservation.customerEmail,
                    date: newReservation.date.includes('T') ? newReservation.date.split('T')[0] : newReservation.date,
                    time: newReservation.time,
                    duration: newReservation.duration,
                    guests: newReservation.guests,
                    tableId: newReservation.tableId.toString(),
                    status: newReservation.status || 'pending',
                    specialRequests: newReservation.specialRequests || '',
                    createdAt: newReservation.created_at,
                    notes: newReservation.notes || ''
                };

                console.log('Formatted reservation to add:', formattedReservation);
                setReservations(prev => {
                    const updated = [...prev, formattedReservation];
                    console.log('Updated reservations after add:', updated);
                    return updated;
                });

                // Sync table statuses after adding reservation
                syncTableStatuses();
            } else {
                const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                console.error('Failed to add reservation:', response.status, errorData);
                throw new Error(errorData.message || 'Failed to add reservation');
            }
        } catch (error) {
            console.error('Error adding reservation:', error);
            throw error;
        }
    };

    const updateReservation = async (id: string, reservationData: Omit<Reservation, 'id' | 'createdAt' | 'status'>) => {
        try {
            const response = await fetch(`/admin/api/reservations/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify(reservationData)
            });

            if (response.ok) {
                const updatedReservation = await response.json();
                const formattedReservation: Reservation = {
                    id: updatedReservation.id.toString(),
                    customerName: updatedReservation.customerName,
                    customerPhone: updatedReservation.customerPhone,
                    customerEmail: updatedReservation.customerEmail,
                    date: updatedReservation.date.split('T')[0], // Convert to YYYY-MM-DD
                    time: updatedReservation.time,
                    duration: updatedReservation.duration,
                    guests: updatedReservation.guests,
                    tableId: updatedReservation.tableId.toString(),
                    status: updatedReservation.status || 'pending',
                    specialRequests: updatedReservation.specialRequests || '',
                    createdAt: updatedReservation.created_at,
                    notes: updatedReservation.notes || ''
                };

                setReservations(prev => prev.map(res =>
                    res.id === id ? formattedReservation : res
                ));
            }
        } catch (error) {
            console.error('Error updating reservation:', error);
        }
    };

    const addTable = async (tableData: Omit<Table, 'id' | 'status'>) => {
        try {
            console.log('Sending table data:', tableData);

            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            console.log('CSRF Token:', csrfToken);

            const response = await fetch('/admin/api/tables', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(tableData)
            });

            console.log('Response status:', response.status);

            const responseText = await response.text();
            console.log('Response text:', responseText);

            if (response.ok) {
                let newTable;
                try {
                    newTable = JSON.parse(responseText);
                } catch (e) {
                    console.error('Error parsing JSON response:', e);
                    throw new Error('Invalid JSON response from server');
                }

                console.log('API Response for new table:', newTable);

                const formattedTable: Table = {
                    id: newTable.id.toString(),
                    number: newTable.number,
                    capacity: newTable.capacity,
                    location: newTable.location,
                    status: newTable.status || 'available'
                };

                setTables(prev => {
                    const updated = [...prev, formattedTable];
                    console.log('Adding new table:', formattedTable);
                    console.log('Updated tables:', updated);
                    return updated;
                });

                return formattedTable;
            } else {
                console.error('Failed to add table:', response.status, responseText);
                throw new Error(`Failed to add table: ${responseText}`);
            }
        } catch (error) {
            console.error('Error adding table:', error);
            throw error;
        }
    };

    const updateTable = async (id: string, tableData: Omit<Table, 'id' | 'status'>) => {
        try {
            const response = await fetch(`/admin/api/tables/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify(tableData)
            });

            if (response.ok) {
                const updatedTable = await response.json();
                const formattedTable: Table = {
                    id: updatedTable.id.toString(),
                    number: updatedTable.number,
                    capacity: updatedTable.capacity,
                    location: updatedTable.location,
                    status: updatedTable.status
                };

                setTables(prev => prev.map(table =>
                    table.id === id ? formattedTable : table
                ));
            }
        } catch (error) {
            console.error('Error updating table:', error);
        }
    };

    const deleteTable = async (id: string) => {
        try {
            const response = await fetch(`/admin/api/tables/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });

            if (response.ok) {
                setTables(prev => prev.filter(table => table.id !== id));
            }
        } catch (error) {
            console.error('Error deleting table:', error);
        }
    };

    return {
        reservations,
        tables,
        customers, // ✅ Return customers
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
        fetchTables,
        fetchReservations,
        fetchCustomers, // ✅ Return fetch function
        refreshCustomers, // ✅ Return refresh function
        syncTableStatuses
    };
};
