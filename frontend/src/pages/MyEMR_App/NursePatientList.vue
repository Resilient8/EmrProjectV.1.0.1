<template>
  <q-page padding class="dashboard-background">

    <transition name="fade">
      <div v-if="loading" class="loading-overlay">
        <div class="loading-spinner"></div>
        <div class="loading-text q-mt-md">กำลังโหลดข้อมูล...</div>
      </div>
    </transition>

    <div class="q-pa-md content-container">

      <div class="row items-center justify-between q-mb-md list-item-animation" style="animation-delay: 0.1s;">
        <div class="row items-center">
          <div class="icon-box-flat q-mr-md shadow-3">
            <q-icon name="assignment_ind" size="30px" color="white" />
          </div>
          <div>
            <div class="text-h5 text-weight-bold text-white text-shadow leading-tight">Patient Registry</div>
            <div class="text-caption text-cyan-3">จุดคัดกรองผู้ป่วย (Nurse Station)</div>
          </div>
        </div>

        <div>
            <q-btn flat round icon="refresh" color="cyan-3" class="hover-rotate" @click="initializePage">
                <q-tooltip class="bg-grey-9">รีเฟรชข้อมูล</q-tooltip>
            </q-btn>
        </div>
      </div>

      <q-card class="glass-panel q-mb-lg list-item-animation" style="animation-delay: 0.2s;">
        <q-card-section>
          <div class="row items-center q-col-gutter-md">

            <div class="col-12 col-md-4">
              <q-select
                dark dense outlined
                v-model="selectedDate"
                :options="dateOptions"
                label="วันที่บันทึกข้อมูล"
                emit-value map-options
                color="cyan-3"
                class="flat-input"
                popup-content-class="glass-menu"
                @popup-show="playFormFocusSound"
                @update:model-value="handleDateSelect"
              >
                <template v-slot:prepend><q-icon name="event_available" color="cyan-3"/></template>

                <template v-slot:selected>
                  <div class="text-white">{{ selectedDateLabel }}</div>
                </template>

                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps" class="list-row-hover">
                    <template v-if="scope.opt.value !== 'custom'">
                      <q-item-section avatar>
                        <div :class="['status-dot', scope.opt.hasData ? 'bg-green-4' : 'bg-grey-7']"></div>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-white">{{ scope.opt.label }}</q-item-label>
                        <q-item-label caption class="text-grey-5">{{ scope.opt.subLabel }}</q-item-label>
                      </q-item-section>
                      <q-item-section side v-if="scope.opt.hasData">
                        <q-badge color="cyan-9" text-color="cyan-2" rounded label="มีข้อมูล" />
                      </q-item-section>
                    </template>
                    <template v-else>
                      <q-item-section avatar><q-icon name="edit_calendar" color="cyan-3" /></q-item-section>
                      <q-item-section><q-item-label class="text-cyan-3 text-weight-bold">เลือกวันที่อื่น / ปฏิทิน</q-item-label></q-item-section>
                    </template>
                  </q-item>
                </template>
              </q-select>
            </div>

            <div class="col-12 col-md-5">
              <q-input
                dark dense outlined
                v-model="searchQuery"
                placeholder="ค้นหา (ชื่อ, HN...)"
                class="flat-input"
                color="cyan-3"
                clearable
                @clear="playRemoveSound" @focus="playFormFocusSound"
              >
                <template v-slot:prepend><q-icon name="search" /></template>
              </q-input>
            </div>

            <div class="col-12 col-md-3 row justify-end q-gutter-sm">
                <q-btn-toggle
                v-model="viewMode"
                unelevated rounded
                class="glass-toggle"
                text-color="grey-5"
                toggle-color="cyan-4"
                toggle-text-color="black"
                :options="[{icon: 'grid_view', value: 'cards'}, {icon: 'view_list', value: 'table'}]"
                @update:model-value="playClickSound"
              />
            </div>
          </div>
        </q-card-section>

        <q-separator dark class="opacity-20" />

        <q-card-section class="q-py-sm">
          <div class="row items-center justify-between">
            <div class="row items-center q-gutter-sm">
              <span class="text-grey-4 q-mr-sm text-weight-medium text-caption">สถานะ:</span>
              <q-btn
                v-for="option in statusFilterOptions"
                :key="option.value || 'all'"
                :label="`${option.label} (${option.count})`"
                @click="() => { statusFilter = option.value; playClickSound(); }"
                :class="['status-filter-btn', {'is-active': statusFilter === option.value}]"
                unelevated no-caps rounded size="sm"
              />
            </div>

            <div class="row items-center">
                <q-toggle
                    v-model="filterByMyRecords"
                    color="cyan-3"
                    keep-color
                    icon="person"
                    label="แสดงเฉพาะงานของฉัน"
                    left-label
                    class="text-grey-4"
                    @update:model-value="playClickSound"
                />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <div v-if="!loading && paginatedPatients.length > 0" class="list-item-animation" style="animation-delay: 0.3s;">

        <div v-if="viewMode === 'cards'" class="row q-col-gutter-lg items-stretch">
          <div
            v-for="(patient, index) in paginatedPatients"
            :key="`card-${patient.visit_id}`"
            class="col-12 col-md-6 col-lg-4 col-xl-3 list-item-animation"
            :style="{'animation-delay': `${index * 0.05}s`}"
          >
            <q-card class="patient-card glass-panel full-height" @click="openVisitSelector(patient)">
              <q-item class="q-pa-md">
                <q-item-section avatar>
                  <div class="avatar-wrapper" @click.stop="openImagePreview(patient)">
                    <q-avatar size="56px" class="shadow-2">
                      <img v-if="patient.avatar_url" :src="`http://localhost:3000${patient.avatar_url}`" class="avatar-img" style="object-fit: cover;">
                      <q-icon v-else name="person" color="grey-4" class="bg-grey-9" />
                    </q-avatar>
                    <div class="zoom-overlay"><q-icon name="zoom_in" color="white" /></div>
                    <q-badge v-if="patient.totalVisitsToday > 1" color="orange-7" rounded floating class="shadow-1" style="z-index: 10;">{{ patient.totalVisitsToday }}</q-badge>
                  </div>
                </q-item-section>

                <q-item-section>
                  <div class="text-subtitle1 text-white ellipsis text-weight-bold">{{ patient.patientName }}</div>
                  <div class="text-caption text-grey-5">HN: {{ patient.patient_id }}</div>
                </q-item-section>

                <q-item-section side>
                  <q-chip :class="getStatusChipClass(patient.status)" size="xs" class="glass-chip">
                    {{ getStatusLabel(patient) }}
                  </q-chip>
                </q-item-section>
              </q-item>

              <q-separator dark class="opacity-20" />

              <q-card-section class="q-py-sm bg-white-05 col-auto">
                <div class="row items-center justify-between text-grey-4 text-caption">
                  <div class="row items-center"><q-icon name="schedule" class="q-mr-xs text-cyan-3"/> {{ patient.arrivalTime }}</div>

                  <div v-if="!filterByMyRecords && patient.recorderId && patient.recorderId !== authStore.userId" class="row items-center text-orange-3">
                     <q-icon name="edit" size="xs" class="q-mr-xs"/> คนอื่นบันทึก
                  </div>
                  <div v-else-if="patient.temperature" class="row items-center">
                    <q-icon name="thermostat" color="orange-4" class="q-mr-xs"/> {{ patient.temperature }}°C
                  </div>

                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <div v-else-if="viewMode === 'table'" class="list-view-container">
          <div class="glass-panel q-pa-none" style="border-radius: 12px; overflow: hidden;">
             <div class="row q-px-md q-py-sm bg-white-05 text-grey-4 text-caption text-weight-bold">
                <div class="col-4">ข้อมูลผู้ป่วย</div>
                <div class="col-2 text-center">เวลามาถึง</div>
                <div class="col-3">สัญญาณชีพ / ผู้บันทึก</div>
                <div class="col-2 text-center">สถานะ</div>
                <div class="col-1 text-right">จัดการ</div>
             </div>
             <div
                v-for="(patient, index) in paginatedPatients"
                :key="patient.visit_id"
                class="list-row cursor-pointer list-item-animation"
                :style="{ animationDelay: `${index * 0.03}s` }"
                @click="openVisitSelector(patient)"
             >
                <div class="row items-center q-pa-md">
                   <div class="col-4 row items-center no-wrap">
                      <div class="avatar-wrapper-mini q-mr-md" @click.stop="openImagePreview(patient)">
                         <q-avatar size="40px" class="shadow-1 bg-dark">
                            <img v-if="patient.avatar_url" :src="`http://localhost:3000${patient.avatar_url}`" class="avatar-img">
                            <q-icon v-else name="person" class="text-grey-4" />
                         </q-avatar>
                         <q-badge v-if="patient.totalVisitsToday > 1" color="orange-8" label="M" class="mini-badge" rounded floating />
                      </div>
                      <div>
                         <div class="text-body2 text-white text-weight-bold ellipsis">{{ patient.patientName }}</div>
                         <div class="text-caption text-cyan-2 row items-center">
                            <q-icon name="fingerprint" size="xs" class="q-mr-xs"/> {{ patient.patient_id }}
                         </div>
                      </div>
                   </div>
                   <div class="col-2 text-center">
                      <div class="text-cyan-2 text-weight-medium bg-cyan-10-glass px-2 py-1 rounded-borders inline-block font-mono text-caption">
                         <q-icon name="schedule" class="q-mr-xs"/>{{ patient.arrivalTime }}
                      </div>
                   </div>
                   <div class="col-3">
                      <div v-if="patient.temperature || patient.pulse" class="row items-center q-gutter-x-md text-caption">
                         <div class="row items-center text-orange-3"><q-icon name="thermostat" class="q-mr-xs"/> {{ patient.temperature || '-' }}°C</div>
                         <div class="row items-center text-red-3"><q-icon name="favorite" class="q-mr-xs"/> {{ patient.pulse || '-' }} bpm</div>
                      </div>
                      <div v-else-if="!filterByMyRecords && patient.recorderId && patient.recorderId !== authStore.userId" class="text-grey-5 text-caption">
                         <q-icon name="person_outline" class="q-mr-xs"/>บันทึกโดยผู้อื่น
                      </div>
                      <div v-else class="text-grey-6 text-caption text-italic"><q-icon name="hourglass_empty" class="q-mr-xs"/>รอการตรวจ</div>
                   </div>
                   <div class="col-2 text-center">
                      <q-chip :class="getStatusChipClass(patient.status)" size="xs" class="glass-chip">
                         {{ getStatusLabel(patient) }}
                      </q-chip>
                   </div>
                   <div class="col-1 text-right">
                      <q-btn flat round dense icon="edit_note" color="cyan-3" class="hover-icon"><q-tooltip class="bg-black">บันทึกข้อมูล</q-tooltip></q-btn>
                   </div>
                </div>
                <q-separator dark class="opacity-10" />
             </div>
          </div>
        </div>

        <div class="row justify-center q-mt-xl">
          <q-pagination v-model="currentPage" :max="maxPages" direction-links color="cyan-3" active-color="cyan-6" active-text-color="white" class="glass-pagination" />
        </div>

      </div>

      <div v-else-if="!loading" class="column items-center justify-center q-pa-xl text-grey-5" style="min-height: 400px;">
        <div class="glass-panel q-pa-xl column flex-center" style="border-radius: 50%;">
            <q-icon name="assignment" size="60px" class="text-cyan-9 opacity-50 q-mb-sm" />
        </div>
        <div class="text-h6 q-mt-md opacity-80">ไม่พบผู้ป่วยในช่วงเวลานี้</div>
        <div class="text-caption opacity-60">สำหรับวันที่ {{ selectedDateLabel }}</div>
        <div v-if="filterByMyRecords" class="text-caption text-orange-4 q-mt-sm">
            <q-icon name="filter_alt" /> คุณเปิดตัวกรอง "เฉพาะงานของฉัน" อยู่
        </div>
        <q-btn flat color="cyan-3" class="q-mt-lg" label="เลือกวันที่อื่น" @click="showCalendarDialog = true" />
      </div>

    </div>

    <q-dialog v-model="showVisitSelector" backdrop-filter="blur(8px)">
      <q-card class="glass-panel dialog-card">
        <div class="dialog-header row items-center justify-between q-pa-md bg-white-05">
          <div class="text-subtitle1 text-white text-weight-bold"><q-icon name="history" class="q-mr-sm text-cyan-3"/>เลือกรายการรักษา</div>
          <q-btn dense flat round icon="close" v-close-popup color="grey-5" />
        </div>
        <q-card-section class="q-pa-none">
          <q-list separator dark>
            <q-item
              v-for="visit in selectedPatientForDialog?.visits"
              :key="visit.visit_id"
              clickable v-ripple
              class="visit-item"
              @click="goToRecord({ ...visit, id: selectedPatientForDialog.id })"
            >
              <q-item-section avatar>
                <q-avatar color="cyan-9" text-color="cyan-1" font-size="14px">{{ visit.daily_visit_number }}</q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold text-white">เวลา {{ formatTime(visit.visit_datetime) }} น.</q-item-label>
                <q-item-label caption class="text-grey-4">T: {{ visit.vitalSign?.temperature || '-' }}°C • P: {{ visit.vitalSign?.pulse || '-' }}</q-item-label>
                <q-item-label caption v-if="visit.UserID === authStore.userId" class="text-green-4 text-xs">คุณเป็นผู้บันทึก</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-chip :class="getStatusChipClass(visit.status)" size="xs">{{ translateStatusToThai(visit.status) }}</q-chip>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showCalendarDialog" backdrop-filter="blur(4px)">
        <q-card class="glass-panel">
            <q-date
                v-model="tempSelectedDate"
                mask="YYYY-MM-DD"
                color="cyan-6"
                dark
                class="no-shadow bg-transparent"
                :events="checkCalendarEvent"
                event-color="green-4"
            />
            <div class="row justify-end q-pa-sm">
                <q-btn flat label="ยกเลิก" color="grey-4" v-close-popup />
                <q-btn flat label="ตกลง" color="cyan-3" text-color="black" class="bg-cyan-3" @click="confirmCalendarDate" />
            </div>
        </q-card>
    </q-dialog>

    <q-dialog v-model="showImagePreview" backdrop-filter="blur(8px)">
      <q-card class="bg-transparent shadow-none no-shadow" style="min-width: 300px; max-width: 90vw;">
        <div class="column items-center relative-position">
          <q-img
            :src="currentImageSrc"
            class="rounded-borders shadow-20"
            style="max-height: 80vh; max-width: 100%; border: 4px solid rgba(255,255,255,0.1);"
            spinner-color="white"
          />
          <div class="text-white text-h5 q-mt-md text-weight-bold text-shadow">{{ currentImageName }}</div>
          <q-btn round color="white" text-color="black" icon="close" class="absolute-top-right q-ma-md shadow-10" v-close-popup style="top: -20px; right: -20px;" />
        </div>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import * as Tone from 'tone';
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar, date } from 'quasar';
import axios from 'axios';

