import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Mail, Sparkles, ShieldCheck, ArrowLeft, Key } from 'lucide-react';
import { FormEventHandler, useState, useEffect } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ForgotPassword({ status }: { status?: string }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm<Required<{ email: string }>>({
        email: '',
    });

    // Animation on mount
    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <AuthLayout
            title="Lupa Kata Sandi"
            description="Masukkan email Anda untuk menerima tautan reset password"
        >
            <Head title="Forgot password" />

            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute top-1/3 -right-8 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-1/4 -left-6 w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-amber-400/20 rounded-full blur-xl animate-pulse delay-2000"></div>
            </div>

            {/* Status Message with Enhanced Design */}
            {status && (
                <div className={`mb-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl relative overflow-hidden transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-green-400/10 animate-pulse"></div>
                    <div className="relative flex items-center justify-center">
                        <ShieldCheck className="h-5 w-5 text-emerald-600 mr-2 animate-bounce" />
                        <div className="text-center text-sm font-medium text-emerald-700">{status}</div>
                    </div>
                </div>
            )}

            <div className={`space-y-6 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                {/* Info Section */}
                <div className={`text-center space-y-3 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/30 to-amber-400/30 rounded-full blur-lg animate-pulse"></div>
                            <div className="relative w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                                <Key className="h-8 w-8 text-white animate-pulse" />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-gray-800">Reset Kata Sandi</h2>
                        <p className="text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
                            Tidak masalah! Masukkan alamat email Anda dan kami akan mengirimkan tautan untuk reset kata sandi.
                        </p>
                    </div>
                </div>

                <form className={`space-y-6 transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} onSubmit={submit}>
                    {/* Email Field with Enhanced Design */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-orange-500 animate-pulse" />
                            Alamat Email
                        </Label>
                        <div className="relative group">
                            <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300 ${
                                focusedField === 'email' ? 'scale-110 text-orange-500' : 'text-gray-400'
                            }`}>
                                <Mail className="h-5 w-5 transition-all duration-300" />
                            </div>

                            {/* Animated border effect */}
                            <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/20 to-amber-500/20 opacity-0 transition-all duration-300 ${
                                focusedField === 'email' ? 'opacity-100 scale-105' : ''
                            }`}></div>

                            <Input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                value={data.email}
                                autoFocus
                                onChange={(e) => setData('email', e.target.value)}
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField(null)}
                                placeholder="nama@email.com"
                                className={`relative pl-12 h-12 bg-white/50 backdrop-blur-sm border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 hover:bg-white/70 hover:shadow-lg ${
                                    data.email && !errors.email ? 'pr-10' : 'pr-4'
                                }`}
                            />

                            {/* Success indicator */}
                            {data.email && !errors.email && (
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                                </div>
                            )}

                            {/* Email validation indicator */}
                            {data.email && data.email.includes('@') && (
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                                    <div className="h-2 w-2 bg-orange-500 rounded-full animate-pulse"></div>
                                </div>
                            )}
                        </div>
                        <InputError message={errors.email} />
                    </div>

                    {/* Enhanced Submit Button */}
                    <Button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group"
                        disabled={processing}
                    >
                        {/* Animated background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-amber-400/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                        {processing ? (
                            <div className="relative flex items-center justify-center">
                                <LoaderCircle className="h-5 w-5 animate-spin mr-2" />
                                <span className="animate-pulse">Mengirim...</span>

                                {/* Loading dots animation */}
                                <div className="ml-2 flex space-x-1">
                                    <div className="h-1 w-1 bg-white rounded-full animate-bounce delay-0"></div>
                                    <div className="h-1 w-1 bg-white rounded-full animate-bounce delay-100"></div>
                                    <div className="h-1 w-1 bg-white rounded-full animate-bounce delay-200"></div>
                                </div>
                            </div>
                        ) : (
                            <div className="relative flex items-center justify-center">
                                <Mail className="h-5 w-5 mr-2 animate-pulse" />
                                Kirim Tautan Reset
                            </div>
                        )}
                    </Button>
                </form>

                {/* Enhanced Divider */}
                <div className={`relative transition-all duration-700 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white/80 backdrop-blur-sm text-gray-500 font-medium rounded-full border border-gray-200/50">
                            atau
                        </span>
                    </div>
                </div>

                {/* Enhanced Back to Login Link */}
                <div className={`text-center space-y-4 transition-all duration-700 delay-800 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <TextLink
                        href={route('login')}
                        className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-all duration-200 hover:scale-105 inline-flex items-center group"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
                        <span>Kembali ke Halaman Masuk</span>
                    </TextLink>

                    {/* Additional helper text */}
                    <div className="text-xs text-gray-500 space-y-1">
                        <p>Ingat kata sandi Anda?</p>
                        <TextLink
                            href={route('login')}
                            className="text-gray-600 hover:text-orange-600 transition-colors duration-200 inline-flex items-center"
                        >
                            <Sparkles className="h-3 w-3 mr-1 animate-pulse" />
                            Masuk sekarang
                        </TextLink>
                    </div>
                </div>

                {/* Security Note */}
                <div className={`bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200/50 rounded-xl p-4 transition-all duration-700 delay-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                            <ShieldCheck className="h-5 w-5 text-blue-500 mt-0.5" />
                        </div>
                        <div className="text-xs text-gray-600 leading-relaxed">
                            <p className="font-medium text-gray-700 mb-1">Keamanan Data Terjamin</p>
                            <p>Tautan reset akan dikirim ke email Anda dan hanya berlaku selama 60 menit untuk keamanan maksimal.</p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}
