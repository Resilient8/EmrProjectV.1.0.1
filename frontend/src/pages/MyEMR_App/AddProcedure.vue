<template>
<q-page padding class="dashboard-background">
  <div class="q-pa-md content-wrapper">

    <div class="header-section main-card q-pa-md q-mb-lg row items-center justify-between list-item-animation" style="animation-delay: 0.1s;">
      <div class="row items-center justify-between no-wrap">
        <div class="row items-center no-wrap">
          <q-icon name="o_feed" size="lg" class="q-mr-md header-icon" />
          <div class="text-h5 text-weight-bold header-title">{{ isEditMode ? 'แก้ไขข้อมูลการรักษา' : 'เพิ่มข้อมูลการรักษา' }}</div>
        </div>
        <q-btn flat round icon="history" class="header-action-btn q-ml-md" @click="toggleHistory">
          <q-tooltip class="tooltip-glassy">ประวัติการบันทึก</q-tooltip>
        </q-btn>
      </div>
      <div class="q-mt-md">
        <div class="text-center text-caption text-grey q-mb-xs">ความสมบูรณ์ของข้อมูลสำคัญ</div>
        <q-linear-progress dark rounded size="15px" :value="formProgress" color="light-blue" class="q-mt-sm progress-bar-animation">
          <div class="absolute-full flex flex-center">
            <q-badge color="transparent" text-color="white" :label="`${(formProgress * 100).toFixed(0)}%`" />
          </div>
        </q-linear-progress>
      </div>
    </div>
    <q-card class="main-card interactive-card q-mb-lg list-item-animation" style="animation-delay: 0.2s;">
      <q-card-section>
        <div class="section-header">
          <q-icon name="o_person_search" />
          <span>ข้อมูลผู้ป่วย</span>
        </div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-select dark dense outlined v-model="selectedPatientIdObject" label="ค้นหาด้วย ID ผู้ป่วย" :options="patientIdOptions" use-input input-debounce="0" @filter="filterPatientId" @update:model-value="(newValue) => { handlePatientSelection(newValue); playSelectionSound(); }" @popup-show="playFormFocusSound" @clear="clearForm" clearable :disable="isEditMode">
              <template v-slot:no-option><q-item><q-item-section class="text-grey">ไม่พบข้อมูล</q-item-section></q-item></template>
            </q-select>
          </div>
          <div class="col-12 col-md-6">
            <q-select dark dense outlined v-model="selectedPatientNameObject" label="ค้นหาด้วยชื่อผู้ป่วย" :options="patientNameOptions" use-input input-debounce="0" @filter="filterPatientName" @update:model-value="(newValue) => { handlePatientSelection(newValue); playSelectionSound(); }" @popup-show="playFormFocusSound" @clear="clearForm" clearable :disable="isEditMode">
              <template v-slot:option="scope"><q-item v-bind="scope.itemProps"><q-item-section><q-item-label>{{ scope.opt.label }}</q-item-label><q-item-label caption>{{ scope.opt.value }}</q-item-label></q-item-section></q-item></template>
              <template v-slot:no-option><q-item><q-item-section class="text-grey">ไม่พบข้อมูล</q-item-section></q-item></template>
            </q-select>
          </div>
        </div>
        <q-slide-transition>
          <div v-if="patientInfo.id" class="patient-details-box q-pa-md q-mt-md">
            <div class="row items-center q-col-gutter-md">
              <div class="col-auto">
                <q-avatar size="70px" color="primary" text-color="white" icon="o_person" class="patient-avatar" />
              </div>
              <div class="col">
                <div class="text-h6 text-white">{{ patientInfo.name }} <span class="text-body1 welcome-text q-ml-sm">(ID: {{ patientInfo.patientId }})</span></div>
                <div class="row items-center q-mt-xs welcome-text q-gutter-x-lg">
                  <div v-if="patientInfo.gender"><strong>เพศ:</strong> {{ patientInfo.gender }}</div>
                  <div v-if="patientInfo.age !== null"><strong>อายุ:</strong> {{ patientInfo.age }} ปี</div>
                </div>
              </div>
              <div class="col-12 col-md-auto">
                <div class="row items-center q-mt-md q-md-mt-none welcome-text q-gutter-x-lg justify-end">
                  <div><strong>โรคประจำตัว:</strong> <span :class="{'text-negative text-weight-bolder': patientInfo.underlyingDiseases !== 'ไม่มี'}">{{ patientInfo.underlyingDiseases }}</span></div>
                  <div><strong>การแพ้ยา:</strong> <span :class="{'text-negative text-weight-bolder': patientInfo.drugAllergies !== 'ไม่มี'}">{{ patientInfo.drugAllergies }}</span></div>
                </div>
              </div>
            </div>
          </div>
        </q-slide-transition>
      </q-card-section>
    </q-card>
    <q-card class="main-card interactive-card q-mb-lg list-item-animation" style="animation-delay: 0.3s;" :class="{ 'form-disabled': isFormLocked }">
      <q-card-section>
          <div class="section-header">
            <q-icon name="monitor_heart" />
            <span>บันทึกสัญญาณชีพ (Vital Signs)</span>
          </div>
          <div class="row q-col-gutter-md q-mb-sm">
            <div class="col-6 col-md-3">
                <q-select dark dense outlined v-model="newVitalSign.temperature" label="อุณหภูมิ (°C) (*)" :options="tempOptions" use-input input-debounce="0" @filter="filterTemp" @new-value="addNewDecimalOption" @blur="event => handleVitalSignBlur(event, 'temperature')" clearable @clear="() => newVitalSign.temperature = null" :class="{'field-filled': newVitalSign.temperature}" @popup-show="playFormFocusSound" @update:model-value="playSelectionSound">
                    <template v-slot:prepend><q-icon name="thermostat" /></template>
                    <template v-slot:no-option><q-item><q-item-section class="text-grey">พิมพ์เพื่อเพิ่มค่า</q-item-section></q-item></template>
                </q-select>
            </div>
            <div class="col-6 col-md-3">
                <q-select dark dense outlined v-model="newVitalSign.pulse" label="ชีพจร (ครั้ง/นาที) (*)" :options="pulseOptions" use-input input-debounce="0" @filter="filterPulse" @new-value="addNewIntegerOption" @blur="event => handleVitalSignBlur(event, 'pulse')" clearable @clear="() => newVitalSign.pulse = null" :class="{'field-filled': newVitalSign.pulse}" @popup-show="playFormFocusSound" @update:model-value="playSelectionSound">
                    <template v-slot:prepend><q-icon name="favorite_border" /></template>
                    <template v-slot:no-option><q-item><q-item-section class="text-grey">พิมพ์เพื่อเพิ่มค่า</q-item-section></q-item></template>
                </q-select>
            </div>
            <div class="col-6 col-md-3">
                <q-select dark dense outlined v-model="newVitalSign.breathing" label="การหายใจ (ครั้ง/นาที) (*)" :options="breathingOptions" use-input input-debounce="0" @filter="filterBreathing" @new-value="addNewIntegerOption" @blur="event => handleVitalSignBlur(event, 'breathing')" clearable @clear="() => newVitalSign.breathing = null" :class="{'field-filled': newVitalSign.breathing}" @popup-show="playFormFocusSound" @update:model-value="playSelectionSound">
                    <template v-slot:prepend><q-icon name="air" /></template>
                    <template v-slot:no-option><q-item><q-item-section class="text-grey">พิมพ์เพื่อเพิ่มค่า</q-item-section></q-item></template>
                </q-select>
            </div>
            <div class="col-6 col-md-3">
                <q-select dark dense outlined v-model="newVitalSign.oxygenSaturation" label="O2 Sat (%)" :options="o2SatOptions" use-input input-debounce="0" @filter="filterO2Sat" @new-value="addNewIntegerOption" @blur="event => handleVitalSignBlur(event, 'oxygenSaturation')" clearable @clear="() => newVitalSign.oxygenSaturation = null" :class="{'field-filled': newVitalSign.oxygenSaturation}" @popup-show="playFormFocusSound" @update:model-value="playSelectionSound">
                    <template v-slot:prepend><q-icon name="o_bloodtype" /></template>
                    <template v-slot:no-option><q-item><q-item-section class="text-grey">พิมพ์เพื่อเพิ่มค่า</q-item-section></q-item></template>
                </q-select>
            </div>
            <div class="col-6 col-md-3">
                <q-select dark dense outlined v-model="newVitalSign.bloodPressureSystolic" label="ความดัน (Systolic) (*)" :options="bpSysOptions" use-input input-debounce="0" @filter="filterBpSys" @new-value="addNewIntegerOption" @blur="event => handleVitalSignBlur(event, 'bloodPressureSystolic')" clearable @clear="() => newVitalSign.bloodPressureSystolic = null" :class="{'field-filled': newVitalSign.bloodPressureSystolic}" @popup-show="playFormFocusSound" @update:model-value="playSelectionSound">
                    <template v-slot:prepend><q-icon name="o_arrow_upward" /></template>
                    <template v-slot:no-option><q-item><q-item-section class="text-grey">พิมพ์เพื่อเพิ่มค่า</q-item-section></q-item></template>
                </q-select>
            </div>
            <div class="col-6 col-md-3">
                <q-select dark dense outlined v-model="newVitalSign.bloodPressureDiastolic" label="ความดัน (Diastolic) (*)" :options="bpDiaOptions" use-input input-debounce="0" @filter="filterBpDia" @new-value="addNewIntegerOption" @blur="event => handleVitalSignBlur(event, 'bloodPressureDiastolic')" clearable @clear="() => newVitalSign.bloodPressureDiastolic = null" :class="{'field-filled': newVitalSign.bloodPressureDiastolic}" @popup-show="playFormFocusSound" @update:model-value="playSelectionSound">
                    <template v-slot:prepend><q-icon name="o_arrow_downward" /></template>
                    <template v-slot:no-option><q-item><q-item-section class="text-grey">พิมพ์เพื่อเพิ่มค่า</q-item-section></q-item></template>
                </q-select>
            </div>
            <div class="col-6 col-md-3">
                <q-select dark dense outlined v-model="newVitalSign.height" label="ส่วนสูง (ซม.)" :options="heightOptions" use-input input-debounce="0" @filter="filterHeight" @new-value="addNewIntegerOption" @blur="event => handleVitalSignBlur(event, 'height')" @update:model-value="() => { calculateBMI(); playSelectionSound(); }" clearable @clear="() => newVitalSign.height = null" :class="{'field-filled': newVitalSign.height}" @popup-show="playFormFocusSound">
                    <template v-slot:prepend><q-icon name="o_height" /></template>
                    <template v-slot:no-option><q-item><q-item-section class="text-grey">พิมพ์เพื่อเพิ่มค่า</q-item-section></q-item></template>
                </q-select>
            </div>
            <div class="col-6 col-md-3">
                <q-select dark dense outlined v-model="newVitalSign.weight" label="น้ำหนัก (กก.)" :options="weightOptions" use-input input-debounce="0" @filter="filterWeight" @new-value="addNewDecimalOption" @blur="event => handleVitalSignBlur(event, 'weight')" @update:model-value="() => { calculateBMI(); playSelectionSound(); }" clearable @clear="() => newVitalSign.weight = null" :class="{'field-filled': newVitalSign.weight}" @popup-show="playFormFocusSound">
                    <template v-slot:prepend><q-icon name="o_scale" /></template>
                    <template v-slot:no-option><q-item><q-item-section class="text-grey">พิมพ์เพื่อเพิ่มค่า</q-item-section></q-item></template>
                </q-select>
            </div>
            <div class="col-6 col-md-3">
                <q-select dark dense outlined v-model="newVitalSign.waist" label="รอบเอว (ซม.)" :options="waistOptions" use-input input-debounce="0" @filter="filterWaist" @new-value="addNewIntegerOption" @blur="event => handleVitalSignBlur(event, 'waist')" clearable @clear="() => newVitalSign.waist = null" :class="{'field-filled': newVitalSign.waist}" @popup-show="playFormFocusSound" @update:model-value="playSelectionSound">
                    <template v-slot:prepend><q-icon name="o_straighten" /></template>
                    <template v-slot:no-option><q-item><q-item-section class="text-grey">พิมพ์เพื่อเพิ่มค่า</q-item-section></q-item></template>
                </q-select>
            </div>
            <div class="col-6 col-md-3"><q-input dark dense outlined v-model="newVitalSign.bmi" label="BMI" readonly :class="{'field-filled': newVitalSign.bmi}"><template v-slot:prepend><q-icon name="o_fitness_center" /></template></q-input></div>
          </div>
          <div v-if="bmiInterpretation" class="q-mt-md">
            <q-banner inline-actions rounded-borders :class="bmiInterpretation.styleClass">
              <template v-slot:avatar><q-icon :name="bmiInterpretation.icon" size="md" /></template>
              <div class="text-weight-bold">{{ bmiInterpretation.title }}</div>
              <div>{{ bmiInterpretation.text }}</div>
            </q-banner>
          </div>
      </q-card-section>
    </q-card>


    <q-card class="main-card interactive-card q-mb-lg list-item-animation" style="animation-delay: 0.4s;" :class="{ 'form-disabled': isFormLocked }">
      <q-card-section>
        <div class="section-header">
          <q-icon name="plagiarism" />
          <span>อาการและการซักประวัติ</span>
        </div>

        <div class="text-subtitle1 welcome-text">อาการสำคัญที่นำมา (Chief Complaint)</div>
        <div class="q-mb-md">
          <q-select
            dark dense outlined ref="symptomSelectRef" v-model="chiefComplaint"
            label="เลือกหรือพิมพ์อาการสำคัญ (*)" multiple use-chips use-input
            option-label="name"
            v-bind:option-value="opt => opt"
            input-debounce="0"
            @new-value="createSymptom"
            @filter="filterSymptoms"
            :options="symptomOptions"
            :class="{'field-filled': chiefComplaint.length > 0}"
            @popup-show="playFormFocusSound"
            @remove="playRemoveSound"
            @blur="handleSymptomInputBlur"
            hint="พิมพ์อาการแล้วกด Enter หรือเลือกจากโมเดลร่างกาย"
          >
            <template v-slot:no-option>
              <q-item><q-item-section class="text-grey">ไม่พบอาการ, พิมพ์แล้วกด Enter เพื่อเพิ่ม</q-item-section></q-item>
            </template>
          </q-select>
        </div>

        <div v-if="chiefComplaint.length > 0" class="q-mb-md">
          <q-list bordered separator class="themed-list">
            <q-item v-for="(symptom, index) in chiefComplaint" :key="`${symptom.name}-${index}`">
              <q-item-section avatar>
                  <q-icon color="light-blue-4" name="o_sick" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-body1">
                  {{ symptom.name }}
                  <q-badge
                    :class="[`pain-badge--${symptom.level}`, 'cursor-pointer']"
                    class="q-ml-sm"
                    v-if="symptom.level"
                    @click="openPainLevelEditor(symptom)"
                  >
                    {{ symptom.level }}
                    <q-tooltip class="tooltip-glassy">คลิกเพื่อเปลี่ยนระดับ</q-tooltip>
                  </q-badge>
                </q-item-label>
                <q-item-label v-if="symptom.locations && symptom.locations.length" caption>ตำแหน่ง: {{ symptom.locations.join(', ') }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  flat dense
                  :label="symptom.duration || 'ระบุเวลา'"
                  :color="symptom.duration ? 'light-blue' : 'grey-7'"
                  icon-right="o_edit_calendar"
                  @click="openDurationDialog(symptom)"
                  class="duration-btn"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <q-dialog v-model="showDurationDialog" persistent>
          <q-card class="popup-edit-content">
            <q-card-section>
              <div class="text-body1 text-white text-center">อาการของ "{{ symptomToEdit ? symptomToEdit.name : '' }}"</div>
              <div class="text-subtitle2 text-grey text-center q-mb-sm">เริ่มเป็นมานานเท่าไหร่แล้ว?</div>
              <div class="row q-col-gutter-sm items-center">
                <div class="col-6">
                  <q-input dark autofocus dense type="number" v-model.number="durationNumber" label="จำนวน" />
                </div>
                <div class="col-6">
                  <q-select dark dense outlined v-model="durationUnit" :options="durationUnitOptions" label="หน่วยเวลา" />
                </div>
              </div>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="ยกเลิก" v-close-popup color="white" />
              <q-btn label="บันทึก" color="primary" @click="saveDuration" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog v-model="painLevelDialog.show" persistent>
          <q-card class="popup-edit-content" style="min-width: 350px;">
            <q-card-section>
              <div class="text-body1 text-white text-center">
                เปลี่ยนระดับอาการสำหรับ "{{ painLevelDialog.symptomToEdit ? painLevelDialog.symptomToEdit.name : '' }}"
              </div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <q-option-group
                v-model="painLevelDialog.selectedLevel"
                :options="painLevelOptions"
                color="primary"
                type="radio"
                dark
              />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="ยกเลิก" v-close-popup color="white" />
              <q-btn label="บันทึก" color="primary" @click="savePainLevel" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <div class="text-subtitle1 welcome-text q-mt-lg">ระบุตำแหน่งที่มีอาการ</div>

        <div class="q-my-md row justify-center">
           <q-btn-group rounded class="view-toggle-btn-group">
            <q-btn
              :class="modelView === 'front' ? 'active' : ''"
              @click="modelView = 'front'"
              label="ด้านหน้า"
              icon="o_person"
            />
            <q-btn
              :class="modelView === 'back' ? 'active' : ''"
              @click="modelView = 'back'"
              label="ด้านหลัง"
              icon="o_accessibility_new"
            />
          </q-btn-group>
        </div>

        <div class="body-model-wrapper q-pa-md">
            <div class="body-model-container">
              <svg id="human-body" viewBox="0 0 450 480" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="injury-glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" style="stop-color:rgb(255,150,150);stop-opacity:1" />
                    <stop offset="100%" style="stop-color:rgb(200,0,0);stop-opacity:1" />
                  </radialGradient>
                  <radialGradient id="pain-glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" style="stop-color:rgb(255, 200, 130);stop-opacity:1" />
                    <stop offset="100%" style="stop-color:rgb(249, 115, 22);stop-opacity:1" />
                  </radialGradient>
                  <radialGradient id="irritation-glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" style="stop-color:rgb(255, 255, 170);stop-opacity:1" />
                    <stop offset="100%" style="stop-color:rgb(234, 179, 8);stop-opacity:1" />
                  </radialGradient>
                </defs>

                <g id="body-parts-front" v-if="modelView === 'front'">
                    <path class="body-part" id="head-upper-left" @click="showSymptomSelector('head-upper-left', 'หน้าผาก (ซ้าย)')" :class="getPainLevelClass('head-upper-left')" d="M225,20 C185,20 170,50 170,90 H225 V20 Z" />
                    <path class="body-part" id="head-upper-right" @click="showSymptomSelector('head-upper-right', 'หน้าผาก (ขวา)')" :class="getPainLevelClass('head-upper-right')" d="M225,20 C265,20 280,50 280,90 H225 V20 Z" />
                    <path class="body-part" id="head-lower-left" @click="showSymptomSelector('head-lower-left', 'ใบหน้า (ซ้าย)')" :class="getPainLevelClass('head-lower-left')" d="M170,90 C170,130 190,145 225,145 V90 H170 Z" />
                    <path class="body-part" id="head-lower-right" @click="showSymptomSelector('head-lower-right', 'ใบหน้า (ขวา)')" :class="getPainLevelClass('head-lower-right')" d="M280,90 C280,130 260,145 225,145 V90 H280 Z" />
                    <path class="body-part" id="ear-left" @click="showSymptomSelector('ear-left', 'หู (ซ้าย)')" :class="getPainLevelClass('ear-left')" d="M170,90 a 15 25 0 0 0 -5 25" />
                    <path class="body-part" id="ear-right" @click="showSymptomSelector('ear-right', 'หู (ขวา)')" :class="getPainLevelClass('ear-right')" d="M280,90 a 15 25 0 0 1 5 25" />
                    <path class="body-part" id="eye-left" @click="showSymptomSelector('eye-left', 'ตา (ซ้าย)')" :class="getPainLevelClass('eye-left')" d="M200 95 a 6 6 0 0 1 12 0 a 6 6 0 0 1 -12 0" />
                    <path class="body-part" id="eye-right" @click="showSymptomSelector('eye-right', 'ตา (ขวา)')" :class="getPainLevelClass('eye-right')" d="M238 95 a 6 6 0 0 1 12 0 a 6 6 0 0 1 -12 0" />
                    <path class="body-part" id="nose" @click="showSymptomSelector('nose', 'จมูก')" :class="getPainLevelClass('nose')" d="M223 105 l 2 12 l 2 -12 z" />
                    <path class="body-part" id="mouth" @click="showSymptomSelector('mouth', 'ปาก')" :class="getPainLevelClass('mouth')" d="M215 128 q 10 7 20 0" />
                    <path class="body-part" id="neck" @click="showSymptomSelector('neck', 'คอ')" :class="getPainLevelClass('neck')" d="M215 145 H235 V160 H215 V145Z" />
                    <path class="body-part" id="chest-left" @click="showSymptomSelector('chest-left', 'หน้าอก (ซ้าย)')" :class="getPainLevelClass('chest-left')" d="M190,162 C188,185 195,210 225,210 V160 C210,160 195,160 190,162 Z" />
                    <path class="body-part" id="chest-right" @click="showSymptomSelector('chest-right', 'หน้าอก (ขวา)')" :class="getPainLevelClass('chest-right')" d="M260,162 C262,185 255,210 225,210 V160 C240,160 255,160 260,162 Z" />
                    <path class="body-part" id="abdomen-left" @click="showSymptomSelector('abdomen-left', 'ช่องท้อง (ซ้าย)')" :class="getPainLevelClass('abdomen-left')" d="M225,210 C195,210 188,235 190,260 H225 V210 Z" />
                    <path class="body-part" id="abdomen-right" @click="showSymptomSelector('abdomen-right', 'ช่องท้อง (ขวา)')" :class="getPainLevelClass('abdomen-right')" d="M225,210 C255,210 262,235 260,260 H225 V210 Z" />
                    <path class="body-part" id="arm-left" @click="showSymptomSelector('arm-left', 'แขน (ซ้าย)')" :class="getPainLevelClass('arm-left')" d="M190,165 Q165,170 160,220 L180,225 Q185,180 190,165 Z" />
                    <path class="body-part" id="arm-right" @click="showSymptomSelector('arm-right', 'แขน (ขวา)')" :class="getPainLevelClass('arm-right')" d="M260,165 Q285,170 290,220 L270,225 Q265,180 260,165 Z" />
                    <path class="body-part" id="forearm-left" @click="showSymptomSelector('forearm-left', 'ปลายแขน (ซ้าย)')" :class="getPainLevelClass('forearm-left')" d="M160,220 L150,280 L170,285 L180,225 Z" />
                    <path class="body-part" id="forearm-right" @click="showSymptomSelector('forearm-right', 'ปลายแขน (ขวา)')" :class="getPainLevelClass('forearm-right')" d="M290,220 L300,280 L280,285 L270,225 Z" />
                    <path class="body-part" id="hand-left" @click="showSymptomSelector('hand-left', 'มือ (ซ้าย)')" :class="getPainLevelClass('hand-left')" d="M150,280 L140,310 L170,315 L170,285 Z" />
                    <path class="body-part" id="hand-right" @click="showSymptomSelector('hand-right', 'มือ (ขวา)')" :class="getPainLevelClass('hand-right')" d="M300,280 L310,310 L280,315 L280,285 Z" />
                    <path class="body-part" id="leg-left" @click="showSymptomSelector('leg-left', 'ขา (ซ้าย)')" :class="getPainLevelClass('leg-left')" d="M190,260 L175,350 L215,350 L220,260 Z" />
                    <path class="body-part" id="leg-right" @click="showSymptomSelector('leg-right', 'ขา (ขวา)')" :class="getPainLevelClass('leg-right')" d="M260,260 L275,350 L235,350 L230,260 Z" />
                    <path class="body-part" id="foot-left" @click="showSymptomSelector('foot-left', 'เท้า (ซ้าย)')" :class="getPainLevelClass('foot-left')" d="M175,350 L160,365 L215,365 L215,350 Z" />
                    <path class="body-part" id="foot-right" @click="showSymptomSelector('foot-right', 'เท้า (ขวา)')" :class="getPainLevelClass('foot-right')" d="M275,350 L290,365 L235,365 L235,350 Z" />
                </g>

                <g id="body-parts-back" v-if="modelView === 'back'">
                    <path class="body-part" id="head-back" @click="showSymptomSelector('head-back', 'ศีรษะด้านหลัง')" :class="getPainLevelClass('head-back')" d="M170,90 C170,50 185,20 225,20 C265,20 280,50 280,90 C280,130 260,145 225,145 C190,145 170,130 170,90 Z" />
                    <path class="body-part" id="neck-back" @click="showSymptomSelector('neck-back', 'ต้นคอ')" :class="getPainLevelClass('neck-back')" d="M215 145 H235 V160 H215 V145Z" />
                    <path class="body-part" id="back-upper" @click="showSymptomSelector('back-upper', 'หลังส่วนบน')" :class="getPainLevelClass('back-upper')" d="M190,160 C185,210 265,210 260,160 Z" />
                    <path class="body-part" id="back-lower" @click="showSymptomSelector('back-lower', 'หลังส่วนล่าง/เอว')" :class="getPainLevelClass('back-lower')" d="M190,210 C185,260 265,260 260,210 Z" />
                    <path class="body-part" id="buttocks" @click="showSymptomSelector('buttocks', 'ก้น')" :class="getPainLevelClass('buttocks')" d="M190,260 Q225,270 260,260 L255,265 L195,265 Z" />
                    <path class="body-part" id="arm-left-back" @click="showSymptomSelector('arm-left', 'แขน (ซ้าย)')" :class="getPainLevelClass('arm-left')" d="M190,165 Q165,170 160,220 L180,225 Q185,180 190,165 Z" />
                    <path class="body-part" id="arm-right-back" @click="showSymptomSelector('arm-right', 'แขน (ขวา)')" :class="getPainLevelClass('arm-right')" d="M260,165 Q285,170 290,220 L270,225 Q265,180 260,165 Z" />
                    <path class="body-part" id="forearm-left-back" @click="showSymptomSelector('forearm-left', 'ปลายแขน (ซ้าย)')" :class="getPainLevelClass('forearm-left')" d="M160,220 L150,280 L170,285 L180,225 Z" />
                    <path class="body-part" id="forearm-right-back" @click="showSymptomSelector('forearm-right', 'ปลายแขน (ขวา)')" :class="getPainLevelClass('forearm-right')" d="M290,220 L300,280 L280,285 L270,225 Z" />
                    <path class="body-part" id="hand-left-back" @click="showSymptomSelector('hand-left', 'มือ (ซ้าย)')" :class="getPainLevelClass('hand-left')" d="M150,280 L140,310 L170,315 L170,285 Z" />
                    <path class="body-part" id="hand-right-back" @click="showSymptomSelector('hand-right', 'มือ (ขวา)')" :class="getPainLevelClass('hand-right')" d="M300,280 L310,310 L280,315 L280,285 Z" />
                    <path class="body-part" id="leg-left-back" @click="showSymptomSelector('leg-left', 'ขา (ซ้าย)')" :class="getPainLevelClass('leg-left')" d="M190,260 L175,350 L215,350 L220,260 Z" />
                    <path class="body-part" id="leg-right-back" @click="showSymptomSelector('leg-right', 'ขา (ขวา)')" :class="getPainLevelClass('leg-right')" d="M260,260 L275,350 L235,350 L230,260 Z" />
                    <path class="body-part" id="foot-left-back" @click="showSymptomSelector('foot-left', 'เท้า (ซ้าย)')" :class="getPainLevelClass('foot-left')" d="M175,350 L160,365 L215,365 L215,350 Z" />
                    <path class="body-part" id="foot-right-back" @click="showSymptomSelector('foot-right', 'เท้า (ขวา)')" :class="getPainLevelClass('foot-right')" d="M275,350 L290,365 L235,365 L235,350 Z" />
                </g>

                <g class="body-labels" v-if="modelView === 'front'">
                    <g class="label-group"><line x1="140" y1="50" x2="197" y2="55"/><text x="135" y="50" text-anchor="end">head-upper-left</text></g>
                    <g class="label-group"><line x1="310" y1="50" x2="252" y2="55"/><text x="315" y="50" text-anchor="start">head-upper-right</text></g>
                    <g class="label-group"><line x1="140" y1="120" x2="197" y2="120"/><text x="135" y="120" text-anchor="end">head-lower-left</text></g>
                    <g class="label-group"><line x1="310" y1="120" x2="252" y2="120"/><text x="315" y="120" text-anchor="start">head-lower-right</text></g>
                    <g class="label-group"><line x1="140" y1="105" x2="165" y2="105"/><text x="135" y="105" text-anchor="end">ear-left</text></g>
                    <g class="label-group"><line x1="310" y1="105" x2="285" y2="105"/><text x="315" y="105" text-anchor="start">ear-right</text></g>
                    <g class="label-group"><line x1="170" y1="80" x2="203" y2="95"/><text x="165" y="80" text-anchor="end">eye-left</text></g>
                    <g class="label-group"><line x1="280" y1="80" x2="247" y2="95"/><text x="285" y="80" text-anchor="start">eye-right</text></g>
                    <g class="label-group"><line x1="225" y1="150" x2="225" y2="160"/><text x="225" y="190" text-anchor="middle">neck</text></g>
                    <g class="label-group"><line x1="150" y1="185" x2="175" y2="185"/><text x="145" y="185" text-anchor="end">arm-left</text></g>
                    <g class="label-group"><line x1="300" y1="185" x2="275" y2="185"/><text x="305" y="185" text-anchor="start">arm-right</text></g>
                    <g class="label-group"><line x1="130" y1="255" x2="162" y2="255"/><text x="125" y="255" text-anchor="end">forearm-left</text></g>
                    <g class="label-group"><line x1="320" y1="255" x2="288" y2="255"/><text x="325" y="255" text-anchor="start">forearm-right</text></g>
                    <g class="label-group"><line x1="120" y1="300" x2="150" y2="300"/><text x="115" y="300" text-anchor="end">hand-left</text></g>
                    <g class="label-group"><line x1="330" y1="300" x2="300" y2="300"/><text x="335" y="300" text-anchor="start">hand-right</text></g>
                    <g class="label-group"><line x1="160" y1="310" x2="195" y2="310"/><text x="155" y="310" text-anchor="end">leg-left</text></g>
                    <g class="label-group"><line x1="290" y1="310" x2="255" y2="310"/><text x="295" y="310" text-anchor="start">leg-right</text></g>
                    <g class="label-group"><line x1="150" y1="360" x2="185" y2="360"/><text x="145" y="360" text-anchor="end">foot-left</text></g>
                    <g class="label-group"><line x1="300" y1="360" x2="265" y2="360"/><text x="305" y="360" text-anchor="start">foot-right</text></g>
                    <g class="label-group"><line x1="170" y1="185" x2="205" y2="185"/><text x="165" y="185" text-anchor="end">chest-left</text></g>
                    <g class="label-group"><line x1="280" y1="185" x2="245" y2="185"/><text x="285" y="185" text-anchor="start">chest-right</text></g>
                    <g class="label-group"><line x1="170" y1="235" x2="205" y2="235"/><text x="165" y="235" text-anchor="end">abdomen-left</text></g>
                    <g class="label-group"><line x1="280" y1="235" x2="245" y2="235"/><text x="285" y="235" text-anchor="start">abdomen-right</text></g>
                </g>
              </svg>
            </div>
        </div>

        <q-dialog v-model="bodyPartDialog.show">
            <q-card class="main-card" style="width: 400px;">
                <q-card-section class="bg-primary text-white">
                    <div class="text-h6">ระบุอาการสำหรับ: {{ bodyPartDialog.title }}</div>
                </q-card-section>

                <q-card-section>
                  <div class="text-subtitle1 text-white q-mb-sm">เลือกระดับอาการ:</div>
                  <q-option-group
                    v-model="bodyPartDialog.level"
                    :options="painLevelOptions"
                    color="primary"
                    type="radio"
                    dark
                    inline
                    class="q-mb-md"
                  />

                  <div class="text-subtitle1 text-white q-mb-sm">เลือกอาการ:</div>
                  <q-option-group
                    v-model="bodyPartDialog.selected"
                    :options="bodyPartDialog.options"
                    color="primary"
                    type="checkbox"
                    dark
                  />
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="ยกเลิก" v-close-popup />
                    <q-btn label="ยืนยัน" color="primary" @click="addSymptomsFromModel" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <div class="text-subtitle1 welcome-text q-mt-lg">ชุดอาการสำเร็จรูป (Symptom Templates)</div>
        <div class="row q-gutter-sm q-mb-md">
          <q-btn v-for="(template, name) in symptomTemplates" :key="name"
            unelevated class="symptom-template-btn"
            :label="template.label" :icon="template.icon"
            @click="applySymptomTemplate(name)"
          />
        </div>
        <div class="text-subtitle1 welcome-text q-mt-md">รายละเอียดอาการเพิ่มเติม (Present Illness)</div>
        <q-input dark dense outlined v-model="presentIllness" label="กรอกรายละเอียด หรือเลือกจากคำแนะนำด้านล่าง" type="textarea" autogrow class="q-mb-sm" :class="{'field-filled': presentIllness}" @focus="playFormFocusSound"/>
        <q-slide-transition>
            <div v-if="dynamicSuggestions.length > 0">
              <div class="text-caption text-grey q-mb-xs">คำแนะนำ (คลิกเพื่อเพิ่ม):</div>
              <div class="row q-gutter-sm q-mb-md">
                  <q-chip
                    v-for="suggestion in dynamicSuggestions" :key="suggestion"
                    clickable outline color="light-blue" text-color="white" icon="add_circle_outline"
                    @click="addDetailToIllness(suggestion)"
                    class="suggestion-chip"
                  >
                    {{ suggestion }}
                  </q-chip>
              </div>
            </div>
        </q-slide-transition>
        <q-separator dark class="q-my-lg" />
        <div class="text-subtitle1 welcome-text">การซักประวัติเพิ่มเติมตามระบบ (Review of Systems)</div>
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-6"><q-select dark dense outlined v-model="reviewOfSystems.general" multiple :options="rosOptions.general" use-chips stack-label label="อาการทั่วไป (General)" @popup-show="playFormFocusSound" @update:model-value="playSelectionSound" @remove="playRemoveSound" :class="{'field-filled': reviewOfSystems.general.length > 0}"/></div>
          <div class="col-12 col-md-6"><q-select dark dense outlined v-model="reviewOfSystems.headAndNeck" multiple :options="rosOptions.headAndNeck" use-chips stack-label label="ศีรษะและลำคอ (Head & Neck)" @popup-show="playFormFocusSound" @update:model-value="playSelectionSound" @remove="playRemoveSound" :class="{'field-filled': reviewOfSystems.headAndNeck.length > 0}"/></div>
          <div class="col-12 col-md-6"><q-select dark dense outlined v-model="reviewOfSystems.respiratory" multiple :options="rosOptions.respiratory" use-chips stack-label label="ระบบทางเดินหายใจ (Respiratory)" @popup-show="playFormFocusSound" @update:model-value="playSelectionSound" @remove="playRemoveSound" :class="{'field-filled': reviewOfSystems.respiratory.length > 0}"/></div>
          <div class="col-12 col-md-6"><q-select dark dense outlined v-model="reviewOfSystems.cardiovascular" multiple :options="rosOptions.cardiovascular" use-chips stack-label label="ระบบหัวใจและหลอดเลือด (Cardiovascular)" @popup-show="playFormFocusSound" @update:model-value="playSelectionSound" @remove="playRemoveSound" :class="{'field-filled': reviewOfSystems.cardiovascular.length > 0}"/></div>
          <div class="col-12 col-md-6"><q-select dark dense outlined v-model="reviewOfSystems.gastrointestinal" multiple :options="rosOptions.gastrointestinal" use-chips stack-label label="ระบบทางเดินอาหาร (Gastrointestinal)" @popup-show="playFormFocusSound" @update:model-value="playSelectionSound" @remove="playRemoveSound" :class="{'field-filled': reviewOfSystems.gastrointestinal.length > 0}"/></div>
          <div class="col-12 col-md-6"><q-select dark dense outlined v-model="reviewOfSystems.skin" multiple :options="rosOptions.skin" use-chips stack-label label="ระบบผิวหนัง (Dermatological)" @popup-show="playFormFocusSound" @update:model-value="playSelectionSound" @remove="playRemoveSound" :class="{'field-filled': reviewOfSystems.skin.length > 0}"/></div>
        </div>
      </q-card-section>
    </q-card>

    <q-card class="main-card interactive-card q-mb-xl list-item-animation" style="animation-delay: 0.5s;" :class="{ 'form-disabled': isFormLocked }">
      <q-card-section>
        <div class="section-header">
          <q-icon name="medical_services" />
          <span>การรักษาและการส่งต่อ</span>
        </div>
        <div class="text-subtitle1 welcome-text">ข้อมูลการรักษา</div>
        <div class="row q-col-gutter-sm q-mb-md">
          <div class="col-12 col-md-4"><q-select dark dense outlined v-model="newProcedureItem.service" label="บริการ" :options="serviceOptions" class="q-mb-sm" @popup-show="playFormFocusSound" @update:model-value="playSelectionSound" :class="{'field-filled': newProcedureItem.service}"/></div>
          <div class="col-12 col-md-4"><q-select dark dense outlined v-model="newProcedureItem.procedure" label="หัตถการ" :options="procedureOptions" :disable="isProcedureDisabled" use-input input-debounce="0" @filter="filterProcedure" class="q-mb-sm" @popup-show="playFormFocusSound" @update:model-value="playSelectionSound" :class="{'field-filled': newProcedureItem.procedure}"/></div>
          <div class="col-12 col-md-4"><q-select dark dense outlined v-model="newProcedureItem.diagnosis" label="การวินิจฉัย" :options="diagnosisOptions" :disable="isProcedureDisabled" use-input input-debounce="0" @filter="filterDiagnosis" class="q-mb-sm" @popup-show="playFormFocusSound" @update:model-value="playSelectionSound" :class="{'field-filled': newProcedureItem.diagnosis}"/></div>
          <div class="col-12"><q-input dark dense outlined v-model="newProcedureItem.notes" label="บันทึกเพิ่มเติม" type="textarea" class="q-mb-sm" @focus="playFormFocusSound" :class="{'field-filled': newProcedureItem.notes}"/></div>
          <div class="col-12 q-mt-sm row" style="gap: 8px;">
            <q-btn class="positive-action-btn" icon="o_add_circle" label="เพิ่มการรักษา" @click="addProcedure" :disable="!newProcedureItem.service"/>
            <q-btn class="negative-action-btn" icon="o_cancel" label="ไม่รับการรักษา" @click="addDeclinedProcedure"/>
          </div>
          </div>
        <div v-if="procedures.length > 0">
          <q-separator class="q-my-md" dark /><div class="text-subtitle1 welcome-text">รายการการรักษา</div>
          <q-list bordered separator class="themed-list">
            <q-item v-for="(procedure, index) in procedures" :key="index">
              <q-item-section>
                <q-item-label>บริการ: {{ procedure.service }}</q-item-label>
                <q-item-label caption>การวินิจฉัย: {{ procedure.diagnosis }}</q-item-label>
                <q-item-label caption>หัตถการ: {{ procedure.procedure }}</q-item-label>
                <q-item-label caption>บันทึก: {{ procedure.notes || '-' }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn flat round icon="delete" color="red" @click="removeProcedure(index)"/>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <q-separator class="q-my-lg" dark />
        <div class="text-subtitle1 welcome-text">การส่งต่อผู้ป่วย (Referral)</div>
        <div class="row" style="gap: 8px;">
            <q-btn
              :class="['choice-btn', {'choice-btn--active-positive': referralChoice === 'refer'}]"
              icon="o_check_circle" label="ส่งต่อ"
              @click="referralChoice = 'refer'; playSelectionSound()"
            />
            <q-btn
              :class="['choice-btn', {'choice-btn--active-negative': referralChoice === 'no_referral'}]"
              icon="o_cancel" label="ไม่ส่งต่อ"
              @click="referralChoice = 'no_referral'; playSelectionSound()"
            />
        </div>
        <div v-if="referralChoice === 'refer'">
          <div class="row q-col-gutter-sm q-mb-md q-mt-sm">
            <div class="col-12 col-md-6"><q-select dark dense outlined v-model="selectedDepartment" label="เลือกแผนก" :options="departmentOptions" clearable @popup-show="playFormFocusSound" @update:model-value="playSelectionSound" :class="{'field-filled': selectedDepartment}"/></div>
            <div class="col-12 col-md-6"><q-select dark dense outlined v-model="selectedDoctor" label="เลือกแพทย์" :options="filteredDoctorOptions" :disable="!selectedDepartment" clearable @popup-show="playFormFocusSound" @update:model-value="playSelectionSound" :class="{'field-filled': selectedDoctor}">
              <template v-slot:no-option><q-item><q-item-section class="text-grey">กรุณาเลือกแผนกก่อน</q-item-section></q-item></template>
            </q-select></div>
          </div>
        </div>
        <div class="col-12"><q-input dark dense outlined v-model="referralNotes" label="หมายเหตุการส่งต่อ (ถ้ามี)" type="textarea" autogrow class="q-mt-sm" @focus="playFormFocusSound" :class="{'field-filled': referralNotes}"/></div>
      </q-card-section>
    </q-card>

  </div>

  <q-footer class="action-footer">
    <div class="row items-center justify-between q-pa-md">
      <div class="row items-center text-grey-7 welcome-text">
        <q-icon name="person" class="q-mr-sm" />
        <span class="text-subtitle2">ผู้บันทึก: {{ recordingNurse }}</span>
      </div>
      <div class="row items-center q-gutter-md">
          <q-btn class="cert-btn" @click="openCertificateDialog" label="ออกใบรับรองแพทย์" icon="o_description" :disable="isFormLocked"/>
          <q-btn class="save-btn" @click="confirmAndSaveDraft" label="บันทึกฉบับร่าง" icon="o_save" :disable="isFormLocked"/>
          <q-btn class="primary-action-btn" @click="completeTreatment" label="บันทึกและสิ้นสุดการรักษา" icon="o_check_circle" :disable="isFormLocked"/>
      </div>
    </div>
  </q-footer>

  <q-dialog v-model="showCertificateDialog" persistent>
      <q-card class="certificate-dialog-card">
        <q-bar class="bg-primary text-white no-print">
            <q-icon name="o_description" />
            <div>ใบรับรองแพทย์</div>
            <q-space />
            <q-btn dense flat icon="print" @click="printCertificate"><q-tooltip class="tooltip-glassy">พิมพ์</q-tooltip></q-btn>
            <q-btn dense flat icon="close" v-close-popup><q-tooltip class="tooltip-glassy">ปิด</q-tooltip></q-btn>
        </q-bar>
        <q-card-section class="q-pa-lg scroll" style="max-height: 80vh;">
            <div class="text-h6 text-center q-mb-md">กรอกข้อมูลสำหรับใบรับรองแพทย์</div>
            <div class="part-title">ส่วนที่ 1: ของผู้ขอรับใบรับรองสุขภาพ</div>
            <q-input dark dense outlined v-model="certificateData.patientName" label="ชื่อ-นามสกุล ผู้ป่วย" readonly />
            <q-input dark dense outlined v-model="certificateData.patientAddress" label="สถานที่อยู่ (ที่สามารถติดต่อได้)" class="q-mt-sm" type="textarea" autogrow/>
            <q-input dark dense outlined v-model="certificateData.patientIdCard" label="หมายเลขบัตรประชาชน" class="q-mt-sm" />
            <div class="text-subtitle1 q-mt-md">ประวัติสุขภาพ:</div>
            <div class="row q-gutter-sm items-center"><q-checkbox dark v-model="certificateData.hasChronicDisease" label="โรคประจำตัว" /><q-input class="col" dark dense outlined v-if="certificateData.hasChronicDisease" v-model="certificateData.chronicDiseaseDetail" label="ระบุ" /></div>
            <q-separator dark class="q-my-lg" />
            <div class="part-title">ส่วนที่ 2: ของแพทย์</div>
            <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6"><q-input dark dense outlined v-model="certificateData.hospitalName" label="สถานประกอบพยาบาล" /></div>
                <div class="col-12 col-sm-6"><q-input dark dense outlined v-model="certificateData.examDate" label="วันที่ตรวจ" mask="date" :rules="['date']"><template v-slot:append><q-icon name="event" class="cursor-pointer"><q-popup-proxy cover><q-date v-model="certificateData.examDate" dark borderless /></q-popup-proxy></q-icon></template></q-input></div>
                <div class="col-12 col-sm-6"><q-input dark dense outlined v-model="certificateData.doctorName" label="ชื่อแพทย์" /></div>
                <div class="col-12 col-sm-6"><q-input dark dense outlined v-model="certificateData.doctorLicense" label="เลขที่ใบอนุญาต ว." /></div>
            </div>
            <div class="text-subtitle1 q-mt-md">ผลการตรวจร่างกาย:</div>
            <div class="row q-col-gutter-md q-mt-xs">
                <div class="col-6 col-sm-3"><q-input dark dense outlined v-model="certificateData.vitals.weight" label="น้ำหนัก" suffix="กก."/></div>
                <div class="col-6 col-sm-3"><q-input dark dense outlined v-model="certificateData.vitals.height" label="ส่วนสูง" suffix="ซม."/></div>
                <div class="col-12 col-sm-6"><q-input dark dense outlined v-model="certificateData.vitals.bloodPressure" label="ความดันโลหิต" suffix="มม.ปรอท"/></div>
                <div class="col-6 col-sm-3"><q-input dark dense outlined v-model="certificateData.vitals.pulse" label="ชีพจร" suffix="ครั้ง/นาที"/></div>
            </div>
            <q-input class="q-mt-sm" dark dense outlined v-model="certificateData.doctorOpinion" label="ความเห็นแพทย์" type="textarea" autogrow />
            <q-input class="q-mt-md" dark dense outlined v-model="certificateData.doctorRecommendation" label="สรุปความเห็นและข้อแนะนำ" type="textarea" autogrow />
        </q-card-section>
      </q-card>
  </q-dialog>

</q-page>
</template>

<script setup>
import * as Tone from 'tone';
import { reactive, ref, computed, onMounted, watch, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useQuasar, date } from 'quasar';
import axios from 'axios';

// =================================================================================
// ===== SOUND SYSTEM =====
// =================================================================================
const createSynth = (synth, options, volume) => { const s = new synth(options).toDestination(); s.volume.value = volume; return s; };
const clickSynth = createSynth(Tone.FMSynth, { harmonicity: 8, modulationIndex: 2, oscillator: { type: "sine" }, envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.2 }, modulation: { type: "square" }, modulationEnvelope: { attack: 0.002, decay: 0.2, sustain: 0, release: 0.2 } }, -10);
const formFocusSynth = createSynth(Tone.Synth, { oscillator: { type: 'triangle' }, envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.1 } }, -20);
const selectionSynth = createSynth(Tone.Synth, { oscillator: { type: 'sine' }, envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 0.1 } }, -16);
const removeSynth = createSynth(Tone.MembraneSynth, { pitchDecay: 0.05, octaves: 10, oscillator: { type: 'sine' }, envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4, attackCurve: 'exponential' } }, -12);
let isRemoving = false;

