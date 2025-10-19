'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ChevronDown, Check, Settings } from 'lucide-react';

export default function ModelSelector({ 
  models, 
  selectedModels, 
  onSelectionChange, 
  compareMode 
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModel = (modelId) => {
    if (compareMode) {
      // In compare mode, allow multiple selections
      if (selectedModels.includes(modelId)) {
        onSelectionChange(selectedModels.filter(id => id !== modelId));
      } else {
        onSelectionChange([...selectedModels, modelId]);
      }
    } else {
      // In single mode, only one selection
      onSelectionChange([modelId]);
      setIsOpen(false);
    }
  };

  const selectedCount = selectedModels.length;
  const displayText = compareMode 
    ? `${selectedCount} Model${selectedCount !== 1 ? 's' : ''}`
    : models.find(m => m.id === selectedModels[0])?.name || 'Select Model';

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 min-w-[140px] justify-between"
      >
        <span className="truncate">{displayText}</span>
        <ChevronDown className={cn(
          "w-4 h-4 transition-transform",
          isOpen && "rotate-180"
        )} />
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <Card className="absolute top-full mt-2 right-0 w-64 z-20 p-2">
            <div className="space-y-1">
              {models.map((model) => {
                const IconComponent = model.icon;
                const isSelected = selectedModels.includes(model.id);
                
                return (
                  <div
                    key={model.id}
                    onClick={() => toggleModel(model.id)}
                    className={cn(
                      "flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all",
                      "hover:bg-white/10",
                      isSelected && "bg-white/20 ring-1 ring-white/30"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      model.color === 'emerald' && "bg-gradient-to-r from-emerald-500 to-cyan-500",
                      model.color === 'purple' && "bg-gradient-to-r from-purple-500 to-blue-500",
                      model.color === 'amber' && "bg-gradient-to-r from-amber-500 to-orange-500"
                    )}>
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white text-sm">
                          {model.name}
                        </span>
                        {isSelected && (
                          <Check className="w-4 h-4 text-emerald-400" />
                        )}
                      </div>
                      <p className="text-xs text-white/60 mt-1">
                        {model.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {compareMode && (
              <div className="border-t border-white/10 mt-2 pt-2">
                <p className="text-xs text-white/60 px-3">
                  Select multiple models to compare responses
                </p>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}