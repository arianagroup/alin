// types/restaurant.ts
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
    specialRequests: string;
    createdAt: string;
    notes: string;
}

// ✅ Update Customer interface sesuai data dari Laravel
export interface Customer {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    emailVerifiedAt?: string;
    isEmailVerified: boolean;
    registrationDate: string;
    daysSinceRegistration: number;
    // Optional fields dari interface lama
    phone?: string;
    totalVisits?: number;
    lastVisit?: string;
    preferences?: string;
}
