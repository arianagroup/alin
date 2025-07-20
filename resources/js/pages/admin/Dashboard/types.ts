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

export interface DashboardProps {
  reservations: Reservation[];
  tables: Table[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  updateReservationStatus: (id: string, status: Reservation['status']) => void;
  setShowAddReservation: (show: boolean) => void;
}

export interface StatsData {
  totalReservations: number;
  confirmed: number;
  seated: number;
  available: number;
}

export interface GreetingData {
  text: string;
  icon: string;
  color: string;
}