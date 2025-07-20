import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Mail, Lock, Eye, EyeOff, Sparkles, ShieldCheck, AlertCircle, CheckCircle, User } from 'lucide-react';
import { FormEventHandler, useState, useEffect, useCallback } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);


    // 🆕 UX Enhancement States
    const [emailValidation, setEmailValidation] = useState<{ isValid: boolean; message: string }>({ isValid: false, message: '' });
    const [isFormValid, setIsFormValid] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    // Animation on mount
    useEffect(() => {
        setIsLoaded(true);
    }, []);

    // 🆕 Email validation helper
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // 🆕 Real-time email validation
    const handleEmailChange = useCallback((email: string) => {
        setData('email', email);

        if (email.length === 0) {
            setEmailValidation({ isValid: false, message: '' });
        } else {
            const isValid = validateEmail(email);
            setEmailValidation({
                isValid,
                message: isValid ? 'Email valid' : 'Format email tidak valid'
            });
        }
    }, [setData]);

    // 🆕 Check form validity - lebih fleksibel
    useEffect(() => {
        const isValid = data.email.length > 0 && data.password.length > 0;
        setIsFormValid(isValid);
    }, [data.email, data.password]);

    // 🆕 Enhanced submit with UX feedback
    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Debug log
        console.log('Form submitted:', { email: data.email, password: data.password, isFormValid });

        post(route('login'), {
            onFinish: () => reset('password'),
            onError: (errors) => {
                console.log('Login errors:', errors);
                // Shake animation for errors
                const form = e.currentTarget as HTMLFormElement;
                if (form) {
                    form.classList.add('animate-pulse');
                    setTimeout(() => form.classList.remove('animate-pulse'), 500);
                }
            },
            onSuccess: () => {
                console.log('Login successful');
            }
        });
    };

    return (
        <AuthLayout title="Natlin Resto & Bar" description="Masuk ke akun Anda untuk melanjutkan">
            <Head title="Log in" />


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

            <form className={`space-y-6 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} onSubmit={submit}>
                <div className="space-y-5">
                    {/* 🆕 Enhanced Email Field */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center">
                            <Sparkles className="h-4 w-4 mr-2 text-blue-500 animate-pulse" />
                            Alamat Email
                        </Label>
                        <div className="relative group">
                            {/* 🆕 Dynamic icon with validation feedback */}
                            <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300 ${
                                focusedField === 'email' ? 'scale-110 text-blue-500' :
                                    emailValidation.isValid ? 'text-green-500 scale-110' :
                                        errors.email ? 'text-red-500 scale-110' : 'text-gray-400'
                            }`}>
                                {emailValidation.isValid && data.email ? (
                                    <CheckCircle className="h-5 w-5 transition-all duration-300" />
                                ) : errors.email ? (
                                    <AlertCircle className="h-5 w-5 transition-all duration-300" />
                                ) : (
                                    <Mail className="h-5 w-5 transition-all duration-300" />
                                )}
                            </div>

                            {/* 🆕 Enhanced border effect with validation colors */}
                            <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                                focusedField === 'email' ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-100 scale-105' :
                                    emailValidation.isValid ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-100 scale-102' :
                                        errors.email ? 'bg-gradient-to-r from-red-500/10 to-pink-500/10 opacity-100 scale-102' : 'opacity-0'
                            }`}></div>

                            <Input
                                id="email"
                                type="email"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => handleEmailChange(e.target.value)}
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField(null)}
                                placeholder="nama@email.com"
                                className={`pl-12 pr-12 h-12 bg-white/50 backdrop-blur-sm border-gray-200 rounded-xl transition-all duration-300 hover:bg-white/70 hover:shadow-lg ${
                                    emailValidation.isValid ? 'focus:ring-green-500/20 focus:border-green-500 border-green-200' :
                                        errors.email ? 'focus:ring-red-500/20 focus:border-red-500 border-red-300' :
                                            'focus:ring-blue-500/20 focus:border-blue-500'
                                }`}
                            />

                            {/* 🆕 Success/Error indicator */}
                            {data.email && (
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                                    <div className={`h-2 w-2 rounded-full animate-pulse ${
                                        emailValidation.isValid ? 'bg-green-500' : 'bg-red-500'
                                    }`}></div>
                                </div>
                            )}
                        </div>

                        {/* 🆕 Real-time validation message */}
                        {data.email && emailValidation.message && (
                            <div className={`text-sm flex items-center mt-1 transition-all duration-300 ${
                                emailValidation.isValid ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {emailValidation.isValid ? (
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                ) : (
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                )}
                                {emailValidation.message}
                            </div>
                        )}

                        <InputError message={errors.email} />
                    </div>

                    {/* 🆕 Enhanced Password Field */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center">
                                <Lock className="h-4 w-4 mr-2 text-purple-500 animate-pulse" />
                                Kata Sandi
                            </Label>
                            {canResetPassword && (
                                <TextLink
                                    href={route('password.request')}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-all duration-200 hover:scale-105"
                                    tabIndex={5}
                                >
                                    Lupa kata sandi?
                                </TextLink>
                            )}
                        </div>
                        <div className="relative group">
                            {/* 🆕 Enhanced password icon */}
                            <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300 ${
                                focusedField === 'password' ? 'scale-110 text-purple-500' :
                                    errors.password ? 'text-red-500 scale-110' : 'text-gray-400'
                            }`}>
                                <Lock className="h-5 w-5 transition-all duration-300" />
                            </div>

                            {/* 🆕 Enhanced border effect */}
                            <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                                focusedField === 'password' ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-100 scale-105' :
                                    errors.password ? 'bg-gradient-to-r from-red-500/10 to-pink-500/10 opacity-100 scale-102' : 'opacity-0'
                            }`}></div>

                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                onFocus={() => setFocusedField('password')}
                                onBlur={() => setFocusedField(null)}
                                placeholder="Masukkan kata sandi"
                                className={`pl-12 pr-12 h-12 bg-white/50 backdrop-blur-sm border-gray-200 rounded-xl transition-all duration-300 hover:bg-white/70 hover:shadow-lg ${
                                    errors.password ? 'focus:ring-red-500/20 focus:border-red-500 border-red-300' :
                                        'focus:ring-purple-500/20 focus:border-purple-500'
                                }`}
                            />

                            {/* Enhanced Eye Toggle Button */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-all duration-300 hover:scale-110 group"
                            >
                                <div className={`transition-all duration-300 ${showPassword ? 'rotate-180' : ''}`}>
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </div>
                            </button>

                            {/* 🆕 Password length indicator */}
                            {data.password && (
                                <div className="absolute inset-y-0 right-12 pr-4 flex items-center">
                                    <div className={`h-2 w-2 rounded-full animate-pulse ${
                                        data.password.length >= 6 ? 'bg-green-500' : 'bg-yellow-500'
                                    }`}></div>
                                </div>
                            )}
                        </div>

                        {/* 🆕 Password length feedback */}
                        {data.password && data.password.length < 6 && (
                            <div className="text-sm flex items-center mt-1 transition-all duration-300 text-yellow-600">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                Kata sandi minimal 6 karakter
                            </div>
                        )}

                        <InputError message={errors.password} />
                    </div>

                    {/* Enhanced Remember Me Checkbox */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 group">
                            <div className="relative">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    checked={data.remember}
                                    onCheckedChange={(checked) => setData('remember', !!checked)}
                                    tabIndex={3}
                                    className="rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500/20 transition-all duration-300 hover:scale-110"
                                />
                                {data.remember && (
                                    <div className="absolute inset-0 rounded-lg bg-blue-500/20 animate-ping"></div>
                                )}
                            </div>
                            <Label htmlFor="remember" className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200 cursor-pointer">
                                Ingat saya
                            </Label>
                        </div>
                    </div>

                    {/* 🆕 Enhanced Submit Button with Dynamic States */}
                    <Button
                        type="submit"
                        className={`w-full h-12 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group ${
                            isFormValid && !processing
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                                : 'bg-gray-400 hover:bg-gray-500 text-gray-200 cursor-not-allowed'
                        }`}
                        tabIndex={4}
                        disabled={!isFormValid || processing}
                    >
                        {/* 🆕 Animated background shimmer */}
                        {isFormValid && !processing && (
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        )}

                        {processing ? (
                            <div className="relative flex items-center justify-center">
                                <LoaderCircle className="h-5 w-5 animate-spin mr-2" />
                                <span className="animate-pulse">Memproses...</span>

                                {/* 🆕 Loading dots animation */}
                                <div className="ml-2 flex space-x-1">
                                    <div className="h-1 w-1 bg-white rounded-full animate-bounce delay-0"></div>
                                    <div className="h-1 w-1 bg-white rounded-full animate-bounce delay-100"></div>
                                    <div className="h-1 w-1 bg-white rounded-full animate-bounce delay-200"></div>
                                </div>
                            </div>
                        ) : (
                            <div className="relative flex items-center justify-center">
                                {isFormValid ? (
                                    <>
                                        <Sparkles className="h-5 w-5 mr-2 animate-pulse" />
                                        Masuk ke Akun
                                    </>
                                ) : (
                                    <>
                                        <User className="h-5 w-5 mr-2" />
                                        Lengkapi form untuk melanjutkan
                                    </>
                                )}
                            </div>
                        )}
                    </Button>

                    {/* 🆕 Form progress indicator */}
                    <div className="flex justify-center space-x-2">
                        <div className={`h-2 w-8 rounded-full transition-all duration-300 ${
                            data.email.length > 0 ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                        <div className={`h-2 w-8 rounded-full transition-all duration-300 ${
                            data.password.length > 0 ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                    </div>
                </div>

                {/* Enhanced Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white/80 backdrop-blur-sm text-gray-500 font-medium rounded-full border border-gray-200/50">
                            atau
                        </span>
                    </div>
                </div>

                {/* Enhanced Register Link */}
                <div className="text-center">
                    <span className="text-sm text-gray-600">Belum punya akun? </span>
                    <TextLink
                        href={route('register')}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-all duration-200 hover:scale-105 inline-flex items-center"
                        tabIndex={5}
                    >
                        <span>Daftar sekarang</span>
                        <Sparkles className="h-3 w-3 ml-1 animate-pulse" />
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
