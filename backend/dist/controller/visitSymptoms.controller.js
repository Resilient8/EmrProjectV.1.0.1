"use strict";
// ในไฟล์ src/controller/visitSymptoms.controller.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addVisitSymptoms = void 0;
const visitSymptoms_service_1 = require("../services/visitSymptoms.service");
const addVisitSymptoms = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const visitId = parseInt(req.params.visit_id, 10);
        const symptomsData = req.body;
        if (isNaN(visitId)) {
            return res.status(400).json({ message: 'Invalid Visit ID' });
        }
        yield visitSymptoms_service_1.VisitSymptomService.addOrUpdateSymptoms(visitId, symptomsData);
        res.status(201).json({ message: 'Symptoms saved successfully' });
    }
    catch (error) {
        console.error('Error adding symptoms:', error);
        next(error);
    }
});
exports.addVisitSymptoms = addVisitSymptoms;
