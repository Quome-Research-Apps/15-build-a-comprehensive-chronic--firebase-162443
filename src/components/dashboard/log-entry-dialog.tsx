'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';

interface LogEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  logType: 'symptom' | 'treatment' | 'lifestyle';
  onLogSubmit: (data: any) => void;
}

export function LogEntryDialog({ open, onOpenChange, logType, onLogSubmit }: LogEntryDialogProps) {
  const [formData, setFormData] = useState<any>({});
  const [lifestyleSubtype, setLifestyleSubtype] = useState<'diet' | 'exercise' | 'sleep' | ''>('');

  useEffect(() => {
    if (open) {
      setFormData({ timestamp: new Date() });
      setLifestyleSubtype('');
    }
  }, [open, logType]);

  const handleSubmit = () => {
    onLogSubmit(formData);
    onOpenChange(false);
  };
  
  const handleValueChange = (key: string, value: string | number) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  }

  const renderFormFields = () => {
    switch (logType) {
      case 'symptom':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Symptom Name</Label>
              <Input id="name" value={formData.name || ''} onChange={(e) => handleValueChange('name', e.target.value)} placeholder="e.g., Headache, Fatigue" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="severity">Severity (1-10)</Label>
              <Input id="severity" type="number" min="1" max="10" value={formData.severity || ''} onChange={(e) => handleValueChange('severity', parseInt(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" value={formData.notes || ''} onChange={(e) => handleValueChange('notes', e.target.value)} placeholder="Any additional details..."/>
            </div>
          </>
        );
      case 'treatment':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Treatment/Medication Name</Label>
              <Input id="name" value={formData.name || ''} onChange={(e) => handleValueChange('name', e.target.value)} placeholder="e.g., Ibuprofen, Physiotherapy" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dosage">Dosage</Label>
              <Input id="dosage" value={formData.dosage || ''} onChange={(e) => handleValueChange('dosage', e.target.value)} placeholder="e.g., 200mg, 1 tablet" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" value={formData.notes || ''} onChange={(e) => handleValueChange('notes', e.target.value)} placeholder="e.g., Taken with food" />
            </div>
          </>
        );
      case 'lifestyle':
        return (
          <>
            <div className="space-y-2">
              <Label>Lifestyle Type</Label>
              <Select onValueChange={(value: string) => {
                  setLifestyleSubtype(value as 'diet' | 'exercise' | 'sleep');
                  handleValueChange('subtype', value);
                }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sleep">Sleep</SelectItem>
                  <SelectItem value="diet">Diet</SelectItem>
                  <SelectItem value="exercise">Exercise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {lifestyleSubtype === 'sleep' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="quality">Sleep Quality (1-10)</Label>
                  <Input id="quality" type="number" min="1" max="10" value={formData.quality || ''} onChange={(e) => handleValueChange('quality', parseInt(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Sleep Duration (hours)</Label>
                  <Input id="duration" type="number" step="0.5" value={formData.duration || ''} onChange={(e) => handleValueChange('duration', parseFloat(e.target.value))} />
                </div>
              </>
            )}
            {lifestyleSubtype === 'diet' && (
              <div className="space-y-2">
                <Label htmlFor="item">Food/Drink Item</Label>
                <Textarea id="item" value={formData.item || ''} onChange={(e) => handleValueChange('item', e.target.value)} placeholder="e.g., Coffee, Spicy curry, Gluten-free bread" />
              </div>
            )}
            {lifestyleSubtype === 'exercise' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="exerciseType">Type of Exercise</Label>
                  <Input id="exerciseType" value={formData.exerciseType || ''} onChange={(e) => handleValueChange('exerciseType', e.target.value)} placeholder="e.g., Walking, Yoga, Weightlifting" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exerciseDuration">Duration (minutes)</Label>
                  <Input id="exerciseDuration" type="number" value={formData.exerciseDuration || ''} onChange={(e) => handleValueChange('exerciseDuration', parseInt(e.target.value))} />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" value={formData.notes || ''} onChange={(e) => handleValueChange('notes', e.target.value)} placeholder="Any additional details..." />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log a new {logType}</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new entry to your health log.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {renderFormFields()}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>Save Entry</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
