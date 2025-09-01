<template>
  <q-page padding class="dashboard-background">
    <div class="q-pa-md content-wrapper">

      <!-- Header Section -->
      <div class="header-section main-card q-pa-md q-mb-lg row items-center justify-between list-item-animation" style="animation-delay: 0.1s;">
        <div class="row items-center">
          <q-icon name="person_add" size="lg" class="q-mr-md header-icon" />
          <div class="text-h5 text-weight-bold header-title">เพิ่มข้อมูลผู้ป่วยใหม่</div>
        </div>
         <q-btn flat round icon="arrow_back" class="header-action-btn" @click="goBack" @mouseenter="playNextNote">
          <q-tooltip class="tooltip-glassy">กลับไปหน้ารายชื่อ</q-tooltip>
        </q-btn>
      </div>

      <!-- Add Patient Form Card -->
      <q-card class="main-card interactive-card q-mb-lg list-item-animation" style="animation-delay: 0.2s;">
        <q-card-section>
          <div class="section-header">
            <q-icon name="o_description" />
            <span>กรอกรายละเอียดผู้ป่วย</span>
          </div>
          <q-form @submit="submitForm" class="q-gutter-y-md">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-2">
                <q-select
                  dark dense outlined
                  v-model="prefix"
                  label="คำนำหน้า"
                  :options="prefixOptions"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'กรุณาเลือกคำนำหน้า']"
                  @popup-show="playNextNote"
                />
              </div>
              <div class="col-12 col-sm-5">
                <q-input
                  dark dense outlined
                  v-model="firstName"
                  label="ชื่อ"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'กรุณากรอกชื่อ']"
                ><template v-slot:prepend><q-icon name="person_outline" /></template></q-input>
              </div>
              <div class="col-12 col-sm-5">
                <q-input
                  dark dense outlined
                  v-model="lastName"
                  label="นามสกุล"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'กรุณากรอกนามสกุล']"
                ><template v-slot:prepend><q-icon name="person_outline" /></template></q-input>
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-4">
                <q-input
                  dark dense outlined
                  v-model="patientId"
                  label="เลขประจำตัวประชาชน"
                  mask="#############"
                  lazy-rules
                  :rules="[
                    val => val && val.length > 0 || 'กรุณากรอกเลขประจำตัวประชาชน',
                    val => val && val.length === 13 || 'ต้องมี 13 หลัก',
                  ]"
                ><template v-slot:prepend><q-icon name="badge" /></template></q-input>
              </div>
              <div class="col-12 col-sm-4">
                <q-input
                  dark dense outlined
                  v-model="birthDate"
                  label="วันเกิด"
                  mask="##/##/####"
                  fill-mask
                  hint="วัน/เดือน/ปี ค.ศ."
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'กรุณากรอกวันเกิด']"
                >
                  <template v-slot:prepend><q-icon name="cake" /></template>
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="birthDate" mask="DD/MM/YYYY" dark>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="ปิด" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-sm-4">
                <q-input
                  dark dense outlined
                  :model-value="calculatedAge"
                  label="อายุ (ปี)"
                  readonly
                ><template v-slot:prepend><q-icon name="o_schedule" /></template></q-input>
              </div>
            </div>

            <div class="row">
              <div class="col-12">
                <q-input
                  dark dense outlined
                  type="textarea"
                  v-model="address"
                  label="ที่อยู่"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'กรุณากรอกที่อยู่']"
                ><template v-slot:prepend><q-icon name="o_home" /></template></q-input>
              </div>
            </div>

            <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                 <!-- SELECT สำหรับโรคประจำตัว -->
                 <q-select
                    ref="underlyingDiseasesSelect"
                    dark dense outlined
                    v-model="underlyingDiseases"
                    label="โรคประจำตัว"
                    :options="underlyingDiseaseOptions"
                    multiple use-chips use-input
                    @new-value="(val, done) => createValue(val, done, masterUnderlyingDiseaseOptions, underlyingDiseases, newUnderlyingDiseases)"
                    @filter="filterUnderlyingDiseases"
                    hint="เลือกหรือพิมพ์เพิ่ม (ใช้ , คั่นหลายรายการ)"
                  >
                    <template v-slot:prepend><q-icon name="o_coronavirus" /></template>
                    <!-- SLOT สำหรับการแสดงผลแต่ละรายการใน Dropdown -->
                    <template v-slot:option="scope">
                      <q-item v-bind="scope.itemProps" :class="{ 'new-item-highlight': newUnderlyingDiseases.includes(scope.opt) }">
                        <q-item-section>
                          <q-item-label>{{ scope.opt }}</q-item-label>
                        </q-item-section>
                        <!-- แสดงป้าย 'New' สำหรับรายการที่เพิ่งเพิ่มเข้ามา -->
                        <q-item-section side v-if="newUnderlyingDiseases.includes(scope.opt)">
                          <q-badge label="New" color="info" />
                        </q-item-section>
                      </q-item>
                    </template>
                    <!-- SLOT สำหรับแสดงตัวเลือก 'เพิ่ม' เมื่อไม่พบรายการที่ค้นหา -->
                    <template v-slot:no-option="scope">
                      <q-item v-if="scope.inputValue.length > 0" clickable @click="addNewValue(scope, masterUnderlyingDiseaseOptions, underlyingDiseases, newUnderlyingDiseases, underlyingDiseasesSelect)">
                        <q-item-section>
                          <q-item-label><q-icon name="add_circle_outline" class="q-mr-sm" />เพิ่ม: "{{ scope.inputValue }}"</q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
                <div class="col-12 col-sm-6">
                  <q-select
                    dark dense outlined
                    v-model="bloodGroup"
                    label="กรุ๊ปเลือด"
                    :options="bloodGroupOptions"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'กรุณาเลือกกรุ๊ปเลือด']"
                     @popup-show="playNextNote"
                  ><template v-slot:prepend><q-icon name="o_bloodtype" /></template></q-select>
                </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <!-- SELECT สำหรับการแพ้ยา -->
                <q-select
                  ref="drugAllergiesSelect"
                  dark dense outlined
                  v-model="drugAllergies"
                  label="ประวัติการแพ้ยา"
                  :options="drugAllergyOptions"
                  multiple use-chips use-input
                  @new-value="(val, done) => createValue(val, done, masterDrugAllergyOptions, drugAllergies, newDrugAllergies)"
                  @filter="filterDrugAllergies"
                  hint="เลือกหรือพิมพ์เพิ่ม (ใช้ , คั่นหลายรายการ)"
                >
                  <template v-slot:prepend><q-icon name="o_medication" /></template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps" :class="{ 'new-item-highlight': newDrugAllergies.includes(scope.opt) }">
                      <q-item-section>
                        <q-item-label>{{ scope.opt }}</q-item-label>
                      </q-item-section>
                      <q-item-section side v-if="newDrugAllergies.includes(scope.opt)">
                        <q-badge label="New" color="info" />
                      </q-item-section>
                    </q-item>
                  </template>
                   <template v-slot:no-option="scope">
                    <q-item v-if="scope.inputValue.length > 0" clickable @click="addNewValue(scope, masterDrugAllergyOptions, drugAllergies, newDrugAllergies, drugAllergiesSelect)">
                      <q-item-section>
                        <q-item-label><q-icon name="add_circle_outline" class="q-mr-sm" />เพิ่ม: "{{ scope.inputValue }}"</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div class="col-12 col-sm-6">
                <!-- SELECT สำหรับการแพ้อาหาร -->
                <q-select
                  ref="foodAllergiesSelect"
                  dark dense outlined
                  v-model="foodAllergies"
                  label="ประวัติการแพ้อาหาร"
                  :options="foodAllergyOptions"
                  multiple use-chips use-input
                  @new-value="(val, done) => createValue(val, done, masterFoodAllergyOptions, foodAllergies, newFoodAllergies)"
                  @filter="filterFoodAllergies"
                  hint="เลือกหรือพิมพ์เพิ่ม (ใช้ , คั่นหลายรายการ)"
                >
                  <template v-slot:prepend><q-icon name="o_restaurant" /></template>
                   <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps" :class="{ 'new-item-highlight': newFoodAllergies.includes(scope.opt) }">
                      <q-item-section>
                        <q-item-label>{{ scope.opt }}</q-item-label>
                      </q-item-section>
                      <q-item-section side v-if="newFoodAllergies.includes(scope.opt)">
                        <q-badge label="New" color="info" />
                      </q-item-section>
                    </q-item>
                  </template>
                   <template v-slot:no-option="scope">
                    <q-item v-if="scope.inputValue.length > 0" clickable @click="addNewValue(scope, masterFoodAllergyOptions, foodAllergies, newFoodAllergies, foodAllergiesSelect)">
                      <q-item-section>
                        <q-item-label><q-icon name="add_circle_outline" class="q-mr-sm" />เพิ่ม: "{{ scope.inputValue }}"</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
            </div>

            <q-separator class="q-my-md" dark/>

            <div class="row justify-end q-pt-sm">
              <q-btn class="save-btn" label="บันทึกข้อมูลผู้ป่วย" type="submit" icon="save" @mouseenter="playNextNote"/>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import * as Tone from 'tone';
