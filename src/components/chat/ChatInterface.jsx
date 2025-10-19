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

const AI_MODELS = [
  { 
    id: 'gemini', 
    name: 'Gemini Pro', 
    icon: Sparkles, 
    color: 'emerald',
    description: 'Google\'s most capable AI'
  },
  { 
    id: 'grok', 
    name: 'Grok', 
    icon: Zap, 
    color: 'purple',
    description: 'X\'s witty AI assistant'
  },
  { 
    id: 'custom', 
    name: 'Custom Model', 
    icon: Brain, 
    color: 'amber',
    description: 'Add your own AI model'
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      content: inputValue,
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
              message: inputValue,
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
            />
          ))}

          {isLoading && <TypingIndicator models={selectedModels} />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <Card className="p-3">
            <div className="flex space-x-3">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything... Press Enter to send, Shift+Enter for new line"
                className="flex-1 border-0 bg-transparent resize-none focus:ring-0 min-h-[50px] max-h-32"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
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