const playSound = (synth, note, duration) => {
  if (Tone.context.state !== 'running') Tone.context.resume();
  synth.triggerAttackRelease(note, duration, Tone.now());
};

const playClickSound = () => playSound(clickSynth, "C5", "32n");
const playFormFocusSound = () => playSound(formFocusSynth, "G5", "32n");
const playSelectionSound = () => { if (!isRemoving) playSound(selectionSynth, "C6", "16n"); };
const playRemoveSound = () => {
  playSound(removeSynth, "C2", "8n");
  isRemoving = true;
  setTimeout(() => { isRemoving = false; }, 50);
};

// =================================================================================
// ===== VUE & QUASAR SETUP =====
// =================================================================================
const router = useRouter();
const route = useRoute();
const $q = useQuasar();

// =================================================================================
// ===== STATE VARIABLES =====
// =================================================================================
const currentVisitId = ref(null);
const isEditMode = computed(() => !!route.query.visitId);
const recordingNurse = ref('พยาบาล สมศรี สุขใจ');
const allPatients = ref([]);
const selectedPatientIdObject = ref(null);
const selectedPatientNameObject = ref(null);
const patientInfo = ref({ id: '', name: '', patientId: '', gender: '', age: null, drugAllergies: '', foodAllergies: '', underlyingDiseases: '' });
const patientIdOptions = ref([]);
const patientNameOptions = ref([]);
const masterPatientIdOptions = ref([]);
const masterPatientNameOptions = ref([]);
const isFormLocked = computed(() => !patientInfo.value.id || !currentVisitId.value);
const newVitalSign = reactive({ temperature: null, pulse: null, breathing: null, bloodPressureSystolic: null, bloodPressureDiastolic: null, oxygenSaturation: null, waist: null, height: null, weight: null, bmi: '' });
const reviewOfSystems = ref({ general: [], headAndNeck: [], respiratory: [], cardiovascular: [], gastrointestinal: [], skin: [] });
const rosOptions = { general: ['มีไข้', 'หนาวสั่น', 'อ่อนเพลีย / ไม่มีแรง', 'เบื่ออาหาร', 'น้ำหนักลด', 'เหงื่อออกกลางคืน'], headAndNeck: ['ปวดศีรษะ', 'เวียนศีรษะ', 'เจ็บคอ', 'ต่อมน้ำเหลืองโต', 'ตาแดง/เคืองตา', 'มองเห็นผิดปกติ', 'หูอื้อ/ปวดหู', 'มีน้ำมูก/คัดจมูก'], respiratory: ['ไอ', 'ไอมีเสมหะ', 'หายใจลำบาก/หอบเหนื่อย', 'เจ็บหน้าอกเวลาหายใจ', 'ไอเป็นเลือด'], cardiovascular: ['เจ็บหน้าอก', 'ใจสั่น', 'บวม', 'นอนราบไม่ได้'], gastrointestinal: ['คลื่นไส้/อาเจียน', 'ปวดท้อง', 'ท้องเสีย', 'ท้องผูก', 'ถ่ายเป็นเลือด/ถ่ายดำ', 'ตัวเหลืองตาเหลือง'], skin: ['ผื่น', 'ตุ่มน้ำ', 'คัน', 'ผิวแห้ง'], };
const procedures = ref([]);
const newProcedureItem = reactive({ service: null, procedure: null, diagnosis: null, notes: '' });
const serviceOptions = ref([]);
const originalDiagnosisOptions = ref([]);
const diagnosisOptions = ref([]);
const originalProcedureOptions = ref([]);
const procedureOptions = ref([]);
const isProcedureDisabled = computed(() => newProcedureItem.service === '-');
const allDoctors = ref([{ id: 1, name: 'นพ. สมชาย ใจดี', department: 'อายุรกรรม' }, { id: 2, name: 'นพ. เก่งกาจ ชนะชัย', department: 'อายุรกรรม' }, { id: 3, name: 'พญ. สุดา รักษา', department: 'กุมารเวชกรรม' }, { id: 4, name: 'พญ. ยิ่งลักษณ์ อารี', department: 'กุมารเวชกรรม' }, { id: 5, name: 'นพ. วิชัย เชี่ยวชาญ', department: 'ศัลยกรรม' }]);
const referralChoice = ref('refer');
const selectedDepartment = ref(null);
const selectedDoctor = ref(null);
const referralNotes = ref('');
const departmentOptions = computed(() => [...new Set(allDoctors.value.map(d => d.department))]);
const filteredDoctorOptions = computed(() => !selectedDepartment.value ? [] : allDoctors.value.filter(doctor => doctor.department === selectedDepartment.value).map(doctor => doctor.name));
watch(referralChoice, (newChoice) => { if (newChoice === 'no_referral') { selectedDepartment.value = null; selectedDoctor.value = null; } });
watch(selectedDepartment, () => { selectedDoctor.value = null; });
const showHistory = ref(false);
const showCertificateDialog = ref(false);
const certificateData = reactive({ patientName: '', patientAddress: '', patientIdCard: '', hasChronicDisease: false, chronicDiseaseDetail: '', hospitalName: 'คลินิก สบายใจเฮลท์แคร์', examDate: date.formatDate(Date.now(), 'YYYY/MM/DD'), doctorName: '', doctorLicense: '', vitals: { weight: '', height: '', bloodPressure: '', pulse: '' }, doctorOpinion: 'แข็งแรงสมบูรณ์', doctorRecommendation: 'ตรวจสุขภาพประจำปี' });