// 🔥 1. Import Auth Store เพื่อเอา UserID มาเช็ค
import { useAuthStore } from 'src/store/auth';
const authStore = useAuthStore();

// --- Sound ---
const meloSynth = new Tone.FMSynth({ harmonicity: 3.1, modulationIndex: 20, envelope: { attack: 0.001, decay: 0.1, sustain: 0.1, release: 0.8 }, modulationEnvelope: { attack: 0.01, decay: 0.5, sustain: 0, release: 0.8 } }).toDestination();
meloSynth.volume.value = -10;
const noteSequence = [ { note: 'C4', duration: '16n' }, { note: 'E4', duration: '16n' } ];
const noteIndex = ref(0);

const playClickSound = () => {};
const playFormFocusSound = () => {};
const playRemoveSound = () => {};
const playNextNote = () => {
  if (Tone.context.state !== 'running') { Tone.context.resume(); }
  const { note, duration } = noteSequence[noteIndex.value];
  meloSynth.triggerAttackRelease(note, duration);
  noteIndex.value = (noteIndex.value + 1) % noteSequence.length;
};

// --- Logic Helpers ---
const translateStatusToThai = (status) => {
  const completedStatuses = ['รอพบแพทย์', 'กำลังรักษา', 'รักษาเสร็จสิ้น', 'รอรับยา', 'กำลังรับยา', 'จ่ายยาแล้ว'];
  return completedStatuses.includes(status) ? 'กรอกข้อมูลเสร็จสิ้น' : 'ยังกรอกไม่เสร็จ';
};

