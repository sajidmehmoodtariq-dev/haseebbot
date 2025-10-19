'use client';

import { Card } from '@/components/ui/card';
import { Sparkles, Zap, Brain } from 'lucide-react';

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

export default function TypingIndicator({ models = ['gemini'] }) {
  return (
    <div className="flex w-full gap-4 justify-start chat-bubble">
      {models.map((modelId, index) => {
        const ModelIcon = MODEL_ICONS[modelId] || Brain;
        const modelName = modelId === 'gemini' ? 'Gemini Pro' : 
                         modelId === 'grok' ? 'Grok' : 'Custom Model';

        return (
          <div key={modelId} className="flex gap-4">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r ${MODEL_COLORS[modelId]} glow`}>
              <ModelIcon className="w-4 h-4 text-white" />
            </div>
            
            <div className="max-w-[70%]">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xs font-medium text-white/60 uppercase tracking-wide">
                  {modelName}
                </span>
              </div>
              
              <Card className="glass p-4">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <span className="ml-2 text-sm text-white/60">Thinking...</span>
                </div>
              </Card>
            </div>
          </div>
        );
      })}
    </div>
  );
}