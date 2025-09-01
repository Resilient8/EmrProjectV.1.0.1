<template>
<q-page class="dashboard-background">
  <div class="q-pa-lg">

    <q-card class="main-card q-mb-lg">
      <q-card-section>
        <div class="row items-center q-gutter-md">
          <div class="col-xs-12 col-sm">
            <div class="text-h5 text-weight-bold header-title">ทะเบียนผู้ป่วย</div>
          </div>
          <div class="col-xs-12 col-sm-auto">
            <q-btn-toggle
              v-model="viewMode"
              @update:model-value="playNextNote"
              @mouseenter="playNextNote"
              unelevated rounded
              toggle-color="primary"
              color="rgba(0, 184, 255, 0.1)" text-color="primary"
              :options="[{icon: 'o_grid_view', value: 'cards'}, {icon: 'o_view_list', value: 'table'}]"
            />
          </div>
          <div class="col-xs-12 col-sm-auto">
            <q-btn icon="o_person_add" label="เพิ่มผู้ป่วยใหม่" @click="() => { addPatient(); playNextNote(); }" @mouseenter="playNextNote" class="logout-btn" flat no-caps rounded />
          </div>
        </div>
      </q-card-section>
      <q-separator dark />
      <q-card-section>
        <div class="row items-center q-gutter-sm">
          <div class="text-caption welcome-text q-mr-sm">สถานะการรักษา:</div>
          <q-btn
            v-for="option in treatmentStatusOptions"
            :key="option.value || 'all'"
            :label="option.label"
            @click="() => { statusFilter = option.value; playNextNote(); }"
            @mouseenter="playNextNote"
            :color="statusFilter === option.value ? 'primary' : 'blue-grey-10'"
            :text-color="statusFilter === option.value ? 'white' : 'blue-grey-3'"
            unelevated no-caps rounded padding="xs md"
          />
          <q-space />
          <q-btn :icon="showAdvancedFilters ? 'o_filter_alt_off' : 'o_filter_alt'" @click="() => { showAdvancedFilters = !showAdvancedFilters; playNextNote(); }" @mouseenter="playNextNote" flat no-caps dense round color="welcome-text">
            <q-tooltip class="tooltip-glassy">ตัวกรองเพิ่มเติม</q-tooltip>
          </q-btn>
        </div>
        <q-slide-transition>
          <div v-show="showAdvancedFilters" class="q-mt-md">
            <q-separator dark spaced />
            <div class="row q-col-gutter-md">
              <div class="col-sm-6 col-md-grow">
                <q-input
                  dark v-model="searchQuery" dense outlined placeholder="ค้นหาจาก HN, ชื่อ, นามสกุล..." clearable
                  @clear="playClearSound"
                >
                  <template v-slot:prepend><q-icon name="o_search"/></template>
                </q-input>
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-select
                  dark v-model="sortBy" :options="sortOptions" label="จัดเรียงตาม" dense outlined emit-value map-options
                  @update:model-value="playNextNote"
                  @popup-show="playNextNote"
                />
              </div>
              <div class="col-12 col-sm-4 col-md-2">
                <q-select
                  dark v-model="selectedSex" :options="sexOptions" label="เพศ" dense outlined emit-value map-options stack-label
                  @update:model-value="playNextNote"
                  @popup-show="playNextNote"
                />
              </div>
              <div class="col-12 col-sm-4 col-md-2">
                <q-select
                  dark v-model="hasUnderlyingDisease" :options="underlyingDiseaseOptions" label="โรคประจำตัว" dense outlined emit-value map-options stack-label
                  @update:model-value="playNextNote"
                  @popup-show="playNextNote"
                />
              </div>
              <div class="col-12 col-sm-4 col-md-2">
                <q-select
                  dark v-model="selectedAgeRange" :options="ageRangeOptions" label="ช่วงอายุ" dense outlined emit-value map-options stack-label
                  @update:model-value="playNextNote"
                  @popup-show="playNextNote"
                />
              </div>
            </div>
          </div>
        </q-slide-transition>
      </q-card-section>
    </q-card>

    <div v-if="!loading && paginatedPatients.length > 0">
      <div v-if="viewMode === 'cards'" class="row q-col-gutter-lg">
        <div v-for="(patient, index) in paginatedPatients" :key="`card-${patient.id}`" class="col-12 col-md-6 col-lg-4 list-item-animation" :style="{ animationDelay: `${index * 0.07}s` }">
          <q-card class="stat-card patient-card" @click="() => { goToPatientRecord(patient); playNextNote(); }" @mouseenter="playNextNote">
              <q-item>
                <q-item-section avatar>
                    <q-avatar :color="getAvatarColor(patient.sex)" text-color="white" :icon="patient.sex === 'ชาย' ? 'o_male' : 'o_female'">
                      <q-badge v-if="patient.isNew" color="red" rounded floating />
                    </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold ellipsis">{{ `${patient.prefix}${patient.firstName} ${patient.lastName}` }}</q-item-label>
                  <q-item-label caption class="welcome-text">HN: {{ patient.hn }} | อายุ: {{ patient.age }} ปี</q-item-label>
                </q-item-section>
                <q-item-section side> <q-btn icon="o_edit" flat round dense color="welcome-text" @click.stop="() => { editPatient(patient); playNextNote(); }" @mouseenter="playNextNote"><q-tooltip class="tooltip-glassy">แก้ไข</q-tooltip></q-btn> </q-item-section>
              </q-item>
              <q-separator dark />
              <q-card-section class="q-pt-sm">
                  <div class="row items-start no-wrap q-mb-sm">
                    <q-icon name="o_warning" :color="patient.allergies ? 'negative' : 'welcome-text'" class="q-mt-xs q-mr-sm" />
                    <div> <div class="text-caption welcome-text">ประวัติการแพ้: <span class="text-weight-medium" :class="patient.allergies ? 'text-negative' : ''">{{ patient.allergies || 'ไม่มี' }}</span></div> </div>
                  </div>
              </q-card-section>
          </q-card>
        </div>
      </div>
      <q-table
        v-else-if="viewMode === 'table'"
        :rows="paginatedPatients" :columns="columns" row-key="id"
        class="themed-table" dark flat
        @row-click="(evt, row) => { goToPatientRecord(row); playNextNote(); }"
      >
        <template v-slot:body="props">
          <q-tr :props="props" @mouseenter="playNextNote" class="list-item-animation" :style="{ animationDelay: `${props.rowIndex * 0.05}s` }">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <template v-if="col.name === 'patientInfo'">
                <q-item class="q-pa-none" dense>
                  <q-item-section avatar>
                    <q-avatar :color="getAvatarColor(props.row.sex)" text-color="white" :icon="props.row.sex === 'ชาย' ? 'o_male' : 'o_female'" size="md">
                      <q-badge v-if="props.row.isNew" color="red" rounded floating />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">{{ `${props.row.prefix}${props.row.firstName} ${props.row.lastName}` }}</q-item-label>
                    <q-item-label caption class="welcome-text">HN: {{ props.row.hn }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-else-if="col.name === 'allergies'">
                <q-chip v-if="props.row.allergies" dense square color="negative" text-color="white" icon="o_warning"> {{ props.row.allergies }} </q-chip>
                <span v-else class="welcome-text">ไม่มี</span>
              </template>
              <template v-else-if="col.name === 'actions'">
                <div class="text-right">
                  <q-btn icon="o_visibility" color="welcome-text" flat round @click.stop="() => { goToPatientRecord(props.row); playNextNote(); }" @mouseenter="playNextNote" dense><q-tooltip class="tooltip-glassy">ดูประวัติ</q-tooltip></q-btn>
                  <q-btn icon="o_edit" color="welcome-text" flat round @click.stop="() => { editPatient(props.row); playNextNote(); }" @mouseenter="playNextNote" dense><q-tooltip class="tooltip-glassy">แก้ไขข้อมูล</q-tooltip></q-btn>
                  <q-btn icon="o_delete" color="red-4" flat round @click.stop="() => { deletePatient(props.row); playNextNote(); }" @mouseenter="playNextNote" dense><q-tooltip class="tooltip-glassy">ลบข้อมูล</q-tooltip></q-btn>
                </div>
              </template>
              <template v-else>
                {{ col.value }}
              </template>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <div v-else-if="!loading && paginatedPatients.length === 0">
      <q-card class="main-card no-data-card">
        <q-card-section class="text-center">
          <q-icon name="o_person_search" size="6em" class="placeholder-icon" />
          <div class="text-h5 welcome-text q-mt-md">ไม่พบข้อมูลผู้ป่วย</div>
          <p class="welcome-text">ลองเปลี่ยนคำค้นหาหรือล้างตัวกรอง</p>
          <q-btn label="ล้างตัวกรอง" @click="clearFilters" flat no-caps color="primary" v-if="activeFilterCount > 0"/>
        </q-card-section>
      </q-card>
    </div>
    <q-inner-loading dark :showing="loading" />
    <div v-if="maxPages > 1" class="row justify-center q-mt-lg">
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
          @update:model-value="playNextNote"
          @mouseenter="playNextNote"
        />
      </div>
    </div>
  </div>
</q-page>
</template>

<script setup>
import * as Tone from 'tone';
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import axios from 'axios';

const meloSynth = new Tone.FMSynth({
    harmonicity: 3.1,
    modulationIndex: 20,
    envelope: { attack: 0.001, decay: 0.1, sustain: 0.1, release: 0.8 },
    modulationEnvelope: { attack: 0.01, decay: 0.5, sustain: 0, release: 0.8 },
}).toDestination();
meloSynth.volume.value = -10;

const clearSoundSynth = new Tone.MetalSynth({
  frequency: 800,
  envelope: {
    attack: 0.001,
    decay: 0.1,
    sustain: 0,
    release: 0.1,
  },
  harmonicity: 5.1,
  modulationIndex: 15,
  resonance: 10000,
  octaves: 2,
}).toDestination();
clearSoundSynth.volume.value = -6;

const noteSequence = [
  { note: 'C4', duration: '4n' }, { note: 'C4', duration: '4n' }, { note: 'G4', duration: '4n' }, { note: 'G4', duration: '4n' },
  { note: 'A4', duration: '4n' }, { note: 'A4', duration: '4n' }, { note: 'G4', duration: '2n' },
  { note: 'F4', duration: '4n' }, { note: 'F4', duration: '4n' }, { note: 'E4', duration: '4n' }, { note: 'E4', duration: '4n' },
  { note: 'D4', duration: '4n' }, { note: 'D4', duration: '4n' }, { note: 'C4', duration: '2n' },
  { note: 'G4', duration: '4n' }, { note: 'G4', duration: '4n' }, { note: 'F4', duration: '4n' }, { note: 'F4', duration: '4n' },
  { note: 'E4', duration: '4n' }, { note: 'E4', duration: '4n' }, { note: 'D4', duration: '2n' },
  { note: 'G4', duration: '4n' }, { note: 'G4', duration: '4n' }, { note: 'F4', duration: '4n' }, { note: 'F4', duration: '4n' },
  { note: 'E4', duration: '4n' }, { note: 'E4', duration: '4n' }, { note: 'D4', duration: '2n' },
  { note: 'C4', duration: '4n' }, { note: 'C4', duration: '4n' }, { note: 'G4', duration: '4n' }, { note: 'G4', duration: '4n' },
  { note: 'A4', duration: '4n' }, { note: 'A4', duration: '4n' }, { note: 'G4', duration: '2n' },
  { note: 'F4', duration: '4n' }, { note: 'F4', duration: '4n' }, { note: 'E4', duration: '4n' }, { note: 'E4', duration: '4n' },
  { note: 'D4', duration: '4n' }, { note: 'D4', duration: '4n' }, { note: 'C4', duration: '2n' },
];
const noteIndex = ref(0);

const isSoundPlaying = ref(false);

const playNextNote = () => {
  if (isSoundPlaying.value) return;

  if (Tone.context.state !== 'running') {
    Tone.context.resume();
  }

  isSoundPlaying.value = true;

  const { note, duration } = noteSequence[noteIndex.value];

  if (note) {
    meloSynth.triggerAttackRelease(note, duration);
  }

  const delay = Tone.Time(duration).toMilliseconds();

  setTimeout(() => {
    isSoundPlaying.value = false;
  }, delay);

  noteIndex.value = (noteIndex.value + 1) % noteSequence.length;
};

const playClearSound = () => {
  if (Tone.context.state !== 'running') {
    Tone.context.resume();
  }
  clearSoundSynth.triggerAttackRelease("C5", "32n");
};

const viewMode = ref('cards');
const router = useRouter();
const $q = useQuasar();
const loading = ref(true);
const patientData = ref([]);
const searchQuery = ref('');
const selectedSex = ref(null);
const selectedAgeRange = ref(null);
const hasUnderlyingDisease = ref(null);
const statusFilter = ref(null);
const currentPage = ref(1);
const rowsPerPage = ref(9);
const showAdvancedFilters = ref(true);

const sortBy = ref('lastVisit-desc');
const sortOptions = ref([
  { label: 'วันที่มาล่าสุด (ใหม่ > เก่า)', value: 'lastVisit-desc' },
  { label: 'วันที่มาล่าสุด (เก่า > ใหม่)', value: 'lastVisit-asc' },
  { label: 'ชื่อผู้ป่วย (ก > ฮ)', value: 'name-asc' },
  { label: 'ชื่อผู้ป่วย (ฮ > ก)', value: 'name-desc' },
  { label: 'อายุ (น้อย > มาก)', value: 'age-asc' },
  { label: 'อายุ (มาก > น้อย)', value: 'age-desc' },
]);
const sexOptions = ref([
  { label: 'ทุกเพศ', value: null },
  { label: 'ชาย', value: 'ชาย' },
  { label: 'หญิง', value: 'หญิง' }
]);
const ageRangeOptions = ref([
  { label: 'ทุกช่วงอายุ', value: null },
  { label: '0-10 ปี', value: '0-10' },
  { label: '11-20 ปี', value: '11-20' },
  { label: '21-30 ปี', value: '21-30' },
  { label: '31-40 ปี', value: '31-40' },
  { label: '41-50 ปี', value: '41-50' },
  { label: '51-60 ปี', value: '51-60' },
  { label: '61+', value: '61-200' }
]);
const underlyingDiseaseOptions = ref([
  { label: 'ทั้งหมด', value: null },
  { label: 'มี', value: true },
  { label: 'ไม่มี', value: false }
]);
const treatmentStatusOptions = ref([
  { label: 'ทั้งหมด', value: null },
  { label: 'รักษาแล้ว', value: 'treated' },
  { label: 'ยังไม่รักษา', value: 'untreated' }
]);

const processedPatientData = computed(() => {
  if (!patientData.value) return [];
  return patientData.value.map((p, index) => ({
    ...p,
    // <<< จุดที่แก้ไข: ใช้ p.patientId แทน p.hn
    hn: p.patientId || `HN${String(10001 + index).padStart(6, '0')}`,
    allergies: p.allergies || (index % 4 === 0 ? 'Penicillin' : null),
    lastVisit: p.lastVisit || new Date(Date.now() - Math.random() * 1e12).toISOString(),
    sex: (p.prefix === 'นาง' || p.prefix === 'นางสาว' || p.prefix === 'เด็กหญิง') ? 'หญิง' : 'ชาย',
    age: p.birthDate ? new Date().getFullYear() - new Date(p.birthDate).getFullYear() : null,
    hasUnderlyingDisease: p.has_disease === 1,
    isNew: p.isNew === undefined ? (p.id % 2 !== 0) : p.isNew
  }));
});

const filteredPatientData = computed(() => {
  let data = processedPatientData.value;
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    data = data.filter(p =>
      (p.hn && p.hn.toLowerCase().includes(q)) ||
      p.firstName.toLowerCase().includes(q) ||
      p.lastName.toLowerCase().includes(q)
    );
  }
  if (statusFilter.value) {
    // This part is commented out as it requires a 'treatmentStatus' field
    // which is not in the current data model.
  }
  if (selectedSex.value) {
    data = data.filter(p => p.sex === selectedSex.value);
  }
  if (hasUnderlyingDisease.value !== null) {
    data = data.filter(p => p.hasUnderlyingDisease === hasUnderlyingDisease.value);
  }
  if (selectedAgeRange.value) {
    data = data.filter(p => {
      if (p.age === null) return false;
      const [min, max] = selectedAgeRange.value.split('-').map(Number);
      return p.age >= min && p.age <= max;
    });
  }
  return data;
});