// --- Setup ---
const router = useRouter();
const route = useRoute();
const $q = useQuasar();
const viewMode = ref('table');
const loading = ref(true);
const allPatientsData = ref([]);

const searchQuery = ref('');
const statusFilter = ref(null);
const currentPage = ref(1);
const rowsPerPage = ref(10);
const activeSortOption = ref('time_desc');
const selectedDate = ref(null);

// 🔥 ตัวแปร Toggle Filter (Default = true ตามที่คุณต้องการ)
const filterByMyRecords = ref(true);

const showVisitSelector = ref(false);
const selectedPatientForDialog = ref(null);

// 🔥 Calendar Logic Vars
const showCalendarDialog = ref(false);
const tempSelectedDate = ref(null);

// Options
const sortOptions = [ { label: 'เวลา (ใหม่ > เก่า)', value: 'time_desc' }, { label: 'เวลา (เก่า > ใหม่)', value: 'time_asc' }, { label: 'ชื่อ (ก-ฮ)', value: 'name_asc' } ];
const statusOptions = [ { label: 'ทุกสถานะ', value: null }, { label: 'เสร็จสิ้น', value: 'COMPLETED' }, { label: 'รอคัดกรอง', value: 'ยังกรอกไม่เสร็จ' } ];
const thaiDateLocale = { days: 'อา_จ_อ_พ_พฤ_ศ_ส'.split('_'), daysShort: 'อา_จ_อ_พ_พฤ_ศ_ส'.split('_'), months: 'ม.ค._ก.พ._มี.ค._เม.ย._พ.ค._มิ.ย._ก.ค._ส.ค._ก.ย._ต.ค._พ.ย._ธ.ค.'.split('_'), monthsShort: 'ม.ค._ก.พ._มี.ค._เม.ย._พ.ค._มิ.ย._ก.ค._ส.ค._ก.ย._ต.ค._พ.ย._ธ.ค.'.split('_') };

