<template>
  <q-page padding class="dashboard-background">
    <div class="q-pa-md">

      <!-- Header Section -->
      <div class="header-section main-card interactive-card q-pa-md q-mb-lg row items-center justify-between list-item-animation" style="animation-delay: 0.1s;">
        <div class="row items-center">
          <q-icon name="o_person_search" size="lg" class="q-mr-md header-icon" />
          <div class="text-h5 text-weight-bold header-title">ค้นหารายการผู้ป่วย</div>
        </div>
        <div
          class="history-button primary-action-btn row items-center no-wrap q-pa-sm cursor-pointer"
          @click="() => { toggleHistory(); playClickSound(); }"
          @mouseenter="throttledPlayHoverSound"
        >
          <q-icon name="history" size="md" class="q-mr-sm" />
          <div class="history-text">ประวัติการบันทึก</div>
        </div>
      </div>

      <!-- Filter Card -->
      <q-card class="filter-card main-card interactive-card q-mb-lg list-item-animation" flat bordered style="animation-delay: 0.2s;">
        <q-card-section>
          <div class="row items-center q-col-gutter-md">
            <div class="col-xs-12 col-sm">
              <q-input
                dark v-model="searchQuery" dense outlined placeholder="ค้นหาชื่อ, ID, อาการ..." clearable
                @clear="playRemoveSound"
                @focus="playFormFocusSound"
                @mouseenter="throttledPlayHoverSound"
                class="custom-q-input" >
                <template v-slot:prepend> <q-icon name="o_search" /> </template>
              </q-input>
            </div>
            <div class="col-xs-12 col-sm-auto">
              <div class="row items-center q-gutter-md no-wrap">
                <q-select
                  dark dense outlined
                  v-model="activeSortOption"
                  :options="sortOptions"
                  label="เรียงตาม"
                  emit-value
                  map-options
                  class="sort-select"
                  style="min-width: 220px;"
                  @popup-show="playFormFocusSound"
                  @update:model-value="playClickSound"
                />
                <q-btn-toggle
                  v-model="viewMode"
                  unelevated
                  toggle-color="primary"
                  color="rgba(0, 184, 255, 0.1)"
                  text-color="primary"
                  :options="[
                    {icon: 'o_view_list', value: 'table', slot: 'table-view'},
                    {icon: 'o_grid_view', value: 'cards', slot: 'card-view'}
                  ]"
                  @update:model-value="playClickSound"
                  @mouseenter="throttledPlayHoverSound"
                  class="view-toggle"
                >
                  <template v-slot:table-view>
                    <q-tooltip class="tooltip-glassy" anchor="top middle" self="bottom middle">มุมมองตาราง</q-tooltip>
                  </template>
                  <template v-slot:card-view>
                    <q-tooltip class="tooltip-glassy" anchor="top middle" self="bottom middle">มุมมองการ์ด</q-tooltip>
                  </template>
                </q-btn-toggle>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-separator dark />
        <q-card-section>
            <div class="row items-center q-gutter-x-md q-gutter-y-sm">
                <div class="text-caption welcome-text q-mr-sm">สถานะ:</div>
                <q-btn
                  v-for="option in statusFilterOptions"
                  :key="option.value || 'all'"
                  :label="`${option.label} (${option.count})`"
                  @click="() => { statusFilter = option.value; playClickSound(); }"
                  @mouseenter="throttledPlayHoverSound"
                  :class="['status-pill', getStatusPillClass(option.value)]"
                  unelevated
                  no-caps
                  rounded
                />
            </div>
        </q-card-section>
      </q-card>

      <!-- Results Section -->
      <div v-if="paginatedPatients.length > 0">
        <div
          v-if="viewMode === 'cards'"
          :key="`cards-${statusFilter}-${searchQuery}`"
          class="row q-col-gutter-lg items-stretch"
        >
          <div
            v-for="(patient, index) in paginatedPatients"
            :key="`card-${patient.id}`"
            class="col-12 col-md-6 col-lg-4 list-item-animation"
            :style="{'animation-delay': `${index * 50}ms`}"
          >
            <q-card :class="['patient-card main-card interactive-card', getStatusBorderClass(patient.status)]" flat bordered @click="() => { goToDiagnosis(patient); playClickSound(); }" @mouseenter="throttledPlayHoverSound">
              <q-item class="q-pa-md">
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white" icon="o_person" size="lg"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold text-h6 ellipsis">{{ patient.patientName }}</q-item-label>
                  <q-item-label caption class="welcome-text">ID: {{ patient.patientId }}</q-item-label>
                </q-item-section>
                  <q-item-section side>
                    <q-chip :class="getStatusChipClass(patient.status)">{{ patient.status }}</q-chip>
                  </q-item-section>
              </q-item>
              <q-separator dark />
              <q-card-section class="col">
                <div class="row items-start no-wrap q-mb-md"><q-icon name="o_sick" size="sm" color="welcome-text" class="q-mt-xs q-mr-sm" /><div><div class="welcome-text text-caption">อาการสำคัญ</div><div class="text-body1">{{ patient.chiefComplaint }}</div></div></div>
                <div class="row items-center no-wrap"><q-icon name="o_schedule" size="sm" color="welcome-text" class="q-mr-sm" /><div><div class="welcome-text text-caption">เวลาที่มาถึง</div><div class="text-body1">{{ patient.arrivalTime }}</div></div></div>
              </q-card-section>
              <q-card-actions class="q-pa-md">
                <q-btn class="primary-action-btn full-width" label="ดูเคส" icon-right="o_arrow_forward" unelevated padding="sm lg" />
              </q-card-actions>
            </q-card>
          </div>
        </div>

        <q-table
          v-else-if="viewMode === 'table'"
          :key="`table-${statusFilter}-${searchQuery}`"
          :rows="paginatedPatients"
          :columns="columns"
          row-key="id"
          class="themed-table list-item-animation"
          dark flat
          @row-click="onRowClick"
          hide-pagination
          style="animation-delay: 0.3s;"
        >
          <template v-slot:body="props">
            <q-tr :props="props" class="table-row-item" @mouseenter="throttledPlayHoverSound">
              <q-td key="patient" :props="props">
                <div class="cell-content">
                  <q-avatar color="primary" text-color="white" icon="o_person" size="md" />
                  <div class="q-ml-md">
                    <div class="text-weight-bold">{{ props.row.patientName }}</div>
                    <div class="welcome-text text-caption">ID: {{ props.row.patientId }}</div>
                  </div>
                </div>
              </q-td>
              <q-td key="chiefComplaint" :props="props">
                <div class="cell-content">
                    <q-icon name="o_sick" color="welcome-text" class="q-mr-sm" />
                    <div class="ellipsis">{{ props.row.chiefComplaint }}</div>
                </div>
              </q-td>
              <q-td key="arrivalTime" :props="props">
                  <div class="cell-content justify-center">
                    <q-icon name="o_schedule" color="welcome-text" class="q-mr-sm" />
                    <span>{{ props.row.arrivalTime }}</span>
                  </div>
              </q-td>
              <q-td key="status" :props="props">
                <div class="cell-content justify-center">
                  <q-chip :class="getStatusChipClass(props.row.status)">{{ props.row.status }}</q-chip>
                </div>
              </q-td>
              <q-td key="actions" :props="props">
                <div class="cell-content justify-end">
                  <q-btn class="primary-action-btn" label="ดูเคส" icon-right="o_arrow_forward_ios" @click.stop="() => { goToDiagnosis(props.row); playClickSound(); }" unelevated padding="xs lg" no-caps />
                </div>
              </q-td>
            </q-tr>
          </template>
          <template v-slot:no-data>
            <div class="full-width row flex-center text-primary q-gutter-sm q-pa-xl">
              <q-icon size="4em" name="o_search_off" />
              <div class="text-h6">ไม่พบข้อมูลผู้ป่วยที่ตรงกับเงื่อนไข</div>
            </div>
          </template>
        </q-table>

      </div>
      <div v-else class="list-item-animation" style="animation-delay: 0.3s;">
        <q-card flat bordered class="no-data-card main-card">
          <q-card-section class="text-center q-pa-xl">
            <q-icon name="o_inbox" size="6em" class="placeholder-icon" />
            <div class="text-h5 welcome-text q-mt-md">ไม่พบข้อมูลผู้ป่วย</div>
            <p class="welcome-text q-mb-lg">ลองเปลี่ยนคำค้นหาหรือตัวกรองสถานะ</p>
            <q-btn
              class="primary-action-btn"
              label="รีเฟรช"
              icon="o_refresh"
              @click="() => { searchQuery = ''; statusFilter = null; playClickSound(); }"
              @mouseenter="throttledPlayHoverSound"
            />
          </q-card-section>
        </q-card>
      </div>

      <!-- Pagination -->
      <div v-if="maxPages > 1" class="row justify-center q-mt-lg list-item-animation" style="animation-delay: 0.4s;">
        <div class="pagination-container">
          <q-pagination
            dark
            v-model="currentPage"
            :max="maxPages"
            direction-links
            active-design="unelevated"
            active-color="primary"
            gutter="sm"
            class="pagination-control"
            @update:model-value="playClickSound"
            @mouseenter="throttledPlayHoverSound"
          />
        </div>
      </div>

    </div>
  </q-page>