const sortedAndFilteredData = computed(() => {
  const data = [...filteredPatientData.value];
  const [key, direction] = sortBy.value.split('-');
  data.sort((a, b) => {
    let valA, valB;

    if (key === 'name') {
      valA = `${a.firstName} ${a.lastName}`;
      valB = `${b.firstName} ${b.lastName}`;
      return direction === 'asc' ? valA.localeCompare(valB, 'th') : valB.localeCompare(valA, 'th');
    } else if (key === 'lastVisit') {
      valA = new Date(a.lastVisit).getTime();
      valB = new Date(b.lastVisit).getTime();
    } else {
      valA = a[key];
      valB = b[key];
    }

    if (valA < valB) return direction === 'asc' ? -1 : 1;
    if (valA > valB) return direction === 'asc' ? 1 : -1;
    return 0;
  });
  return data;
});

const maxPages = computed(() => Math.ceil(sortedAndFilteredData.value.length / rowsPerPage.value));
const paginatedPatients = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;
  return sortedAndFilteredData.value.slice(start, start + rowsPerPage.value);
});
const activeFilterCount = computed(() => {
  let count = 0;
  if (searchQuery.value) count++;
  if (selectedSex.value) count++;
  if (selectedAgeRange.value) count++;
  if (hasUnderlyingDisease.value !== null) count++;
  if (statusFilter.value) count++;
  return count;
});