// --- Computed: Active Dates ---
const activeDatesSet = computed(() => {
  const dates = new Set();
  if (allPatientsData.value) {
      allPatientsData.value.forEach(p => {
          if (p.visits) {
              p.visits.forEach(v => dates.add(date.formatDate(v.visit_datetime, 'YYYY-MM-DD')))
          }
      });
  }
  return dates;
});

const checkCalendarEvent = (dateStr) => {
    const formatted = dateStr.replace(/\//g, '-');
    return activeDatesSet.value.has(formatted);
};

const dateOptions = computed(() => {
    const opts = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
        const d = date.subtractFromDate(today, { days: i });
        const dateVal = date.formatDate(d, 'YYYY-MM-DD');
        const isRealData = activeDatesSet.value.has(dateVal);

        let labelText = date.formatDate(d, 'D MMM YYYY', thaiDateLocale);
        if (i === 0) labelText += ' (วันนี้)';
        else if (i === 1) labelText += ' (เมื่อวาน)';

        opts.push({
            label: labelText,
            subLabel: isRealData ? 'มีข้อมูลการคัดกรอง' : 'ไม่มีรายการ',
            value: dateVal,
            hasData: isRealData
        });
    }
    opts.push({ label: 'เลือกวันที่อื่น...', value: 'custom', hasData: false });

    if (selectedDate.value && selectedDate.value !== 'custom' && !opts.find(o => o.value === selectedDate.value)) {
         const d = new Date(selectedDate.value);
         const isRealData = activeDatesSet.value.has(selectedDate.value);
         opts.unshift({
            label: date.formatDate(d, 'D MMM YYYY', thaiDateLocale) + ' (เลือกเอง)',
            subLabel: 'จากการเลือกปฏิทิน',
            value: selectedDate.value,
            hasData: isRealData
        });
    }

    return opts;
});

