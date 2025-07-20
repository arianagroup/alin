import AppLogoIcon from './app-logo-icon';

interface AppLogoProps {
    size?: 'sm' | 'md' | 'lg';
    showText?: boolean;
    variant?: 'sidebar' | 'auth' | 'header' | 'clean'; // Tambahkan variant 'clean'
}

export default function AppLogo({
                                    size = 'md',
                                    showText = true,
                                    variant = 'sidebar'
                                }: AppLogoProps) {

    const sizeClasses = {
        sm: {
            container: 'size-6',
            icon: 24,
            text: 'text-xs'
        },
        md: {
            container: 'size-8',
            icon: 32,
            text: 'text-sm'
        },
        lg: {
            container: 'size-12',
            icon: 48,
            text: 'text-lg'
        }
    };

    const variantClasses = {
        sidebar: 'bg-sidebar-primary text-sidebar-primary-foreground',
        auth: 'bg-gradient-to-br from-emerald-500 to-blue-500 text-white shadow-lg',
        header: 'bg-white text-gray-700 shadow-md border border-gray-200',
        clean: '' // Tidak ada background sama sekali
    };

    const currentSize = sizeClasses[size];
    const currentVariant = variantClasses[variant];

    // Untuk variant 'clean', tidak pakai container wrapper
    if (variant === 'clean') {
        if (!showText) {
            return (
                <AppLogoIcon
                    size={currentSize.icon}
                    className="transition-all duration-300 hover:scale-105"
                />
            );
        }

        return (
            <div className="flex items-center space-x-3 group">
                <AppLogoIcon
                    size={currentSize.icon}
                    className="transition-all duration-300 group-hover:scale-105"
                />

                {showText && (
                    <div className="grid flex-1 text-left">
                        <span className={`truncate leading-tight font-bold tracking-wide ${currentSize.text} text-gray-800 transition-all duration-300`}>
                            Natlin Resto & Bar
                        </span>
                        {size === 'lg' && (
                            <span className="text-xs text-gray-500 font-medium tracking-wider">
                                Restaurant & Bar
                            </span>
                        )}
                    </div>
                )}
            </div>
        );
    }

    // Untuk variant lainnya, tetap pakai container dengan background
    if (!showText) {
        return (
            <div className={`flex aspect-square ${currentSize.container} items-center justify-center rounded-lg ${currentVariant} transition-all duration-300 hover:scale-105`}>
                <AppLogoIcon
                    size={currentSize.icon}
                    className="fill-current transition-all duration-300"
                />
            </div>
        );
    }

    return (
        <div className="flex items-center space-x-3 group">
            <div className={`flex aspect-square ${currentSize.container} items-center justify-center rounded-lg ${currentVariant} transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg`}>
                <AppLogoIcon
                    size={currentSize.icon}
                    className="fill-current transition-all duration-300"
                />
            </div>

            {showText && (
                <div className="grid flex-1 text-left">
                    <span className={`truncate leading-tight font-bold tracking-wide ${currentSize.text} ${
                        variant === 'auth' ? 'text-gray-700' :
                            variant === 'header' ? 'text-gray-800' :
                                'text-sidebar-primary-foreground'
                    } transition-all duration-300`}>
                        Natlin Resto & Bar
                    </span>
                    {size === 'lg' && (
                        <span className="text-xs text-gray-500 font-medium tracking-wider">
                            Restaurant & Bar
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
