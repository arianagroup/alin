import { useState, useEffect } from 'react';
import { StatsData } from '../types';
import { ANIMATION_DELAYS, ANIMATION_DURATIONS } from '../constants';

export const useAnimatedStats = (stats: StatsData) => {
  const [animatedStats, setAnimatedStats] = useState<StatsData>({
    totalReservations: 0,
    confirmed: 0,
    seated: 0,
    available: 0
  });

  const animateValue = (start: number, end: number, duration: number, callback: (value: number) => void) => {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(start + (end - start) * easeOutQuart);
      callback(current);
      if (progress < 1) requestAnimationFrame(animate);
    };
    animate();
  };

  useEffect(() => {
    setTimeout(() => {
      animateValue(0, stats.totalReservations, ANIMATION_DURATIONS.totalReservations, (value) =>
        setAnimatedStats(prev => ({ ...prev, totalReservations: value }))
      );
    }, ANIMATION_DELAYS.totalReservations);

    setTimeout(() => {
      animateValue(0, stats.confirmed, ANIMATION_DURATIONS.confirmed, (value) =>
        setAnimatedStats(prev => ({ ...prev, confirmed: value }))
      );
    }, ANIMATION_DELAYS.confirmed);

    setTimeout(() => {
      animateValue(0, stats.seated, ANIMATION_DURATIONS.seated, (value) =>
        setAnimatedStats(prev => ({ ...prev, seated: value }))
      );
    }, ANIMATION_DELAYS.seated);

    setTimeout(() => {
      animateValue(0, stats.available, ANIMATION_DURATIONS.available, (value) =>
        setAnimatedStats(prev => ({ ...prev, available: value }))
      );
    }, ANIMATION_DELAYS.available);
  }, [stats.totalReservations, stats.confirmed, stats.seated, stats.available]);

  return animatedStats;
};