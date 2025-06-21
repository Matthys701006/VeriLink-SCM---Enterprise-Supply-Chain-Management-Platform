import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  EyeOff, 
  Shield, 
  Smartphone, 
  AlertTriangle, 
  CheckCircle,
  Lock,
  Unlock
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabase/client';
import { usePerformance } from '../../contexts/PerformanceContext';
import { useTranslation } from 'react-i18next';
import { rbacService } from '../../services/security/RBACService';

interface EnhancedAuthProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface LoginAttempt {
  email: string;
  timestamp: string;
  success: boolean;
  ip_address?: string;
}

export const EnhancedAuth: React.FC<EnhancedAuthProps> = ({ onSuccess, onError }) => {
  const { user } = useAuth();
  const { recordApiCall } = usePerformance();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [showMfa, setShowMfa] = useState(false);
  const [accountLocked, setAccountLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState<Date | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    checkAccountLockout();
  }, [email]);

  const checkAccountLockout = async () => {
    if (!email) return;

    try {
      // Check recent failed login attempts (mock implementation)
      const recentAttempts = getRecentFailedAttempts(email);
      
      if (recentAttempts >= 5) {
        setAccountLocked(true);
        setLockoutTime(new Date(Date.now() + 5 * 60 * 1000)); // 5 minute lockout
      } else {
        setAccountLocked(false);
        setLockoutTime(null);
      }
      
      setFailedAttempts(recentAttempts);
    } catch (error) {
      console.error('Error checking account lockout:', error);
    }
  };

  const getRecentFailedAttempts = (email: string): number => {
    // Mock implementation - in real app, would query database
    const attempts = JSON.parse(localStorage.getItem('loginAttempts') || '[]') as LoginAttempt[];
    const recentAttempts = attempts.filter(
      attempt => 
        attempt.email === email && 
        !attempt.success &&
        new Date(attempt.timestamp) > new Date(Date.now() - 30 * 60 * 1000) // Last 30 minutes
    );
    return recentAttempts.length;
  };

  const recordLoginAttempt = (email: string, success: boolean) => {
    const attempts = JSON.parse(localStorage.getItem('loginAttempts') || '[]') as LoginAttempt[];
    attempts.push({
      email,
      timestamp: new Date().toISOString(),
      success,
      ip_address: 'localhost' // Mock IP
    });
    
    // Keep only last 100 attempts
    if (attempts.length > 100) {
      attempts.splice(0, attempts.length - 100);
    }
    
    localStorage.setItem('loginAttempts', JSON.stringify(attempts));
  };

  const validatePassword = (pwd: string): string[] => {
    const errors: string[] = [];
    
    if (pwd.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(pwd)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(pwd)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(pwd)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
      errors.push('Password must contain at least one special character');
    }
    
    return errors;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      newErrors.password = passwordErrors[0]; // Show first error
    }
    
    // Confirm password (sign up only)
    if (isSignUp && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Account lockout check
    if (accountLocked && lockoutTime && new Date() < lockoutTime) {
      newErrors.lockout = `Account locked. Try again in ${Math.ceil((lockoutTime.getTime() - Date.now()) / 60000)} minutes.`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      setErrors({});
      
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              mfa_enabled: false // Default to false, can be enabled later
            }
          }
        });
        
        if (error) throw error;
        
        recordLoginAttempt(email, true);
        onSuccess?.();
        
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) {
          recordLoginAttempt(email, false);
          throw error;
        }

        // Check if user requires MFA (mandatory for admin roles)
        if (!mfaCode) {
          const requiresMFA = await rbacService.userRequiresMFA(userData.id);
          if (requiresMFA && !userData.mfa_enabled) {
            // Redirect to MFA setup
            console.log('Admin role requires MFA setup');
            // In a real implementation, would redirect to MFA setup page
            // or show MFA setup component
            return;
          }
        }
        
        recordLoginAttempt(email, true);
        
        // Check if MFA is required
        const { data: userData } = await supabase
          .auth.getUser();
        
        if (userData?.data?.user?.user_metadata?.mfa_enabled) {
          setShowMfa(true);
        } else {
          onSuccess?.();
        }
      }
      
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      if (error.message.includes('Invalid login credentials')) {
        setErrors({ auth: 'Invalid email or password' });
        checkAccountLockout(); // Recheck lockout status
      } else {
        setErrors({ auth: error.message });
      }
      
      onError?.(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMfaVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Mock MFA verification - in real app would verify TOTP code
      try {
        const startTime = performance.now();
        
        if (mfaCode.length === 6 && /^\d+$/.test(mfaCode)) {
          // In real implementation, would verify with backend
          const valid = true; // Mock response
          
          recordApiCall('verify-mfa', performance.now() - startTime);
          
          if (valid) {
            onSuccess?.();
          } else {
            setErrors({ mfa: t('auth.invalidCode') });
          }
        } else {
          setErrors({ mfa: t('auth.invalidCode') });
        }
      } catch (error) {
        setErrors({ mfa: error.message });
      }
      
    } catch (error: any) {
      setErrors({ mfa: error.message });
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (pwd: string): { score: number; label: string; color: string } => {
    const errors = validatePassword(pwd);
    const score = Math.max(0, 5 - errors.length);
    
    switch (score) {
      case 5:
        return { score, label: 'Very Strong', color: 'bg-green-500' };
      case 4:
        return { score, label: 'Strong', color: 'bg-blue-500' };
      case 3:
        return { score, label: 'Moderate', color: 'bg-yellow-500' };
      case 2:
        return { score, label: 'Weak', color: 'bg-orange-500' };
      default:
        return { score, label: 'Very Weak', color: 'bg-red-500' };
    }
  };

  if (showMfa) {
    return (
      <div className="space-y-6">
         <div className="text-center">
           <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
           <h2 className="text-2xl font-bold text-gray-900">{t('auth.twoFactorAuth')}</h2>
           <p className="text-gray-600 mt-2">{t('auth.enterCode')}</p>
         </div>

        <form onSubmit={handleMfaVerification} className="space-y-4">
          {errors.mfa && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {errors.mfa}
            </div>
          )}

          <div>
            <label htmlFor="mfaCode" className="block text-sm font-medium text-gray-700 mb-2">
              {t('auth.verificationCode')}
            </label>
            <input
              id="mfaCode"
              type="text"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="000000"
              maxLength={6}
              autoComplete="one-time-code"
            />
          </div>

          <button
            type="submit"
            disabled={loading || mfaCode.length !== 6}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Smartphone className="w-5 h-5 mr-2" />
                {t('auth.verifyCode')}
              </>
            )}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {isSignUp ? 'Create Account' : 'Sign In'}
        </h2>
        <p className="text-gray-600 mt-2">
          {isSignUp ? 'Join OrchestrixSCM Enterprise Platform' : 'Access your enterprise dashboard'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* General errors */}
        {(errors.auth || errors.lockout) && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-start">
            <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              {errors.auth || errors.lockout}
              {failedAttempts > 0 && !accountLocked && (
                <div className="mt-1 text-xs">
                  {failedAttempts} failed attempt{failedAttempts !== 1 ? 's' : ''} in the last 30 minutes
                </div>
              )}
            </div>
          </div>
        )}

        {/* Account lockout warning */}
        {failedAttempts >= 3 && !accountLocked && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-sm flex items-start">
            <Lock className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              Account will be locked after {5 - failedAttempts} more failed attempt{5 - failedAttempts !== 1 ? 's' : ''}
            </div>
          </div>
        )}

        {/* Email field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter your email"
            autoComplete="email"
            disabled={accountLocked}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Password field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter your password"
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              disabled={accountLocked}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
          {isSignUp && password && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Password Strength</span>
                <span className={getPasswordStrength(password).score >= 4 ? 'text-green-600' : 'text-gray-600'}>
                  {getPasswordStrength(password).label}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrength(password).color}`}
                  style={{ width: `${(getPasswordStrength(password).score / 5) * 100}%` }}
                />
              </div>
            </div>
          )}
          
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        {/* Confirm password (sign up only) */}
        {isSignUp && (
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Confirm your password"
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading || accountLocked}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : accountLocked ? (
            <>
              <Lock className="w-5 h-5 mr-2" />
              Account Locked
            </>
          ) : (
            <>
              {isSignUp ? 'Create Account' : 'Sign In'}
            </>
          )}
        </button>

        {/* Toggle sign up/sign in */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrors({});
              setPassword('');
              setConfirmPassword('');
            }}
            className="text-blue-600 hover:text-blue-500 text-sm font-medium"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </form>
    </div>
  );
};