// =================================================================================
// ===== SYMPTOM LOGIC (REFACTORED FOR PAIN LEVELS) =====
// =================================================================================
const symptomSelectRef = ref(null);
const chiefComplaint = ref([]);
const presentIllness = ref('');
const masterSymptomList = ref([]);
const symptomOptions = ref([]);
const durationNumber = ref(null);
const durationUnit = ref('วัน');
const durationUnitOptions = ['ชั่วโมง', 'วัน', 'สัปดาห์', 'เดือน', 'ปี'];
const showDurationDialog = ref(false);
const symptomToEdit = ref(null);
const modelView = ref('front');

const painLevelOptions = [
  { label: 'ระคายเคือง', value: 'irritation' },
  { label: 'ปวด', value: 'pain' },
  { label: 'บาดเจ็บ', value: 'injury' },
];

const painLevelDialog = reactive({
  show: false,
  symptomToEdit: null,
  selectedLevel: 'pain',
});

const openPainLevelEditor = (symptom) => {
  painLevelDialog.symptomToEdit = symptom;
  painLevelDialog.selectedLevel = symptom.level;
  painLevelDialog.show = true;
};

const savePainLevel = () => {
  if (painLevelDialog.symptomToEdit) {
    painLevelDialog.symptomToEdit.level = painLevelDialog.selectedLevel;
  }
  playSelectionSound();
};