const selectedDateLabel = computed(() => {
    if (!selectedDate.value) return '-';
    if (selectedDate.value === 'custom') return 'เลือกวันที่...';
    const d = new Date(selectedDate.value);
    if (isNaN(d.getTime())) return selectedDate.value;
    return date.formatDate(d, 'D MMM YYYY', thaiDateLocale);
});

// --- Logic ---
const displayedPatients = computed(() => {
  if (!allPatientsData.value) return [];

  const targetDate = selectedDate.value && selectedDate.value !== 'custom'
                      ? date.formatDate(selectedDate.value, 'YYYY/MM/DD')
                      : date.formatDate(Date.now(), 'YYYY/MM/DD');

  // 🟢 1. Filter by Date (เหมือนเดิม)
  let filteredByDate = allPatientsData.value.map(p => ({
    ...p, visits: p.visits.filter(v => date.formatDate(v.visit_datetime, 'YYYY/MM/DD') === targetDate)
  })).filter(p => p.visits.length > 0);

  // 🔥 2. Filter by Nurse (เพิ่มเข้ามา)
  // ถ้าเปิด Toggle นี้อยู่ -> ให้กรองเอาเฉพาะ Patient ที่มี Visit ที่ UserID ตรงกับเรา
  if (filterByMyRecords.value) {
      filteredByDate = filteredByDate.map(p => ({
          ...p,
          // กรอง Visits ที่ไม่ใช่ของเราออกไป
          visits: p.visits.filter(v => v.UserID === authStore.userId)
      })).filter(p => p.visits.length > 0); // ถ้าไม่เหลือ Visit เลย ก็เอา Patient ออก
  }

  return filteredByDate.map(p => {
    const latest = p.visits[0] || {};
    const total = p.visits.length;
    const completed = p.visits.filter(v => translateStatusToThai(v.status) === 'กรอกข้อมูลเสร็จสิ้น').length;

    return {
      ...p,
      visit_id: latest.visit_id,
      patientName: `${p.prefix || ''} ${p.first_name} ${p.last_name}`,
      status: (total > 0 && completed === total) ? 'COMPLETED' : 'ยังกรอกไม่เสร็จ',
      arrivalTime: formatTime(latest.visit_datetime),
      originalArrivalTime: latest.visit_datetime,
      temperature: latest.vitalSign?.temperature,
      pulse: latest.vitalSign?.pulse,
      totalVisitsToday: total,
      completedVisitsToday: completed,
      avatar_url: p.avatar_url,
      // 🔥 เก็บ UserID ผู้บันทึกไว้เช็คตอนแสดงผล
      recorderId: latest.UserID
    };
  });
});