import { ref, computed } from 'vue';
import axios from 'axios';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

// --- Tone.js Sound Engine ---
const meloSynth = new Tone.FMSynth({
    harmonicity: 3.1,
    modulationIndex: 20,
    envelope: { attack: 0.001, decay: 0.1, sustain: 0.1, release: 0.8 },
    modulationEnvelope: { attack: 0.01, decay: 0.5, sustain: 0, release: 0.8 },
}).toDestination();
meloSynth.volume.value = -10;
const noteSequence = [ { note: 'C4', duration: '4n' }, { note: 'E4', duration: '4n' }, { note: 'G4', duration: '4n' }, { note: 'C5', duration: '2n' }];
const noteIndex = ref(0);
const isSoundPlaying = ref(false);

const playNextNote = () => {
  if (isSoundPlaying.value) return;
  if (Tone.context.state !== 'running') { Tone.context.resume(); }
  isSoundPlaying.value = true;
  const { note, duration } = noteSequence[noteIndex.value];
  if (note) { meloSynth.triggerAttackRelease(note, duration); }
  const delay = Tone.Time(duration).toMilliseconds();
  setTimeout(() => { isSoundPlaying.value = false; }, delay);
  noteIndex.value = (noteIndex.value + 1) % noteSequence.length;
};
// --- END Tone.js Sound Engine ---