const symptomToLocationMap = {
  'ปวดหัว': ['head-upper-left', 'head-upper-right', 'head-back'],
  'ปวดหัวข้างเดียว': ['head-upper-left', 'head-lower-left'],
  'ปวดท้ายทอย': ['head-back', 'neck-back'],
  'เวียนหัว': ['head-upper-left', 'head-upper-right', 'head-lower-left', 'head-lower-right', 'head-back'],
  'เจ็บตา': ['eye-left', 'eye-right'],
  'เคืองตา': ['eye-left', 'eye-right'],
  'หูอื้อ': ['ear-left', 'ear-right'],
  'ปวดหู': ['ear-left', 'ear-right'],
  'คัดจมูก': ['nose'],
  'มีน้ำมูก': ['nose'],
  'เจ็บคอ': ['neck', 'mouth'],
  'ไอ': ['chest-left', 'chest-right'],
  'เจ็บหน้าอก': ['chest-left', 'chest-right'],
  'ปวดท้อง': ['abdomen-left', 'abdomen-right'],
  'ปวดไหล่': ['arm-left', 'arm-right'],
  'ปวดแขน': ['arm-left', 'arm-right', 'forearm-left', 'forearm-right'],
  'ปวดมือ': ['hand-left', 'hand-right'],
  'ปวดขา': ['leg-left', 'leg-right'],
  'ปวดเท้า': ['foot-left', 'foot-right'],
  'ปวดหลัง': ['back-upper', 'back-lower'],
  'ปวดเอว': ['back-lower'],
};

