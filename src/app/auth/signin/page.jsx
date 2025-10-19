'use client';

import { useState } from 'react';
import { signIn, getProviders } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Brain, Github, Chrome, Sparkles, Zap } from 'lucide-react';

export default function SignIn() {
  const [isLoading, setIsLoading] = useState({});

  const handleSignIn = async (providerId) => {
    setIsLoading(prev => ({ ...prev, [providerId]: true }));
    try {
      await signIn(providerId, { callbackUrl: '/' });
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, [providerId]: false }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center glow-strong float">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to HaseebBot</h1>
          <p className="text-white/60">
            Sign in to access your multi-AI neural assistant
          </p>
        </div>

        {/* Sign In Card */}
        <Card className="glass-strong p-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white text-center mb-6">
              Choose your sign-in method
            </h2>
            
            {/* Google Sign In */}
            <Button
              onClick={() => handleSignIn('google')}
              disabled={isLoading.google}
              className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all duration-300"
              size="lg"
            >
              <Chrome className="w-5 h-5 mr-3" />
              {isLoading.google ? 'Signing in...' : 'Continue with Google'}
            </Button>

            {/* GitHub Sign In */}
            <Button
              onClick={() => handleSignIn('github')}
              disabled={isLoading.github}
              className="w-full bg-gray-900/50 hover:bg-gray-800/50 text-white border border-white/20 transition-all duration-300"
              size="lg"
            >
              <Github className="w-5 h-5 mr-3" />
              {isLoading.github ? 'Signing in...' : 'Continue with GitHub'}
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="text-center">
              <p className="text-white/60 text-sm mb-4">
                Experience the power of multiple AI models
              </p>
              <div className="flex justify-center space-x-4">
                <div className="flex items-center space-x-2 text-white/50">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs">Gemini</span>
                </div>
                <div className="flex items-center space-x-2 text-white/50">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span className="text-xs">Grok</span>
                </div>
                <div className="flex items-center space-x-2 text-white/50">
                  <Brain className="w-4 h-4 text-amber-400" />
                  <span className="text-xs">Custom</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/40 text-sm">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}