</template>

<script setup>
import * as Tone from 'tone';
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';

// --- SOUND SYSTEM ---
const createSynth = (synth, options, volume) => {
  const s = new synth(options).toDestination();
  s.volume.value = volume;
  return s;
};
const hoverSynth = createSynth(Tone.NoiseSynth, { noise: { type: 'pink' }, envelope: { attack: 0.001, decay: 0.15, sustain: 0 } }, -28);
const clickSynth = createSynth(Tone.FMSynth, { harmonicity: 8, modulationIndex: 2, oscillator: { type: "sine" }, envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.2 }, modulation: { type: "square" }, modulationEnvelope: { attack: 0.002, decay: 0.2, sustain: 0, release: 0.2 } }, -10);
const formFocusSynth = createSynth(Tone.Synth, { oscillator: { type: 'triangle' }, envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.1 } }, -20);
const removeSynth = createSynth(Tone.MembraneSynth, { pitchDecay: 0.05, octaves: 10, oscillator: { type: 'sine' }, envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4, attackCurve: 'exponential' } }, -12);
let lastHoverTime = 0;
const throttleDelay = 100;
const playSound = (synth, note, duration) => {
  if (Tone.context.state !== 'running') Tone.context.resume();
  synth.triggerAttackRelease(note, duration);
};
const throttledPlayHoverSound = () => {
  const now = Date.now();
  if (now - lastHoverTime > throttleDelay) {
    playSound(hoverSynth, "C4", "8n");
    lastHoverTime = now;
  }
};
const playClickSound = () => playSound(clickSynth, "C5", "32n");
const playFormFocusSound = () => playSound(formFocusSynth, "G5", "32n");
const playRemoveSound = () => playSound(removeSynth, "C2", "8n");
// --- END OF SOUNDS ---