const filteredPatients = computed(() => {
  let data = displayedPatients.value;
  if (statusFilter.value) data = data.filter(p => p.status === statusFilter.value);
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    data = data.filter(p => p.patientName.toLowerCase().includes(q) || p.patient_id.includes(q));
  }
  return data;
});

const sortedPatients = computed(() => {
  const data = [...filteredPatients.value];
  const [key, order] = activeSortOption.value.split('_');
  data.sort((a, b) => {
    let valA = key === 'time' ? new Date(a.originalArrivalTime) : a.patientName;
    let valB = key === 'time' ? new Date(b.originalArrivalTime) : b.patientName;
    return order === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
  });
  return data;
});

const paginatedPatients = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;
  return sortedPatients.value.slice(start, start + rowsPerPage.value);
});

const maxPages = computed(() => Math.ceil(sortedPatients.value.length / rowsPerPage.value));
const statusFilterOptions = computed(() => statusOptions.map(o => ({
  ...o, count: o.value === null ? displayedPatients.value.length : displayedPatients.value.filter(p => p.status === o.value).length
})));

// --- Handlers ---
const handleDateSelect = (val) => {
    if (val === 'custom') {
        tempSelectedDate.value = selectedDate.value !== 'custom' ? selectedDate.value : date.formatDate(new Date(), 'YYYY-MM-DD');
        showCalendarDialog.value = true;
        nextTick(() => { /* UI Trick */ });
    } else {
        playClickSound();
    }
}