const columns = [
  { name: 'patientInfo', label: 'ผู้ป่วย', align: 'left', field: 'firstName', sortable: false },
  { name: 'age', label: 'อายุ', align: 'center', field: 'age', sortable: true },
  { name: 'sex', label: 'เพศ', align: 'left', field: 'sex', sortable: true },
  { name: 'allergies', label: 'ประวัติการแพ้', align: 'left', field: 'allergies', sortable: true },
  {
    name: 'lastVisit', label: 'วันที่มาล่าสุด', align: 'left', field: 'lastVisit', sortable: true,
    format: (val) => val ? new Date(val).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'
  },
  { name: 'actions', label: '', align: 'right', sortable: false }
];

const loadPatientData = async () => {
  loading.value = true;
  try {
    const res = await axios.get('http://localhost:3000/api/patients');
    const responseData = res.data;
    if (Array.isArray(responseData)) {
      patientData.value = responseData;
    } else if (responseData && Array.isArray(responseData.result)) {
      patientData.value = responseData.result;
    } else {
      patientData.value = [];
    }
  } catch (error) {
    console.error('Error fetching patient data:', error);
    $q.notify({
        type: 'negative',
        message: 'ไม่สามารถโหลดข้อมูลผู้ป่วยได้',
        caption: error.message || 'โปรดลองอีกครั้ง',
        position: 'top-right'
    });
    patientData.value = [];
  } finally {
    setTimeout(() => { // Simulate network delay
        loading.value = false;
    }, 500);
  }
};