const router = useRouter();

const viewMode = ref('cards');
const patientQueue = ref([
  { id: 1, patientName: 'นายสมศักดิ์ แข็งแรง', patientId: 'HN00123', chiefComplaint: 'มีไข้, ไอ, เจ็บคอ', arrivalTime: '09:05', status: 'รอพบแพทย์'},
  { id: 2, patientName: 'นางสาวสมศรี สุขใจ', patientId: 'HN00456', chiefComplaint: 'ปวดท้อง, คลื่นไส้', arrivalTime: '09:15', status: 'รอพบแพทย์'},
  { id: 3, patientName: 'เด็กชายมานะ อดทน', patientId: 'HN00789', chiefComplaint: 'หกล้ม, มีแผลถลอก', arrivalTime: '09:20', status: 'กำลังรักษา'},
  { id: 4, patientName: 'นางสมบูรณ์ มั่งมี', patientId: 'HN00112', chiefComplaint: 'ติดตามอาการความดันสูง', arrivalTime: '09:30', status: 'รอพบแพทย์'},
  { id: 5, patientName: 'นายวิชัย ใจสู้', patientId: 'HN00258', chiefComplaint: 'เวียนศีรษะ', arrivalTime: '09:45', status: 'รักษาเสร็จสิ้น'},
  { id: 6, patientName: 'นายอาทิตย์ ตั้งใจ', patientId: 'HN00333', chiefComplaint: 'ปวดหลัง', arrivalTime: '10:00', status: 'รอพบแพทย์'},
  { id: 7, patientName: 'นางวันดี มีสุข', patientId: 'HN00444', chiefComplaint: 'ภูมิแพ้', arrivalTime: '10:15', status: 'กำลังรักษา'},
  { id: 8, patientName: 'นายเอกราช ชาติไทย', patientId: 'HN00555', chiefComplaint: 'อาหารเป็นพิษ', arrivalTime: '10:30', status: 'รอพบแพทย์'},
]);