const confirmCalendarDate = () => {
    if (!tempSelectedDate.value) return;
    selectedDate.value = tempSelectedDate.value;
    showCalendarDialog.value = false;
    playClickSound();
}

// --- Image Preview ---
const showImagePreview = ref(false);
const currentImageSrc = ref('');
const currentImageName = ref('');

const openImagePreview = (patient) => {
  if (patient.avatar_url) {
    currentImageSrc.value = `http://localhost:3000${patient.avatar_url}`;
    currentImageName.value = patient.patientName;
    showImagePreview.value = true;
    playNextNote();
  }
};

const formatTime = (d) => d ? new Date(d).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : '';

const loadRegistryData = async () => {
  loading.value = true;
  try {
    const res = await axios.get('http://localhost:3000/api/patients/registry');
    allPatientsData.value = res.data.map(p => ({ ...p, visits: p.visits.sort((a, b) => new Date(b.visit_datetime) - new Date(a.visit_datetime)) }));
  } catch (e) { $q.notify({ type: 'negative', message: 'โหลดข้อมูลไม่สำเร็จ' }); }
  finally { loading.value = false; }
};

const initializePage = async () => {
  await loadRegistryData();
  // Set default date to Today (Formatted correctly)
  selectedDate.value = date.formatDate(Date.now(), 'YYYY-MM-DD');
};

const getStatusLabel = (p) => p.status === 'COMPLETED' ? `เสร็จสิ้น (${p.totalVisitsToday})` : `${p.completedVisitsToday}/${p.totalVisitsToday} รอคัดกรอง`;
const getStatusChipClass = (s) => (s === 'COMPLETED' || s === 'รอพบแพทย์' || s === 'กำลังรักษา') ? 'bg-green-9 text-green-1' : 'bg-orange-9 text-orange-1';

const openVisitSelector = (p) => {
  const fullData = allPatientsData.value.find(x => x.id === p.id);
  const targetDate = date.formatDate(selectedDate.value, 'YYYY/MM/DD');

  // 🔥 Filter ใน Dialog ก็ต้องเช็คด้วยว่าถ้าเปิดโหมด "งานฉัน" ก็ต้องโชว์เฉพาะงานฉัน
  let visits = fullData.visits.filter(v => date.formatDate(v.visit_datetime, 'YYYY/MM/DD') === targetDate);

  if (filterByMyRecords.value) {
      visits = visits.filter(v => v.UserID === authStore.userId);
  }

  if (p.totalVisitsToday > 1 || visits.length > 1) {
      selectedPatientForDialog.value = { ...fullData, visits };
      showVisitSelector.value = true;
  }
  else {
      if (visits.length > 0) goToRecord({ ...p, visit_id: visits[0].visit_id, id: p.id });
  }
};

const goToRecord = (v) => router.push({ name: 'AddProcedure', query: { patientId: v.id, visitId: v.visit_id } });

onMounted(initializePage);
watch([searchQuery, statusFilter, selectedDate, viewMode, filterByMyRecords], () => currentPage.value = 1);
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600;700&display=swap');

$dark-bg: #0f172a;
$glass-bg: rgba(30, 41, 59, 0.7);
$border: 1px solid rgba(255,255,255,0.08);
$cyan: #22d3ee;

