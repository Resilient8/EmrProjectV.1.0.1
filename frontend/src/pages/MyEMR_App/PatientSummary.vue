<template>
  <div class="summary-grid">
    <div class="left-column">
      <q-card class="main-card profile-card list-item-animation" flat style="animation-delay: 0.1s;">
        <div class="profile-card-header">
          <q-avatar size="90px" color="primary" text-color="white" icon="o_person" class="profile-avatar" />
          <div class="text-h5 q-mt-md text-weight-bold header-title">{{ patientData.firstName }} {{ patientData.lastName }}</div>
          <div class="text-subtitle1 welcome-text">HN: {{ patientData.patientId }}</div>
        </div>
        <q-list class="profile-details-list" separator>
          <q-item>
            <q-item-section avatar><q-icon name="o_cake" color="primary" /></q-item-section>
            <q-item-section>
              <q-item-label caption>อายุ (วันเกิด)</q-item-label>
              <q-item-label>{{ patientData.age }} ปี ({{ formatDate(patientData.birthDate) }})</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar><q-icon name="o_bloodtype" color="primary" /></q-item-section>
            <q-item-section>
              <q-item-label caption>กรุ๊ปเลือด</q-item-label>
              <q-item-label>{{ patientData.bloodGroup || 'ไม่ระบุ' }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar><q-icon name="o_home" color="primary" /></q-item-section>
            <q-item-section>
              <q-item-label caption>ที่อยู่</q-item-label>
              <q-item-label class="ellipsis-2-lines">{{ patientData.address || 'ไม่ระบุ' }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="patientData.allergies && patientData.allergies !== 'ไม่มี'">
            <q-item-section avatar><q-icon name="o_warning" color="negative" /></q-item-section>
            <q-item-section>
              <q-item-label caption class="text-negative">ประวัติการแพ้ยา</q-item-label>
              <q-item-label class="text-negative text-weight-bold">{{ patientData.allergies }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>

      <q-card class="main-card history-card list-item-animation" flat style="animation-delay: 0.2s;">
        <q-toolbar class="main-card-header">
          <q-toolbar-title class="text-h6 text-weight-bold header-title">ประวัติการรักษา</q-toolbar-title>
        </q-toolbar>
        <q-list separator class="themed-list">
          <q-item
            v-for="visit in treatmentHistory"
            :key="visit.id"
            clickable v-ripple
            :active="currentVisit.id === visit.id"
            active-class="active-visit-item"
            @click="() => { currentVisit = visit; playClickSound(); }"
          >
            <q-item-section>
              <q-item-label class="text-weight-medium">{{ visit.mainDiagnosis }}</q-item-label>
              <q-item-label caption class="welcome-text">{{ formatDate(visit.visitDate) }}</q-item-label>
            </q-item-section>
            <q-item-section side><q-icon name="o_chevron_right" :color="currentVisit.id === visit.id ? 'white' : 'primary'"/></q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </div>

    <div class="right-column">
      <div class="list-item-animation" style="animation-delay: 0.3s;">
          <div class="row q-col-gutter-md">
            <div v-for="stat in currentVisit.vitalSigns" :key="stat.label" class="col-6 col-md-4">
              <q-card class="stat-card main-card interactive-card" flat @click="() => { showHistoryChart(stat.label); playClickSound(); }">
                <q-card-section class="stat-card-section">
                  <div class="stat-content">
                    <div class="text-caption welcome-text">{{ stat.label }}</div>
                    <div class="text-h5 text-weight-bolder">
                      <span :class="getVitalSignColorClass(stat.label, stat.value, patientData.gender)">{{ stat.value }}</span>
                      <span class="text-body2 text-weight-regular q-ml-xs welcome-text">{{ stat.unit }}</span>
                    </div>
                    <div class="text-caption welcome-text">ค่าปกติ: {{ stat.ref }}</div>
                  </div>
                  <q-icon :name="stat.icon" :color="stat.color" size="2.5em" class="stat-icon" />
                </q-card-section>
                <q-tooltip class="tooltip-glassy">คลิกเพื่อดูกราฟย้อนหลัง</q-tooltip>
              </q-card>
            </div>
          </div>
      </div>

      <q-card class="main-card timeline-card list-item-animation" flat style="animation-delay: 0.4s;">
        <q-toolbar class="main-card-header">
          <q-toolbar-title class="text-h6 text-weight-bold header-title">บันทึกการรักษา - {{ formatDate(currentVisit.visitDate) }}</q-toolbar-title>
          <q-btn flat round dense icon="o_print" @click="() => { printVisit(); playClickSound(); }" text-color="welcome-text">
            <q-tooltip class="tooltip-glassy">พิมพ์ใบสรุป</q-tooltip>
          </q-btn>
        </q-toolbar>
        <q-card-section class="timeline-scroll-area">
          <div class="elegant-timeline-container">

            <div class="elegant-timeline-section">
              <div class="elegant-section-header">
                <q-icon name="o_healing" class="elegant-header-icon"/>
                <span class="text-h6 text-weight-bold">อาการและการซักประวัติ</span>
              </div>
              <div class="elegant-section-content">
                <div class="elegant-timeline-card" @click="showDetailDialog({
                  icon: 'o_sick',
                  title: 'อาการสำคัญ (Chief Complaint)',
                  content: currentVisit.symptoms.chiefComplaint
                })">
                  <div class="item-icon-wrapper"><q-icon name="o_sick" class="item-icon"/></div>
                  <div class="item-content-wrapper">
                    <div class="item-title">อาการสำคัญ (Chief Complaint)</div>
                    <div class="item-description">{{ currentVisit.symptoms.chiefComplaint || 'ไม่ระบุ' }}</div>
                  </div>
                </div>
                <div class="elegant-timeline-card" @click="showDetailDialog({
                  icon: 'o_history',
                  title: 'ประวัติการเจ็บป่วยปัจจุบัน (Present Illness)',
                  content: currentVisit.symptoms.presentIllness
                })">
                  <div class="item-icon-wrapper"><q-icon name="o_history" class="item-icon"/></div>
                  <div class="item-content-wrapper">
                    <div class="item-title">ประวัติการเจ็บป่วยปัจจุบัน (Present Illness)</div>
                    <div class="item-description">{{ currentVisit.symptoms.presentIllness || 'ไม่ระบุ' }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="elegant-timeline-section">
              <div class="elegant-section-header">
                <q-icon name="o_medical_information" class="elegant-header-icon"/>
                <span class="text-h6 text-weight-bold">การวินิจฉัยและการรักษา</span>
              </div>
              <div class="elegant-section-content">
                <div class="elegant-timeline-card highlight-diagnosis" @click="showDetailDialog({
                  icon: 'o_medical_services',
                  title: 'การวินิจฉัยหลัก (Main Diagnosis)',
                  content: currentVisit.mainDiagnosis,
                  isHighlight: true
                })">
                  <div class="item-icon-wrapper"><q-icon name="o_medical_services" class="item-icon highlight"/></div>
                  <div class="item-content-wrapper">
                    <div class="item-title">การวินิจฉัยหลัก (Main Diagnosis)</div>
                    <div class="item-description text-h6 text-positive text-weight-bold">{{ currentVisit.mainDiagnosis || 'ไม่ระบุ' }}</div>
                  </div>
                </div>

                <div v-if="currentVisit.procedures && currentVisit.procedures.length > 0" class="elegant-timeline-card" @click="showDetailDialog({
                  icon: 'o_list_alt',
                  title: 'รายการบริการและหัตถการ',
                  content: currentVisit.procedures,
                  type: 'procedures'
                })">
                  <div class="item-icon-wrapper"><q-icon name="o_list_alt" class="item-icon"/></div>
                  <div class="item-content-wrapper">
                    <div class="item-title">รายการบริการและหัตถการ</div>
                    <q-list dense separator class="elegant-info-list preview-list">
                      <q-item v-for="(proc, index) in currentVisit.procedures" :key="index">
                        <q-item-section>
                          <q-item-label>{{ proc.service }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>
                </div>

                <div v-if="currentVisit.medications && currentVisit.medications.length > 0" class="elegant-timeline-card" @click="showDetailDialog({
                  icon: 'o_medication_liquid',
                  title: 'ยาที่ได้รับ (Prescription)',
                  content: currentVisit.medications,
                  type: 'medications'
                })">
                  <div class="item-icon-wrapper"><q-icon name="o_medication_liquid" class="item-icon"/></div>
                  <div class="item-content-wrapper">
                    <div class="item-title">ยาที่ได้รับ (Prescription)</div>
                    <q-list dense separator class="elegant-info-list preview-list">
                      <q-item v-for="(med, index) in currentVisit.medications" :key="index">
                        <q-item-section>
                          <q-item-label>{{ med.name }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </q-card-section>
      </q-card>
    </div>

    <q-dialog v-model="isChartDialogVisible">
      <q-card style="width: 700px; max-width: 80vw;" class="main-card">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 header-title">ประวัติข้อมูล: {{ selectedVitalSign }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="playClickSound"/>
        </q-card-section>
        <q-card-section>
          <apexchart :type="chartType" height="350" :options="chartOptions" :series="chartSeries"></apexchart>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="isDetailDialogVisible">
      <q-card style="width: 600px; max-width: 80vw;" class="main-card">
        <q-toolbar :class="['main-card-header', { 'bg-positive-tint': selectedDetail.isHighlight }]">
          <q-icon :name="selectedDetail.icon" size="24px" class="q-mr-md" />
          <q-toolbar-title class="text-h6 text-weight-bold header-title">{{ selectedDetail.title }}</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup @click="playClickSound"/>
        </q-toolbar>
        <q-card-section class="q-pa-lg">
          <div v-if="!selectedDetail.type" :class="['text-body1', { 'text-h5 text-positive text-weight-bold': selectedDetail.isHighlight }]">
            {{ selectedDetail.content || 'ไม่ระบุ' }}
          </div>
          <q-list v-if="selectedDetail.type === 'procedures'" dense separator class="elegant-info-list">
            <q-item v-for="(proc, index) in selectedDetail.content" :key="index" class="q-py-sm">
              <q-item-section>
                <q-item-label class="text-body1">{{ proc.service }}</q-item-label>
                <q-item-label caption v-if="proc.diagnosis && proc.diagnosis !== '-'">วินิจฉัย: {{ proc.diagnosis }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-list v-if="selectedDetail.type === 'medications'" dense separator class="elegant-info-list">
            <q-item v-for="(med, index) in selectedDetail.content" :key="index" class="q-py-sm">
              <q-item-section>
                <q-item-label class="text-body1">{{ med.name }}</q-item-label>
                <q-item-label caption>{{ med.dosage }} | จำนวน: {{ med.quantity }}</q-item-label>
                <q-item-label caption>วิธีใช้: {{ med.instruction }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { date } from 'quasar';
import * as Tone from 'tone';
import VueApexCharts from 'vue3-apexcharts';

// --- SOUND SYSTEM ---
const clickSynth = new Tone.FMSynth({ harmonicity: 8, modulationIndex: 2, oscillator: { type: "sine" }, envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.2 }, modulation: { type: "square" }, modulationEnvelope: { attack: 0.002, decay: 0.2, sustain: 0, release: 0.2 } }).toDestination();
clickSynth.volume.value = -10;
const playClickSound = () => {
  if (Tone.context.state !== 'running') Tone.context.resume();
  clickSynth.triggerAttackRelease("C5", "32n");
};

// Define 'apexchart' component for use in the template
const apexchart = VueApexCharts;

const patientData = ref({});
const currentVisit = ref({
    symptoms: { reviewOfSystems: {} }, vitalSigns: [], procedures: [], medications: [], referral: {}
});
const treatmentHistory = ref([]);
const isChartDialogVisible = ref(false);
const selectedVitalSign = ref(null);

// --- NEW DIALOG LOGIC ---
const isDetailDialogVisible = ref(false);
const selectedDetail = ref({});
const showDetailDialog = (detail) => {
  selectedDetail.value = detail;
  isDetailDialogVisible.value = true;
  playClickSound();
};

onMounted(() => {
  const demoData = createDemoPatientData();
  patientData.value = demoData.patient;

  const demoVisits = createDemoVisitsForPatient();
  treatmentHistory.value = demoVisits.map(visit => transformApiDataToVisit(visit));

  if (treatmentHistory.value.length > 0) {
    currentVisit.value = treatmentHistory.value[0];
  }
});


// --- CHART LOGIC ---
const showHistoryChart = (vitalLabel) => {
    if (['ส่วนสูง', 'น้ำหนัก', 'BMI', 'รอบเอว'].includes(vitalLabel)) return;
    selectedVitalSign.value = vitalLabel;
    isChartDialogVisible.value = true;
};
const validChartData = computed(() => {
    if (!selectedVitalSign.value) return [];
    return treatmentHistory.value.map(visit => {
        const vital = visit.vitalSigns.find(v => v.label === selectedVitalSign.value);
        if (!vital || vital.value === 'N/A') return null;
        if (selectedVitalSign.value === 'ความดัน') {
            const [sys, dia] = vital.value.split('/').map(parseFloat);
            if (isNaN(sys) || isNaN(dia)) return null;
            return { date: visit.visitDate, systolic: sys, diastolic: dia };
        } else {
            const value = parseFloat(vital.value);
            if (isNaN(value)) return null;
            return { date: visit.visitDate, value: value };
        }
    }).filter(v => v !== null).reverse();
});
const chartType = computed(() => validChartData.value.length > 1 ? 'line' : 'scatter');
const chartSeries = computed(() => {
    if (validChartData.value.length === 0) return [];
    if (selectedVitalSign.value === 'ความดัน') {
        return [
            { name: 'Systolic (ตัวบน)', data: validChartData.value.map(v => v.systolic) },
            { name: 'Diastolic (ตัวล่าง)', data: validChartData.value.map(v => v.diastolic) }
        ];
    } else {
        return [{ name: selectedVitalSign.value, data: validChartData.value.map(v => v.value) }];
    }
});
const chartOptions = computed(() => {
    if (validChartData.value.length === 0) return {};
    const options = {
        chart: { id: 'vital-signs-history', toolbar: { show: false }, background: 'transparent' },
        theme: { mode: 'dark' },
        stroke: { curve: 'smooth', width: 3 },
        xaxis: {
            categories: validChartData.value.map(v => date.formatDate(v.date, 'DD/MM/YY')),
            labels: { style: { colors: '#e0e0e0' } },
        },
        yaxis: { labels: { style: { colors: '#e0e0e0' } } },
        grid: { borderColor: 'rgba(0, 184, 255, 0.1)' },
        markers: { size: 5 },
        dataLabels: { enabled: true, background: { enabled: true, borderRadius: 2, opacity: 0.7, foreColor: '#000' } },
        tooltip: { theme: 'dark', x: { format: 'dd/MM/yy' } },
        legend: { labels: { colors: '#e0e0e0' } }
    };
    if (selectedVitalSign.value === 'ความดัน') {
        options.colors = ['#C10015', '#1976D2'];
        options.yaxis.title = { text: 'mmHg', style: { color: '#90a4ae' } };
    } else {
        options.colors = ['#00b8ff'];
    }
    return options;
});

// --- HELPER FUNCTIONS ---
const printVisit = () => window.print();
const getVitalSignColorClass = (label, value, gender) => {
    if (value === 'N/A' || !value) return ''; const numValue = parseFloat(value); if (isNaN(numValue)) return '';
    switch (label) {
        case 'อุณหภูมิ': if (numValue >= 38.5) return 'text-negative'; if (numValue > 37.5) return 'text-warning'; if (numValue < 36.5) return 'text-warning'; return 'text-positive';
        case 'ชีพจร': if (numValue > 120 || numValue < 50) return 'text-negative'; if (numValue > 100 || numValue < 60) return 'text-warning'; return 'text-positive';
        case 'การหายใจ': if (numValue > 24 || numValue < 10) return 'text-negative'; if (numValue > 20 || numValue < 12) return 'text-warning'; return 'text-positive';
        case 'O2 Sat': if (numValue < 92) return 'text-negative'; if (numValue <= 95) return 'text-warning'; return 'text-positive';
        case 'ความดัน': const [systolic, diastolic] = value.split('/').map(v => parseInt(v, 10)); if (isNaN(systolic) || isNaN(diastolic)) return ''; if (systolic >= 140 || diastolic >= 90) return 'text-negative'; if (systolic >= 130 || diastolic >= 80) return 'text-warning'; if (systolic < 90 || diastolic < 60) return 'text-warning'; return 'text-positive';
        case 'BMI': if (numValue >= 30) return 'text-negative'; if (numValue >= 25 || numValue < 18.5) return 'text-warning'; return 'text-positive';
        case 'รอบเอว': if (gender === 'male' && numValue >= 90) return 'text-negative'; if (gender === 'female' && numValue >= 80) return 'text-negative'; return 'text-positive';
        default: return '';
    }
};
const transformApiDataToVisit = (visitData) => {
    const vitalSigns = visitData.vitalSigns || {};
    let calculatedBmi = 'N/A';
    if (vitalSigns.height > 0 && vitalSigns.weight > 0) { calculatedBmi = (vitalSigns.weight / ((vitalSigns.height / 100) ** 2)).toFixed(1); }
    const bloodPressureValue = (vitalSigns.bloodPressureSystolic && vitalSigns.bloodPressureDiastolic) ? `${vitalSigns.bloodPressureSystolic}/${vitalSigns.bloodPressureDiastolic}` : 'N/A';
    const mainDiagnosis = visitData.doctorNotes?.diagnosis?.filter(d => d !== 'Other').join(', ') || visitData.procedures?.[0]?.diagnosis || 'ไม่ระบุ';
    return {
        id: visitData.visitId ?? Date.now(), visitDate: visitData.recordDateTime ?? new Date().toISOString(), mainDiagnosis: mainDiagnosis,
        symptoms: { chiefComplaint: visitData.symptoms?.chiefComplaint ?? 'ไม่ระบุ', presentIllness: visitData.symptoms?.presentIllness ?? 'ไม่ระบุ' },
        vitalSigns: [
            { label: 'อุณหภูมิ', value: vitalSigns.temperature ?? 'N/A', unit: '°C', icon: 'o_thermostat', color: 'red', ref: '36.5-37.5' },
            { label: 'ชีพจร', value: vitalSigns.pulse ?? 'N/A', unit: 'bpm', icon: 'o_monitor_heart', color: 'green', ref: '60-100' },
            { label: 'การหายใจ', value: vitalSigns.breathing ?? 'N/A', unit: '/min', icon: 'o_air', color: 'purple', ref: '12-20' },
            { label: 'O2 Sat', value: vitalSigns.oxygenSaturation ?? 'N/A', unit: '%', icon: 'o_bloodtype', color: 'light-blue', ref: '>95' },
            { label: 'ความดัน', value: bloodPressureValue, unit: 'mmHg', icon: 'o_favorite', color: 'orange', ref: '<120/80' },
            { label: 'BMI', value: calculatedBmi, unit: 'kg/m²', icon: 'o_calculate', color: 'teal', ref: '18.5-22.9' },
            { label: 'ส่วนสูง', value: vitalSigns.height ?? 'N/A', unit: 'ซม.', icon: 'o_straighten', color: 'brown', ref: '-' },
            { label: 'น้ำหนัก', value: vitalSigns.weight ?? 'N/A', unit: 'กก.', icon: 'o_scale', color: 'deep-purple', ref: '-' },
            { label: 'รอบเอว', value: vitalSigns.waist ?? 'N/A', unit: 'ซม.', icon: 'o_social_distance', color: 'pink', ref: 'ช<90,ญ<80' },
        ],
        procedures: visitData.procedures ?? [], medications: visitData.medications ?? []
    };
};
const createDemoPatientData = () => ({ patient: { id: 1, patientId: 'HN-DEMO', firstName: 'ข้อมูล', lastName: 'ตัวอย่าง', gender: 'male', age: 40, birthDate: '1985-01-01T00:00:00.000Z', bloodGroup: 'A+', allergies: 'Penicillin', address: '123/45 ถนนสุขุมวิท กรุงเทพมหานคร 10110' } });
const createDemoVisitsForPatient = () => ([
    { visitId: 1, recordDateTime: '2025-07-13T11:30:00.000Z', symptoms: { chiefComplaint: 'มีไข้สูง ไอ เจ็บคอ', presentIllness: 'มีอาการไข้เมื่อ 2 วันก่อน' }, vitalSigns: { temperature: '38.5', pulse: '95', breathing: '22', bloodPressureSystolic: '125', bloodPressureDiastolic: '85', oxygenSaturation: '97', height: '175', weight: '72', waist: '88' }, doctorNotes: { diagnosis: ['ไข้หวัดใหญ่'] }, procedures: [ { service: 'ตรวจรักษา', diagnosis: 'ไข้หวัดใหญ่' } ], medications: [ { name: 'Oseltamivir', dosage: '75mg', quantity: '10', instruction: 'วันละ 2 ครั้ง' } ] },
    { visitId: 2, recordDateTime: '2025-06-20T14:00:00.000Z', symptoms: { chiefComplaint: 'เจ็บคอ', presentIllness: 'เจ็บคอเวลากลืน' }, vitalSigns: { temperature: '37.2', pulse: '88', breathing: '18', bloodPressureSystolic: '130', bloodPressureDiastolic: '88', oxygenSaturation: '99', height: '175', weight: '72', waist: '88' }, doctorNotes: { diagnosis: ['คออักเสบ'] }, medications: [ { name: 'Ibuprofen', dosage: '400mg', quantity: '10', instruction: 'เมื่อมีอาการปวด' } ] },
]);
const formatDate = (value) => { if (!value) return null; return date.formatDate(value, 'DD MMMM YYYY'); };
</script>

<style scoped lang="scss">
.summary-grid {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 24px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
}

.left-column, .right-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.header-title {
  color: #ffffff;
}

.welcome-text {
  color: #90a4ae;
}

.main-card {
  background: linear-gradient(135deg, rgba(38, 50, 56, 0.5), rgba(38, 50, 56, 0.3));
  backdrop-filter: blur(8px);
  border-radius: 12px;
  border: 1px solid rgba(0, 184, 255, 0.2);
  color: #e0e0e0;
  overflow: hidden;
}

.main-card-header {
  background-color: rgba(0, 184, 255, 0.05);
  border-bottom: 1px solid rgba(0, 184, 255, 0.15);
}

.profile-card-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
}

.profile-avatar {
  border: 3px solid #00b8ff;
  box-shadow: 0 0 10px rgba(0, 184, 255, 0.4);
}

.profile-details-list {
  .q-item {
    padding: 12px 24px;
  }
}

.themed-list {
  .q-item {
    padding: 12px 16px;
    transition: background-color 0.2s;
    &:hover:not(.active-visit-item) {
      background-color: rgba(255, 255, 255, 0.03);
    }
  }
  .active-visit-item {
    background-color: rgba(0, 184, 255, 0.2) !important;
    color: white !important;
    font-weight: bold;
    border-left: 4px solid #00b8ff;
    padding-left: 12px;
  }
}

.stat-card {
  cursor: pointer;
  height: 100%;
}

.interactive-card {
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    transform: translateY(-6px);
    border-color: rgba(0, 184, 255, 0.4);
    box-shadow: 0 8px 30px rgba(0,0,0,0.2);
  }
}