const searchQuery = ref('');
const statusFilter = ref(null);
const currentPage = ref(1);
const rowsPerPage = ref(6);
const activeSortOption = ref('time_asc');

const sortOptions = ref([
  { label: 'เวลาที่มาถึง (เก่าสุด -> ล่าสุด)', value: 'time_asc' },
  { label: 'เวลาที่มาถึง (ล่าสุด -> เก่าสุด)', value: 'time_desc' },
  { label: 'ชื่อ ก -> ฮ', value: 'name_asc' },
  { label: 'ชื่อ ฮ -> ก', value: 'name_desc' }
]);

const statusOptions = ref([
  { label: 'ทุกสถานะ', value: null },
  { label: 'รอพบแพทย์', value: 'รอพบแพทย์' },
  { label: 'กำลังรักษา', value: 'กำลังรักษา' },
  { label: 'รักษาเสร็จสิ้น', value: 'รักษาเสร็จสิ้น' },
]);

const filteredPatientQueue = computed(() => {
  let data = patientQueue.value;
  if (statusFilter.value) {
    data = data.filter(patient => patient.status === statusFilter.value);
  }
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    data = data.filter(patient =>
      patient.patientName.toLowerCase().includes(query) ||
      patient.patientId.toLowerCase().includes(query) ||
      patient.chiefComplaint.toLowerCase().includes(query)
    );
  }
  return data;
});

const sortedPatients = computed(() => {
  const data = [...filteredPatientQueue.value];
  const [key, order] = activeSortOption.value.split('_');

  data.sort((a, b) => {
    let valA, valB;

    if (key === 'time') {
      valA = a.arrivalTime;
      valB = b.arrivalTime;
    } else { // key === 'name'
      valA = a.patientName;
      valB = b.patientName;
    }

    if (valA < valB) return order === 'asc' ? -1 : 1;
    if (valA > valB) return order === 'asc' ? 1 : -1;
    return 0;
  });

  return data;
});

const statusCounts = computed(() => {
  const counts = {
    'รอพบแพทย์': 0,
    'กำลังรักษา': 0,
    'รักษาเสร็จสิ้น': 0,
  };
  for (const patient of patientQueue.value) {
    if (patient.status in counts) {
      counts[patient.status]++;
    }
  }
  return counts;
});

const statusFilterOptions = computed(() => {
  return statusOptions.value.map(option => ({
    ...option,
    count: option.value === null
      ? patientQueue.value.length
      : (statusCounts.value[option.value] || 0)
  }));
});

const maxPages = computed(() => {
  return Math.ceil(sortedPatients.value.length / rowsPerPage.value);
});

const paginatedPatients = computed(() => {
  const startIndex = (currentPage.value - 1) * rowsPerPage.value;
  const endIndex = startIndex + rowsPerPage.value;
  return sortedPatients.value.slice(startIndex, endIndex);
});

watch([() => searchQuery.value, () => statusFilter.value], () => {
  currentPage.value = 1;
});

const columns = [
  { name: 'patient', required: true, label: 'ชื่อ-นามสกุลผู้ป่วย', align: 'left', field: 'patientName', style: 'width: 30%' },
  { name: 'chiefComplaint', align: 'left', label: 'อาการสำคัญ', field: 'chiefComplaint', style: 'width: 35%' },
  { name: 'arrivalTime', align: 'center', label: 'เวลาที่มาถึง', field: 'arrivalTime', style: 'width: 15%' },
  { name: 'status', align: 'center', label: 'สถานะ', field: 'status', style: 'width: 10%' },
  { name: 'actions', align: 'right', label: 'ดำเนินการ', style: 'width: 10%' }
];

const getStatusColor = (status) => {
  if (status === 'รอพบแพทย์') return 'deep-orange';
  if (status === 'กำลังรักษา') return 'light-blue-7';
  if (status === 'รักษาเสร็จสิ้น') return 'positive';
  return 'grey';
};

const getStatusBorderClass = (status) => {
  if (status === 'รอพบแพทย์') return 'border-orange';
  if (status === 'กำลังรักษา') return 'border-blue';
  if (status === 'รักษาเสร็จสิ้น') return 'border-green';
  return 'border-grey';
}

const getStatusPillClass = (status) => {
  if (statusFilter.value !== status) return '';
  if (status === null) return 'active-primary';
  const color = getStatusColor(status);
  return `active-${color}`;
}

