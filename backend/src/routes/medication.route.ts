import { Router } from 'express';
import { 
    getAllMedications, 
    createMedication, 
    updateMedication, 
    deleteMedication,
    restockMedication // 👈 import มาด้วย
} from '../controller/medication.controller';

const router = Router();

router.get('/', getAllMedications);
router.post('/', createMedication);
router.put('/:id', updateMedication);
router.delete('/:id', deleteMedication);
router.post('/:id/restock', restockMedication); // 👈 Route สำหรับเติมของ

export default router;