import MainLayout from "layouts/MainLayout.vue";
import IndexPage from "layouts/IndexPage.vue";
// User
// Mangagement
import FormComponent from "pages/forms/FormComponent.vue";
// import FormPivotTable from "pages/forms/FormPivotTable.vue";
import FormPlan from "pages/forms/FormPlan.vue";
import FormPlanCareer from "pages/forms/FormPlanCareer.vue";
import FormQualification from "pages/forms/FormQualification.vue";
import FormSelfAssessment from "pages/forms/FormSelfAssessment.vue";
import FormReference from "pages/forms/FormReference.vue";
// import FormReport from "pages/forms/FormReport.vue";
import FormRegistration from "pages/forms/FormRegistration.vue";
import FormNotification from "pages/forms/FormNotification.vue";
// ----------------------------------------------
// import ChatBox from "pages/forms/ChatBox.vue";
import ChatLangchain from "pages/forms/ChatLangchain.vue";
// ----------------------------------------------
// registration
import LoginPage from "src/pages/registration/LoginPage.vue";
import LogoutPage from "pages/registration/LogoutPage.vue";
import RegistrationPage from "pages/registration/RegistrationPage.vue";

// Admin
import AdminFormComponent from "pages/admin_forms/FormComponent.vue";
import AdminFormPivotTable from "pages/admin_forms/FormPivotTable.vue";
import AdminFormPlan from "pages/admin_forms/FormPlan.vue";
import AdminFormPlanCareer from "pages/admin_forms/FormPlanCareer.vue";
import AdminFormQualification from "pages/admin_forms/FormQualification.vue";
import AdminFormSelfAssessment from "pages/admin_forms/FormSelfAssessment.vue";
import AdminFormReport from "pages/admin_forms/FormReport.vue";
import AdminFormRegistration from "pages/admin_forms/FormRegistration.vue";
import AdminFormNotification from "pages/admin_forms/FormNotification.vue";
import ImportExcel from "pages/admin_forms/ImportExcel.vue";
// registration
import AdminLoginPage from "src/pages/admin_registration/LoginPage.vue";
import AdminLogoutPage from "pages/admin_registration/LogoutPage.vue";
import AdminRegistrationPage from "pages/admin_registration/RegistrationPage.vue";

// SUPER USER - SUSER
import SuserFormComponent from "pages/super_user_forms/FormComponent.vue";
import SuserFormPivotTable from "pages/super_user_forms/FormPivotTable.vue";
import SuserFormPlan from "pages/super_user_forms/FormPlan.vue";
import SuserFormPlanCareer from "pages/super_user_forms/FormPlanCareer.vue";
import SuserFormQualification from "pages/super_user_forms/FormQualification.vue";
import SuserFormSelfAssessment from "pages/super_user_forms/FormSelfAssessment.vue";
import SuserFormReport from "pages/super_user_forms/FormReport.vue";
import SuserFormRegistration from "pages/super_user_forms/FormRegistration.vue";
import SuserFormNotification from "pages/super_user_forms/FormNotification.vue";

//sub admin forms
import instituteForm from "pages/sub_admin_forms/instituteForm.vue";
import facultyForm from "pages/sub_admin_forms/facultyForm.vue";
import degreeForm from "pages/sub_admin_forms/degreeForm.vue";
import departmentForm from "pages/sub_admin_forms/departmentForm.vue";
import tapFormInstitute from "pages/sub_admin_forms/tapFormInstitute.vue";

//sub admin forms
import s_instituteForm from "pages/sub_super_user_forms/instituteForm.vue";
import s_facultyForm from "pages/sub_super_user_forms/facultyForm.vue";
import s_degreeForm from "pages/sub_super_user_forms/degreeForm.vue";
import s_departmentForm from "pages/sub_super_user_forms/departmentForm.vue";
import s_tapFormInstitute from "pages/sub_super_user_forms/tapFormInstitute.vue";

