export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  mrn: string;
  bloodType: string;
  ward: string;
  avatarInitials: string;
  chiefComplaint: string;
  arrivalText: string;
  urgency: 'Urgent' | 'Waiting' | 'Routine';
  vitals: {
    temp: number;
    bp: string;
    pulse: number;
    spo2: number;
  };
  workingDiagnosis?: string;
}

export interface SystemLog {
  id: string;
  type: 'verified' | 'autosave' | 'pending';
  title: string;
  description: string;
  timeAgo: string;
}

export interface ClinicalProcedure {
  date: string;
  time: string;
  id: string;
  name: string;
  setting: string;
  supervisor: {
    name: string;
    avatarUrl: string;
    role: string;
  };
  seal: string;
}

export interface ReviewCase {
  id: string;
  residentName: string;
  timeAgo: string;
  patientId: string;
  patientName: string;
  findings: string;
  plan: string[];
  aiInsight: string;
  aiSuggestion: string;
}