watch(chiefComplaint, (newSymptoms, oldSymptoms) => {
  if (newSymptoms.length > oldSymptoms.length) {
    const addedSymptom = newSymptoms.find(s => !oldSymptoms.includes(s));
    if (addedSymptom && (!addedSymptom.locations || addedSymptom.locations.length === 0)) {
      const locations = symptomToLocationMap[addedSymptom.name] || [];
      if (locations.length > 0) {
        addedSymptom.locations = [...locations];
        if (!addedSymptom.level) {
           addedSymptom.level = 'pain';
        }
      }
    }
  }
}, { deep: true });

const symptomLocations = computed(() => {
  const locations = {};
  const severity = { irritation: 1, pain: 2, injury: 3 };
  chiefComplaint.value.forEach(symptom => {
    if (symptom.locations && symptom.locations.length > 0 && symptom.level) {
      symptom.locations.forEach(loc => {
        if (!locations[loc] || severity[symptom.level] > severity[locations[loc]]) {
          locations[loc] = symptom.level;
        }
      });
    }
  });
  return locations;
});

const getPainLevelClass = (partId) => {
  const level = symptomLocations.value[partId];
  return level ? `pain--${level}` : '';
};

const symptomDetailMap = { 'ปวดท้อง': ['ปวดบิด', 'ปวดเกร็ง', 'ปวดจี๊ดๆ', 'ปวดแสบ', 'บริเวณลิ้นปี่', 'บริเวณรอบสะือ'], 'ไอ': ['ไอแห้ง', 'ไอมีเสมหะ', 'ไอเป็นเลือด', 'ไอเรื้อรัง'], 'ปวดหัว': ['ปวดตุบๆ', 'ปวดบีบๆ', 'ปวดข้างเดียว', 'ปวดท้ายทอย', 'ปวดกระบอกตา'], 'มีไข้': ['ไข้สูง', 'ไข้ต่ำๆ', 'หนาวสั่น'], 'ปวดหลัง': ['ปวดร้าวลงขา', 'ปวดเมื่อย', 'ปวดจี๊ดๆ'] };
const dynamicSuggestions = computed(() => { return chiefComplaint.value.flatMap(symptom => symptomDetailMap[symptom.name] || []); });

const symptomTemplates = {
  commonCold: { label: 'ชุดไข้หวัด', icon: 'ac_unit', symptoms: ['มีไข้', 'ไอ', 'เจ็บคอ', 'มีน้ำมูก'] },
  foodPoisoning: { label: 'ชุดอาหารเป็นพิษ', icon: 'medication_liquid', symptoms: ['คลื่นไส้', 'อาเจียน', 'ปวดท้อง', 'ท้องเสีย'] },
  migraine: { label: 'ชุดไมเกรน', icon: 'bolt', symptoms: ['ปวดหัวข้างเดียว', 'คลื่นไส้'] },
  officeSyndrome: { label: 'ชุดออฟฟิศซินโดรม', icon: 'desktop_windows', symptoms: ['ปวดหลัง', 'ปวดไหล่', 'ปวดท้ายทอย'] },
};

const applySymptomTemplate = (templateName) => {
    playClickSound();
    const templateSymptoms = symptomTemplates[templateName].symptoms;
    templateSymptoms.forEach(symptomName => {
      const isExisting = chiefComplaint.value.some(s => s.name === symptomName);
      if (!isExisting) {
        chiefComplaint.value.push({
          name: symptomName,
          duration: '',
          locations: symptomToLocationMap[symptomName] || [],
          level: 'pain'
        });
      }
    });
};

const addDetailToIllness = (detail) => {
    playSelectionSound();
    presentIllness.value = presentIllness.value ? `${presentIllness.value}, ${detail}` : detail;
};

const createSymptom = (val, done) => {
    const newSymptomName = (val || '').trim();
    if (newSymptomName.length > 0) {
        const isExisting = chiefComplaint.value.some(s => s.name === newSymptomName);
        if (!isExisting) {
            if (!masterSymptomList.value.some(s => s.name === newSymptomName)) {
                masterSymptomList.value.unshift({ name: newSymptomName });
            }
            done({
              name: newSymptomName,
              duration: '',
              locations: symptomToLocationMap[newSymptomName] || [],
              level: 'pain'
            }, 'add-unique');
            return;
        }
    }
    done(null);
    if (symptomSelectRef.value) { symptomSelectRef.value.updateInputValue(''); }
};

const handleSymptomInputBlur = () => {
  if (symptomSelectRef.value && typeof symptomSelectRef.value.inputValue === 'string' && symptomSelectRef.value.inputValue.trim()) {
    createSymptom(symptomSelectRef.value.inputValue, (newValue, mode) => {
      if (newValue && mode === 'add-unique') {
        chiefComplaint.value.push(newValue);
      }
    });
  }
};

const filterSymptoms = (val, update) => {
  update(() => {
    if (val === '') {
      symptomOptions.value = masterSymptomList.value;
    } else {
      const needle = val.toLowerCase();
      symptomOptions.value = masterSymptomList.value.filter(v => v.name.toLowerCase().includes(needle));
    }
  })
};

const openDurationDialog = (symptom) => {
  symptomToEdit.value = symptom;
  prepareDurationEdit(symptom.duration);
  showDurationDialog.value = true;
  playFormFocusSound();
};

const prepareDurationEdit = (existingDuration) => {
    if (existingDuration) {
        const parts = existingDuration.split(' ');
        if (parts.length === 2 && !isNaN(parts[0]) && durationUnitOptions.includes(parts[1])) {
            durationNumber.value = parseInt(parts[0], 10);
            durationUnit.value = parts[1];
            return;
        }
    }
    durationNumber.value = null;
    durationUnit.value = 'วัน';
};

const saveDuration = () => {
    if (symptomToEdit.value) {
        if (durationNumber.value > 0) {
            symptomToEdit.value.duration = `${durationNumber.value} ${durationUnit.value}`;
        } else {
            symptomToEdit.value.duration = '';
        }
        playSelectionSound();
    }
    symptomToEdit.value = null;
};

const bodyPartSymptoms = {
  'head-upper-left': {symptoms: ['ปวดหน้าผากซ้าย']}, 'head-upper-right': {symptoms: ['ปวดหน้าผากขวา']}, 'head-lower-left': {symptoms: ['ปวดแก้มซ้าย', 'ปวดกรามซ้าย']}, 'head-lower-right': {symptoms: ['ปวดแก้มขวา', 'ปวดกรามขวา']}, 'eye-left': {symptoms: ['เจ็บตาซ้าย', 'ตาแดงซ้าย', 'เคืองตาซ้าย']}, 'eye-right': {symptoms: ['เจ็บตาขวา', 'ตาแดงขวา', 'เคืองตาขวา']}, 'ear-left': {symptoms: ['ปวดหูซ้าย', 'หูอื้อซ้าย']}, 'ear-right': {symptoms: ['ปวดหูขวา', 'หูอื้อขวา']}, 'nose': {symptoms: ['คัดจมูก', 'เลือดกำเดาไหล']}, 'mouth': {symptoms: ['แผลในปาก', 'เจ็บลิ้น']}, 'neck': {symptoms: ['เจ็บคอ', 'คอเคล็ด']}, 'chest-left': {symptoms: ['เจ็บหน้าอกซ้าย', 'แน่นหน้าอกซ้าย']}, 'chest-right': {symptoms: ['เจ็บหน้าอกขวา', 'แน่นหน้าอกขวา']}, 'abdomen-left': {symptoms: ['ปวดท้องซ้าย', 'ท้องอืดซ้าย']}, 'abdomen-right': {symptoms: ['ปวดท้องขวา', 'ท้องอืดขวา']}, 'arm-left': {symptoms: ['ปวดแขนซ้าย', 'แขนซ้ายชา']}, 'arm-right': {symptoms: ['ปวดแขนขวา', 'แขนขวาชา']}, 'forearm-left': {symptoms: ['ปวดปลายแขนซ้าย']}, 'forearm-right': {symptoms: ['ปวดปลายแขนขวา']}, 'hand-left': {symptoms: ['ปวดมือซ้าย', 'นิ้วล็อคซ้าย']}, 'hand-right': {symptoms: ['ปวดมือขวา', 'นิ้วล็อคขวา']}, 'leg-left': {symptoms: ['ปวดขาซ้าย', 'ตะคริวขาซ้าย']}, 'leg-right': {symptoms: ['ปวดขาขวา', 'ตะคริวขาขวา']}, 'foot-left': {symptoms: ['ปวดเท้าซ้าย', 'ข้อเท้าแพลงซ้าย']}, 'foot-right': {symptoms: ['ปวดเท้าขวา', 'ข้อเท้าแพลงขวา']}, 'head-back': {symptoms: ['ปวดท้ายทอย']}, 'neck-back': {symptoms: ['ปวดต้นคอ']}, 'back-upper': {symptoms: ['ปวดหลังส่วนบน', 'ปวดสะบัก']}, 'back-lower': {symptoms: ['ปวดหลังส่วนล่าง', 'ปวดเอว']}, 'buttocks': {symptoms: ['ปวดก้น', 'ฝีที่ก้น']},
};

const bodyPartDialog = reactive({ show: false, title: '', locationId: '', options: [], selected: [], level: 'pain' });

const addSymptomsFromModel = () => {
  chiefComplaint.value = chiefComplaint.value.filter(s => !s.locations.includes(bodyPartDialog.locationId));
  bodyPartDialog.selected.forEach(symptomName => {
    chiefComplaint.value.push({
      name: symptomName,
      duration: '',
      locations: [bodyPartDialog.locationId],
      level: bodyPartDialog.level
    });
  });
  playSelectionSound();
};

const showSymptomSelector = (locationId, title) => {
  const data = bodyPartSymptoms[locationId];
  if (!data) return;
  playClickSound();
  bodyPartDialog.locationId = locationId;
  bodyPartDialog.title = title;
  bodyPartDialog.options = data.symptoms.map(s => ({ label: s, value: s }));
  const currentSymptomsOnPart = chiefComplaint.value.filter(s => s.locations.includes(locationId));
  bodyPartDialog.selected = currentSymptomsOnPart.map(s => s.name);
  bodyPartDialog.level = currentSymptomsOnPart.length > 0 ? currentSymptomsOnPart[0].level : 'pain';
  bodyPartDialog.show = true;
};

