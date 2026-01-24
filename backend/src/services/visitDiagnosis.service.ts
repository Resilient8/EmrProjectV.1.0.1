// backend/src/services/visitDiagnosis.service.ts
import VisitDiagnosis from '../models/visitDiagnosis';

interface DiagnosisInput {
  icd10_code: string;
  diagnosis_type: string;
}

export const addDiagnoses = async (
  visitId: number, 
  diagnoses: DiagnosisInput[], 
  doctorId: number
) => {
  try {
    // 🔥 1. ล้างข้อมูลเก่าของ Visit นี้ทิ้งก่อน (เพื่อไม่ให้ซ้ำเวลา Save หลายรอบ)
    await VisitDiagnosis.destroy({
      where: { visit_id: visitId }
    });

    if (diagnoses.length === 0) {
      return [];
    }

    // 2. เตรียมข้อมูลใหม่
    const dataToSave = diagnoses.map(d => ({
      visit_id: visitId,
      icd10_code: d.icd10_code,
      diagnosis_type: d.diagnosis_type || 'PRINCIPAL',
      doctor_id: doctorId
    }));

    // 3. บันทึกข้อมูลชุดใหม่ลงไป
    const savedDiagnoses = await VisitDiagnosis.bulkCreate(dataToSave);
    return savedDiagnoses;
    
  } catch (error) {
    throw error;
  }
};

export const getDiagnosesByVisitId = async (visitId: number) => {
  try {
    const diagnoses = await VisitDiagnosis.findAll({
      where: { visit_id: visitId },
      include: ['icd10_detail'] // ต้องตรงกับ alias ใน db/index.ts
    });
    return diagnoses;
  } catch (error) {
    throw error;
  }
};