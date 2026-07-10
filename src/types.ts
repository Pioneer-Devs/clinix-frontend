export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'supervisor' | 'admin' | 'patient';
  yearOfStudy?: number;
  hospital?: string;
  matricNumber?: string;
  mdcnRegNo?: string;
  isVerified?: boolean;
}

export interface Patient {
  id: string;
  hospitalId: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: 'M' | 'F';
  phone?: string;
  chiefComplaint: string;
  waitingTime: number;
  priority: 'urgent' | 'waiting' | 'routine';
  vitals: {
    temp: number;
    bp: string;
    pulse: number;
    spo2: number;
  };
  workingDiagnosis?: string;
  latestEncounterId?: string;
  latestEncounterStatus?: string;
  isActiveQueueItem: boolean;
  aiAnalysis?: AIAnalysis;
  examNotes?: string;
  treatmentPlan?: string;
  associatedSymptoms?: string[];
}

export interface ActivityEvent {
  id: string;
  type: string;
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
    role: string;
  };
  seal: string;
  credits: number;
}

export interface AIAnalysis {
  primaryDiagnosis: string;
  confidence: number;
  differential: { condition: string; probability: number }[];
  recommendedInvestigations: string[];
  urgency: string;
  mcpActions: {
    skill: string;
    actions: {
      type: string;
      drug?: string;
      stock?: number;
      available?: boolean;
      test?: string;
      days?: number;
    }[];
  }[];
}

export interface ApiUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'student' | 'supervisor' | 'admin' | 'patient';
  year_of_study?: number;
  matric_number?: string;
  hospital?: string;
  mdcn_reg_no?: string;
  is_verified?: boolean;
}

export interface ApiPatient {
  id: string;
  hospital_id: string;
  first_name: string;
  last_name: string;
  age?: number;
  gender: 'M' | 'F';
  phone?: string;
}

export interface ApiPatientCreate {
  hospital_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string; // ISO date YYYY-MM-DD
  gender: 'M' | 'F';
  phone: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  insurance_id?: string;
}

export interface ApiEncounter {
  id: string;
  patient_id: string;
  student_id: string;
  supervisor_id?: string;
  status: string;
  chief_complaint: string;
  duration?: string;
  severity?: string;
  associated_symptoms?: unknown[];
  ai_diagnosis?: string;
  ai_confidence?: number;
  ai_differential?: { condition: string; probability: number }[];
  ai_actions_triggered?: unknown[];
  vitals?: Record<string, unknown>;
  exam_notes?: string;
  working_diagnosis?: string;
  investigations?: string[];
  treatment_plan?: string;
  follow_up?: string;
  supervisor_notes?: string;
  credits_earned?: number;
  created_at: string;
  updated_at: string;
  finalized_at?: string;
}

export interface ApiActivity {
  id: string;
  user_id: string;
  activity_type: string;
  description: string;
  event_data?: Record<string, unknown>;
  created_at: string;
}

export interface ApiPortfolio {
  total_encounters: number;
  total_diagnoses: number;
  diagnostic_accuracy: number;
  total_credits: number;
  clinical_hours: number;
  competencies: Record<string, number | { score: number; encounters: number }>;
  verified_procedures: {
    id: string;
    encounter_id: string;
    category: string;
    points: number;
    signed_hash?: string;
    created_at: string;
  }[];
}

export interface ApiPortfolioStats {
  credits: Record<string, number>;
  skills: Record<string, number>;
  activities: Record<string, number>;
  encounters: Record<string, number>;
}

export interface ApiInventory {
  hospital: string;
  last_updated: string;
  drugs: Record<string, Record<string, unknown>>;
  tests: Record<string, Record<string, unknown>>;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: 'student' | 'supervisor';
  year_of_study?: number;
  matric_number?: string;
  hospital?: string;
  mdcn_reg_no?: string;
}

export interface VerifyEmailPayload {
  email: string;
  code: string;
}

export interface EncounterPayload {
  patient_id: string;
  chief_complaint: string;
  severity?: string;
  associated_symptoms: string[];
  consent_obtained: boolean;
}

export interface EncounterUpdatePayload {
  vitals?: Record<string, unknown>;
  exam_notes?: string;
  working_diagnosis?: string;
  treatment_plan?: string;
  severity?: string;
  associated_symptoms?: string[];
}

export function mapUser(user: ApiUser): User {
  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    role: user.role,
    yearOfStudy: user.year_of_study,
    hospital: user.hospital,
    matricNumber: user.matric_number,
    mdcnRegNo: user.mdcn_reg_no,
    isVerified: user.is_verified,
  };
}

export function mapPatient(patient: ApiPatient, encounters: ApiEncounter[] = []): Patient {
  const patientEncounters = encounters.filter((encounter) => encounter.patient_id === patient.id);
  const activeEncounters = patientEncounters.filter((encounter) => ['draft', 'in_progress', 'pending_review', 'rejected'].includes(encounter.status));
  const latestEncounter = patientEncounters
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0];
  const activeEncounter = activeEncounters
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0];
  const vitals = (activeEncounter?.vitals || latestEncounter?.vitals) || {};
  const temp = Number(vitals.temperature || vitals.temp || 0);
  const pulse = Number(vitals.pulse || 0);
  const spo2 = Number(vitals.spo2 || 0);
  const bp = String(vitals.blood_pressure || vitals.bp || '');
  const isActiveQueueItem = activeEncounters.length > 0 || patientEncounters.length === 0;

  return {
    id: patient.id,
    hospitalId: patient.hospital_id,
    firstName: patient.first_name,
    lastName: patient.last_name,
    age: patient.age || 0,
    gender: patient.gender,
    phone: patient.phone,
    chiefComplaint: activeEncounter?.chief_complaint || latestEncounter?.chief_complaint || 'No active complaint recorded',
    waitingTime: activeEncounter ? Math.max(1, Math.round((Date.now() - new Date(activeEncounter.created_at).getTime()) / 60000)) : 0,
    priority: activeEncounter?.severity === 'severe' || activeEncounter?.severity === 'life_threatening' ? 'urgent' : 'waiting',
    vitals: { temp, bp, pulse, spo2 },
    workingDiagnosis: activeEncounter?.working_diagnosis || latestEncounter?.working_diagnosis,
    latestEncounterId: latestEncounter?.id,
    latestEncounterStatus: latestEncounter?.status,
    isActiveQueueItem,
    aiAnalysis: (activeEncounter?.ai_diagnosis || latestEncounter?.ai_diagnosis) ? {
      primaryDiagnosis: (activeEncounter?.ai_diagnosis || latestEncounter?.ai_diagnosis) as string,
      confidence: (activeEncounter?.ai_confidence || latestEncounter?.ai_confidence) as number || 0,
      differential: (activeEncounter?.ai_differential || latestEncounter?.ai_differential) as any || [],
      recommendedInvestigations: (activeEncounter?.investigations || latestEncounter?.investigations) as any || [],
      urgency: (activeEncounter?.severity || latestEncounter?.severity) as string || '',
      mcpActions: (activeEncounter?.ai_actions_triggered || latestEncounter?.ai_actions_triggered) as any || []
    } : undefined,
    examNotes: activeEncounter?.exam_notes || latestEncounter?.exam_notes,
    treatmentPlan: activeEncounter?.treatment_plan || latestEncounter?.treatment_plan,
    associatedSymptoms: (activeEncounter?.associated_symptoms || latestEncounter?.associated_symptoms) as string[] || [],
  };
}