const clearFilters = () => {
  searchQuery.value = '';
  selectedSex.value = null;
  selectedAgeRange.value = null;
  hasUnderlyingDisease.value = null;
  statusFilter.value = null;
  sortBy.value = 'lastVisit-desc';
  currentPage.value = 1;
};

const getAvatarColor = (sex) => sex === 'ชาย' ? 'primary' : 'pink';

const goToPatientRecord = (patient) => {
  const index = patientData.value.findIndex(p => p.id === patient.id);
  if (index !== -1) {
    patientData.value[index].isNew = false; // Mark as not new when clicked
  }
  router.push({ name: 'PatientRecords', params: { id: patient.id } });
};

const addPatient = () => router.push({ name: 'AddPatient' });
const editPatient = (p) => router.push({ name: 'AddPatient', query: { id: p.id } });
const deletePatient = (patient) => {
  $q.dialog({
      dark: true,
      title: 'ยืนยันการลบ',
      message: `คุณต้องการลบข้อมูลของ ${patient.prefix}${patient.firstName} ${patient.lastName} ใช่หรือไม่?`,
      cancel: { label: 'ยกเลิก', color: 'grey' },
      ok: { label: 'ยืนยัน', color: 'negative' },
      persistent: true
  }).onOk(async () => {
      try {
          await axios.delete(`http://localhost:3000/api/patients/${patient.id}`);
          await loadPatientData(); // Reload data after deletion
          $q.notify({
              type: 'positive',
              message: 'ลบข้อมูลผู้ป่วยสำเร็จ',
              position: 'top-right'
          });
      } catch (error) {
          console.error('Error deleting patient:', error);
          $q.notify({
              type: 'negative',
              message: 'ไม่สามารถลบข้อมูลผู้ป่วยได้',
              caption: error.message || 'โปรดลองอีกครั้ง',
              position: 'top-right'
          });
      }
  });
};

