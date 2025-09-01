"use strict";
// src/controller/visits.controller.ts
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
exports.getVisitsByPatientId = exports.getAllVisits = exports.getVisitSymptoms = exports.updateVisit = exports.getVisitById = exports.createVisit = void 0;
const visits_service_1 = require("../services/visits.service");
const visitSymptoms_service_1 = require("../services/visitSymptoms.service");
// ====================================================================
// ฟังก์ชันสำหรับ "Visit หลัก" (Vitals, Referral)
// ====================================================================
const createVisit = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const visitData = req.body;
        if (!visitData.visit_datetime) {
            visitData.visit_datetime = new Date();
        }
        const newVisitId = yield visits_service_1.VisitService.createVisit(visitData);
        res.status(201).json({ message: 'Visit created successfully', visitId: newVisitId });
    }
    catch (error) {
        next(error);
    }
});
exports.createVisit = createVisit;
const getVisitById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const visitId = parseInt(req.params.visit_id, 10);
        const visit = yield visits_service_1.VisitService.getVisitById(visitId);
        if (visit) {
            res.json(visit);
        }
        else {
            res.status(404).json({ message: 'Visit not found' });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.getVisitById = getVisitById;
const updateVisit = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const visitId = parseInt(req.params.visit_id, 10);
        const fieldsToUpdate = req.body;
        if (!visitId || Object.keys(fieldsToUpdate).length === 0) {
            return res.status(400).json({ message: "Visit ID or fields to update are missing" });
        }
        const success = yield visits_service_1.VisitService.updateVisit(visitId, fieldsToUpdate);
        if (success) {
            res.status(200).json({ message: `Visit ID ${visitId} updated successfully.` });
        }
        else {
            res.status(404).json({ message: `Visit with ID ${visitId} not found.` });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.updateVisit = updateVisit;
// ====================================================================
// ฟังก์ชันสำหรับ "อาการ" (Symptoms)
// ====================================================================
const getVisitSymptoms = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const visitId = parseInt(req.params.visit_id, 10);
        const symptoms = yield visitSymptoms_service_1.VisitSymptomService.getSymptomsByVisitId(visitId);
        if (symptoms) {
            const parseJsonField = (field) => {
                try {
                    return (typeof field === 'string') ? JSON.parse(field) : (field || []);
                }
                catch (_a) {
                    return [];
                }
            };
            const responseData = {
                ChiefComplaint: symptoms.ChiefComplaint,
                PresentIllness: symptoms.PresentIllness,
                ROS_General: parseJsonField(symptoms.ROS_General),
                ROS_HeadAndNeck: parseJsonField(symptoms.ROS_HeadAndNeck),
                ROS_Respiratory: parseJsonField(symptoms.ROS_Respiratory),
                ROS_Cardiovascular: parseJsonField(symptoms.ROS_Cardiovascular),
                ROS_Gastrointestinal: parseJsonField(symptoms.ROS_Gastrointestinal),
                ROS_Skin: parseJsonField(symptoms.ROS_Skin),
            };
            res.json(responseData);
        }
        else {
            res.json({ ChiefComplaint: '', PresentIllness: '', ROS_General: [], ROS_HeadAndNeck: [], ROS_Respiratory: [], ROS_Cardiovascular: [], ROS_Gastrointestinal: [], ROS_Skin: [] });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.getVisitSymptoms = getVisitSymptoms;
// ====================================================================
// ฟังก์ชันอื่นๆ
// ====================================================================
const getAllVisits = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rows = yield visits_service_1.VisitService.getAllVisits();
        res.json(rows);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllVisits = getAllVisits;
const getVisitsByPatientId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { patientId } = req.params;
    try {
        const rows = yield visits_service_1.VisitService.getVisitsByPatientId(patientId);
        res.json(rows);
    }
    catch (error) {
        next(error);
    }
});
exports.getVisitsByPatientId = getVisitsByPatientId;
// --- Export ทั้งหมด ---
exports.default = {
    createVisit: exports.createVisit,
    getAllVisits: exports.getAllVisits,
    getVisitById: exports.getVisitById,
    updateVisit: exports.updateVisit,
    getVisitsByPatientId: exports.getVisitsByPatientId,
    getVisitSymptoms: exports.getVisitSymptoms,
};
