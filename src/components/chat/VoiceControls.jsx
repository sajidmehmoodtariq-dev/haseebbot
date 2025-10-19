'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Square,
  Settings,
  ChevronDown
} from 'lucide-react';

export default function VoiceControls({
  // Speech to Text props
  isListening,
  startListening,
  stopListening,
  isSTTSupported,
  sttError,
  
  // Text to Speech props
  isSpeaking,
  isPaused,
  speak,
  pause,
  resume,
  stop,
  isTTSSupported,
  voices,
  selectedVoice,
  setVoice,
  rate,
  setRate,
  volume,
  setVolume,
  
  // Other props
  lastResponse
}) {
  const [showSettings, setShowSettings] = useState(false);

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSpeakResponse = () => {
    if (lastResponse) {
      speak(lastResponse);
    }
  };

  const handleSpeechControl = () => {
    if (isSpeaking) {
      if (isPaused) {
        resume();
      } else {
        pause();
      }
    } else {
      handleSpeakResponse();
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Speech to Text Control */}
      {isSTTSupported && (
        <div className="relative">
          <Button
            onClick={handleMicClick}
            variant="ghost"
            size="sm"
            className={cn(
              "relative overflow-hidden transition-all duration-300",
              isListening 
                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" 
                : "hover:bg-white/10"
            )}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4" />
                <div className="absolute inset-0 bg-red-500/20 animate-pulse" />
              </>
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </Button>
          
          {isListening && (
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full animate-ping" />
          )}
        </div>
      )}

      {/* Text to Speech Controls */}
      {isTTSSupported && (
        <>
          <Button
            onClick={handleSpeechControl}
            variant="ghost"
            size="sm"
            disabled={!lastResponse}
            className={cn(
              "transition-all duration-300",
              isSpeaking 
                ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                : "hover:bg-white/10"
            )}
          >
            {isSpeaking ? (
              isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>

          {isSpeaking && (
            <Button
              onClick={stop}
              variant="ghost"
              size="sm"
              className="hover:bg-red-500/20 text-red-400"
            >
              <Square className="w-3 h-3" />
            </Button>
          )}
        </>
      )}

      {/* Settings Toggle */}
      <Button
        onClick={() => setShowSettings(!showSettings)}
        variant="ghost"
        size="sm"
        className="hover:bg-white/10"
      >
        <Settings className="w-4 h-4" />
      </Button>

      {/* Settings Panel */}
      {showSettings && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowSettings(false)}
          />
          <Card className="absolute top-full right-0 mt-2 w-80 z-50 p-4">
            <h3 className="text-sm font-semibold text-white mb-4">Voice Settings</h3>
            
            {/* Voice Selection */}
            {voices.length > 0 && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-white/60 mb-2 block">Voice</label>
                  <select
                    value={selectedVoice?.name || ''}
                    onChange={(e) => {
                      const voice = voices.find(v => v.name === e.target.value);
                      setVoice(voice);
                    }}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white"
                  >
                    {voices.map((voice) => (
                      <option key={voice.name} value={voice.name} className="bg-gray-800">
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Speed Control */}
                <div>
                  <label className="text-xs text-white/60 mb-2 block">
                    Speed: {rate.toFixed(1)}x
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={rate}
                    onChange={(e) => setRate(parseFloat(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>

                {/* Volume Control */}
                <div>
                  <label className="text-xs text-white/60 mb-2 block">
                    Volume: {Math.round(volume * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Feature Status */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60">Speech to Text:</span>
                <span className={isSTTSupported ? "text-green-400" : "text-red-400"}>
                  {isSTTSupported ? "Supported" : "Not Supported"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-white/60">Text to Speech:</span>
                <span className={isTTSSupported ? "text-green-400" : "text-red-400"}>
                  {isTTSSupported ? "Supported" : "Not Supported"}
                </span>
              </div>
            </div>

            {sttError && (
              <div className="mt-2 p-2 bg-red-500/20 border border-red-500/30 rounded text-xs text-red-400">
                Speech error: {sttError}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}