// Watchers to reset page when filters change
watch([searchQuery, selectedSex, selectedAgeRange, hasUnderlyingDisease, statusFilter, sortBy], () => {
  currentPage.value = 1;
});

onMounted(loadPatientData);

</script>

<style lang="scss" scoped>
/* คัดลอกสไตล์จากหน้า Dashboard มาทั้งหมด */
.dashboard-background {
  background-color: #0d1a26;
  font-family: 'Sarabun', sans-serif;
  color: #e0e0e0;
}

.header-title {
  color: #ffffff;
  text-shadow: 0 0 5px #00b8ff;
}

.welcome-text {
  color: #90a4ae;
}

.logout-btn {
  border: 1px solid #00b8ff;
  color: #00b8ff;
  border-radius: 8px;
  transition: background-color 0.3s, color 0.3s, box-shadow 0.3s;
  &:hover {
    background-color: #00b8ff;
    color: white;
    box-shadow: 0 0 10px #00b8ff;
  }
}

.stat-card, .main-card {
  background-color: rgba(38, 50, 56, 0.5);
  backdrop-filter: blur(5px);
  border-radius: 12px;
  border: 1px solid rgba(0, 184, 255, 0.2);
  box-shadow: none;
  transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s;
  height: 100%;
  color: #e0e0e0;
}

