'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [availableVoices, setAvailableVoices] = useState([]);

  const utteranceRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      
      const loadVoices = () => {
        const voiceList = window.speechSynthesis.getVoices();
        console.log('Loading voices:', voiceList.length);
        setVoices(voiceList);
        setAvailableVoices(voiceList);
        
        if (voiceList.length > 0) {
          // Set default voice (prefer English voices)
          const englishVoice = voiceList.find(voice => 
            voice.lang.startsWith('en-') && voice.name.includes('Google')
          ) || voiceList.find(voice => 
            voice.lang.startsWith('en-')
          ) || voiceList[0];
          
          console.log('Selected default voice:', englishVoice?.name);
          setSelectedVoice(englishVoice);
        }
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;

      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  const speak = useCallback((text) => {
    if (!isSupported || !text.trim()) {
      console.log('Speech synthesis not supported or empty text');
      return;
    }

    // Check if speech synthesis is currently speaking
    if (window.speechSynthesis.speaking) {
      console.log('Speech synthesis is already speaking, canceling...');
      window.speechSynthesis.cancel();
    }

    // Wait a moment for the cancel to complete
    setTimeout(() => {
      try {
        // Validate speech synthesis state
        if (!window.speechSynthesis) {
          console.error('Speech synthesis not available in this browser');
          return;
        }

        console.log('Creating speech utterance for text:', text.substring(0, 50) + '...');
        console.log('Available voices:', availableVoices.length);
        console.log('Selected voice:', selectedVoice?.name || 'None');

        const utterance = new SpeechSynthesisUtterance(text);
        
        // Validate and set voice
        if (selectedVoice && availableVoices.includes(selectedVoice)) {
          utterance.voice = selectedVoice;
          console.log('Voice set to:', selectedVoice.name);
        } else if (availableVoices.length > 0) {
          utterance.voice = availableVoices[0];
          console.log('Using fallback voice:', availableVoices[0].name);
        }
        
        // Set speech parameters with validation
        utterance.rate = Math.max(0.1, Math.min(2, rate));
        utterance.pitch = Math.max(0, Math.min(2, pitch));
        utterance.volume = Math.max(0, Math.min(1, volume));

        utterance.onstart = () => {
          console.log('Speech started');
          setIsSpeaking(true);
          setIsPaused(false);
        };

        utterance.onend = () => {
          console.log('Speech ended');
          setIsSpeaking(false);
          setIsPaused(false);
        };

        utterance.onerror = (event) => {
          console.error('Speech synthesis error details:', {
            error: event.error,
            type: event.type,
            message: event.error || 'Unknown error',
            utteranceText: event.utterance?.text?.substring(0, 50) || 'No text',
            voiceName: event.utterance?.voice?.name || 'No voice'
          });
          
          // Try to recover by clearing state
          setIsSpeaking(false);
          setIsPaused(false);
          
          // Cancel any remaining speech
          try {
            window.speechSynthesis.cancel();
          } catch (cancelError) {
            console.error('Error canceling speech after error:', cancelError);
          }
        };

        utterance.onpause = () => {
          console.log('Speech paused');
          setIsPaused(true);
        };

        utterance.onresume = () => {
          console.log('Speech resumed');
          setIsPaused(false);
        };

        utteranceRef.current = utterance;
        
        // Speak with additional error checking
        try {
          console.log('Attempting to speak...');
          window.speechSynthesis.speak(utterance);
          console.log('Speech request sent');
        } catch (speakError) {
          console.error('Error calling speak():', speakError);
          setIsSpeaking(false);
          setIsPaused(false);
        }
        
      } catch (error) {
        console.error('Error in speak function:', error);
        setIsSpeaking(false);
        setIsPaused(false);
      }
    }, 200); // Increased timeout to ensure cancel completes
  }, [isSupported, selectedVoice, rate, pitch, volume, availableVoices]);

  const pause = useCallback(() => {
    if (isSpeaking && !isPaused) {
      try {
        window.speechSynthesis.pause();
      } catch (error) {
        console.error('Error pausing speech synthesis:', error);
      }
    }
  }, [isSpeaking, isPaused]);

  const resume = useCallback(() => {
    if (isSpeaking && isPaused) {
      try {
        window.speechSynthesis.resume();
      } catch (error) {
        console.error('Error resuming speech synthesis:', error);
      }
    }
  }, [isSpeaking, isPaused]);

  const stop = useCallback(() => {
    try {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    } catch (error) {
      console.error('Error stopping speech synthesis:', error);
    } finally {
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, []);

  const setVoice = useCallback((voice) => {
    setSelectedVoice(voice);
  }, []);

  return {
    speak,
    pause,
    resume,
    stop,
    isSpeaking,
    isPaused,
    isSupported,
    voices,
    selectedVoice,
    setVoice,
    rate,
    setRate,
    pitch,
    setPitch,
    volume,
    setVolume
  };
}