const getStatusChipClass = (status) => {
  const baseClasses = 'text-weight-bold status-chip-display';
  if (status === 'รอพบแพทย์') return `${baseClasses} status-chip-orange`;
  if (status === 'กำลังรักษา') return `${baseClasses} status-chip-blue`;
  if (status === 'รักษาเสร็จสิ้น') return `${baseClasses} status-chip-green`;
  return `${baseClasses} status-chip-grey`;
};

const goToDiagnosis = (patientData) => {
  console.log('Go to diagnosis for patient:', patientData.patientId);
  router.push(`/doctor/diagnosis/${patientData.id}`);
};

const onRowClick = (evt, row) => {
  goToDiagnosis(row);
  playClickSound();
};

const toggleHistory = () => {
  // Placeholder for history toggle logic
  console.log("Toggle history view");
}
</script>

<style scoped lang="scss">
.dashboard-background {
  background-color: #0d1a26;
  font-family: 'Sarabun', sans-serif;
  color: #e0e0e0;
}

.header-icon {
  color: #00d4ff;
  text-shadow: 0 0 12px #00d4ff;
}

.header-title {
  color: #ffffff;
  text-shadow: 0 0 8px rgba(0, 184, 255, 0.8);
}

.welcome-text {
  color: #90a4ae;
}

.primary-action-btn {
  position: relative;
  overflow: hidden;
  z-index: 1;
  border: 1px solid #00b8ff;
  color: #00b8ff;
  background: transparent;
  border-radius: 8px;
  transition: color 0.4s ease-in-out;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #00b8ff;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    z-index: -1;
  }

  &:hover {
    color: white;
    &::before {
      transform: scaleX(1);
    }
  }
}

.main-card {
  background: linear-gradient(135deg, rgba(38, 50, 56, 0.5), rgba(38, 50, 56, 0.3));
  background-size: 200% 200%;
  background-position: 50% 50%;
  backdrop-filter: blur(8px);
  border-radius: 12px;
  border: 1px solid rgba(0, 184, 255, 0.2);
  box-shadow: 0 4px 30px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(0, 184, 255, 0.1);
  color: #e0e0e0;
  transition: background-position 0.4s ease-out;
}

.interactive-card {
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    transform: translateY(-6px) scale(1.02);
    border-color: rgba(0, 184, 255, 0.5);
    box-shadow: 0 8px 40px rgba(0,0,0,0.2);
    background-position: 100% 100%;
  }
}

.status-pill {
  background-color: rgba(144, 164, 174, 0.15);
  color: #b0bec5;
  transition: all 0.3s ease;
  border: 1px solid rgba(144, 164, 174, 0.2);
  padding: 4px 12px;

  &:hover {
    background-color: rgba(144, 164, 174, 0.25);
    border-color: rgba(144, 164, 174, 0.5);
  }

  &.active-primary {
    color: white;
    font-weight: 500;
    background: #00b8ff;
    box-shadow: 0 0 10px rgba(0, 184, 255, 0.7);
    border-color: #00b8ff;
  }
  &.active-deep-orange {
    color: white;
    font-weight: 500;
    background: #FF5722;
    box-shadow: 0 0 10px #FF5722;
    border-color: #FF5722;
  }
  &.active-light-blue-7 {
    color: white;
    font-weight: 500;
    background: #039BE5;
    box-shadow: 0 0 10px #039BE5;
    border-color: #039BE5;
  }
  &.active-positive {
    color: white;
    font-weight: 500;
    background: #26A69A;
    box-shadow: 0 0 10px #26A69A;
    border-color: #26A69A;
  }
}

.patient-card {
  cursor: pointer;
  border-left-width: 5px;
  border-left-style: solid;
  height: 100%;
}

