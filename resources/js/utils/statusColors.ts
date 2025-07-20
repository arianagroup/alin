export const getStatusColor = (status: string) => {
    switch (status) {
        case 'confirmed': return 'bg-green-100 text-green-800';
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'seated': return 'bg-blue-100 text-blue-800';
        case 'completed': return 'bg-gray-100 text-gray-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        case 'no-show': return 'bg-orange-100 text-orange-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

export const getTableStatusColor = (status: string) => {
    switch (status) {
        case 'available': return 'bg-green-100 text-green-800';
        case 'occupied': return 'bg-red-100 text-red-800';
        case 'reserved': return 'bg-yellow-100 text-yellow-800';
        case 'maintenance': return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};