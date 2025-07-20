import React from 'react';
import { STATUS_COLORS, STATUS_ICONS, GREETING_CONFIG } from './constants';
import { Table, Reservation, StatsData, GreetingData } from './types';

export const getStatusColor = (status: string): string => {
  return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || STATUS_COLORS.default;
};

export const getStatusIcon = (status: string): React.ReactElement => {
  const IconComponent = STATUS_ICONS[status as keyof typeof STATUS_ICONS] || STATUS_ICONS.default;
  return React.createElement(IconComponent, { className: "w-4 h-4" });
};

export const getTableById = (tables: Table[], id: string): Table | undefined => {
  return tables.find(table => table.id === id);
};

export const getGreeting = (currentTime: Date): GreetingData => {
  const hour = currentTime.getHours();
  if (hour < 12) return GREETING_CONFIG.morning;
  if (hour < 17) return GREETING_CONFIG.afternoon;
  return GREETING_CONFIG.evening;
};

export const calculateStats = (reservations: Reservation[], tables: Table[], selectedDate: string): StatsData => {
  // Jika selectedDate kosong, gunakan hari ini untuk stats
  const today = new Date().toISOString().split('T')[0];
  const dateToUse = selectedDate || today;
  const todayReservations = reservations.filter(res => res.date === dateToUse);
  
  return {
    totalReservations: todayReservations.length,
    confirmed: todayReservations.filter(res => res.status === 'confirmed').length,
    seated: todayReservations.filter(res => res.status === 'seated').length,
    available: tables.filter(table => table.status === 'available').length
  };
};

export const getUpcomingReservations = (reservations: Reservation[], selectedDate: string): Reservation[] => {
  // Jika selectedDate kosong, gunakan hari ini
  const today = new Date().toISOString().split('T')[0];
  const dateToUse = selectedDate || today;
  
  return reservations
    .filter(res => res.date === dateToUse)
    .filter(res => res.status === 'confirmed' || res.status === 'pending')
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, 4);
};

export const getTodayReservations = (reservations: Reservation[], selectedDate: string): Reservation[] => {
  // Jika selectedDate kosong, gunakan hari ini
  const today = new Date().toISOString().split('T')[0];
  const dateToUse = selectedDate || today;
  
  return reservations.filter(res => res.date === dateToUse);
};