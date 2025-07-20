import { useState, useEffect } from 'react';

export const usePelangganData = () => {
    const [tables, setTables] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch tables dari API pelanggan
    const fetchTables = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/pelanggan/tables');
            if (response.ok) {
                const data = await response.json();
                const formattedTables = data.map((table: any) => ({
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
        } finally {
            setLoading(false);
        }
    };

    // Membuat reservasi baru
    const addReservation = async (reservationData: any) => {
        try {
            const cleanData = {
                customerName: reservationData.customerName,
                customerPhone: reservationData.customerPhone,
                customerEmail: reservationData.customerEmail,
                date: reservationData.date,
                time: reservationData.time,
                duration: reservationData.duration || 120,
                guests: parseInt(reservationData.guests),
                tableId: parseInt(reservationData.tableId),
                specialRequests: reservationData.specialRequests || '',
                notes: ''
            };
            
            console.log('Sending reservation data:', cleanData);
            
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            console.log('CSRF Token:', csrfToken);
            
            const response = await fetch('/api/pelanggan/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(cleanData)
            });
            
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            
            const responseText = await response.text();
            console.log('Response text:', responseText);
            
            if (response.ok) {
                const newReservation = JSON.parse(responseText);
                console.log('Reservation created:', newReservation);
                
                // Update table status to reserved
                await updateTableStatus(cleanData.tableId, 'reserved');
                
                // Refresh tables to get updated statuses
                await fetchTables();
                
                return newReservation;
            } else {
                console.error('Failed to add reservation:', response.status, responseText);
                throw new Error(`HTTP ${response.status}: ${responseText}`);
            }
        } catch (error) {
            console.error('Error adding reservation:', error);
            throw error;
        }
    };

    // Update table status
    const updateTableStatus = async (tableId: number, status: string) => {
        try {
            console.log(`Updating table ${tableId} status to ${status}`);
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            const response = await fetch(`/api/pelanggan/tables/${tableId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || ''
                },
                body: JSON.stringify({ status })
            });
            
            if (response.ok) {
                console.log(`Table ${tableId} status updated to ${status}`);
                return true;
            } else {
                console.error(`Failed to update table ${tableId} status:`, response.status);
                return false;
            }
        } catch (error) {
            console.error(`Error updating table ${tableId} status:`, error);
            return false;
        }
    };
    
    useEffect(() => {
        fetchTables();
    }, []);

    return {
        tables,
        loading,
        addReservation,
        fetchTables,
        updateTableStatus
    };
};