'use client';

import { Card } from '@/components/ui/card';
import { cn, formatTimestamp } from '@/lib/utils';
import { Bot, User, Sparkles, Zap, Brain, Volume2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MODEL_ICONS = {
  gemini: Sparkles,
  grok: Zap,
  gpt: Brain,
  custom: Brain
};

const MODEL_COLORS = {
  gemini: 'from-emerald-500 to-cyan-500',
  grok: 'from-purple-500 to-blue-500',
  gpt: 'from-blue-500 to-indigo-500',
  custom: 'from-amber-500 to-orange-500'
};

export default function ChatMessage({ message, isLast, compareMode, isSpeaking }) {
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
              {message.model === 'gemini' ? 'Gemini 2.0 Flash' : 
               message.model === 'grok' ? 'GPT-OSS 20B' : 
               message.model === 'gpt' ? 'GPT-4o Mini' : 'Custom Model'}
            </span>
            {isSpeaking && (
              <div className="flex items-center space-x-1">
                <Volume2 className="w-3 h-3 text-blue-400 animate-pulse" />
                <span className="text-xs text-blue-400">Speaking...</span>
              </div>
            )}
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
          <div className="prose prose-invert max-w-none prose-sm">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                // Customize markdown components for better styling
                h1: ({children}) => <h1 className="text-lg font-bold text-white mb-2">{children}</h1>,
                h2: ({children}) => <h2 className="text-base font-bold text-white mb-2">{children}</h2>,
                h3: ({children}) => <h3 className="text-sm font-bold text-white mb-1">{children}</h3>,
                p: ({children}) => <p className="text-white mb-2 last:mb-0">{children}</p>,
                strong: ({children}) => <strong className="font-bold text-blue-200">{children}</strong>,
                em: ({children}) => <em className="italic text-green-200">{children}</em>,
                code: ({children}) => <code className="bg-black/30 text-cyan-200 px-1 py-0.5 rounded text-xs">{children}</code>,
                pre: ({children}) => <pre className="bg-black/40 text-cyan-200 p-3 rounded-lg overflow-x-auto text-xs mb-2">{children}</pre>,
                ul: ({children}) => <ul className="list-disc list-inside text-white mb-2 space-y-1">{children}</ul>,
                ol: ({children}) => <ol className="list-decimal list-inside text-white mb-2 space-y-1">{children}</ol>,
                li: ({children}) => <li className="text-white">{children}</li>,
                blockquote: ({children}) => <blockquote className="border-l-4 border-blue-400 pl-4 text-blue-100 italic">{children}</blockquote>,
              }}
            >
              {message.content}
            </ReactMarkdown>
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