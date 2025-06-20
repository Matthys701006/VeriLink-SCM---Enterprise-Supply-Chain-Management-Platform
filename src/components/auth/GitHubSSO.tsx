import React from 'react';
import { Github } from 'lucide-react';
import { supabase } from '../../services/supabase/client';

interface GitHubSSOProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const GitHubSSO: React.FC<GitHubSSOProps> = ({ onSuccess, onError }) => {
  const handleGitHubSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/success`
        }
      });

      if (error) {
        throw error;
      }

      // onSuccess will be called after redirect
      onSuccess?.();
    } catch (error) {
      console.error('GitHub SSO error:', error);
      onError?.(error as Error);
    }
  };

  return (
    <button
      onClick={handleGitHubSignIn}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 font-medium"
    >
      <Github className="w-5 h-5" />
      Continue with GitHub
    </button>
  );
};

export default GitHubSSO;