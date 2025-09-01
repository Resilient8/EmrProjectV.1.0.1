// models/patient.ts
export interface Patient {
  id: number;
  prefix?: string;
  firstName: string;
  lastName: string;
  age?: number;
  address?: string;
  patientId: string;
  birthDate?: Date | null;
  status?: string;
  // ลบ Properties เหล่านี้ออก:
  // temperature?: number;
  // pulse?: number;
  // respiration?: number;
  // bloodPressure?: string;
  // height?: number;
  // weight?: number;
  // bmi?: number;
  // waistCircumference?: number;
  // allergies?: string;
  // underlyingDiseases?: string;
  // symptoms?: string;
  // visitDate?: Date | null;
}