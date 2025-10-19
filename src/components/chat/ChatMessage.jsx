'use client';

import { Card } from '@/components/ui/card';
import { cn, formatTimestamp } from '@/lib/utils';
import { Bot, User, Sparkles, Zap, Brain } from 'lucide-react';

const MODEL_ICONS = {
  gemini: Sparkles,
  grok: Zap,
  custom: Brain
};

const MODEL_COLORS = {
  gemini: 'from-emerald-500 to-cyan-500',
  grok: 'from-purple-500 to-blue-500',
  custom: 'from-amber-500 to-orange-500'
};

export default function ChatMessage({ message, isLast, compareMode }) {
  const isUser = message.role === 'user';
  const ModelIcon = MODEL_ICONS[message.model] || Bot;

  return (
    <div className={cn(
      "flex w-full gap-4 chat-bubble",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <div className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          message.model ? `bg-gradient-to-r ${MODEL_COLORS[message.model]} glow` : "bg-gradient-to-r from-blue-500 to-purple-500"
        )}>
          <ModelIcon className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={cn(
        "max-w-[70%] space-y-2",
        isUser && "flex flex-col items-end"
      )}>
        {!isUser && message.model && (
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-white/60 uppercase tracking-wide">
              {message.model === 'gemini' ? 'Gemini Pro' : 
               message.model === 'grok' ? 'Grok' : 'Custom Model'}
            </span>
            <span className="text-xs text-white/40">
              {formatTimestamp(message.timestamp)}
            </span>
          </div>
        )}
        
        <Card className={cn(
          "p-4 transition-all duration-300",
          isUser 
            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white glow" 
            : compareMode 
              ? "glass-strong border-l-4 border-l-blue-400" 
              : "glass"
        )}>
          <div className="prose prose-invert max-w-none">
            <p className="text-sm leading-relaxed text-white whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
        </Card>
        
        {isUser && (
          <span className="text-xs text-white/40 mt-1">
            {formatTimestamp(message.timestamp)}
          </span>
        )}
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center glow">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
}