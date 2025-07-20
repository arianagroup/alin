import { CheckCircle, Clock, UserCheck, Star, Activity } from 'lucide-react';

export const STATUS_COLORS = {
  confirmed: 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200 shadow-emerald-100',
  pending: 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 border-amber-200 shadow-amber-100',
  seated: 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200 shadow-blue-100',
  completed: 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border-purple-200 shadow-purple-100',
  cancelled: 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-red-200 shadow-red-100',
  'no-show': 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border-orange-200 shadow-orange-100',
  default: 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border-gray-200 shadow-gray-100'
} as const;

export const STATUS_ICONS = {
  confirmed: CheckCircle,
  pending: Clock,
  seated: UserCheck,
  completed: Star,
  default: Activity
} as const;

export const GREETING_CONFIG = {
  morning: { text: 'Selamat Pagi', icon: '🌅', color: 'from-orange-400 to-pink-400' },
  afternoon: { text: 'Selamat Siang', icon: '☀️', color: 'from-yellow-400 to-orange-400' },
  evening: { text: 'Selamat Malam', icon: '🌙', color: 'from-purple-400 to-pink-400' }
} as const;

export const ANIMATION_DELAYS = {
  totalReservations: 200,
  confirmed: 400,
  seated: 600,
  available: 800
} as const;

export const ANIMATION_DURATIONS = {
  totalReservations: 1000,
  confirmed: 1200,
  seated: 1400,
  available: 1600
} as const;