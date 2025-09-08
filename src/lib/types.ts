export type SymptomLog = {
  id: string;
  type: 'symptom';
  timestamp: Date;
  name: string;
  severity: number;
  notes?: string;
};

export type TreatmentLog = {
  id: string;
  type: 'treatment';
  timestamp: Date;
  name: string;
  dosage: string;
  notes?: string;
};

export type LifestyleLog = {
  id: string;
  type: 'lifestyle';
  timestamp: Date;
  subtype: 'diet' | 'exercise' | 'sleep';
  quality?: number; // for sleep
  duration?: number; // for sleep
  item?: string; // for diet
  exerciseType?: string; // for exercise
  exerciseDuration?: number; // for exercise
  notes?: string;
};

export type LogEntry = SymptomLog | TreatmentLog | LifestyleLog;
