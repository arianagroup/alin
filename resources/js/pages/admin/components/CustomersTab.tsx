import React, { useState } from 'react';
import { Users, Mail, Award, Calendar, User, CheckCircle, XCircle, Search, Filter } from 'lucide-react';

// ✅ Interface sesuai data yang dikirim dari Laravel
interface Customer {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    emailVerifiedAt?: string;
    isEmailVerified: boolean;
    registrationDate: string;
    daysSinceRegistration: number;
}

interface CustomersTabProps {
    customers: Customer[];
}

export const CustomersTab: React.FC<CustomersTabProps> = ({ customers }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [verificationFilter, setVerificationFilter] = useState('all'); // all, verified, unverified

    // ✅ Debug log untuk melihat data customers
    React.useEffect(() => {
        console.log('📊 Customers received in CustomersTab:', customers);
        if (customers.length > 0) {
            console.log('📊 Sample customer data:', customers[0]);
            customers.forEach((customer, index) => {
                if (index < 3) { // Log hanya 3 customer pertama
                    console.log(`📊 Customer ${customer.name}:`, {
                        daysSinceRegistration: customer.daysSinceRegistration,
                        type: typeof customer.daysSinceRegistration,
                        createdAt: customer.createdAt,
                        registrationDate: customer.registrationDate
                    });
                }
            });
        }
    }, [customers]);

    // Filter customers berdasarkan search dan verification status
    const filteredCustomers = customers.filter(customer => {
        const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesVerification = verificationFilter === 'all' ||
            (verificationFilter === 'verified' && customer.isEmailVerified) ||
            (verificationFilter === 'unverified' && !customer.isEmailVerified);

        return matchesSearch && matchesVerification;
    });

    // Helper function untuk format tanggal
    const formatDate = (dateString: string) => {
        if (!dateString) return 'Tidak diketahui';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return 'Invalid date';
        }
    };

    // ✅ Helper function untuk format "lama bergabung" dengan validasi
    const formatDaysSinceRegistration = (customer: Customer) => {
        const days = customer.daysSinceRegistration;

        // Validasi dan fallback untuk daysSinceRegistration
        if (typeof days === 'number' && !isNaN(days) && days >= 0) {
            if (days === 0) {
                return (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        Hari ini
                    </span>
                );
            } else if (days === 1) {
                return <span className="text-gray-600">1 hari yang lalu</span>;
            } else {
                return <span className="text-gray-600">{days} hari yang lalu</span>;
            }
        } else {
            // ✅ Fallback calculation jika data dari backend bermasalah
            try {
                const createdDate = new Date(customer.createdAt);
                const now = new Date();
                const diffTime = Math.abs(now.getTime() - createdDate.getTime());
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                console.warn(`⚠️ Fallback calculation for ${customer.name}: ${diffDays} days`);

                if (diffDays === 0) {
                    return (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            Hari ini
                        </span>
                    );
                } else if (diffDays === 1) {
                    return <span className="text-gray-600">1 hari yang lalu</span>;
                } else {
                    return <span className="text-gray-600">{diffDays} hari yang lalu</span>;
                }
            } catch (error) {
                console.error(`❌ Error calculating days for ${customer.name}:`, error);
                return <span className="text-red-500 text-xs">Error: {String(days)}</span>;
            }
        }
    };

    // Statistics
    const totalCustomers = customers.length;
    const verifiedCustomers = customers.filter(c => c.isEmailVerified).length;
    const unverifiedCustomers = totalCustomers - verifiedCustomers;
    const newCustomersToday = customers.filter(c => {
        const days = c.daysSinceRegistration;
        return typeof days === 'number' && !isNaN(days) && days === 0;
    }).length;

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Database Pelanggan
                    </h1>
                    <p className="text-gray-600 font-medium mt-2">Pelanggan yang telah mendaftar melalui form registrasi</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2 px-4 py-2 bg-purple-50 rounded-xl border border-purple-200">
                        <Award className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-700">{totalCustomers} Total</span>
                    </div>
                    <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 rounded-xl border border-green-200">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700">{verifiedCustomers} Verified</span>
                    </div>
                    <div className="flex items-center space-x-2 px-4 py-2 bg-red-50 rounded-xl border border-red-200">
                        <XCircle className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-medium text-red-700">{unverifiedCustomers} Unverified</span>
                    </div>
                    <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-xl border border-blue-200">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">{newCustomersToday} Hari Ini</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari nama atau email pelanggan..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>

                    {/* Verification Filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <select
                            value={verificationFilter}
                            onChange={(e) => setVerificationFilter(e.target.value)}
                            className="pl-10 pr-8 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none bg-white"
                        >
                            <option value="all">Semua Status</option>
                            <option value="verified">Email Terverifikasi</option>
                            <option value="unverified">Email Belum Terverifikasi</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            {filteredCustomers.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {searchTerm || verificationFilter !== 'all' ? 'Tidak Ada Hasil' : 'Belum Ada Pelanggan Terdaftar'}
                    </h3>
                    <p className="text-gray-600">
                        {searchTerm || verificationFilter !== 'all'
                            ? 'Coba ubah kata kunci pencarian atau filter'
                            : 'Pelanggan akan muncul setelah melakukan registrasi melalui form pendaftaran.'
                        }
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    Pelanggan
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    Status Email
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    Tanggal Registrasi
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    Lama Bergabung
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCustomers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-purple-50 transition-colors duration-200">
                                    <td className="px-6 py-6 whitespace-nowrap">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-200 rounded-full flex items-center justify-center">
                                                <User className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-gray-900">{customer.name}</div>
                                                <div className="text-xs text-gray-500">ID: {customer.id}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-6 whitespace-nowrap">
                                        <div className="flex items-center space-x-1">
                                            <Mail className="w-3 h-3 text-gray-400" />
                                            <span className="text-sm text-gray-900">{customer.email}</span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-6 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            {customer.isEmailVerified ? (
                                                <>
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                    <span className="text-sm font-medium text-green-700">Terverifikasi</span>
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="w-4 h-4 text-red-500" />
                                                    <span className="text-sm font-medium text-red-700">Belum Terverifikasi</span>
                                                </>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-6 py-6 whitespace-nowrap">
                                        <div className="flex items-center space-x-1">
                                            <Calendar className="w-3 h-3 text-gray-400" />
                                            <span className="text-sm text-gray-600">
                                                {formatDate(customer.createdAt)}
                                            </span>
                                        </div>
                                    </td>

                                    {/* ✅ Updated: Menggunakan helper function dengan validasi */}
                                    <td className="px-6 py-6 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {formatDaysSinceRegistration(customer)}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/*/!* Footer Info *!/*/}
            {/*<div className="bg-gray-50 rounded-xl p-4">*/}
            {/*    <p className="text-sm text-gray-600">*/}
            {/*        Menampilkan {filteredCustomers.length} dari {totalCustomers} pelanggan terdaftar*/}
            {/*        {searchTerm && ` • Pencarian: "${searchTerm}"`}*/}
            {/*        {verificationFilter !== 'all' && ` • Filter: ${verificationFilter === 'verified' ? 'Terverifikasi' : 'Belum Terverifikasi'}`}*/}
            {/*    </p>*/}
            {/*</div>*/}

            {/*/!* ✅ Debug section - hapus di production *!/*/}
            {/*{process.env.NODE_ENV === 'development' && customers.length > 0 && (*/}
            {/*    <div className="bg-gray-100 rounded-xl p-4">*/}
            {/*        <h4 className="text-sm font-semibold text-gray-700 mb-2">🔧 Debug Info (Development Only):</h4>*/}
            {/*        <pre className="text-xs text-gray-600 bg-white p-2 rounded overflow-auto max-h-32">*/}
            {/*            {JSON.stringify(customers.slice(0, 2), null, 2)}*/}
            {/*        </pre>*/}
            {/*    </div>*/}
            {/*)}*/}
        </div>
    );
};
