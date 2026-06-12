import React, { useState, useRef, useEffect, type ClipboardEvent, type KeyboardEvent } from 'react';
import { ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import useVerifyOtp from '../../hooks/Auth/useVerifyOtp';
import { useAuthStore } from '../../store/Auth/useAuthStore';
import useSendOtp from '../../hooks/Auth/useResendOtp';

export const OtpVerification: React.FC = () => {
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const { login } = useAuthStore();
    const navigate = useNavigate();
    const { userId, type } = useParams();

    // 🔥 Hook send otp
    const { mutate: sendOtp, isPending: isSending } = useSendOtp();

    // 🔥 Hook verify otp
    const { mutate: verifyOtp, isPending } = useVerifyOtp();

    // 10 minutes = 10 * 60 seconds = 600 seconds
    const [resendTimer, setResendTimer] = useState<number>(10);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Countdown timer mechanism
    useEffect(() => {
        if (resendTimer === 0) return;
        const interval = setInterval(() => {
            setResendTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [resendTimer]);

    // Helper function to format seconds into MM:SS format (e.g., 09:59)
    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    // Focus the first input box on component mount
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    // Handle single character inputs
    const handleChange = (value: string, index: number) => {
        if (isNaN(Number(value))) return; // Only allow numeric values

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        if (error) setError('');

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Handle backspaces and arrow navigation
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                const newOtp = [...otp];
                newOtp[index - 1] = '';
                setOtp(newOtp);
                inputRefs.current[index - 1]?.focus();
            } else {
                const newOtp = [...otp];
                newOtp[index] = '';
                setOtp(newOtp);
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Handle clipboard paste event
    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim().replace(/\D/g, '');

        if (!pastedData) return;

        const newOtp = [...otp];
        for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
            newOtp[i] = pastedData[i];
        }
        setOtp(newOtp);

        const targetFocusIndex = Math.min(pastedData.length, 5);
        inputRefs.current[targetFocusIndex]?.focus();
    };

    // Submit combined OTP code to backend
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const combinedOtp = otp.join('');

        if (combinedOtp.length < 6) {
            setError('Please enter all 6 digits.');
            return;
        }

        setIsLoading(true);
        setError('');

        switch (type) {
            case 'EMAIL_VERIFICATION':
                const payload = {
                    userId: userId!,
                    type: type,
                    otp: combinedOtp
                };

                // 1. TODO call hook
                verifyOtp({ payload: payload }, {
                    onSuccess: (response) => {
                        if (response?.success !== false) {
                            // 2. TODO: save to store
                            login(response?.data.user!, response?.data.accessToken!);
                            navigate('/admin/dashboard');
                        }
                        else {
                            return
                        }
                    }
                })

                break;

            default:
                break;
        }

    };

    const handleResend = async () => {
        if (resendTimer > 0) return;
        setResendTimer(600); // Resetting back to 10 minutes
        setError('');
        // Call your resend API endpoint here...

        switch (type) {
            case 'EMAIL_VERIFICATION':
                const payload = {
                    userId: userId!,
                    type: type,
                };

                // 1. TODO call hook
                sendOtp({ payload: payload })

                break;

            default:
                break;
        }
    };

    return (
        <>
            {/* 1. Full screen parent container that handles absolute centering */}
            <div className="min-h-screen w-full flex items-center justify-center bg-slate-50/50 p-4">

                {/* 2. Your OTP Card */}
                <div className="w-full max-w-md bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
                    <div className="w-full">
                        {/* Header Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                        </div>

                        {/* Headings */}
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Security Verification</h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Enter the 6-digit verification code sent to your email address.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* OTP Input Fields Row */}
                            <div className="flex justify-between items-center gap-2">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength={1}
                                        value={digit}
                                        ref={(el) => { inputRefs.current[index] = el; }}
                                        onChange={(e) => handleChange(e.target.value, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        onPaste={handlePaste}
                                        className="w-12 h-14 text-center text-xl font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none text-slate-800 shadow-inner"
                                    />
                                ))}
                            </div>

                            {/* Error Messaging */}
                            {error && (
                                <div className="text-sm text-red-500 text-center font-medium bg-red-50 p-2.5 rounded-lg border border-red-100">
                                    {error}
                                </div>
                            )}

                            {/* Action Button */}
                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-xl shadow-md shadow-indigo-100 transition-all duration-200 flex justify-center items-center"
                            >
                                {isPending ? 'Verifying Code...' : 'Verify & Continue'}
                            </button>

                            {/* Dynamic Resend Options */}
                            <div className="text-center pt-2">
                                {resendTimer > 0 ? (
                                    <p className="text-xs text-slate-400">
                                        Resend code available in{' '}
                                        <span className="font-mono font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                                            {formatTime(resendTimer)}
                                        </span>
                                    </p>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleResend}
                                        disabled={isSending}
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                                    >
                                        <RefreshCw className="w-3.5 h-3.5" />
                                        Resend Code
                                    </button>
                                )}
                            </div>

                            {/* Return Button */}
                            <button
                                type="button"
                                onClick={() => {
                                    navigate('/signup');
                                }}
                                className="w-full inline-flex items-center justify-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors mt-2"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                Back to registration
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};