//import tapAdminConstances from "pages/admin_constances/tapAdminConstances.vue";
import tapUserConstances from "pages/user_constances/tapUserConstances.vue";
import tapAdminReports from "pages/admin_reports/tapAdminReports.vue";
import tapSuperUserConstances from "pages/super_user_constances/tapSuperUserConstances.vue";
import tapAdminConstances1 from "pages/admin_constances1/tapAdminConstances1.vue";
import tapSuperReports from "pages/super_reports/tapSuperReports.vue";
import tapUserReports from "pages/user_reports/tapUserReports.vue";

// admin-form-report
import tapRegistration from "pages/admin_forms/registration_reports/tapRegistration.vue";
import tapIndividual from "pages/admin_forms/individual_reports/tapIndividual.vue";
import tapPlan_career from "pages/admin_forms/plan_career_reports/tapPlan_career.vue";
import tapQualification from "pages/admin_forms/qualification_reports/tapQualification.vue";
import tapPlan from "pages/admin_forms/plan_reports/tapPlan.vue";
import tapSelf_assessment from "pages/admin_forms/self_assessment_reports/tapSelf_assessment.vue";
import tapNotification from "pages/admin_forms/Notification_reports/tapNotification.vue";
// super_user_forms
import tapRegistration_ from "pages/super_user_forms/registration_reports/tapRegistration.vue";
import tapIndividual_ from "pages/super_user_forms/individual_reports/tapIndividual.vue";
import tapPlan_career_ from "pages/super_user_forms/plan_career_reports/tapPlan_career.vue";
import tapQualification_ from "pages/super_user_forms/qualification_reports/tapQualification.vue";
import tapPlan_ from "pages/super_user_forms/plan_reports/tapPlan.vue";
import tapSelf_assessment_ from "pages/super_user_forms/self_assessment_reports/tapSelf_assessment.vue";
import tapNotification_ from "pages/super_user_forms/Notification_reports/tapNotification.vue";

