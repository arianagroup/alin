import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
                                                                        isOpen,
                                                                        onClose,
                                                                        onConfirm,
                                                                        title,
                                                                        message,
                                                                        confirmText = 'Hapus',
                                                                        cancelText = 'Batal',
                                                                        type = 'danger'
                                                                    }) => {
    if (!isOpen) return null;

    const getTypeStyles = () => {
        switch (type) {
            case 'danger':
                return {
                    icon: 'text-red-600',
                    confirmBtn: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800',
                    iconBg: 'bg-red-100'
                };
            case 'warning':
                return {
                    icon: 'text-yellow-600',
                    confirmBtn: 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800',
                    iconBg: 'bg-yellow-100'
                };
            default:
                return {
                    icon: 'text-blue-600',
                    confirmBtn: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
                    iconBg: 'bg-blue-100'
                };
        }
    };

    const styles = getTypeStyles();

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
                <div className="p-6">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className={`w-12 h-12 ${styles.iconBg} rounded-full flex items-center justify-center`}>
                            <AlertTriangle className={`w-6 h-6 ${styles.icon}`} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                            <p className="text-gray-600 mt-1">{message}</p>
                        </div>
                    </div>

                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`flex-1 ${styles.confirmBtn} text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 shadow-lg`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