.stat-card-section {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-icon {
  opacity: 0.5;
}

.tooltip-glassy {
  background: rgba(38, 50, 56, 0.8);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(0, 184, 255, 0.2);
  color: white;
}

.list-item-animation {
  opacity: 0;
  animation: floatUp 0.6s ease-out forwards;
}

@keyframes floatUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}


/* ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ */
/* --- START: POPUP DIALOG TIMELINE STYLES --- */
/* ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ */

.timeline-card {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.timeline-scroll-area {
  flex-grow: 1;
  overflow-y: auto;
  padding: 24px;
}

.elegant-timeline-container {
  display: flex;
  flex-direction: column;
  gap: 36px;
}

.elegant-timeline-section {
  position: relative;
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    bottom: -18px;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(0, 184, 255, 0.1), transparent);
  }
}

.elegant-section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #cce7ff;
  margin-bottom: 24px;
}

.elegant-header-icon {
  font-size: 28px;
  color: #00b8ff;
}

.elegant-section-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.elegant-timeline-card {
  background: rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  border: 1px solid rgba(0, 184, 255, 0.15);
  padding: 16px 20px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  transition: all 0.3s ease;
  cursor: pointer; // ทำให้รู้ว่าคลิกได้

  &:hover {
    border-color: rgba(0, 184, 255, 0.4);
    background: rgba(0, 184, 255, 0.05);
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    transform: translateY(-2px);
  }
}