import MedicalCertificate from "pages/MyEMR_App/MedicalCertificate.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: MainLayout,
    children: [
      {
        path: "/",
        name: "IndexPage",
        component: IndexPage,
      },
    ],
  },

  // ... All other top-level routes from your original file ...
  // User forms
  { path: "/FormRegistration", name: "FormRegistration", component: FormRegistration, },
  { path: "/FormComponent", name: "FormComponent", component: FormComponent, },
  { path: "/FormPlan", name: "FormPlan", component: FormPlan, },
  { path: "/FormPlanCareer", name: "FormPlanCareer", component: FormPlanCareer, },
  { path: "/FormQualification", name: "FormQualification", component: FormQualification, },
  { path: "/FormSelfAssessment", name: "FormSelfAssessment", component: FormSelfAssessment, },
  { path: "/LoginPage", name: "LoginPage", component: LoginPage, },
  { path: "/LogoutPage", name: "LogoutPage", component: LogoutPage, },
  { path: "/RegistrationPage", name: "RegistrationPage", component: RegistrationPage, },
  { path: "/FormReference", name: "FormReference", component: FormReference, },
  { path: "/FormNotification", name: "FormNotification", component: FormNotification, },
  { path: "/ChatLangchain", name: "ChatLangchain", component: ChatLangchain, },
  // Admin forms
  { path: "/AdminFormRegistration", name: "AdminFormRegistration", component: AdminFormRegistration, },
  { path: "/AdminFormComponent", name: "AdminFormComponent", component: AdminFormComponent, },
  { path: "/AdminFormPivotTable", name: "AdminFormPivotTable", component: AdminFormPivotTable, },
  { path: "/AdminFormReport", name: "AdminFormReport", component: AdminFormReport, },
  { path: "/AdminFormPlan", name: "AdminFormPlan", component: AdminFormPlan, },
  { path: "/AdminFormPlanCareer", name: "AdminFormPlanCareer", component: AdminFormPlanCareer, },
  { path: "/AdminFormQualification", name: "AdminFormQualification", component: AdminFormQualification, },
  { path: "/AdminFormSelfAssessment", name: "AdminFormSelfAssessment", component: AdminFormSelfAssessment, },
  { path: "/AdminFormNotification", name: "AdminFormNotification", component: AdminFormNotification, },
  { path: "/AdminLoginPage", name: "AdminLoginPage", component: AdminLoginPage, },
  { path: "/AdminLogoutPage", name: "AdminLogoutPage", component: AdminLogoutPage, },
  { path: "/AdminRegistrationPage", name: "AdminRegistrationPage", component: AdminRegistrationPage, },
  { path: "/ImportExcel", name: "ImportExcel", component: ImportExcel, },
  // Super user forms
  { path: "/SuserFormRegistration", name: "SuserFormRegistration", component: SuserFormRegistration, },
  { path: "/SuserFormComponent", name: "SuserFormComponent", component: SuserFormComponent, },
  { path: "/SuserFormPivotTable", name: "SuserFormPivotTable", component: SuserFormPivotTable, },
  { path: "/SuserFormReport", name: "SuserFormReport", component: SuserFormReport, },
  { path: "/SuserFormPlan", name: "SuserFormPlan", component: SuserFormPlan, },
  { path: "/SuserFormPlanCareer", name: "SuserFormPlanCareer", component: SuserFormPlanCareer, },
  { path: "/SuserFormQualification", name: "SuserFormQualification", component: SuserFormQualification, },
  { path: "/SuserFormSelfAssessment", name: "SuserFormSelfAssessment", component: SuserFormSelfAssessment, },
  { path: "/SuserFormNotification", name: "SuserFormNotification", component: SuserFormNotification, },
  // sub admin education
  { path: "/instituteForm", name: "instituteForm", component: instituteForm, },
  { path: "/tapFormInstitute", name: "tapFormInstitute", component: tapFormInstitute, },
  { path: "/facultyForm", name: "facultyForm", component: facultyForm, },
  { path: "/degreeForm", name: "degreeForm", component: degreeForm, },
  { path: "/departmentForm", name: "departmentForm", component: departmentForm, },
  // sub_super_user education
  { path: "/s_instituteForm", name: "s_instituteForm", component: s_instituteForm, },
  { path: "/s_tapFormInstitute", name: "s_tapFormInstitute", component: s_tapFormInstitute, },
  { path: "/s_facultyForm", name: "s_facultyForm", component: s_facultyForm, },
  { path: "/s_degreeForm", name: "s_degreeForm", component: s_degreeForm, },
  { path: "/s_departmentForm", name: "s_departmentForm", component: s_departmentForm, },
  // User constances
  { path: "/tapUserConstances", name: "tapUserConstances", component: tapUserConstances, },
  { path: "/tapAdminReports", name: "tapAdminReports", component: tapAdminReports, },
  { path: "/tapSuperUserConstances", name: "tapSuperUserConstances", component: tapSuperUserConstances, },
  { path: "/tapAdminConstances1", name: "tapAdminGroupConstances", component: tapAdminConstances1, },
  { path: "/tapSuperReports", name: "tapSuperReports", component: tapSuperReports, },
  { path: "/tapUserReports", name: "tapUserReports", component: tapUserReports, },
  // tap Registration
  { path: "/tapRegistration", name: "tapRegistration", component: tapRegistration, },
  { path: "/tapIndividual", name: "tapIndividual", component: tapIndividual, },
  { path: "/tapPlan_career", name: "tapPlan_career", component: tapPlan_career, },
  { path: "/tapQualification", name: "tapQualification", component: tapQualification, },
  { path: "/tapPlan", name: "tapPlan", component: tapPlan, },
  { path: "/tapSelf_assessment", name: "tapSelf_assessment", component: tapSelf_assessment, },
  { path: "/tapNotification", name: "tapNotification", component: tapNotification, },
  //----------------------------------
  // tap Registration
  { path: "/tapRegistration_", name: "tapRegistration_", component: tapRegistration_, },
  { path: "/tapIndividual_", name: "tapIndividual_", component: tapIndividual_, },
  { path: "/tapPlan_career_", name: "tapPlan_career_", component: tapPlan_career_, },
  { path: "/tapQualification_", name: "tapQualification_", component: tapQualification_, },
  { path: "/tapPlan_", name: "tapPlan_", component: tapPlan_, },
  { path: "/tapSelf_assessment_", name: "tapSelf_assessment_", component: tapSelf_assessment_, },
  { path: "/tapNotification_", name: "tapNotification_", component: tapNotification_, },


  // --- MyEMR_App Routes ---
  { path: "/patient-list", name: "PatientList", component: () => import("pages/MyEMR_App/PatientList.vue") },
  { path: '/myemr-app/login', name: 'Login', component: () => import('pages/MyEMR_App/LoginPage.vue') },
  { path: '/myemr-app/add-patient', name: 'AddPatient', component: () => import('pages/MyEMR_App/AddPatient.vue') },
  { path: '/myemr-app/patient-records/:id', name: 'PatientRecords', component: () => import('../pages/MyEMR_App/PatientRecords.vue'), props: true },
  { path: '/myemr-app/patient-history/:id', name: 'PatientHistory', component: () => import('pages/MyEMR_App/PatientHistory.vue'), props: true },
  { path: '/myemr-app/vital-sign/:label', name: 'VitalSign', component: () => import('pages/MyEMR_App/VitalSign.vue') },
  { path: '/myemr-app/patient-summary', name: 'PatientSummary', component: () => import('pages/MyEMR_App/PatientSummary.vue') },
  { path: '/myemr-app/patient-timeline', name: 'PatientTimeline', component: () => import('pages/MyEMR_App/PatientTimeline.vue') },
  { path: '/myemr-app/vitalsignlist', name: 'VitalSignList', component: () => import('pages/MyEMR_App/VitalsignList.vue') },
  { path: '/myemr-app/add-vital-sign', name: 'AddVitalSign', component: () => import('pages/MyEMR_App/AddVitalSign.vue') },
  { path: '/myemr-app/user-registration', name: 'UserRegistration', component: () => import('pages/MyEMR_App/UserRegistration.vue') },
  { path: '/myemr-app/emr-home', name: 'EmrHome', component: () => import('pages/MyEMR_App/EmrHome.vue') },
  { path: '/medicine-list', name: 'MedicineList', component: () => import('../pages/MyEMR_App/MedicineList.vue') },
  { path: '/patient-medicine', name: 'PatientMedicine', component: () => import('../pages/MyEMR_App/PatientMedicine.vue') },
  { path: '/add-medicine', name: 'AddMedicine', component: () => import('../pages/MyEMR_App/AddMedicine.vue') },
  { path: '/procedures-list', name: 'ProcedureList', component: () => import('../pages/MyEMR_App/procedureList.vue') },
  { path: '/add-procedure', name: 'AddProcedure', component: () => import('../pages/MyEMR_App/AddProcedure.vue') },
  { path: '/patient-procedure', name: 'PatientProcedure', component: () => import('../pages/MyEMR_App/PatientProcedure.vue') },
  { path: '/patient-dashboard', name: 'PatientDashboard', component: () => import('../pages/MyEMR_App/PatientDashboard.vue') },
  { path: '/medical-form/:patientId', name: 'MedicalFormList', component: () => import('../pages/MyEMR_App/MedicalFormList.vue') },
  { path: '/doctor/diagnosis/:recordId', name: 'DoctorDiagnosis', component: () => import('pages/MyEMR_App/DoctorDiagnosisPage.vue') },
  { path: '/tutorial', name: 'TutorialPage', component: () => import('pages/MyEMR_App/TutorialPage.vue') },
  { path: '/settings', name: 'SettingsPage', component: () => import('pages/MyEMR_App/SettingsPage.vue') },
  { path: '/myemr-app/medical-certificate/:recordId', name: 'MedicalCertificate', component: MedicalCertificate, props: true },
  {
  path: '/nurse/patient-list',
  name: 'NursePatientList',
  component: () => import('pages/MyEMR_App/NursePatientList.vue')
  },
  // *** THIS IS THE FIX ***
  // The dashboard route is now a simple, top-level route like the others.
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('pages/MyEMR_App/DashboardPage.vue')
  },
  {
  path: '/nurse/record/:id',
  name: 'NurseRecord',
  component: () => import('pages/MyEMR_App/NurseRecordPage.vue'),
  props: true
},


  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
