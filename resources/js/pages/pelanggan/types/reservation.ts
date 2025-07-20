export interface Table {
    id: string;
    number: number;
    capacity: number;
    location: string;
    status: 'available' | 'occupied' | 'reserved' | 'maintenance';
}

export interface Reservation {
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
    specialRequests?: string;
    notes?: string;
    createdAt: string;
    tableNumber?: number;
}