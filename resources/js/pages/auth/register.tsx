import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Mail, Lock, Eye, EyeOff, Sparkles, User, Shield, Check, X, AlertCircle, Zap } from 'lucide-react';
import { FormEventHandler, useState, useEffect } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    // Password validation states
    const [passwordValidation, setPasswordValidation] = useState({
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false
    });
    const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);
    const [showPasswordHints, setShowPasswordHints] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    // Animation on mount
    useEffect(() => {
        setIsLoaded(true);
    }, []);

    // Password validation effect
    useEffect(() => {
        const password = data.password;
        setPasswordValidation({
            minLength: password.length >= 8,
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password),
            hasNumber: /\d/.test(password)
        });
    }, [data.password]);

    // Password matching effect
    useEffect(() => {
        if (data.password_confirmation === '') {
            setPasswordsMatch(null);
        } else {
            setPasswordsMatch(data.password === data.password_confirmation);
        }
    }, [data.password, data.password_confirmation]);

    // Clear server errors when user starts typing
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            // Reset errors ketika user mulai mengetik ulang
            const timeoutId = setTimeout(() => {
                // Ini akan trigger re-render dan clear errors dari Inertia
            }, 100);
            return () => clearTimeout(timeoutId);
        }
    }, [data.name, data.email, data.password, data.password_confirmation]);

    // Check if password is strong
    const isPasswordStrong = Object.values(passwordValidation).every(Boolean);

    // Email validation helper
    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Check if form is valid - hanya cek client-side validation
    const isFormValid = data.name.trim() &&
        data.email.trim() &&
        isValidEmail(data.email) &&
        isPasswordStrong &&
        passwordsMatch === true;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Additional client-side validation
        if (!isPasswordStrong) {
            alert('Password harus memenuhi semua kriteria keamanan');
            return;
        }

        if (passwordsMatch !== true) {
            alert('Konfirmasi password tidak cocok');
            return;
        }

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    // Generate strong password function
    const generateStrongPassword = () => {
        const length = 12;
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';

        let password = '';

        // Ensure at least one character from each category
        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];

        // Fill the rest randomly
        const allChars = uppercase + lowercase + numbers;
        for (let i = 3; i < length; i++) {
            password += allChars[Math.floor(Math.random() * allChars.length)];
        }

        // Shuffle the password
        return password.split('').sort(() => Math.random() - 0.5).join('');
    };

    const handleGeneratePassword = () => {
        const strongPassword = generateStrongPassword();
        setData('password', strongPassword);
        setData('password_confirmation', strongPassword);
        setShowPasswordHints(true);
    };

    const ValidationIcon = ({ isValid }: { isValid: boolean }) => (
        isValid ?
            <Check className="h-3 w-3 text-green-500" /> :
            <X className="h-3 w-3 text-red-400" />
    );

    return (
        <AuthLayout title="Bergabung Dengan Kami" description="Buat akun baru untuk menikmati layanan terbaik kami">
            <Head title="Register" />

            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute top-1/3 -right-8 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-1/4 -left-6 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse delay-2000"></div>
            </div>

            {/* FORM dengan atribut yang mendukung browser password manager */}
            <form
                className={`space-y-6 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                onSubmit={submit}
                name="registration" // Important: Nama form untuk browser detection
                method="post" // Important: Method yang jelas
            >
                <div className="space-y-5">
                    {/* Name Field */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center">
                            <User className="h-4 w-4 mr-2 text-emerald-500 animate-pulse" />
                            Nama Lengkap
                        </Label>
                        <div className="relative group">
                            <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300 ${
                                focusedField === 'name' ? 'scale-110 text-emerald-500' : 'text-gray-400'
                            }`}>
                                <User className="h-5 w-5 transition-all duration-300" />
                            </div>

                            <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 opacity-0 transition-all duration-300 ${
                                focusedField === 'name' ? 'opacity-100 scale-105' : ''
                            }`}></div>

                            <Input
                                id="name"
                                name="name" // Important: Nama field yang jelas
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="name" // Standard autocomplete
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                onFocus={() => setFocusedField('name')}
                                onBlur={() => setFocusedField(null)}
                                disabled={processing}
                                placeholder="Masukkan nama lengkap"
                                className={`relative pl-12 h-12 bg-white/50 backdrop-blur-sm border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 hover:bg-white/70 hover:shadow-lg ${
                                    data.name && !errors.name ? 'pr-10' : 'pr-4'
                                }`}
                            />

                            {data.name && !errors.name && (
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                                    <Check className="h-4 w-4 text-green-500" />
                                </div>
                            )}
                        </div>
                        <InputError message={errors.name} />
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-blue-500 animate-pulse" />
                            Alamat Email
                        </Label>
                        <div className="relative group">
                            <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300 ${
                                focusedField === 'email' ? 'scale-110 text-blue-500' : 'text-gray-400'
                            }`}>
                                <Mail className="h-5 w-5 transition-all duration-300" />
                            </div>

                            <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 opacity-0 transition-all duration-300 ${
                                focusedField === 'email' ? 'opacity-100 scale-105' : ''
                            }`}></div>

                            <Input
                                id="email"
                                name="email" // Important: Nama field yang jelas
                                type="email"
                                required
                                tabIndex={2}
                                autoComplete="email" // Standard autocomplete
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField(null)}
                                disabled={processing}
                                placeholder="nama@email.com"
                                className={`relative pl-12 h-12 bg-white/50 backdrop-blur-sm border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 hover:bg-white/70 hover:shadow-lg ${
                                    data.email && isValidEmail(data.email) && !errors.email ? 'pr-10' : 'pr-4'
                                }`}
                            />

                            {data.email && isValidEmail(data.email) && !errors.email && (
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                                    <Check className="h-4 w-4 text-green-500" />
                                </div>
                            )}
                        </div>
                        <InputError message={errors.email} />
                    </div>

                    {/* Password Field with Browser Support */}
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                            <div className="flex items-center">
                                <Lock className="h-4 w-4 mr-2 text-purple-500 animate-pulse" />
                                Kata Sandi
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    type="button"
                                    onClick={handleGeneratePassword}
                                    className="text-xs text-purple-600 hover:text-purple-700 transition-colors flex items-center bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded-md"
                                >
                                    <Zap className="h-3 w-3 mr-1" />
                                    Generate
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordHints(!showPasswordHints)}
                                    className="text-xs text-gray-500 hover:text-purple-500 transition-colors flex items-center"
                                >
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    {showPasswordHints ? 'Sembunyikan' : 'Lihat'} Kriteria
                                </button>
                            </div>
                        </Label>

                        <div className="relative group">
                            <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300 ${
                                focusedField === 'password' ? 'scale-110 text-purple-500' : 'text-gray-400'
                            }`}>
                                <Lock className="h-5 w-5 transition-all duration-300" />
                            </div>

                            <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 transition-all duration-300 ${
                                focusedField === 'password' ? 'opacity-100 scale-105' : ''
                            }`}></div>

                            <Input
                                id="password"
                                name="password" // Important: Nama field yang jelas
                                type={showPassword ? 'text' : 'password'}
                                required
                                tabIndex={3}
                                autoComplete="new-password" // Important: Browser password generation trigger
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                onFocus={() => {
                                    setFocusedField('password');
                                    setShowPasswordHints(true);
                                }}
                                onBlur={() => setFocusedField(null)}
                                disabled={processing}
                                placeholder="Masukkan kata sandi"
                                // Important: Remove custom styling yang menganggu browser detection
                                style={{ WebkitAppearance: 'textfield' }}
                                className={`relative pl-12 h-12 bg-white/50 backdrop-blur-sm border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 hover:bg-white/70 hover:shadow-lg ${
                                    isPasswordStrong ? 'pr-20' : 'pr-12'
                                }`}
                            />

                            {isPasswordStrong && (
                                <div className="absolute inset-y-0 right-12 flex items-center">
                                    <Check className="h-4 w-4 text-green-500" />
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-all duration-300 hover:scale-110"
                            >
                                <div className={`transition-all duration-300 ${showPassword ? 'rotate-180' : ''}`}>
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </div>
                            </button>
                        </div>

                        {/* Password Strength Indicators */}
                        {showPasswordHints && data.password && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                                <p className="text-xs font-medium text-gray-700 mb-2">Kriteria Kata Sandi:</p>
                                <div className="grid grid-cols-1 gap-1 text-xs">
                                    <div className="flex items-center space-x-2">
                                        <ValidationIcon isValid={passwordValidation.minLength} />
                                        <span className={passwordValidation.minLength ? 'text-green-600' : 'text-gray-600'}>
                                            Minimal 8 karakter
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <ValidationIcon isValid={passwordValidation.hasUppercase} />
                                        <span className={passwordValidation.hasUppercase ? 'text-green-600' : 'text-gray-600'}>
                                            Huruf besar (A-Z)
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <ValidationIcon isValid={passwordValidation.hasLowercase} />
                                        <span className={passwordValidation.hasLowercase ? 'text-green-600' : 'text-gray-600'}>
                                            Huruf kecil (a-z)
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <ValidationIcon isValid={passwordValidation.hasNumber} />
                                        <span className={passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-600'}>
                                            Angka (0-9)
                                        </span>
                                    </div>

                                </div>
                            </div>
                        )}

                        <InputError message={errors.password} />
                    </div>

                    {/* Password Confirmation Field */}
                    <div className="space-y-2">
                        <Label htmlFor="password_confirmation" className="text-sm font-semibold text-gray-700 flex items-center">
                            <Shield className="h-4 w-4 mr-2 text-pink-500 animate-pulse" />
                            Konfirmasi Kata Sandi
                        </Label>
                        <div className="relative group">
                            <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300 ${
                                focusedField === 'password_confirmation' ? 'scale-110 text-pink-500' : 'text-gray-400'
                            }`}>
                                <Shield className="h-5 w-5 transition-all duration-300" />
                            </div>

                            <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/20 to-rose-500/20 opacity-0 transition-all duration-300 ${
                                focusedField === 'password_confirmation' ? 'opacity-100 scale-105' : ''
                            }`}></div>

                            <Input
                                id="password_confirmation"
                                name="password_confirmation" // Important: Nama field yang jelas
                                type={showPasswordConfirmation ? 'text' : 'password'}
                                required
                                tabIndex={4}
                                autoComplete="new-password" // Important: Sama dengan password field
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                onFocus={() => setFocusedField('password_confirmation')}
                                onBlur={() => setFocusedField(null)}
                                disabled={processing}
                                placeholder="Konfirmasi kata sandi"
                                className={`relative pl-12 h-12 bg-white/50 backdrop-blur-sm border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-300 hover:bg-white/70 hover:shadow-lg ${
                                    passwordsMatch !== null ? 'pr-20' : 'pr-12'
                                }`}
                            />

                            {/* Password Match Indicator */}
                            {passwordsMatch !== null && (
                                <div className="absolute inset-y-0 right-12 flex items-center">
                                    {passwordsMatch ?
                                        <Check className="h-4 w-4 text-green-500" /> :
                                        <X className="h-4 w-4 text-red-500" />
                                    }
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-all duration-300 hover:scale-110"
                            >
                                <div className={`transition-all duration-300 ${showPasswordConfirmation ? 'rotate-180' : ''}`}>
                                    {showPasswordConfirmation ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </div>
                            </button>
                        </div>

                        {/* Password Match Status */}
                        {data.password_confirmation && passwordsMatch !== null && (
                            <div className={`text-xs flex items-center space-x-2 ${
                                passwordsMatch ? 'text-green-600' : 'text-red-500'
                            }`}>
                                {passwordsMatch ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                                <span>
                                    {passwordsMatch ? 'Kata sandi cocok' : 'Kata sandi tidak cocok'}
                                </span>
                            </div>
                        )}

                        <InputError message={errors.password_confirmation} />
                    </div>

                    {/* Browser Password Manager Hint */}
                    <div className="text-xs text-gray-500 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start space-x-2">
                        <Sparkles className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-medium text-blue-700 mb-1">💡 Tips Keamanan</p>
                            <p>Browser Anda mungkin menawarkan untuk generate password yang kuat. Atau gunakan tombol "Generate" di atas untuk password yang aman secara otomatis.</p>
                        </div>
                    </div>

                    {/* Enhanced Submit Button */}
                    <Button
                        type="submit"
                        className={`w-full h-12 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group mt-6 ${
                            isFormValid
                                ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        tabIndex={5}
                        disabled={processing || !isFormValid}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                        {processing ? (
                            <div className="relative flex items-center justify-center">
                                <LoaderCircle className="h-5 w-5 animate-spin mr-2" />
                                <span className="animate-pulse">Memproses...</span>
                                <div className="ml-2 flex space-x-1">
                                    <div className="h-1 w-1 bg-white rounded-full animate-bounce delay-0"></div>
                                    <div className="h-1 w-1 bg-white rounded-full animate-bounce delay-100"></div>
                                    <div className="h-1 w-1 bg-white rounded-full animate-bounce delay-200"></div>
                                </div>
                            </div>
                        ) : (
                            <div className="relative flex items-center justify-center">
                                <Sparkles className="h-5 w-5 mr-2 animate-pulse" />
                                Buat Akun Baru
                            </div>
                        )}
                    </Button>

                    {/* Form Status Indicator */}
                    {!isFormValid && (data.name || data.email || data.password || data.password_confirmation) && (
                        <div className="text-xs text-gray-500 text-center">
                            Lengkapi semua field dengan benar untuk melanjutkan
                        </div>
                    )}
                </div>

                {/* Enhanced Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white/80 backdrop-blur-sm text-gray-500 font-medium rounded-full border border-gray-200/50">
                            atau
                        </span>
                    </div>
                </div>

                {/* Enhanced Login Link */}
                <div className="text-center">
                    <span className="text-sm text-gray-600">Sudah punya akun? </span>
                    <TextLink
                        href={route('login')}
                        className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-all duration-200 hover:scale-105 inline-flex items-center"
                        tabIndex={6}
                    >
                        <span>Masuk sekarang</span>
                        <Sparkles className="h-3 w-3 ml-1 animate-pulse" />
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
