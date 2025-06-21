import React, { useState, useEffect } from 'react';
import { Smartphone, Copy, Check, Info, Shield, XCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../../services/supabase/client';
import { usePerformance } from '../../contexts/PerformanceContext';
import { useTranslation } from 'react-i18next';

interface MFASetupProps {
  userId: string;
  onComplete?: (success: boolean) => void;
  isAdmin?: boolean;
}

export const MFASetup: React.FC<MFASetupProps> = ({ userId, onComplete, isAdmin = false }) => {
  const [secret, setSecret] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [step, setStep] = useState<'generate' | 'verify' | 'success' | 'error'>('generate');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(30);
  const { recordApiCall } = usePerformance();
  const { t } = useTranslation();

  useEffect(() => {
    if (step === 'generate') {
      generateSecret();
    }
  }, [step]);

  // Countdown timer for code expiration
  useEffect(() => {
    if (step !== 'verify') return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step]);

  const generateSecret = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const startTime = performance.now();
      
      // Generate TOTP secret
      const { data, error } = await supabase.functions.invoke('generate-totp-secret', {
        body: { userId }
      });
      
      recordApiCall('generate-totp-secret', performance.now() - startTime);
      
      if (error) throw error;
      
      setSecret(data.secret);
      setQrCodeUrl(data.qrCodeUrl);
      setStep('verify');
      
    } catch (error) {
      console.error('Error generating TOTP secret:', error);
      setError('Failed to generate security key. Please try again.');
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const startTime = performance.now();
      
      // Verify TOTP code
      const { data, error } = await supabase.functions.invoke('verify-totp', {
        body: { 
          userId,
          secret,
          token: verificationCode
        }
      });
      
      recordApiCall('verify-totp', performance.now() - startTime);
      
      if (error) throw error;
      
      if (data.valid) {
        // Enable MFA for user
        await supabase
          .from('users')
          .update({
            mfa_enabled: true,
            mfa_secret: secret, // In production, this should be stored encrypted
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);
        
        setStep('success');
        onComplete?.(true);
      } else {
        setError('Invalid verification code. Please try again.');
      }
      
    } catch (error) {
      console.error('Error verifying TOTP code:', error);
      setError('Failed to verify code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
  };

  const renderStep = () => {
    switch (step) {
      case 'generate':
        return (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        );
        
      case 'verify':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <h4 className="text-blue-800 font-medium">Scan this QR code</h4>
                  <p className="text-blue-700 text-sm mt-1">
                    Use an authenticator app like Google Authenticator, Authy, or Microsoft Authenticator to scan this QR code.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="p-2 bg-white rounded-lg border border-gray-200 w-56 h-56 flex items-center justify-center">
                {qrCodeUrl ? (
                  <img src={qrCodeUrl} alt="QR Code for two-factor authentication" className="max-w-full" />
                ) : (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                )}
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="secret-key" className="block text-sm font-medium text-gray-700">
                  Or enter this secret key manually:
                </label>
                <button 
                  onClick={copySecret}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  aria-label="Copy secret key"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </button>
              </div>
              <div className="flex items-center">
                <input
                  id="secret-key"
                  type="text"
                  readOnly
                  value={secret}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono"
                  aria-label="Secret key"
                />
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700">
                  Enter the 6-digit verification code:
                </label>
                <div className="mt-1 flex">
                  <input
                    id="verification-code"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="000000"
                    aria-label="Verification code"
                  />
                  <div className="ml-2 flex-shrink-0 flex items-center justify-center rounded-full bg-gray-100 w-8 h-8 text-xs text-gray-500">
                    {countdown}
                  </div>
                </div>
              </div>
              
              {error && (
                <div className="text-sm text-red-600">
                  {error}
                </div>
              )}
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={generateSecret}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  New Code
                </button>
                <button
                  type="button"
                  onClick={verifyCode}
                  disabled={loading || verificationCode.length !== 6}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Shield className="w-4 h-4 mr-2" />
                  )}
                  Verify Code
                </button>
              </div>
            </div>
          </div>
        );
        
      case 'success':
        return (
          <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Two-factor authentication enabled</h3>
            <p className="mt-2 text-sm text-gray-500">
              Your account is now protected with an additional layer of security.
              You will need to provide a verification code each time you sign in.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => onComplete?.(true)}
                className="inline-flex justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Continue
              </button>
            </div>
          </div>
        );
        
      case 'error':
        return (
          <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Setup failed</h3>
            <p className="mt-2 text-sm text-gray-500">
              {error || 'An error occurred while setting up two-factor authentication. Please try again.'}
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setStep('generate')}
                className="inline-flex justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Try Again
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="bg-blue-600 px-4 py-5 sm:px-6 flex items-center">
        <Smartphone className="h-6 w-6 text-white mr-3" />
        <h3 className="text-lg leading-6 font-medium text-white">
          Two-Factor Authentication Setup
        </h3>
      </div>
      <div className="px-4 py-5 sm:p-6">
        {isAdmin && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <Shield className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
              <div>
                <h4 className="text-yellow-800 font-medium">Required for Admin Role</h4>
                <p className="text-yellow-700 text-sm mt-1">
                  As an administrator, you are required to set up two-factor authentication to protect your account and sensitive data.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {renderStep()}
      </div>
    </div>
  );
};

export default MFASetup;