import React, { useState } from 'react';
import { Check, Crown, Star, Zap, Sparkles, ArrowRight } from 'lucide-react';

// Definisikan tipe untuk struktur sebuah paket langganan
interface Plan {
    id: string;
    name: string;
    price: number;
    priority: 'reguler' | 'platinum' | 'vip';
    color: string;
    accent: string;
    features: string[];
    monthlyPrice?: number;
    annualPrice?: number;
}

// CATATAN: Data samplePlans telah dihapus dari komponen ini.
// Anda perlu mengambil atau menyediakan data ini dari sumber eksternal (misalnya, API, prop).

const SubscriptionPlans = () => {
    const [currentPlanId, setCurrentPlanId] = useState('reguler');
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

    // Karena samplePlans dihapus, Anda perlu menyediakan data paket aktual di sini
    // Untuk demonstrasi, mari kita gunakan array kosong. Di aplikasi nyata, ini akan diambil.
    const plans: Plan[] = []; // Array ini harus diisi dengan data paket Anda yang sebenarnya.

    const getPlanIcon = (priority: 'reguler' | 'platinum' | 'vip') => {
        switch (priority) {
            case 'reguler':
                return <Star className="h-6 w-6 text-white" />;
            case 'platinum':
                return <Zap className="h-6 w-6 text-white" />;
            case 'vip':
                return <Crown className="h-6 w-6 text-white" />;
            default:
                return <Sparkles className="h-6 w-6 text-white" />;
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const onSelectPlan = (plan: Plan) => {
        setCurrentPlanId(plan.id);
        console.log('Paket yang dipilih:', plan, 'Siklus penagihan:', billingCycle);
    };

    const getPriceForPlan = (plan: Plan) => {
        return billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Paket Langganan
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Pilih paket yang sempurna untuk
                        <span className="block text-indigo-600">pengalaman bersantap Anda</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Buka restoran eksklusif, reservasi prioritas, dan pengalaman bersantap premium dengan paket langganan fleksibel kami.
                    </p>
                </div>

                {/* Tombol Alih Harga */}
                <div className="flex justify-center mb-12">
                    <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <button
                                onClick={() => setBillingCycle('monthly')}
                                className={`px-6 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                    billingCycle === 'monthly'
                                        ? 'text-indigo-600 bg-indigo-50'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                                aria-pressed={billingCycle === 'monthly'}
                            >
                                Bulanan
                            </button>
                            <button
                                onClick={() => setBillingCycle('annual')}
                                className={`px-6 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                    billingCycle === 'annual'
                                        ? 'text-indigo-600 bg-indigo-50'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                                aria-pressed={billingCycle === 'annual'}
                            >
                                Tahunan
                                <span className="ml-2 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                  Hemat 20%
                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Grid Paket */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative bg-white rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-lg ${
                                plan.priority === 'platinum'
                                    ? 'border-indigo-200 shadow-indigo-100/50 scale-105'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            {plan.priority === 'platinum' && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                                        Paling Populer
                                    </div>
                                </div>
                            )}

                            <div className="p-8">
                                {/* Header Paket */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-3">
                                        <div className={`${plan.accent} p-2 rounded-lg`}>
                                            {getPlanIcon(plan.priority)}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                                            <p className="text-sm text-gray-500">Sempurna untuk pengguna {plan.priority}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Harga */}
                                <div className="mb-8">
                                    <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-bold text-gray-900">
                      {formatPrice(getPriceForPlan(plan) || 0)}
                    </span>
                                        <span className="text-gray-500">
                      /{billingCycle === 'monthly' ? 'bulan' : 'tahun'}
                    </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Ditagih {billingCycle === 'monthly' ? 'bulanan' : 'tahunan'}, batalkan kapan saja
                                    </p>
                                </div>

                                {/* Fitur */}
                                <div className="space-y-4 mb-8">
                                    {plan.features.map((feature, featureIndex) => (
                                        <div key={featureIndex} className="flex items-start space-x-3">
                                            <div className="flex-shrink-0 mt-1">
                                                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                                    <Check className="h-3 w-3 text-green-600" />
                                                </div>
                                            </div>
                                            <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Tombol CTA */}
                                <button
                                    onClick={() => onSelectPlan(plan)}
                                    disabled={currentPlanId === plan.id}
                                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                                        currentPlanId === plan.id
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : plan.priority === 'platinum'
                                                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-indigo-200'
                                                : 'bg-gray-900 text-white hover:bg-gray-800'
                                    }`}
                                >
                  <span>
                    {currentPlanId === plan.id ? 'Paket Saat Ini' : 'Mulai Sekarang'}
                  </span>
                                    {currentPlanId !== plan.id && (
                                        <ArrowRight className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                    {/* Tambahkan pesan jika tidak ada paket yang dimuat */}
                    {plans.length === 0 && (
                        <div className="lg:col-span-3 text-center py-10 text-gray-600 text-lg">
                            Tidak ada paket langganan yang tersedia. Harap muat data.
                        </div>
                    )}
                </div>

                {/* Bagian Bawah */}
                <div className="bg-white rounded-2xl p-8 border border-gray-200">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Butuh solusi kustom?
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Hubungi tim kami untuk mendiskusikan paket perusahaan dan fitur khusus untuk organisasi Anda.
                        </p>
                        <button className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                            Hubungi Bagian Penjualan
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 text-center">
                    <p className="text-gray-500 text-sm">
                        © 2025 Natlin Resto & Bar. Semua hak dilindungi.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPlans;