.dashboard-background { background: $dark-bg; font-family: 'Sarabun'; color: #e2e8f0; min-height: 100vh; position: relative; overflow-x: hidden; }

/* 🔥 Content Container: จัดกึ่งกลางจอ */
.content-container {
  position: relative; z-index: 2;
  width: 100%;
  max-width: 1440px; /* จำกัดความกว้าง */
  margin: 0 auto;    /* จัดกลาง */
}

/* Utilities */
.status-dot { width: 10px; height: 10px; border-radius: 50%; box-shadow: 0 0 5px rgba(0,0,0,0.5); }
.list-row-hover:hover { background: rgba(34, 211, 238, 0.15) !important; cursor: pointer; }
.glass-menu { background: rgba(15, 23, 42, 0.95) !important; backdrop-filter: blur(10px); border: $border; }

/* Components */
.glass-panel { background: $glass-bg; backdrop-filter: blur(12px); border: $border; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.2); }
.icon-box-flat { width: 52px; height: 52px; background: linear-gradient(135deg, $cyan, #0ea5e9); border-radius: 14px; display: flex; align-items: center; justify-content: center; box-shadow: none; }

/* Inputs */
.flat-input :deep(.q-field__control) { background: rgba(0,0,0,0.2) !important; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); transition: border-color 0.3s; }
.flat-input :deep(.q-field__control:hover) { border-color: $cyan; }

/* Filters */
.status-filter-btn { color: #64748b; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); &.is-active { background: $cyan; color: #0f172a; border-color: $cyan; box-shadow: none; font-weight: bold; } }

/* Cards */
.patient-card {
  height: 100%; cursor: pointer;
  position: relative; overflow: hidden;
  border-left: 4px solid transparent;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

  &:hover {
    border-left-color: $cyan;
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.3);
    background: rgba(255,255,255,0.08);
    .zoom-overlay { opacity: 1; }
  }
}

/* Avatar Zoom Effect */
.avatar-wrapper { position: relative; cursor: pointer; border-radius: 50%; overflow: hidden; width: 56px; height: 56px; border: 2px solid rgba(255,255,255,0.1); }
.avatar-wrapper-mini { position: relative; cursor: pointer; border-radius: 50%; overflow: hidden; width: 44px; height: 44px; }
.avatar-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.zoom-overlay {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(34, 211, 238, 0.5); /* Cyan Tint */
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity 0.3s; border-radius: 50%;
}
.avatar-wrapper:hover .avatar-img, .avatar-wrapper-mini:hover .avatar-img { transform: scale(1.1); }

/* List View */
.list-view-container { margin-top: 10px; }
.list-row {
  transition: all 0.2s ease-in-out;
  border-bottom: 1px solid transparent;
  &:hover {
    background: rgba(255,255,255,0.08);
  }
}

/* Helpers */
.bg-cyan-10-glass { background: rgba(0, 96, 100, 0.4); }
.inline-block { display: inline-block; }
.px-2 { padding-left: 8px; padding-right: 8px; }
.py-1 { padding-top: 4px; padding-bottom: 4px; }
.hover-icon:hover { color: #fff; }
.glass-toggle { background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); }
.glass-chip { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(4px); }
.hover-rotate:hover { transform: rotate(180deg); transition: transform 0.5s ease; }

/* Dialog */
.dialog-card { width: 500px; max-width: 90vw; background: #1e293b !important; border: $border; }
.visit-item { border-bottom: $border; &:hover { background: rgba(255,255,255,0.05); } }

/* Utilities */
.opacity-10 { opacity: 0.1; } .opacity-20 { opacity: 0.2; } .opacity-30 { opacity: 0.3; } .bg-white-05 { background: rgba(255,255,255,0.05); }
.list-item-animation { opacity: 0; animation: fadeInSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeInSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.text-shadow { text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
.loading-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.9); z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.loading-spinner { width: 60px; height: 60px; border: 4px solid rgba(34, 211, 238, 0.3); border-top-color: $cyan; border-radius: 50%; animation: spin 1s linear infinite; }
.loading-text { font-family: 'Sarabun'; letter-spacing: 1px; color: $cyan; animation: pulse 1.5s infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes pulse { 50% { opacity: 0.5; } }
.font-mono { font-family: monospace; }
</style>