// =================================================================================
// ===== FORM & DATA HANDLING (RESTORED) =====
// =================================================================================
const vitalSignOptions = { temperature: Array.from({ length: 71 }, (_, i) => (35.0 + i * 0.1).toFixed(1)), pulse: Array.from({ length: 141 }, (_, i) => (40 + i).toString()), breathing: Array.from({ length: 31 }, (_, i) => (10 + i).toString()), oxygenSaturation: Array.from({ length: 21 }, (_, i) => (80 + i).toString()), bloodPressureSystolic: Array.from({ length: 25 }, (_, i) => (80 + i * 5).toString()), bloodPressureDiastolic: Array.from({ length: 17 }, (_, i) => (40 + i * 5).toString()), height: Array.from({ length: 121 }, (_, i) => (100 + i).toString()), weight: Array.from({ length: 241 }, (_, i) => (30.0 + i * 0.5).toFixed(1)), waist: Array.from({ length: 101 }, (_, i) => (50 + i).toString()), };
const tempOptions = ref(vitalSignOptions.temperature); const pulseOptions = ref(vitalSignOptions.pulse); const breathingOptions = ref(vitalSignOptions.breathing); const o2SatOptions = ref(vitalSignOptions.oxygenSaturation); const bpSysOptions = ref(vitalSignOptions.bloodPressureSystolic); const bpDiaOptions = ref(vitalSignOptions.bloodPressureDiastolic); const heightOptions = ref(vitalSignOptions.height); const weightOptions = ref(vitalSignOptions.weight); const waistOptions = ref(vitalSignOptions.waist);
const filterOptions = (val, update, optionsRef, masterOptions) => { update(() => { if (val === '') { optionsRef.value = masterOptions; } else { const needle = val.toLowerCase(); optionsRef.value = masterOptions.filter(v => v.toLowerCase().includes(needle)); } }); };
const filterTemp = (val, update) => filterOptions(val, update, tempOptions, vitalSignOptions.temperature); const filterPulse = (val, update) => filterOptions(val, update, pulseOptions, vitalSignOptions.pulse); const filterBreathing = (val, update) => filterOptions(val, update, breathingOptions, vitalSignOptions.breathing); const filterO2Sat = (val, update) => filterOptions(val, update, o2SatOptions, vitalSignOptions.oxygenSaturation); const filterBpSys = (val, update) => filterOptions(val, update, bpSysOptions, vitalSignOptions.bloodPressureSystolic); const filterBpDia = (val, update) => filterOptions(val, update, bpDiaOptions, vitalSignOptions.bloodPressureDiastolic); const filterHeight = (val, update) => filterOptions(val, update, heightOptions, vitalSignOptions.height); const filterWeight = (val, update) => filterOptions(val, update, weightOptions, vitalSignOptions.weight); const filterWaist = (val, update) => filterOptions(val, update, waistOptions, vitalSignOptions.waist);
const addNewDecimalOption = (val, done) => { if (/^\d*\.?\d+$/.test(val)) { done(val, 'add-unique'); } else { $q.notify({ type: 'negative', message: 'กรุณาป้อนค่าเป็นตัวเลข (ทศนิยมได้)', position: 'top', timeout: 2000 }); } };
const addNewIntegerOption = (val, done) => { if (/^\d+$/.test(val)) { done(val, 'add-unique'); } else { $q.notify({ type: 'negative', message: 'กรุณาป้อนค่าเป็นตัวเลข (จำนวนเต็ม)', position: 'top', timeout: 2000 }); } };
const handleVitalSignBlur = (event, modelKey) => { const inputValue = event.target.value; if (!inputValue) return; const isDecimalAllowed = ['temperature', 'weight'].includes(modelKey); const regex = isDecimalAllowed ? /^\d*\.?\d+$/ : /^\d+$/; if (regex.test(inputValue)) { if (newVitalSign[modelKey] !== inputValue) { newVitalSign[modelKey] = inputValue; if (modelKey === 'height' || modelKey === 'weight') { calculateBMI(); } playSelectionSound(); } } else { event.target.value = newVitalSign[modelKey] || ''; $q.notify({ type: 'negative', message: `ค่าที่ป้อนสำหรับ ${modelKey} ไม่ถูกต้อง`, position: 'top', timeout: 2000 }); } };
const bmiInterpretation = computed(() => { const bmi = parseFloat(newVitalSign.bmi); if (!bmi || bmi <= 0) return null; if (bmi < 18.5) return { title: 'น้ำหนักน้อย / ผอม', text: 'ควรเพิ่มการบริโภคอาหารที่มีประโยชน์', styleClass: 'bmi-banner-underweight', icon: 'sentiment_dissatisfied' }; if (bmi <= 24.9) return { title: 'น้ำหนักปกติ', text: 'อยู่ในเกณฑ์ดี', styleClass: 'bmi-banner-normal', icon: 'check_circle' }; if (bmi <= 29.9) return { title: 'น้ำหนักเกิน (ท้วม)', text: 'ควรปรับพฤติกรรมการทานอาหารและเริ่มออกกำลังกาย', styleClass: 'bmi-banner-overweight', icon: 'warning' }; if (bmi <= 35.0) return { title: 'อ้วนระดับ 1 (อันตราย)', text: 'เสี่ยงต่อการเกิดโรคร้ายแรง ควรปรับพฤติกรรม', styleClass: 'bmi-banner-obese1', icon: 'error' }; return { title: 'อ้วนระดับ 2 (อันตรายมาก)', text: 'มีความเสี่ยงสูงต่อการเกิดโรคร้ายแรง ควรปรึกษาแพทย์', styleClass: 'bmi-banner-obese2', icon: 'dangerous' }; });
const requiredFields = { 'อุณหภูมิ': computed(() => newVitalSign.temperature), 'ชีพจร': computed(() => newVitalSign.pulse), 'การหายใจ': computed(() => newVitalSign.breathing), 'ความดัน (Systolic)': computed(() => newVitalSign.bloodPressureSystolic), 'ความดัน (Diastolic)': computed(() => newVitalSign.bloodPressureDiastolic), 'อาการสำคัญ': computed(() => chiefComplaint.value.length > 0), };
const formProgress = computed(() => { if (!patientInfo.value.id) return 0; const totalFields = Object.keys(requiredFields).length; let filledFields = 0; for (const key in requiredFields) { if (requiredFields[key].value) { filledFields++; } } return totalFields > 0 ? filledFields / totalFields : 0; });
const validateForm = () => { const missingFields = Object.keys(requiredFields).filter(key => !requiredFields[key].value); if (missingFields.length > 0) { $q.notify({ type: 'negative', icon: 'o_warning', message: 'กรุณากรอกข้อมูลสำคัญให้ครบถ้วน', caption: `ยังไม่ได้กรอก: ${missingFields.join(', ')}`, position: 'top', timeout: 5000 }); return false; } return true; };
const getGenderFromPrefix = (prefix) => { if (!prefix) return '-'; if (['นาย', 'เด็กชาย'].includes(prefix)) return 'ชาย'; if (['นาง', 'นางสาว', 'เด็กหญิง'].includes(prefix)) return 'หญิง'; return '-'; };
const parseChiefComplaintString = (complaintString) => { if (!complaintString || typeof complaintString !== 'string') { return []; } const regex = /([\u0E00-\u0E7Fa-zA-Z0-9\s]+)(?:\s\[(irritation|pain|injury)\])?(?:\s\((.+?)\))?/g; let results = []; let match; while ((match = regex.exec(complaintString)) !== null) { const name = match[1].trim(); results.push({ name: name, level: match[2] || 'pain', duration: match[3] ? match[3].trim() : '', locations: symptomToLocationMap[name] || [], }); } return results; };

onMounted(async () => {
  const initialSymptoms = ['ปวดหัว', 'ปวดไหล่', 'มีไข้', 'ไอ', 'เจ็บคอ', 'มีน้ำมูก', 'ปวดท้อง', 'คลื่นไส้', 'อาเจียน', 'ท้องเสีย', 'เวียนหัว', 'ผื่นคัน', 'ปวดกล้ามเนื้อ', 'อ่อนเพลีย', 'ปวดหลัง', 'เจ็บตา', 'หูอื้อ', 'คัดจมูก'];
  const allPartSymptoms = Object.values(bodyPartSymptoms).flatMap(part => part.symptoms);
  const uniqueSymptoms = [...new Set([...initialSymptoms, ...allPartSymptoms])];
  masterSymptomList.value = uniqueSymptoms.map(name => ({ name }));
  symptomOptions.value = [...masterSymptomList.value];

  await Promise.all([fetchAllPatients(), fetchMasterData()]);
  const visitIdToLoad = route.query.visitId;
  const patientDbIdToLoad = route.query.patientId;
  if (visitIdToLoad && patientDbIdToLoad) {
    loadExistingVisitData(visitIdToLoad, patientDbIdToLoad);
  }
});

