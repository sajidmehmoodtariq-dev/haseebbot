'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Send, Sparkles, Brain, Zap, Settings, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import ModelSelector from './ModelSelector';
import VoiceControls from './VoiceControls';
import VoiceInstructions from './VoiceInstructions';
import { useSpeechToText } from '@/hooks/useSpeechToText';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

const AI_MODELS = [
  { 
    id: 'gemini', 
    name: 'Gemini Flash', 
    icon: Sparkles, 
    color: 'emerald',
    description: 'Google\'s fast & capable AI'
  },
  { 
    id: 'gpt', 
    name: 'GPT-4o Mini', 
    icon: Brain, 
    color: 'blue',
    description: 'OpenAI\'s efficient model'
  },
  { 
    id: 'grok', 
    name: 'Grok', 
    icon: Zap, 
    color: 'purple',
    description: 'X\'s witty AI assistant'
  }
];

export default function ChatInterface() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModels, setSelectedModels] = useState(['gemini']);
  const [compareMode, setCompareMode] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Voice functionality hooks
  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported: isSTTSupported,
    error: sttError,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechToText();

  const {
    speak,
    pause,
    resume,
    stop,
    isSpeaking,
    isPaused,
    isSupported: isTTSSupported,
    voices,
    selectedVoice,
    setVoice,
    rate,
    setRate,
    volume,
    setVolume
  } = useTextToSpeech();

  // Get the last AI response for text-to-speech
  const lastAIResponse = messages
    .filter(msg => msg.role === 'assistant')
    .slice(-1)[0]?.content;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle speech-to-text transcript
  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  // Auto-speak AI responses when enabled
  useEffect(() => {
    if (lastAIResponse && !isLoading && selectedModels.length === 1) {
      // Optional: Auto-speak responses (uncomment to enable)
      // speak(lastAIResponse);
    }
  }, [lastAIResponse, isLoading, selectedModels.length]);

  // Keyboard shortcuts for voice controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Space bar for push-to-talk (when input is not focused)
      if (e.code === 'Space' && e.target !== textareaRef.current && !isLoading) {
        if (isListening) {
          stopListening();
        } else {
          startListening();
        }
        e.preventDefault();
      }
      
      // Escape to stop speech
      if (e.code === 'Escape' && isSpeaking) {
        stop();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isListening, isSpeaking, isLoading, startListening, stopListening, stop]);

  const handleSendMessage = async (messageText = null) => {
    const textToSend = messageText || inputValue;
    if (!textToSend.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      content: textToSend,
      role: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate API calls to multiple models
      const responses = await Promise.all(
        selectedModels.map(async (modelId) => {
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: textToSend,
              model: modelId,
              history: messages
            })
          });

          const data = await response.json();
          return {
            id: Date.now() + Math.random(),
            content: data.content || 'Sorry, I could not process that request.',
            role: 'assistant',
            model: modelId,
            timestamp: new Date().toISOString()
          };
        })
      );

      setMessages(prev => [...prev, ...responses]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now(),
        content: 'Sorry, there was an error processing your request.',
        role: 'assistant',
        model: selectedModels[0],
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleCompareMode = () => {
    setCompareMode(!compareMode);
    if (!compareMode && selectedModels.length === 1) {
      setSelectedModels(['gemini', 'grok']);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <VoiceInstructions />
      
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center glow">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">HaseebBot</h1>
              <p className="text-sm text-white/60">Multi-AI Neural Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-white/60">
              <div className="w-6 h-6 rounded-full overflow-hidden">
                {session?.user?.image ? (
                  <img 
                    src={session.user.image} 
                    alt={session.user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white/20 flex items-center justify-center">
                    <User className="w-3 h-3" />
                  </div>
                )}
              </div>
              <span className="text-sm">{session?.user?.name}</span>
            </div>

            {/* Voice Controls */}
            <VoiceControls
              isListening={isListening}
              startListening={startListening}
              stopListening={stopListening}
              isSTTSupported={isSTTSupported}
              sttError={sttError}
              isSpeaking={isSpeaking}
              isPaused={isPaused}
              speak={speak}
              pause={pause}
              resume={resume}
              stop={stop}
              isTTSSupported={isTTSSupported}
              voices={voices}
              selectedVoice={selectedVoice}
              setVoice={setVoice}
              rate={rate}
              setRate={setRate}
              volume={volume}
              setVolume={setVolume}
              lastResponse={lastAIResponse}
            />
            
            <Button
              variant={compareMode ? 'default' : 'outline'}
              size="sm"
              onClick={toggleCompareMode}
              className="float"
            >
              {compareMode ? 'Single Mode' : 'Compare Mode'}
            </Button>
            <ModelSelector
              models={AI_MODELS}
              selectedModels={selectedModels}
              onSelectionChange={setSelectedModels}
              compareMode={compareMode}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              className="text-white/60 hover:text-white"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center glow-strong float">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome to HaseebBot</h2>
              <p className="text-white/60 max-w-md mx-auto">
                Choose your AI models and start a conversation. Experience the power of multiple AI perspectives.
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <ChatMessage
              key={message.id}
              message={message}
              isLast={index === messages.length - 1}
              compareMode={compareMode && message.role === 'assistant'}
              isSpeaking={isSpeaking && message.content === lastAIResponse}
            />
          ))}

          {isLoading && <TypingIndicator models={selectedModels} />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          {/* Speech Recognition Status */}
          {isListening && (
            <div className="mb-3 flex items-center justify-center">
              <Card className="bg-red-500/20 border-red-500/30 p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-red-400 text-sm font-medium">
                    🎤 Listening... {interimTranscript && `"${interimTranscript}"`}
                  </span>
                </div>
              </Card>
            </div>
          )}

          <Card className="p-3">
            <div className="flex space-x-3">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  isListening 
                    ? "Listening... speak now or type your message"
                    : "Ask anything... Press Enter to send, Shift+Enter for new line"
                }
                className={cn(
                  "flex-1 border-0 bg-transparent resize-none focus:ring-0 min-h-[50px] max-h-32",
                  isListening && "ring-2 ring-red-400/50"
                )}
                disabled={isLoading}
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading}
                className={cn(
                  "p-3 aspect-square",
                  !inputValue.trim() ? "opacity-50 cursor-not-allowed" : "glow"
                )}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}