const $q = useQuasar();
const router = useRouter();

// Form Models
const prefix = ref(null);
const firstName = ref(null);
const lastName = ref(null);
const patientId = ref(null);
const birthDate = ref(null);
const address = ref(null);
const bloodGroup = ref(null);
const underlyingDiseases = ref([]);
const drugAllergies = ref([]);
const foodAllergies = ref([]);

// Template Refs for Selects
const underlyingDiseasesSelect = ref(null);
const drugAllergiesSelect = ref(null);
const foodAllergiesSelect = ref(null);

// State for tracking newly added items for highlighting
const newUnderlyingDiseases = ref([]);
const newDrugAllergies = ref([]);
const newFoodAllergies = ref([]);

// Select Options
const prefixOptions = ['เด็กชาย', 'เด็กหญิง', 'นาย', 'นาง', 'นางสาว'];
const bloodGroupOptions = ['A', 'B', 'AB', 'O'];

const masterUnderlyingDiseaseOptions = ref(['ความดันโลหิตสูง', 'เบาหวาน', 'โรคหัวใจ', 'ไขมันในเลือดสูง', 'โรคไต', 'หอบหืด']);
const underlyingDiseaseOptions = ref([...masterUnderlyingDiseaseOptions.value]);

const masterDrugAllergyOptions = ref(['Penicillin', 'Aspirin', 'Sulfa', 'Ibuprofen', 'Codeine']);
const drugAllergyOptions = ref([...masterDrugAllergyOptions.value]);

const masterFoodAllergyOptions = ref(['อาหารทะเล', 'กุ้ง', 'ปู', 'ถั่วลิสง', 'นมวัว', 'ไข่']);
const foodAllergyOptions = ref([...masterFoodAllergyOptions.value]);

// Computed Age
const calculatedAge = computed(() => {
  if (birthDate.value && /^\d{2}\/\d{2}\/\d{4}$/.test(birthDate.value)) {
    try {
      const birthDateParts = birthDate.value.split('/');
      const birthDateObj = new Date(+birthDateParts[2], birthDateParts[1] - 1, +birthDateParts[0]);
      if (isNaN(birthDateObj.getTime())) return null;
      const ageInMilliseconds = Date.now() - birthDateObj.getTime();
      const ageInYears = Math.floor(ageInMilliseconds / 31557600000);
      return ageInYears >= 0 ? ageInYears : null;
    } catch (error) {
      console.error("Error calculating age:", error);
      return null;
    }
  }
  return null;
});