.stat-card:hover, .main-card:hover {
  border-color: rgba(0, 184, 255, 0.5);
  transform: translateY(-4px);
  box-shadow: 0 0 15px rgba(0, 184, 255, 0.2);
}

.patient-card {
  cursor: pointer;
}

.no-data-card {
  border-style: dashed;
  .placeholder-icon {
    color: #37474f;
  }
}

.themed-table {
  background-color: rgba(38, 50, 56, 0.5);
  backdrop-filter: blur(5px);
  border-radius: 12px;
  border: 1px solid rgba(0, 184, 255, 0.2);

  :deep(.q-table__container) {
    background: transparent !important;
  }

  :deep(thead tr th) {
    color: #ffffff;
    background-color: rgba(0, 184, 255, 0.1);
    border-bottom: 1px solid rgba(0, 184, 255, 0.2);
  }

  :deep(tbody tr) {
    cursor: pointer;
    border-bottom: 1px solid rgba(0, 184, 255, 0.1);
    transition: background-color 0.2s, box-shadow 0.2s;
    /* แก้ไขจาก &::last-child เป็น .themed-table :deep(tbody tr:last-child) */
    &:last-child {
      border-bottom: none;
    }
    /* แก้ไขจาก &:hover เป็น .themed-table :deep(tbody tr:hover) */
    &:hover {
      background-color: rgba(0, 184, 255, 0.1) !important;
      box-shadow: inset 0 0 10px rgba(0, 184, 255, 0.2);
    }
  }
}