.border-orange { border-left-color: #FF5722; }
.border-blue { border-left-color: #039BE5; }
.border-green { border-left-color: #26A69A; }
.border-grey { border-left-color: #9E9E9E; }

.no-data-card {
  border: 2px dashed rgba(0, 184, 255, 0.2);
}
.placeholder-icon {
  color: rgba(0, 184, 255, 0.3);
}

.themed-table {
  background-color: rgba(38, 50, 56, 0.5);
  backdrop-filter: blur(5px);
  border-radius: 12px;
  border: 1px solid rgba(0, 184, 255, 0.2);
}

.themed-table :deep(.q-table__container) {
  background: transparent !important;
  border-radius: 12px;
}

.themed-table :deep(thead tr th) {
  color: #ffffff;
  background-color: rgba(0, 184, 255, 0.1);
  border-bottom: 1px solid rgba(0, 184, 255, 0.2);
  font-size: 0.85rem;
  font-weight: bold;
}

.themed-table :deep(.table-row-item) {
  cursor: pointer;
  border-bottom: 1px solid rgba(0, 184, 255, 0.1);
  transition: background-color 0.2s, box-shadow 0.2s, transform 0.2s;
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background-color: rgba(0, 184, 255, 0.1) !important;
    transform: scale(1.01);
  }
}

.themed-table :deep(tbody td) {
  vertical-align: middle;
}

.cell-content {
  display: flex;
  align-items: center;
  height: 100%;
}

.pagination-container {
  background-color: rgba(38, 50, 56, 0.5);
  backdrop-filter: blur(5px);
  border-radius: 50px;
  padding: 8px;
  display: inline-block;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border: 1px solid rgba(0, 184, 255, 0.2);
}

:deep(.q-pagination .q-btn) {
  border-radius: 50px !important;
  background-color: transparent !important;
  color: #00b8ff !important;
  font-weight: bold;
  transition: all 0.3s ease;
}
:deep(.q-pagination .q-btn:not(.q-btn--active):hover) {
  background-color: rgba(0, 184, 255, 0.1) !important;
}
:deep(.q-pagination .q-btn.q-btn--active) {
  background-color: #00b8ff !important;
  color: white !important;
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(0, 184, 255, 0.4);
}

.tooltip-glassy {
  background: rgba(38, 50, 56, 0.8);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(0, 184, 255, 0.2);
  color: white;
}

.view-toggle {
  border-radius: 8px;
  border: 1px solid rgba(0, 184, 255, 0.3);
}

:deep(.q-field--outlined.q-field--dark .q-field__control) {
  background-color: rgba(20, 38, 51, 0.7) !important;
  border-color: rgba(0, 184, 255, 0.2) !important;
  color: #e0e0e0 !important;
  transition: border-color 0.3s, box-shadow 0.3s, background-color 0.3s;
}

:deep(.q-field--outlined.q-field--dark .q-field__native) {
  color: #e0e0e0 !important;
}

:deep(.q-field--outlined.q-field--dark .q-field__native::placeholder) {
  color: #90a4ae !important;
  opacity: 0.8;
}

:deep(.q-field--outlined.q-field--dark .q-field__prepend) {
  color: #00b8ff !important;
}

:deep(.q-field--outlined.q-field--dark .q-field__control:hover) {
  border-color: rgba(0, 184, 255, 0.5) !important;
}

:deep(.q-field--outlined.q-field--dark.q-field--focused .q-field__control) {
  border-color: #00b8ff !important;
  box-shadow: 0 0 10px rgba(0, 184, 255, 0.6) !important;
}

/* --- UPDATED: New Status Chip Styles --- */
.status-chip-display {
  min-width: 140px;
  border-radius: 8px;
  font-weight: 500;
  color: white;
  transition: all 0.3s ease-in-out;
  position: relative;
  overflow: hidden;

  :deep(.q-chip__content) {
    display: inline-block;
    width: 100%;
    text-align: center;
    position: relative;
    z-index: 2;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 100%;
    background: linear-gradient(
      110deg,
      transparent 40%,
      rgba(255, 255, 255, 0.25) 50%,
      transparent 60%
    );
    transform: translateX(-100%);
    transition: transform 0s;
  }
}

.status-chip-orange {
  background-color: #FF5722;
  border: 1px solid #FF5722;
}
.status-chip-blue {
  background-color: #039BE5;
  border: 1px solid #039BE5;
}
.status-chip-green {
  background-color: #26A69A;
  border: 1px solid #26A69A;
}
.status-chip-grey {
  background-color: #455a64;
  border-color: #78909c;
}

.patient-card:hover .status-chip-display::before,
.table-row-item:hover .status-chip-display::before {
  transform: translateX(100%);
  transition: transform 0.8s ease-in-out;
}

.patient-card:hover .status-chip-display,
.table-row-item:hover .status-chip-display {
  transform: scale(1.05);
}


</style>

<style lang="scss">
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
</style>