const fetchAllPatients = async () => { try { const response = await axios.get('http://localhost:3000/api/patients'); let rawPatientData = []; if (Array.isArray(response.data)) { rawPatientData = response.data; } else if (response.data && Array.isArray(response.data.result)) { rawPatientData = response.data.result; } const formattedPatientData = rawPatientData.map(p => { const birthDate = p.birthDate ? new Date(p.birthDate) : null; const age = birthDate ? new Date().getFullYear() - birthDate.getFullYear() : null; return { id: p.id, prefix: p.prefix, firstName: p.firstName, lastName: p.lastName, patientId: p.patientId, age: age, underlyingDiseases: p.underlying_diseases || 'ไม่มี', drugAllergies: p.allergies || 'ไม่มี', }; }); allPatients.value = formattedPatientData; masterPatientIdOptions.value = formattedPatientData.map(p => ({ label: p.patientId, value: p.patientId.toUpperCase() })); masterPatientNameOptions.value = formattedPatientData.map(p => ({ label: `${p.prefix || ''}${p.firstName} ${p.lastName}`, value: p.patientId.toUpperCase() })); patientIdOptions.value = [...masterPatientIdOptions.value]; patientNameOptions.value = [...masterPatientNameOptions.value]; } catch (error) { console.error('Error fetching all patients:', error); $q.notify({ type: 'negative', message: 'ไม่สามารถเชื่อมต่อฐานข้อมูลผู้ป่วยได้', icon: 'o_signal_wifi_off', position: 'top' }); } };
const fetchMasterData = async () => { try { const [servicesRes, proceduresRes, diagnosisRes] = await Promise.all([ axios.get('http://localhost:3000/api/visits/master/services'), axios.get('http://localhost:3000/api/visits/master/procedures'), axios.get('http://localhost:3000/api/visits/master/diagnosis') ]); serviceOptions.value = servicesRes.data.map(item => item.service_name); originalProcedureOptions.value = proceduresRes.data.map(item => item.procedure_name); originalDiagnosisOptions.value = diagnosisRes.data.map(item => item.diagnosis_name); procedureOptions.value = [...originalProcedureOptions.value]; diagnosisOptions.value = [...originalDiagnosisOptions.value]; } catch (error) { console.error("Error fetching master data:", error); $q.notify({ type: 'warning', message: 'ไม่สามารถโหลดข้อมูลหัตถการ/วินิจฉัยได้', icon: 'o_warning', position: 'top' }); } };
const loadExistingVisitData = async (visitId, patientDbId) => { $q.loading.show({ message: 'กำลังโหลดข้อมูลการรักษา...' }); try { currentVisitId.value = visitId; const results = await Promise.allSettled([ axios.get(`http://localhost:3000/api/patients/${patientDbId}`), axios.get(`http://localhost:3000/api/visits/${visitId}`), axios.get(`http://localhost:3000/api/visits/${visitId}/symptoms`), axios.get(`http://localhost:3000/api/visits/${visitId}/procedures`) ]); if (results[0].status === 'fulfilled') { const p = results[0].value.data; const birthDate = p.birthDate ? new Date(p.birthDate) : null; const age = birthDate ? new Date().getFullYear() - birthDate.getFullYear() : null; patientInfo.value = { id: p.id, name: `${p.prefix || ''}${p.firstName} ${p.lastName}`, patientId: p.patientId, age: age, gender: getGenderFromPrefix(p.prefix), drugAllergies: p.allergies || 'ไม่มี', underlyingDiseases: p.underlying_diseases || 'ไม่มี' }; const patientStringId = p.patientId.toUpperCase(); selectedPatientIdObject.value = masterPatientIdOptions.value.find(opt => opt.value === patientStringId); selectedPatientNameObject.value = masterPatientNameOptions.value.find(opt => opt.value === patientStringId); } if (results[1].status === 'fulfilled') { const v = results[1].value.data; newVitalSign.temperature = v.temperature; newVitalSign.pulse = v.pulse; newVitalSign.breathing = v.respiration; newVitalSign.oxygenSaturation = v.oxygen_saturation; if (v.blood_pressure && v.blood_pressure.includes('/')) { const [systolic, diastolic] = v.blood_pressure.split('/'); newVitalSign.bloodPressureSystolic = systolic === '-' ? null : systolic; newVitalSign.bloodPressureDiastolic = diastolic === '-' ? null : diastolic; } newVitalSign.height = v.height; newVitalSign.weight = v.weight; newVitalSign.waist = v.waist_circumference; calculateBMI(); if (v.referral_department) { referralChoice.value = 'refer'; selectedDepartment.value = v.referral_department; await nextTick(); selectedDoctor.value = v.referral_doctor; } referralNotes.value = v.referral_notes || ''; } if (results[2].status === 'fulfilled') { const s = results[2].value.data; chiefComplaint.value = parseChiefComplaintString(s.ChiefComplaint); presentIllness.value = s.PresentIllness || ''; reviewOfSystems.value = { general: s.ROS_General || [], headAndNeck: s.ROS_HeadAndNeck || [], respiratory: s.ROS_Respiratory || [], cardiovascular: s.ROS_Cardiovascular || [], gastrointestinal: s.ROS_Gastrointestinal || [], skin: s.ROS_Skin || [], }; } if (results[3].status === 'fulfilled') { procedures.value = results[3].value.data.map(proc => ({ service: proc.service_name, procedure: proc.procedure_name, diagnosis: proc.diagnosis_name, notes: proc.notes })); } $q.notify({ type: 'positive', icon: 'o_done_all', message: `โหลดข้อมูล Visit ID: ${visitId} สำเร็จ` }); } catch (error) { console.error('Error loading existing visit data:', error); $q.notify({ type: 'negative', message: 'เกิดข้อผิดพลาดในการโหลดข้อมูล', caption: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้', icon: 'o_error', position: 'top' }); router.push({ name: 'NursePatientList' }); } finally { $q.loading.hide(); } };
const getMySqlDateTime = () => { const now = new Date(); const date = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)); return date.toISOString().slice(0, 19).replace('T', ' '); };
const createNewVisitForPatient = async (patientStringId) => { if (!patientStringId) return; currentVisitId.value = null; $q.loading.show({ message: 'กำลังสร้าง Visit ใหม่...' }); try { const visitPayload = { patient_id: patientStringId, UserID: 1, visit_datetime: getMySqlDateTime(), }; const response = await axios.post('http://localhost:3000/api/visits', visitPayload); currentVisitId.value = response.data.visitId; $q.loading.hide(); $q.notify({ type: 'info', message: `เริ่มการบันทึกสำหรับ Visit ID: ${currentVisitId.value}`, position: 'bottom-right', timeout: 2500, icon: 'o_edit_note' }); } catch (error) { $q.loading.hide(); console.error('Error creating new visit:', error); $q.notify({ type: 'negative', message: 'เกิดข้อผิดพลาดในการสร้าง Visit ใหม่', caption: error.response?.data?.message || 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้', icon: 'o_error', position: 'top' }); } };
const handlePatientSelection = (selectedOption) => { if (isEditMode.value) return; if (!selectedOption) { clearForm(); return; } const newPatientStringId = selectedOption.value.toUpperCase(); if (patientInfo.value.patientId && patientInfo.value.patientId.toUpperCase() === newPatientStringId) return; const foundPatient = allPatients.value.find(p => p.patientId.toUpperCase() === newPatientStringId); if (foundPatient) { patientInfo.value = { id: foundPatient.id, name: `${foundPatient.prefix || ''}${foundPatient.firstName} ${foundPatient.lastName}`, patientId: foundPatient.patientId, age: foundPatient.age, gender: getGenderFromPrefix(foundPatient.prefix), drugAllergies: foundPatient.drugAllergies || 'ไม่มี', underlyingDiseases: foundPatient.underlyingDiseases || 'ไม่มี' }; const idOption = masterPatientIdOptions.value.find(opt => opt.value === newPatientStringId); const nameOption = masterPatientNameOptions.value.find(opt => opt.value === newPatientStringId); selectedPatientIdObject.value = idOption; selectedPatientNameObject.value = nameOption; createNewVisitForPatient(foundPatient.patientId); } };
const clearForm = () => { if (isEditMode.value) { router.push({ name: 'NursePatientList' }); return; } playRemoveSound(); patientInfo.value = { id: '', name: '', patientId: '', gender: '', age: null, drugAllergies: '', foodAllergies: '', underlyingDiseases: '' }; selectedPatientIdObject.value = null; selectedPatientNameObject.value = null; currentVisitId.value = null; Object.assign(newVitalSign, { temperature: null, pulse: null, breathing: null, bloodPressureSystolic: null, bloodPressureDiastolic: null, oxygenSaturation: null, waist: null, height: null, weight: null, bmi: '' }); chiefComplaint.value = []; presentIllness.value = ''; Object.assign(reviewOfSystems.value, { general: [], headAndNeck: [], respiratory: [], cardiovascular: [], gastrointestinal: [], skin: [] }); procedures.value = []; Object.assign(newProcedureItem, { service: null, procedure: null, diagnosis: null, notes: '' }); referralChoice.value = 'refer'; selectedDepartment.value = null; selectedDoctor.value = null; referralNotes.value = ''; };
const filterPatientId = (val, update) => { update(() => { patientIdOptions.value = !val ? masterPatientIdOptions.value : masterPatientIdOptions.value.filter(v => v.label.toLowerCase().includes(val.toLowerCase())); }); };
const filterPatientName = (val, update) => { update(() => { patientNameOptions.value = !val ? masterPatientNameOptions.value : masterPatientNameOptions.value.filter(v => v.label.toLowerCase().includes(val.toLowerCase())); }); };
const filterDiagnosis = (val, update) => { update(() => { diagnosisOptions.value = !val ? originalDiagnosisOptions.value : originalDiagnosisOptions.value.filter(v => v.toLowerCase().includes(val.toLowerCase())); }); };
const filterProcedure = (val, update) => { update(() => { procedureOptions.value = !val ? originalProcedureOptions.value : originalProcedureOptions.value.filter(v => v.toLowerCase().includes(val.toLowerCase())); }); };
const toggleHistory = () => { showHistory.value = !showHistory.value; playClickSound(); };
const performSave = async () => { if (!currentVisitId.value || !patientInfo.value.id) { $q.notify({ type: 'negative', message: 'กรุณาเลือกผู้ป่วยก่อน', icon: 'error', position: 'top' }); return false; } const visitPayload = { temperature: newVitalSign.temperature ? parseFloat(newVitalSign.temperature) : null, pulse: newVitalSign.pulse ? parseInt(newVitalSign.pulse, 10) : null, respiration: newVitalSign.breathing ? parseInt(newVitalSign.breathing, 10) : null, oxygen_saturation: newVitalSign.oxygenSaturation ? parseInt(newVitalSign.oxygenSaturation, 10) : null, blood_pressure: `${newVitalSign.bloodPressureSystolic || '-'}/${newVitalSign.bloodPressureDiastolic || '-'}`, height: newVitalSign.height ? parseFloat(newVitalSign.height) : null, weight: newVitalSign.weight ? parseFloat(newVitalSign.weight) : null, waist_circumference: newVitalSign.waist ? parseInt(newVitalSign.waist, 10) : null, bmi: newVitalSign.bmi ? parseFloat(newVitalSign.bmi) : null, allergies: patientInfo.value.drugAllergies, underlying_diseases: patientInfo.value.underlyingDiseases, referral_department: selectedDepartment.value, referral_doctor: selectedDoctor.value, referral_notes: referralNotes.value }; const chiefComplaintString = chiefComplaint.value .map(s => { let text = s.name; if(s.level) text += ` [${s.level}]`; if(s.duration) text += ` (${s.duration})`; return text; }).join(', '); const symptomsPayload = { ChiefComplaint: chiefComplaintString, PresentIllness: presentIllness.value, ROS_General: reviewOfSystems.value.general, ROS_HeadAndNeck: reviewOfSystems.value.headAndNeck, ROS_Respiratory: reviewOfSystems.value.respiratory, ROS_Cardiovascular: reviewOfSystems.value.cardiovascular, ROS_Gastrointestinal: reviewOfSystems.value.gastrointestinal, ROS_Skin: reviewOfSystems.value.skin, }; const proceduresPayload = procedures.value.map(p => ({ service: p.service, procedure: p.procedure, diagnosis: p.diagnosis, notes: p.notes })); const filteredVisitPayload = Object.fromEntries(Object.entries(visitPayload).filter(([_, v]) => v !== null && v !== undefined && v !== '')); const filteredSymptomsPayload = Object.fromEntries(Object.entries(symptomsPayload).filter(([_, v]) => v !== null && v !== undefined && v !== '' && (!Array.isArray(v) || v.length > 0))); const apiCalls = []; if (Object.keys(filteredVisitPayload).length > 0) apiCalls.push(axios.put(`http://localhost:3000/api/visits/${currentVisitId.value}`, filteredVisitPayload)); if (Object.keys(filteredSymptomsPayload).length > 0) apiCalls.push(axios.post(`http://localhost:3000/api/visits/${currentVisitId.value}/symptoms`, filteredSymptomsPayload)); if (proceduresPayload.length > 0) apiCalls.push(axios.post(`http://localhost:3000/api/visits/${currentVisitId.value}/procedures`, proceduresPayload)); if (apiCalls.length === 0) { $q.notify({ type: 'info', message: 'ไม่มีข้อมูลใหม่ให้บันทึก', icon: 'info', position: 'top' }); return false; } try { await Promise.all(apiCalls); return true; } catch (error) { console.error('Error during save operation:', error); $q.notify({ type: 'negative', message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล', caption: error.response?.data?.message || 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้', icon: 'o_error', position: 'top' }); return false; } };
const confirmAndSaveDraft = () => { if (formProgress.value === 1) { saveDraftData(); return; } $q.dialog({ title: 'ยืนยันการบันทึกฉบับร่าง', message: 'ข้อมูลสำคัญยังกรอกไม่ครบถ้วน คุณต้องการบันทึกฉบับร่างต่อไปใช่หรือไม่?', cancel: true, persistent: true, ok: { label: 'บันทึก', color: 'primary', unelevated: true }, cancel: { label: 'ยกเลิก', color: 'grey', flat: true }, dark: true, class: 'main-card' }).onOk(() => { saveDraftData(); }); };
const saveDraftData = async () => { $q.loading.show({ message: 'กำลังบันทึกฉบับร่าง...' }); const success = await performSave(); $q.loading.hide(); if (success) { $q.notify({ type: 'info', message: 'บันทึกข้อมูลฉบับร่างสำเร็จ', icon: 'o_save', position: 'top' }); setTimeout(() => { router.push({ name: 'NursePatientList', query: { newVisitId: currentVisitId.value } }); }, 1000); } };
const completeTreatment = () => { if (!validateForm()) { return; } $q.dialog({ title: 'ยืนยันการสิ้นสุดการรักษา', message: 'คุณต้องการบันทึกและสิ้นสุดการรักษาสำหรับผู้ป่วยรายนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้', cancel: true, persistent: true, ok: { label: 'ยืนยัน', color: 'primary', unelevated: true }, cancel: { label: 'ยกเลิก', color: 'grey', flat: true }, dark: true, class: 'main-card' }).onOk(async () => { $q.loading.show({ message: 'กำลังสิ้นสุดการรักษา...' }); const success = await performSave(); if (success) { try { await axios.put(`http://localhost:3000/api/patients/${patientInfo.value.id}/status`, { status: 'กรอกข้อมูลเสร็จสิ้น' }); $q.loading.hide(); $q.notify({ type: 'positive', message: 'บันทึกและสิ้นสุดการรักษาสำเร็จ!', icon: 'o_check_circle', position: 'top' }); setTimeout(() => { router.push({ name: 'NursePatientList', query: { newVisitId: currentVisitId.value } }); }, 1500); } catch (error) { $q.loading.hide(); console.error('Error updating patient status:', error); $q.notify({ type: 'negative', message: 'บันทึกข้อมูลสำเร็จ แต่ไม่สามารถอัปเดตสถานะได้', caption: error.response?.data?.message || 'โปรดลองอีกครั้ง', icon: 'o_warning', position: 'top' }); } } else { $q.loading.hide(); } }); };
const calculateBMI = () => { const height = parseFloat(newVitalSign.height); const weight = parseFloat(newVitalSign.weight); if (height > 0 && weight > 0) { newVitalSign.bmi = (weight / ((height / 100) ** 2)).toFixed(2); } else { newVitalSign.bmi = ''; } };
const addProcedure = () => { if (newProcedureItem.service) { if (newProcedureItem.service === '-') { newProcedureItem.procedure = '-'; newProcedureItem.diagnosis = '-'; } procedures.value.push({ ...newProcedureItem }); Object.assign(newProcedureItem, { service: null, procedure: null, diagnosis: null, notes: '' }); playClickSound(); } };
const addDeclinedProcedure = () => { procedures.value.push({ service: 'ไม่รับการรักษา', procedure: '-', diagnosis: '-', notes: newProcedureItem.notes || 'ผู้ป่วยปฏิเสธการรับบริการ' }); Object.assign(newProcedureItem, { service: null, procedure: null, diagnosis: null, notes: '' }); playClickSound(); };
const removeProcedure = (index) => { procedures.value.splice(index, 1); playRemoveSound(); };
const openCertificateDialog = () => { if (!patientInfo.value.id) return; playClickSound(); certificateData.patientName = patientInfo.value.name; certificateData.patientIdCard = patientInfo.value.patientId; certificateData.vitals.weight = newVitalSign.weight; certificateData.vitals.height = newVitalSign.height; certificateData.vitals.pulse = newVitalSign.pulse; certificateData.vitals.bloodPressure = `${newVitalSign.bloodPressureSystolic || '-'}/${newVitalSign.bloodPressureDiastolic || '-'}`; if (patientInfo.value.underlyingDiseases && patientInfo.value.underlyingDiseases !== 'ไม่มี') { certificateData.hasChronicDisease = true; certificateData.chronicDiseaseDetail = patientInfo.value.underlyingDiseases; } else { certificateData.hasChronicDisease = false; certificateData.chronicDiseaseDetail = ''; } showCertificateDialog.value = true; };
const printCertificate = () => { playClickSound(); $q.notify({ message: 'กำลังสร้างเอกสารสำหรับพิมพ์...', icon: 'o_print', position: 'top', timeout: 1500 }); const formatThaiDate = (dateStr) => { if (!dateStr) return { day: '...', month: '...', year: '...' }; const d = new Date(dateStr.replace(/(\d{4})\/(\d{2})\/(\d{2})/, '$1-$2-$3')); const day = d.getDate(); const month = d.toLocaleString('th-TH', { month: 'long' }); const year = d.getFullYear() + 543; return { day, month, year }; }; const examFormattedDate = formatThaiDate(certificateData.examDate); const content = ` <div class="cert-container"> <div class="cert-header"> <h1>ใบรับรองแพทย์</h1> </div> <div class="cert-section"> <h2>ส่วนที่ 1: ของผู้ขอรับใบรับรองสุขภาพ</h2> <p>ข้าพเจ้า <span class="underline">${certificateData.patientName || '&nbsp;'.repeat(40)}</span></p> <p>สถานที่อยู่: <span class="underline">${certificateData.patientAddress || '&nbsp;'.repeat(60)}</span></p> <p>หมายเลขบัตรประชาชน: <span class="underline">${certificateData.patientIdCard || '&nbsp;'.repeat(25)}</span></p> </div> <div class="cert-section"> <h2>ส่วนที่ 2: ของแพทย์</h2> <p>สถานที่ตรวจ <span class="underline">${certificateData.hospitalName}</span> วันที่ <span class="underline">${examFormattedDate.day}</span> เดือน <span class="underline">${examFormattedDate.month}</span> พ.ศ. <span class="underline">${examFormattedDate.year}</span></p> <p>ข้าพเจ้าแพทย์ <span class="underline">${certificateData.doctorName}</span> ใบอนุญาตฯ เลขที่ <span class="underline">${certificateData.doctorLicense}</span></p> <p>ได้ตรวจร่างกายของ <span class="underline">${certificateData.patientName}</span> แล้ว และมีความเห็นดังนี้:</p> <div class="vitals-grid"> <span>น้ำหนัก: <span class="underline">${certificateData.vitals.weight || '&nbsp;'}</span> กก.</span> <span>ส่วนสูง: <span class="underline">${certificateData.vitals.height || '&nbsp;'}</span> ซม.</span> <span>ความดันโลหิต: <span class="underline">${certificateData.vitals.bloodPressure || '&nbsp;'}</span> มม.ปรอท</span> <span>ชีพจร: <span class="underline">${certificateData.vitals.pulse || '&nbsp;'}</span> ครั้ง/นาที</span> </div> <p><strong>ความเห็นแพทย์:</strong> ${certificateData.doctorOpinion}</p> <p><strong>สรุปและข้อแนะนำ:</strong> ${certificateData.doctorRecommendation}</p> </div> <div class="signature-area"> <div class="signature-box"> <p>ลงชื่อ .....................................................</p> <p>( ${certificateData.doctorName || '&nbsp;'.repeat(30)} )</p> <p>แพทย์ผู้ตรวจร่างกาย</p> </div> </div> </div> `; const styles = ` @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap'); body { font-family: 'Sarabun', sans-serif; background: #fff; color: #000; margin: 0; padding: 0; font-size: 14px; } .cert-container { width: 210mm; min-height: 297mm; padding: 12mm; margin: auto; box-sizing: border-box; } .cert-header { text-align: center; margin-bottom: 1.5rem; } h1 { font-size: 1.6rem; font-weight: bold; } .cert-section { margin-bottom: 1rem; } h2 { font-size: 1.1rem; font-weight: bold; } p { margin: 0.3rem 0; line-height: 1.7; } .underline { border-bottom: 1px dotted #000; padding: 0 0.2em; font-weight: bold; } .vitals-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.2rem 1rem; margin: 1rem 0; } .signature-area { display: flex; justify-content: flex-end; margin-top: 2rem; } .signature-box { width: 280px; text-align: center; } @page { size: A4; margin: 0; } `; const printWindow = window.open('', '_blank'); printWindow.document.write(`<html><head><title>ใบรับรองแพทย์</title><style>${styles}</style></head><body>${content}</body></html>`); printWindow.document.close(); printWindow.focus(); setTimeout(() => { printWindow.print(); printWindow.close(); }, 250); };
</script>

<style lang="scss" scoped>
/* --- All previous styles are here ... --- */
.dashboard-background { background-color: #0d1a26; font-family: 'Sarabun', sans-serif; color: #e0e0e0; }
.content-wrapper { position: relative; z-index: 2; padding-bottom: 80px; }
.header-icon { color: #38bdf8; text-shadow: 0 0 12px #38bdf8; }
.header-title { color: #ffffff; text-shadow: 0 0 8px rgba(56, 189, 248, 0.7); }
.welcome-text { color: #94a3b8; }
.header-action-btn { border: 1px solid rgba(56, 189, 248, 0.4); color: #94a3b8; border-radius: 50%; transition: all 0.3s ease; }
.header-action-btn:hover { background-color: rgba(56, 189, 248, 0.2); color: white; box-shadow: 0 0 12px rgba(56, 189, 248, 0.5); transform: scale(1.1); }
.progress-bar-animation { transition: width 0.5s ease-out; }
.main-card { background-color: rgba(15, 23, 42, 0.6); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-radius: 16px; border: 1px solid rgba(100, 116, 139, 0.3); color: #e0e0e0; transition: all 0.3s ease; }
.interactive-card:hover { border-color: rgba(56, 189, 248, 0.5); box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.3); }
.section-header { font-size: 1.25rem; font-weight: 600; color: #f1f5f9; padding-bottom: 12px; margin-bottom: 20px; border-bottom: 1px solid rgba(100, 116, 139, 0.3); display: flex; align-items: center; }
.section-header .q-icon { font-size: 1.8rem; margin-right: 12px; color: #38bdf8; }
.patient-avatar { border: 4px solid #38bdf8; box-shadow: 0 0 15px #38bdf8; display: flex; align-items: center; justify-content: center; }
.patient-details-box { background-color: rgba(56, 189, 248, 0.05); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 12px; }
.symptom-template-btn { background-color: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.3); color: #e0f2fe; padding: 8px 16px; font-size: 0.9rem; font-weight: 500; border-radius: 8px; transition: all 0.2s ease-in-out; }
.symptom-template-btn:hover { background-color: rgba(56, 189, 248, 0.25); border-color: #38bdf8; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(56, 189, 248, 0.2); }
.suggestion-chip { transition: all 0.2s ease-in-out; }
.suggestion-chip:hover { background-color: rgba(56, 189, 248, 0.2) !important; transform: scale(1.05); }
.popup-edit-content { background-color: #1e293b; padding: 16px; min-width: 320px; border: 1px solid rgba(100, 116, 139, 0.5); border-radius: 8px; }
:deep(.q-field--outlined.q-field--dark .q-field__control) { background: rgba(56, 189, 248, 0.05) !important; border-color: rgba(100, 116, 139, 0.5) !important; transition: all 0.3s ease; border-left: 4px solid transparent; }
:deep(.q-field--dark .q-field__label) { color: #94a3b8 !important; transition: color 0.3s ease; }
:deep(.q-field--outlined.q-field--dark.q-field--focused .q-field__control) { background: rgba(56, 189, 248, 0.1) !important; border-color: #38bdf8 !important; box-shadow: 0 0 8px rgba(56, 189, 248, 0.4); }
:deep(.q-field.field-filled .q-field__control) { border-left-color: #38bdf8 !important; background: rgba(56, 189, 248, 0.1) !important; }
:deep(.q-field.field-filled .q-field__label) { color: #f1f5f9 !important; }
.positive-action-btn, .negative-action-btn, .choice-btn { flex: 1; border-radius: 8px; transition: all 0.3s ease; border: 1px solid transparent; }
.choice-btn { background-color: rgba(148, 163, 184, 0.2); border: 1px solid rgba(148, 163, 184, 0.4); color: #94a3b8; }
.choice-btn:hover { background-color: rgba(148, 163, 184, 0.3); border-color: rgba(148, 163, 184, 0.6); }
.positive-action-btn, .choice-btn--active-positive { background-image: linear-gradient(to right, #0ea5e9, #2563eb); color: white; box-shadow: 0 2px 10px rgba(59, 130, 246, 0.3); }
.positive-action-btn:hover, .choice-btn--active-positive:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(59, 130, 246, 0.5); }
.negative-action-btn, .choice-btn--active-negative { background-image: linear-gradient(to right, #ef4444, #d946ef); color: white; box-shadow: 0 2px 10px rgba(239, 68, 68, 0.3); }
.negative-action-btn:hover, .choice-btn--active-negative:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(239, 68, 68, 0.5); }
.q-banner { background: transparent; }
.bmi-banner-underweight { background-color: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.4); color: #bae6fd; }
.bmi-banner-underweight :deep(.q-banner__avatar .q-icon) { color: #7dd3fc; }
.bmi-banner-underweight .text-weight-bold { color: #e0f2fe; }
.bmi-banner-normal { background-color: rgba(34, 197, 94, 0.15); border: 1px solid rgba(34, 197, 94, 0.4); color: #a7f3d0; }
.bmi-banner-normal :deep(.q-banner__avatar .q-icon) { color: #4ade80; }
.bmi-banner-normal .text-weight-bold { color: #f0fdf4; }
.bmi-banner-overweight { background-color: rgba(234, 179, 8, 0.15); border: 1px solid rgba(234, 179, 8, 0.4); color: #fef08a; }
.bmi-banner-overweight :deep(.q-banner__avatar .q-icon) { color: #facc15; }
.bmi-banner-overweight .text-weight-bold { color: #fefce8; }
.bmi-banner-obese1 { background-color: rgba(249, 115, 22, 0.15); border: 1px solid rgba(249, 115, 22, 0.4); color: #fed7aa; }
.bmi-banner-obese1 :deep(.q-banner__avatar .q-icon) { color: #fb923c; }
.bmi-banner-obese1 .text-weight-bold { color: #fff7ed; }
.bmi-banner-obese2 { background-color: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); color: #fecaca; }
.bmi-banner-obese2 :deep(.q-banner__avatar .q-icon) { color: #f87171; }
.bmi-banner-obese2 .text-weight-bold { color: #fef2f2; }
.primary-action-btn, .save-btn, .cert-btn { border-radius: 8px; padding: 10px 20px; font-size: 1rem; font-weight: 600; color: white; transition: all 0.3s ease; }
.primary-action-btn { background-color: #0ea5e9; box-shadow: 0 4px 15px -5px rgba(14, 165, 233, 0.5); }
.primary-action-btn:hover { background-color: #38bdf8; box-shadow: 0 6px 20px -5px rgba(56, 189, 248, 0.6); transform: translateY(-2px); }
.save-btn { background-color: #10b981; box-shadow: 0 4px 15px -5px rgba(16, 185, 129, 0.5); animation: pulse-green 2.5s infinite; }
.save-btn:hover { background-color: #34d399; box-shadow: 0 6px 20px -5px rgba(52, 211, 153, 0.6); transform: translateY(-2px); animation-play-state: paused; }
.cert-btn { background-color: #f97316; box-shadow: 0 4px 15px -5px rgba(249, 115, 22, 0.5); }
.cert-btn:hover { background-color: #fb923c; box-shadow: 0 6px 20px -5px rgba(251, 146, 60, 0.6); transform: translateY(-2px); }
@keyframes pulse-green { 0% { box-shadow: 0 4px 15px -5px rgba(16, 185, 129, 0.5); } 50% { box-shadow: 0 4px 25px -2px rgba(16, 185, 129, 0.7); } 100% { box-shadow: 0 4px 15px -5px rgba(16, 185, 129, 0.5); } }
:deep(.q-list.themed-list) { background-color: rgba(56, 189, 248, 0.05); border: 1px solid rgba(56, 189, 248, 0.15); border-radius: 12px; overflow: hidden; }
:deep(.q-list.themed-list .q-item):hover { background-color: rgba(56, 189, 248, 0.1) !important; }
.action-footer { background: rgba(13, 26, 38, 0.8); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-top: 1px solid rgba(100, 116, 139, 0.3); position: sticky; bottom: 0; z-index: 10; }
.list-item-animation { animation: fadeInSlideUp 0.6s ease-out forwards; opacity: 0; }
@keyframes fadeInSlideUp { from { opacity: 0; transform: translateY(25px); } to { opacity: 1; transform: translateY(0); } }
.form-disabled { opacity: 0.5; pointer-events: none; filter: grayscale(50%); }

/* --- NEW & MODIFIED STYLES --- */
.duration-btn { text-transform: none; font-weight: 500; }
.body-model-wrapper {
  border-radius: 12px;
  background-color: rgba(0,0,0,0.2);
  border: 1px solid rgba(100, 116, 139, 0.2);
  position: relative;
  overflow: hidden;
}
.body-model-wrapper::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  height: 450px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(56, 189, 248, 0) 70%);
  z-index: 0;
  pointer-events: none;
}
.body-model-container {
  max-width: 450px;
  margin: auto;
  position: relative;
  z-index: 1;
}
.body-part {
  fill: rgba(100, 116, 139, 0.2);
  stroke: rgba(120, 136, 159, 0.8);
  stroke-width: 2;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}
.body-part:hover {
  stroke: #7dd3fc;
  fill: rgba(100, 116, 139, 0.4);
  filter: drop-shadow(0 0 10px rgba(56, 189, 248, 0.7));
}

.body-labels {
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  pointer-events: none;
  .label-group line {
    stroke: #7dd3fc;
    stroke-width: 1;
    stroke-dasharray: 2 2;
  }
  .label-group text {
    font-family: 'monospace';
    font-size: 12px;
    fill: #e0f2fe;
  }
}
.body-model-wrapper:hover .body-labels {
  opacity: 0.7;
}

.pain--injury {
  fill: url(#injury-glow) !important;
  stroke: rgba(255, 120, 120, 0.9) !important;
  filter: drop-shadow(0 0 15px rgba(255, 20, 20, 0.8));
}
.pain--pain {
  fill: url(#pain-glow) !important;
  stroke: rgba(251, 146, 60, 0.9) !important;
  filter: drop-shadow(0 0 15px rgba(249, 115, 22, 0.8));
}
.pain--irritation {
  fill: url(#irritation-glow) !important;
  stroke: rgba(250, 204, 21, 0.9) !important;
  filter: drop-shadow(0 0 15px rgba(234, 179, 8, 0.8));
}
.pain-badge--injury { background-color: #ef4444; color: white; text-transform: capitalize; }
.pain-badge--pain { background-color: #f97316; color: white; text-transform: capitalize; }
.pain-badge--irritation { background-color: #eab308; color: #1e293b; text-transform: capitalize; }


.view-toggle-btn-group {
  background-color: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(100, 116, 139, 0.3);
}
.view-toggle-btn-group .q-btn {
  color: #94a3b8;
  transition: all 0.3s ease;
}
.view-toggle-btn-group .q-btn.active {
  background-color: #38bdf8;
  color: white;
  box-shadow: 0 0 15px rgba(56, 189, 248, 0.5);
}
</style>
