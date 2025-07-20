import React from 'react';
import { DashboardProps } from './types';
import { useCurrentTime } from './hooks/useCurrentTime';
import { useAnimatedStats } from './hooks/useAnimatedStats';
import { getGreeting, calculateStats, getTodayReservations, getUpcomingReservations } from './utils';
import { DashboardHeader } from './components/DashboardHeader';
import { StatsCards } from './components/StatsCards';
import { ReservationsList } from './components/ReservationsList';
import { DashboardSidebar } from './components/DashboardSidebar';

interface ExtendedDashboardProps extends DashboardProps {
    setActiveTab?: (tab: string) => void;
    setShowAnalytics?: (show: boolean) => void;
}

const Dashboard: React.FC<ExtendedDashboardProps> = ({
                                                         reservations,
                                                         tables,
                                                         selectedDate,
                                                         setSelectedDate,
                                                         updateReservationStatus,
                                                         setShowAddReservation,
                                                         setActiveTab,
                                                         setShowAnalytics
                                                     }) => {
    const currentTime = useCurrentTime();
    const greeting = getGreeting(currentTime);
    const stats = calculateStats(reservations, tables, selectedDate);
    const animatedStats = useAnimatedStats(stats);
    const todayReservations = getTodayReservations(reservations, selectedDate);
    const upcomingReservations = getUpcomingReservations(reservations, selectedDate);

    return (
        <div className="space-y-8 animate-fadeIn">
            <DashboardHeader
                greeting={greeting}
                currentTime={currentTime}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
            />

            <StatsCards
                animatedStats={animatedStats}
                totalTables={tables.length}
            />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                <ReservationsList
                    todayReservations={todayReservations}
                    tables={tables}
                    updateReservationStatus={updateReservationStatus}
                    setShowAddReservation={setShowAddReservation}
                />

                <DashboardSidebar
                    upcomingReservations={upcomingReservations}
                    tables={tables}
                    setShowAddReservation={setShowAddReservation}
                    setActiveTab={setActiveTab}
                    setShowAnalytics={setShowAnalytics}
                />
            </div>
        </div>
    );
};

export default Dashboard;
