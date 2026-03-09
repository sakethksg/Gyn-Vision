/**
 * Model selector dropdown component
 */
'use client';

import { Model } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ModelSelectorProps {
  models: Model[];
  selectedId: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

export function ModelSelector({
  models,
  selectedId,
  onSelect,
  disabled = false,
}: ModelSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Select Model</label>
      <Select value={selectedId} onValueChange={onSelect} disabled={disabled}>
        <SelectTrigger className="w-full bg-white/[0.03] border-white/[0.08] hover:border-primary/30 transition-all duration-300 focus:ring-primary/30 focus:border-primary/30">
          <SelectValue placeholder="Choose a model" />
        </SelectTrigger>
        <SelectContent className="glass-card border-white/[0.08]">
          {models.map((model) => (
            <SelectItem key={model.id} value={model.id} className="focus:bg-primary/10">
              <div className="flex flex-col">
                <span className="font-medium">{model.name}</span>
                <span className="text-xs text-muted-foreground">
                  {model.description}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
