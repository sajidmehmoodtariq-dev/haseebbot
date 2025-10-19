'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Mic, Volume2, Keyboard } from 'lucide-react';

export default function VoiceInstructions() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show instructions on first visit
    const hasSeenInstructions = localStorage.getItem('hasSeenVoiceInstructions');
    if (!hasSeenInstructions) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenVoiceInstructions', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="glass-strong max-w-md w-full p-6 relative">
        <Button
          onClick={handleClose}
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 text-white/60 hover:text-white"
        >
          <X className="w-4 h-4" />
        </Button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center glow">
            <Mic className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">🎙️ Voice Features Ready!</h2>
          <p className="text-white/60 text-sm">
            HaseebBot now supports voice input and audio responses
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Mic className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-white font-medium text-sm">Speech to Text</h3>
              <p className="text-white/60 text-xs">
                Click the microphone icon or press <kbd className="bg-white/20 px-1 rounded">Space</kbd> to start voice input
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Volume2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-white font-medium text-sm">Text to Speech</h3>
              <p className="text-white/60 text-xs">
                Click the speaker icon to hear AI responses read aloud
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Keyboard className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-white font-medium text-sm">Keyboard Shortcuts</h3>
              <p className="text-white/60 text-xs">
                <kbd className="bg-white/20 px-1 rounded">Space</kbd> - Toggle voice input<br />
                <kbd className="bg-white/20 px-1 rounded">Esc</kbd> - Stop speech output
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10">
          <Button
            onClick={handleClose}
            className="w-full neural-btn"
          >
            Got it! Let's chat 🚀
          </Button>
        </div>
      </Card>
    </div>
  );
}