// Generic function to process new items
const processNewItems = (text, optionsList, modelRef, newItemsRef) => {
  const newItems = text.split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0);

  const actuallyAdded = [];
  newItems.forEach(newItem => {
    if (!optionsList.value.includes(newItem)) {
      optionsList.value.push(newItem);
    }
    if (!modelRef.value.includes(newItem)) {
      modelRef.value.push(newItem);
      actuallyAdded.push(newItem);
      if (!newItemsRef.value.includes(newItem)) {
        newItemsRef.value.push(newItem);
      }
    }
  });

  // [REQUIREMENT 1] แสดงการแจ้งเตือน (Notification) เมื่อมีการเพิ่มรายการใหม่จริงๆ
  if (actuallyAdded.length > 0) {
    const message = actuallyAdded.length === 1
      ? `เพิ่มรายการ '${actuallyAdded[0]}' สำเร็จ`
      : `เพิ่ม ${actuallyAdded.length} รายการสำเร็จ`;

    $q.notify({
      color: 'positive',
      textColor: 'white',
      icon: 'check_circle',
      message: message,
      position: 'top-right',
      timeout: 2000
    });
  }
};


// Function for the @new-value event (when user presses Enter)
const createValue = (val, done, optionsList, modelRef, newItemsRef) => {
  processNewItems(val, optionsList, modelRef, newItemsRef);
  // เมื่อกด Enter จะไม่ซ่อน popup เพื่อให้ผู้ใช้เพิ่มต่อได้
  // และปล่อยให้ค่าที่พิมพ์ค้างไว้ เผื่อผู้ใช้ต้องการแก้ไข
  done(null);
};

// Function for the clickable "Add" item in the dropdown
const addNewValue = (scope, optionsList, modelRef, newItemsRef, selectRef) => {
  // 1. เรียกใช้ฟังก์ชันกลางเพื่อเพิ่มรายการ, แสดง notification, และตั้งค่า highlight
  processNewItems(scope.inputValue, optionsList, modelRef, newItemsRef);

  // 2. ล้างค่าที่พิมพ์ในช่อง input ของ select
  scope.updateInputValue('');

  // [REQUIREMENT 2] ซ่อน Dropdown (หุบเมนู) หลังจากเพิ่มรายการสำเร็จ
  if (selectRef && selectRef.value) {
    selectRef.value.hidePopup();
  }
};


// Functions for filtering select options
const filterFn = (val, update, masterOptions, currentOptions) => {
  update(() => {
    if (val === '') {
      currentOptions.value = masterOptions.value;
    } else {
      const needle = val.toLowerCase();
      currentOptions.value = masterOptions.value.filter(v => v.toLowerCase().indexOf(needle) > -1);
    }
  });
};
const filterUnderlyingDiseases = (val, update) => filterFn(val, update, masterUnderlyingDiseaseOptions, underlyingDiseaseOptions);
const filterDrugAllergies = (val, update) => filterFn(val, update, masterDrugAllergyOptions, drugAllergyOptions);
const filterFoodAllergies = (val, update) => filterFn(val, update, masterFoodAllergyOptions, foodAllergyOptions);


const submitForm = async () => {
  try {
    const data = {
      prefix: prefix.value || null,
      firstName: firstName.value || null,
      lastName: lastName.value || null,
      patientId: patientId.value || null,
      birthDate: birthDate.value ? birthDate.value.split('/').reverse().join('-') : null,
      age: calculatedAge.value,
      address: address.value || null,
      bloodGroup: bloodGroup.value || null,
      underlyingDiseases: (underlyingDiseases.value.length > 0) ? underlyingDiseases.value.join(', ') : 'ไม่มี',
      drugAllergies: (drugAllergies.value.length > 0) ? drugAllergies.value.join(', ') : 'ไม่มี',
      foodAllergies: (foodAllergies.value.length > 0) ? foodAllergies.value.join(', ') : 'ไม่มี',
    };

    console.log('Submitting data:', data);
    // const res = await axios.post('http://localhost:3000/api/patients', data);
    // console.log('Patient created:', res.data);

    $q.notify({
      type: 'positive',
      message: 'เพิ่มข้อมูลผู้ป่วยสำเร็จ',
      icon: 'check_circle',
      position: 'top'
    });

    router.push('/patient-list');
  } catch (error) {
    console.error('Error adding patient:', error);
    $q.notify({
      type: 'negative',
      message: 'เกิดข้อผิดพลาด: ' + (error.response?.data?.message || error.message),
      icon: 'error',
      position: 'top'
    });
  }
};