.tooltip-glassy {
  background: rgba(38, 50, 56, 0.8);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(0, 184, 255, 0.2);
  color: white;
}

/* สไตล์สำหรับ QInput ของ Quasar */
:deep(.q-field--outlined.q-field--dark .q-field__control) {
  background: rgba(0, 184, 255, 0.05) !important; /* พื้นหลังโปร่งแสงออกฟ้าอ่อนๆ */
  border-color: rgba(0, 184, 255, 0.2) !important; /* สีขอบปกติ */
  transition: border-color 0.3s, box-shadow 0.3s; /* เพิ่ม transition */
}

:deep(.q-field--dark .q-field__label) {
  color: #90a4ae !important; /* สี label */
}

/* เพิ่มสไตล์สำหรับ QInput เมื่อถูก hover */
:deep(.q-field--outlined.q-field--dark .q-field__control:hover) {
  border-color: rgba(0, 184, 255, 0.5) !important; /* สีขอบเมื่อ hover */
  box-shadow: 0 0 5px rgba(0, 184, 255, 0.2) !important; /* แสงเรืองเมื่อ hover */
}

/* เพิ่มสไตล์สำหรับ QInput เมื่อถูก focus */
:deep(.q-field--outlined.q-field--dark.q-field--focused .q-field__control) {
  border-color: #00b8ff !important; /* สีขอบเมื่อ focus (Primary color) */
  box-shadow: 0 0 10px rgba(0, 184, 255, 0.6) !important; /* แสงเรืองที่ชัดเจนขึ้นเมื่อ focus */
}

/* สไตล์สำหรับปุ่ม pagination (จากโค้ดเดิม) */
.pagination-container {
  background-color: rgba(38, 50, 56, 0.5); /* Darker background */
  backdrop-filter: blur(5px);
  border-radius: 50px;
  padding: 8px;
  display: inline-block;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border: 1px solid rgba(0, 184, 255, 0.2); /* Blue border */
}

:deep(.q-pagination .q-btn) {
  border-radius: 50px !important;
  background-color: transparent !important;
  color: #00b8ff !important; /* Primary color for inactive buttons */
  font-weight: bold;
  transition: all 0.3s ease;
}
:deep(.q-pagination .q-btn:not(.q-btn--active):hover) {
  background-color: rgba(0, 184, 255, 0.1) !important; /* Subtle hover effect */
}
:deep(.q-pagination .q-btn.q-btn--active) {
  background-color: #00b8ff !important; /* Active button primary color */
  color: white !important;
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(0, 184, 255, 0.4); /* Glowing shadow */
}


@keyframes fadeInSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.list-item-animation {
  animation: fadeInSlideUp 0.5s ease-out forwards;
  opacity: 0;
}
</style>