.highlight-diagnosis {
  border-color: #26A69A;
  background: rgba(38, 166, 154, 0.1);

  &:hover {
    border-color: #26A69A;
    background: rgba(38, 166, 154, 0.15);
  }
}

.bg-positive-tint {
  background-color: rgba(38, 166, 154, 0.15) !important;
}

.item-icon-wrapper {
  flex-shrink: 0;
  padding-top: 4px;
}

.item-icon {
  font-size: 24px;
  color: #00b8ff;
  &.highlight { color: #26A69A; }
}

.item-content-wrapper {
  flex-grow: 1;
  overflow: hidden; /* ป้องกันข้อความยาวเกิน */
}

.item-title {
  font-size: 1rem;
  font-weight: 600;
  color: #e0e0e0;
  margin-bottom: 4px;
}

.item-description {
  font-size: 0.95rem;
  color: #b0c2d2;
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.elegant-info-list {
  background: transparent;
  .q-item {
    padding: 4px 0;
    min-height: unset;
  }
  .q-item-label {
    line-height: 1.4;
  }
  .q-item-label[caption] {
    color: #90a4ae;
    font-size: 0.85rem;
  }
}

/* List ที่แสดงแค่ 1-2 รายการแรกเป็น Preview */
.preview-list {
  .q-item:nth-child(n+3) {
    display: none;
  }
}

/* ▲▲▲▲▲ END: POPUP DIALOG TIMELINE STYLES ▲▲▲▲▲ */
</style>