const goBack = () => {
    router.go(-1);
}
</script>

<style scoped>
/* --- FONT & BASE --- */
.dashboard-background {
  background-color: #0d1a26;
  font-family: 'Sarabun', sans-serif;
  color: #e0e0e0;
}

.content-wrapper {
  position: relative;
  z-index: 2;
}

/* --- HEADER --- */
.header-icon {
  color: #38bdf8;
  text-shadow: 0 0 12px #38bdf8;
}

.header-title {
  color: #ffffff;
  text-shadow: 0 0 8px rgba(56, 189, 248, 0.7);
}

.header-action-btn {
  border: 1px solid rgba(56, 189, 248, 0.4);
  color: #94a3b8;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.header-action-btn:hover {
  background-color: rgba(56, 189, 248, 0.2);
  color: white;
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.5);
  transform: scale(1.1);
}

/* --- GLASSMORPHISM CARD --- */
.main-card {
  background-color: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 16px;
  border: 1px solid rgba(100, 116, 139, 0.3);
  color: #e0e0e0;
  transition: all 0.3s ease;
}

.interactive-card:hover {
  border-color: rgba(56, 189, 248, 0.5);
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.3);
}

/* --- SECTION HEADER --- */
.section-header {
  font-size: 1.25rem;
  font-weight: 600;
  color: #f1f5f9;
  padding-bottom: 12px;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(100, 116, 139, 0.3);
  display: flex;
  align-items: center;
}

.section-header .q-icon {
  font-size: 1.8rem;
  margin-right: 12px;
  color: #38bdf8;
}

/* --- FORM ELEMENTS --- */
:deep(.q-field--outlined.q-field--dark .q-field__control) {
  background: rgba(56, 189, 248, 0.05) !important;
  border-color: rgba(100, 116, 139, 0.5) !important;
  transition: all 0.3s ease;
}

:deep(.q-field--dark .q-field__label) {
  color: #94a3b8 !important;
}

:deep(.q-field--outlined.q-field--dark.q-field--focused .q-field__control) {
  background: rgba(56, 189, 248, 0.1) !important;
  border-color: #38bdf8 !important;
  box-shadow: 0 0 8px rgba(56, 189, 248, 0.4);
}

/* [REQUIREMENT 3] สไตล์สำหรับไฮไลท์รายการใหม่ */
.new-item-highlight {
  background-color: rgba(56, 189, 248, 0.15) !important;
  border-left: 3px solid #38bdf8;
}

/* --- BUTTONS --- */
.save-btn {
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  transition: all 0.3s ease;
  background-color: #10b981;
  box-shadow: 0 4px 15px -5px rgba(16, 185, 129, 0.5);
  animation: pulse-green 2.5s infinite;
}
.save-btn:hover {
  background-color: #34d399;
  box-shadow: 0 6px 20px -5px rgba(52, 211, 153, 0.6);
  transform: translateY(-2px);
  animation-play-state: paused;
}

@keyframes pulse-green {
  0% { box-shadow: 0 4px 15px -5px rgba(16, 185, 129, 0.5); }
  50% { box-shadow: 0 4px 25px -2px rgba(16, 185, 129, 0.7); }
  100% { box-shadow: 0 4px 15px -5px rgba(16, 185, 129, 0.5); }
}

.tooltip-glassy {
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(100, 116, 139, 0.3);
  color: white;
}

/* --- ANIMATIONS --- */
@keyframes fadeInSlideUp {
  from { opacity: 0; transform: translateY(25px); }
  to { opacity: 1; transform: translateY(0); }
}

.list-item-animation {
  animation: fadeInSlideUp 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
  opacity: 0;
}
</style>
