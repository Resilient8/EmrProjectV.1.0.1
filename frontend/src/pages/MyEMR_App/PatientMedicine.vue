<template>
  <q-page class="dashboard-background">
    <div v-if="visitData" class="q-pa-md">

      <div class="row items-center justify-between q-mb-md list-item-animation" style="animation-delay: 0.1s;">
        <div class="col-auto">
            <div class="row items-center">
            <q-icon name="o_medication" size="lg" class="q-mr-md header-icon" />
            <div class="text-h4 text-weight-bold header-title">จ่ายยาสำหรับผู้ป่วย</div>
          </div>
        </div>

        <div class="col-auto">
          <q-card class="main-card control-panel interactive-card">
            <q-card-section class="q-pa-none">
              <div class="row items-center no-wrap">
                <q-item
                  class="patient-header-item"
                  @mouseenter="showPatientMenu = true; throttledPlayHoverSound();"
                  @mouseleave="showPatientMenu = false"
                >
                  <q-item-section avatar>
                    <q-avatar color="primary" text-color="white" icon="o_person" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">{{ visitData.patientInfo.name }}</q-item-label>
                    <q-item-label caption class="welcome-text">ID: {{ visitData.patientInfo.patientId }}</q-item-label>
                  </q-item-section>
                  <q-menu v-model="showPatientMenu" anchor="bottom end" self="top end" :offset="[0, 8]" class="bg-transparent no-shadow" style="backdrop-filter: none;">
                    <q-card class="main-card popup-card" style="min-width: 350px;">
                      <q-card-section>
                        <div class="row items-center q-col-gutter-x-md q-mb-xs">
                          <div class="col-12"><span class="text-weight-bold">ชื่อ:</span> {{ visitData.patientInfo.name }} (ID: {{ visitData.patientInfo.patientId }})</div>
                          <div class="col-auto"><span class="text-weight-bold">เพศ:</span> {{ visitData.patientInfo.gender }}</div>
                          <div class="col-auto"><span class="text-weight-bold">อายุ:</span> {{ visitData.patientInfo.age }} ปี</div>
                        </div>
                        <q-separator dark class="q-my-sm" />
                        <div><span class="text-weight-bold">โรคประจำตัว:</span> {{ visitData.patientInfo.underlyingDisease || 'ไม่มี' }}</div>
                        <div class="q-mt-xs"><span class="text-weight-bold">การแพ้ยา:</span> <span :class="{'text-negative text-weight-bolder': visitData.patientInfo.allergies && visitData.patientInfo.allergies !== 'ไม่มี'}">{{ visitData.patientInfo.allergies || 'ไม่มี' }}</span></div>
                        <div class="q-mt-xs"><span class="text-weight-bold">การแพ้อาหาร:</span> <span :class="{'text-orange-9': visitData.patientInfo.foodAllergies && visitData.patientInfo.foodAllergies !== 'ไม่มี'}">{{ visitData.patientInfo.foodAllergies || 'ไม่มี' }}</span></div>
                      </q-card-section>
                    </q-card>
                  </q-menu>
                </q-item>

                <q-separator vertical inset dark />

                <q-item class="status-item" @mouseenter="throttledPlayHoverSound">
                  <q-item-section avatar>
                    <q-icon :name="statusIcon" :color="statusChipColor" size="sm" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption class="welcome-text">สถานะ</q-item-label>
                    <q-item-label class="text-weight-bold">{{ pageStatus }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-separator vertical inset dark />
                <div class="q-pa-sm">
                    <q-btn label="ใบสั่งยา" icon="o_print" @click="openPrescriptionDialog" @mouseenter="throttledPlayHoverSound" color="secondary" unelevated class="action-btn" />
                </div>

              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-5">
          <div class="list-item-animation" style="animation-delay: 0.2s;">
            <div class="text-subtitle1 text-weight-bold q-mb-sm subheader-title">ข้อมูลสำคัญผู้ป่วย</div>
            <q-card
              class="main-card q-mb-lg warning-card-dark interactive-card"
              @mouseenter="throttledPlayHoverSound"
              @click="showDetailDialog({
                icon: 'o_badge',
                title: 'ข้อมูลสำคัญผู้ป่วย',
                type: 'patientInfo',
                content: visitData.patientInfo
              })"
            >
              <q-card-section>
                <div class="info-row"><q-icon name="o_warning" color="negative" size="sm" class="q-mr-sm"/><span class="text-weight-medium q-mr-sm">การแพ้ยา:</span><span class="text-negative text-weight-bold ellipsis">{{ visitData.patientInfo.allergies || 'ไม่มีข้อมูล' }}</span></div>
                <div class="info-row q-mt-sm"><q-icon name="o_restaurant" color="orange" size="sm" class="q-mr-sm"/><span class="text-weight-medium q-mr-sm">การแพ้อาหาร:</span><span class="text-orange-9 ellipsis">{{ visitData.patientInfo.foodAllergies || 'ไม่มีข้อมูล' }}</span></div>
                <div class="info-row q-mt-sm"><q-icon name="o_medical_information" color="primary" size="sm" class="q-mr-sm"/><span class="text-weight-medium q-mr-sm">โรคประจำตัว:</span><span class="ellipsis">{{ visitData.patientInfo.underlyingDisease || 'ไม่มีข้อมูล' }}</span></div>
              </q-card-section>
            </q-card>
          </div>
          <div class="list-item-animation" style="animation-delay: 0.3s;">
            <div class="text-subtitle1 text-weight-bold q-mb-sm subheader-title">สัญญาณชีพ</div>
            <q-card
              class="main-card q-mb-lg interactive-card"
              @mouseenter="throttledPlayHoverSound"
              @click="showDetailDialog({
                icon: 'o_monitor_heart',
                title: 'สัญญาณชีพ',
                type: 'vitalSigns',
                content: visitData.vitalSigns
              })"
            >
                <q-card-section class="row q-col-gutter-sm">
                    <div class="col-6 vital-sign-item"><q-item-label caption class="welcome-text">อุณหภูมิ</q-item-label><q-item-label :class="isAbnormal(visitData.vitalSigns.temperature, 'temp') ? 'text-negative text-weight-bolder' : ''">{{ visitData.vitalSigns.temperature || '-' }} °C</q-item-label></div>
                    <div class="col-6 vital-sign-item"><q-item-label caption class="welcome-text">ชีพจร</q-item-label><q-item-label>{{ visitData.vitalSigns.pulse || '-' }} bpm</q-item-label></div>
                    <div class="col-6 vital-sign-item"><q-item-label caption class="welcome-text">การหายใจ</q-item-label><q-item-label>{{ visitData.vitalSigns.breathing || '-' }} /min</q-item-label></div>
                    <div class="col-6 vital-sign-item"><q-item-label caption class="welcome-text">ความดัน</q-item-label><q-item-label :class="isAbnormal(visitData.vitalSigns, 'bp') ? 'text-negative text-weight-bolder' : ''">{{ visitData.vitalSigns.bloodPressureSystolic || '-' }}/{{ visitData.vitalSigns.bloodPressureDiastolic || '-' }}</q-item-label></div>
                </q-card-section>
            </q-card>
          </div>
          <div class="list-item-animation" style="animation-delay: 0.4s;">
            <div class="text-subtitle1 text-weight-bold q-mb-sm subheader-title">ข้อมูลจากแพทย์</div>
              <q-card
                class="main-card interactive-card"
                @mouseenter="throttledPlayHoverSound"
                @click="showDetailDialog({
                  icon: 'o_assignment',
                  title: 'ข้อมูลจากแพทย์',
                  type: 'doctorNotes',
                  content: visitData.doctorNotes
                })"
              >
               <q-card-section>
                   <div class="info-row q-mb-md">
                     <q-icon name="o_assignment" color="primary" size="sm" class="q-mr-sm q-mt-xs"/>
                     <div>
                       <div class="text-weight-medium welcome-text">การวินิจฉัย:</div>
                       <div class="text-body1 ellipsis">{{ visitData.doctorNotes.diagnosis }}</div>
                     </div>
                   </div>
                   <q-separator dark class="q-my-sm"/>
                   <div class="info-row q-mt-md">
                     <q-icon name="o_rule" color="primary" size="sm" class="q-mr-sm q-mt-xs"/>
                     <div>
                       <div class="text-weight-medium welcome-text">แผนการรักษา:</div>
                       <div class="text-body1 ellipsis-3-lines">{{ visitData.doctorNotes.plan }}</div>
                     </div>
                   </div>
               </q-card-section>
             </q-card>
          </div>
        </div>

        <div class="col-12 col-md-7">
          <div class="list-item-animation" style="animation-delay: 0.5s;">
            <div class="text-subtitle1 text-weight-bold q-mb-sm subheader-title">รายการยาที่ต้องจ่าย</div>
            <q-card class="main-card">
              <q-list bordered separator dark class="med-list">
                <q-item v-for="(med, index) in prescriptionList" :key="index" class="med-item" :class="{'dispensed': med.dispensed}">
                  <q-item-section avatar>
                    <q-checkbox v-model="med.dispensed" color="positive" @update:model-value="playSelectionSound" :disable="pageStatus === 'จัดยาแล้ว'"/>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">{{ med.name }}</q-item-label>
                    <q-item-label caption class="welcome-text">{{ med.dosage }} | {{ med.instruction }}</q-item-label>
                      <q-item-label v-if="med.isEdited" caption class="change-log">
                      <q-icon name="o_history" class="q-mr-xs"/>
                      แก้ไขโดย {{ med.editedBy }} ({{ med.editedAt }}): จาก {{ med.originalState.name }} เป็น {{ med.name }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side class="text-right">
                      <q-item-label class="text-weight-bold text-h6">{{ med.quantity }}</q-item-label>
                      <q-item-label caption class="welcome-text">จำนวน</q-item-label>
                  </q-item-section>
                  <q-item-section side v-if="isEditingMedications" class="row no-wrap">
                      <q-btn flat round color="primary" icon="o_edit" @click="startEdit(index)" />
                      <q-btn v-if="!med.originalState" flat round color="negative" icon="o_delete" @click="removeMedication(index, med)" />
                  </q-item-section>
                </q-item>
              </q-list>

              <q-separator dark class="q-my-md"/>

              <q-card-section>
                <div v-if="!isEditingMedications && pageStatus !== 'จัดยาแล้ว'">
                    <q-btn
                      label="แก้ไข/เพิ่มรายการยา"
                      icon="o_edit_note"
                      @click="isEditingMedications = true; playClickSound();"
                      class="full-width primary-action-btn" unelevated
                    />
                </div>
                <div v-if="isEditingMedications">
                  <div class="text-subtitle1 text-weight-bold q-mb-md">{{ editingMedIndex !== null ? 'แก้ไขรายการยา' : 'เพิ่มรายการยาใหม่' }}</div>
                  <div class="row q-col-gutter-sm items-start q-mb-md">
                    <div class="col-12 col-md-6"><q-select dark dense outlined v-model="editMedicationModel.name" label="ชื่อยา" use-input :options="filteredMedicationOptions" @filter="filterMedication" new-value-mode="add-unique" @popup-show="playFormFocusSound" @update:model-value="playSelectionSound"/></div>
                    <div class="col-12 col-md-6"><q-select dark dense outlined v-model="editMedicationModel.dosage" label="ขนาด" use-input :options="dosageOptions" new-value-mode="add-unique" @popup-show="playFormFocusSound" @update:model-value="playSelectionSound"/></div>
                    <div class="col-6 col-md-3"><q-select dark dense outlined v-model="editMedicationModel.quantity" label="จำนวน" use-input :options="quantityOptions" new-value-mode="add-unique" type="number" @popup-show="playFormFocusSound" @update:model-value="playSelectionSound"/></div>
                    <div class="col-12 col-md-9"><q-select dark dense outlined v-model="editMedicationModel.instruction" label="วิธีใช้" use-input :options="instructionOptions" new-value-mode="add-unique" @popup-show="playFormFocusSound" @update:model-value="playSelectionSound"/></div>
                    <div class="col-12 q-mt-sm row justify-center q-gutter-sm">
                      <q-btn :label="editingMedIndex !== null ? 'บันทึกการแก้ไข' : 'เพิ่มรายการยา'" :icon="editingMedIndex !== null ? 'o_save' : 'o_add_circle'" class="primary-action-btn" @click="saveOrUpdateMedication" @mouseenter="throttledPlayHoverSound" style="min-width: 180px;"/>
                      <q-btn label="ยกเลิก" icon="o_cancel" class="negative-action-btn" @click="cancelEdit" @mouseenter="throttledPlayHoverSound" style="min-width: 180px;"/>
                    </div>
                  </div>
                </div>
              </q-card-section>

              <q-separator dark class="q-my-md"/>

              <q-card-section>
                  <q-select
                    dark
                    outlined
                    v-model="pharmacistNotes"
                    label="คำแนะนำเพิ่มเติมจากเภสัชกร"
                    multiple
                    use-chips
                    use-input
                    new-value-mode="add-unique"
                    :options="filteredPharmacistNoteOptions"
                    @filter="filterPharmacistNotes"
                    @popup-show="playFormFocusSound"
                    @update:model-value="playSelectionSound"
                    @remove="playRemoveSound"
                  />
              </q-card-section>

              <q-card-actions v-if="pageStatus !== 'จัดยาแล้ว'" class="q-pa-md action-footer">
                <div class="row full-width q-gutter-md">
                  <q-btn
                    label="กำลังรับยา" icon="o_save"
                    @click="markAsInProgress"
                    @mouseenter="throttledPlayHoverSound"
                    class="col primary-action-btn" unelevated size="lg"
                  />
                  <q-btn
                    label="ยืนยันการจ่ายยาทั้งหมด" icon="task_alt"
                    @click="confirmDispensing"
                    @mouseenter="throttledPlayHoverSound"
                    class="col positive-btn pulsing-glow" unelevated size="lg"
                    :disable="!allMedsDispensed"
                  />
                </div>
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="fixed-center text-center">
      <q-spinner-dots color="primary" size="50px" />
      <div class="q-mt-md welcome-text">กำลังโหลดข้อมูล...</div>
    </div>

    <q-dialog v-model="postDispenseDialog" class="themed-dialog" persistent transition-show="fade-in-scale" transition-hide="fade-out-scale">
      <q-card class="themed-dialog-card" style="width: 450px;">
        <q-card-section class="final-confirm-dialog">
          <div class="dialog-icon-wrapper" style="color: #26a69a; filter: drop-shadow(0 0 10px rgba(38, 166, 154, 0.6));">
            <q-icon name="task_alt" />
          </div>
          <div class="dialog-title-text">การจ่ายยาเสร็จสมบูรณ์</div>
          <div class="dialog-message-text">
            บันทึกข้อมูลการจ่ายยาเรียบร้อยแล้ว
          </div>
        </q-card-section>
        <q-card-actions class="justify-center q-pb-md bg-dark-2">
          <q-btn
            label="ปิด"
            class="dialog-secondary-btn"
            @click="postDispenseDialog = false; playClickSound();"
            unelevated
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showPrescriptionDialog" persistent>
        <q-card class="certificate-dialog-card">
            <q-bar class="bg-primary text-white no-print">
                <q-icon name="o_description" />
                <div>ใบสั่งยาผู้ป่วยนอก</div>
                <q-space />
                <q-btn dense flat icon="print" @click="generateAndPrintDocument">
                    <q-tooltip class="tooltip-glassy">พิมพ์</q-tooltip>
                </q-btn>
                <q-btn dense flat icon="close" v-close-popup>
                    <q-tooltip class="tooltip-glassy">ปิด</q-tooltip>
                </q-btn>
            </q-bar>
            <q-card-section class="q-pa-lg scroll" style="height: 80vh;">
                <div class="text-h6 text-center q-mb-md">ตรวจสอบข้อมูลก่อนพิมพ์</div>
                <div class="part-title">ข้อมูลผู้ป่วยและแพทย์</div>
                <div class="row q-col-gutter-md">
                    <div class="col-12 col-sm-6"><q-input dark dense outlined v-model="prescriptionPrintData.patientName" label="ชื่อผู้ป่วย" readonly /></div>
                    <div class="col-12 col-sm-6"><q-input dark dense outlined v-model="prescriptionPrintData.patientId" label="HN" readonly /></div>
                    <div class="col-12 col-sm-6"><q-input dark dense outlined v-model="prescriptionPrintData.doctorName" label="แพทย์ผู้สั่งยา" /></div>
                    <div class="col-12 col-sm-6"><q-input dark dense outlined v-model="prescriptionPrintData.doctorCode" label="รหัสแพทย์" /></div>
                </div>
                <q-separator dark class="q-my-lg" />
                <div class="part-title">ข้อมูลการจ่ายยา</div>
                  <div class="row q-col-gutter-md">
                    <div class="col-12 col-sm-6"><q-input dark dense outlined v-model="prescriptionPrintData.pharmacistName" label="เภสัชกรผู้จ่ายยา" /></div>
                    <div class="col-12 col-sm-6"><q-input dark dense outlined v-model="prescriptionPrintData.totalCost" label="รวมค่ายา (บาท)" type="number" /></div>
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>

    <q-dialog v-model="isDetailDialogVisible">
      <q-card class="main-card detail-dialog-card">
        <q-toolbar class="main-card-header">
          <q-icon :name="selectedDetail.icon" size="24px" class="q-mr-md" />
          <q-toolbar-title class="text-h6 text-weight-bold header-title">{{ selectedDetail.title }}</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup @click="playClickSound"/>
        </q-toolbar>

        <q-card-section class="q-pa-lg" style="max-height: 70vh; overflow-y: auto;">
          <div v-if="selectedDetail.type === 'patientInfo'">
            <div class="detail-dialog-row">
              <q-icon name="o_warning" color="negative" size="sm" />
              <span class="text-weight-medium">การแพ้ยา:</span>
              <span class="text-negative text-weight-bold">{{ selectedDetail.content.allergies || 'ไม่มีข้อมูล' }}</span>
            </div>
             <div class="detail-dialog-row">
              <q-icon name="o_restaurant" color="orange" size="sm" />
              <span class="text-weight-medium">การแพ้อาหาร:</span>
              <span class="text-orange-9">{{ selectedDetail.content.foodAllergies || 'ไม่มีข้อมูล' }}</span>
            </div>
             <div class="detail-dialog-row">
              <q-icon name="o_medical_information" color="primary" size="sm" />
              <span class="text-weight-medium">โรคประจำตัว:</span>
              <span>{{ selectedDetail.content.underlyingDisease || 'ไม่มีข้อมูล' }}</span>
            </div>
          </div>

          <div v-if="selectedDetail.type === 'doctorNotes'">
            <div class="q-mb-md">
              <div class="text-subtitle1 text-weight-bold text-primary">การวินิจฉัย</div>
              <p class="text-body1 q-pl-sm" style="white-space: pre-wrap;">{{ selectedDetail.content.diagnosis }}</p>
            </div>
            <div>
              <div class="text-subtitle1 text-weight-bold text-primary">แผนการรักษา</div>
              <p class="text-body1 q-pl-sm" style="white-space: pre-wrap;">{{ selectedDetail.content.plan }}</p>
            </div>
          </div>

          <q-list v-if="selectedDetail.type === 'vitalSigns'" separator class="detail-dialog-list">
            <q-item>
              <q-item-section><q-item-label caption>อุณหภูมิ</q-item-label></q-item-section>
              <q-item-section side><q-item-label class="text-body1">{{ selectedDetail.content.temperature || '-' }} °C</q-item-label></q-item-section>
            </q-item>
            <q-item>
              <q-item-section><q-item-label caption>ชีพจร</q-item-label></q-item-section>
              <q-item-section side><q-item-label class="text-body1">{{ selectedDetail.content.pulse || '-' }} bpm</q-item-label></q-item-section>
            </q-item>
            <q-item>
              <q-item-section><q-item-label caption>การหายใจ</q-item-label></q-item-section>
              <q-item-section side><q-item-label class="text-body1">{{ selectedDetail.content.breathing || '-' }} /min</q-item-label></q-item-section>
            </q-item>
            <q-item>
              <q-item-section><q-item-label caption>ความดันโลหิต</q-item-label></q-item-section>
              <q-item-section side><q-item-label class="text-body1">{{ selectedDetail.content.bloodPressureSystolic || '-' }}/{{ selectedDetail.content.bloodPressureDiastolic || '-' }} mmHg</q-item-label></q-item-section>
            </q-item>
          </q-list>

        </q-card-section>
      </q-card>
    </q-dialog>
    </q-page>
</template>

<script setup>
// ... SCRIPT IS UNCHANGED FROM PREVIOUS VERSION ...
import * as Tone from 'tone';
import { ref, onMounted, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

// --- SOUND SYSTEM ---
const createSynth = (synth, options, volume) => {
  const s = new synth(options).toDestination();
  s.volume.value = volume;
  return s;
};

const revealSynth = createSynth(Tone.PolySynth, { synth: Tone.AMSynth, options: { harmonicity: 1.2, envelope: { attack: 0.3, decay: 0.5, sustain: 0.1, release: 0.8 }, modulationEnvelope: { attack: 0.1, decay: 0.2, sustain: 0.5, release: 0.8 }}}, -12);
const revealFilter = new Tone.AutoFilter("4n").toDestination().start();
revealFilter.baseFrequency = 100;
revealFilter.octaves = 5;
revealSynth.connect(revealFilter);

const hoverSynth = createSynth(Tone.NoiseSynth, { noise: { type: 'pink' }, envelope: { attack: 0.001, decay: 0.15, sustain: 0 } }, -28);
const clickSynth = createSynth(Tone.FMSynth, { harmonicity: 8, modulationIndex: 2, oscillator: { type: "sine" }, envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.2 }, modulation: { type: "square" }, modulationEnvelope: { attack: 0.002, decay: 0.2, sustain: 0, release: 0.2 } }, -10);
const formFocusSynth = createSynth(Tone.Synth, { oscillator: { type: 'triangle' }, envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.1 } }, -20);
const selectionSynth = createSynth(Tone.Synth, { oscillator: { type: 'sine' }, envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 0.1 } }, -16);
const removeSynth = createSynth(Tone.MembraneSynth, { pitchDecay: 0.05, octaves: 10, oscillator: { type: 'sine' }, envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4, attackCurve: 'exponential' } }, -12);
const bulbSynth = createSynth(Tone.FMSynth, { harmonicity: 1.5, modulationIndex: 12, envelope: { attack: 0.002, decay: 0.2, sustain: 0, release: 0.2 }, modulation: { type: 'sine' }, modulationEnvelope: { attack: 0.02, decay: 0.1, sustain: 0, release: 0.2 } }, -12);
const dialogSynth = createSynth(Tone.FMSynth, { harmonicity: 0.8, modulationIndex: 4, envelope: { attack: 0.2, decay: 0.8, sustain: 0.1, release: 1 }, modulation: { type: 'sine' }, modulationEnvelope: { attack: 0.1, decay: 0.5, sustain: 0.2, release: 0.8 } }, -15);

let lastHoverTime = 0;
const throttleDelay = 100;
let isRemoving = false;

const playSound = (synth, note, duration) => {
  if (Tone.context.state !== 'running') Tone.context.resume();
  synth.triggerAttackRelease(note, duration);
};

const playTitleRevealSound = () => playSound(revealSynth, ["C3", "E3", "G3"], "1s");
const throttledPlayHoverSound = () => {
  const now = Date.now();
  if (now - lastHoverTime > throttleDelay) {
    playSound(hoverSynth, "C4", "8n");
    lastHoverTime = now;
  }
};
const playClickSound = () => playSound(clickSynth, "C5", "32n");
const playFormFocusSound = () => playSound(formFocusSynth, "G5", "32n");
const playSelectionSound = () => { if (!isRemoving) playSound(selectionSynth, "C6", "16n"); };
const playRemoveSound = () => {
  playSound(removeSynth, "C2", "8n");
  isRemoving = true;
  setTimeout(() => { isRemoving = false; }, 50);
};
const playBulbSound = () => playSound(bulbSynth, "G5", "16n");
const playDialogSound = () => playSound(dialogSynth, "C4", "2n");
// --- END OF SOUNDS ---

// --- DIALOG LOGIC ---
const isDetailDialogVisible = ref(false);
const selectedDetail = ref({});
const showDetailDialog = (detail) => {
  selectedDetail.value = detail;
  isDetailDialogVisible.value = true;
  playClickSound();
};
// --- END DIALOG LOGIC ---

const router = useRouter();
const $q = useQuasar();

const mockVisitData = {
  patientInfo: {
    name: 'นายสมชาย ใจดี', patientId: 'HXH0001', gender: 'ชาย', age: 45,
    allergies: 'Penicillin', foodAllergies: 'ไม่มี', underlyingDisease: 'ความดันโลหิตสูง'
  },
  doctorNotes: {
    doctorName: 'นพ. เก่งกาจ', doctorCode: 'D007', diagnosis: 'Acute Pharyngitis (คออักเสบเฉียบพลัน)',
    plan: 'ให้ยาปฏิชีวนะและยาลดไข้, แนะนำให้พักผ่อนและดื่มน้ำมากๆ'
  },
  vitalSigns: { temperature: 38.5, pulse: 92, breathing: 20, bloodPressureSystolic: 145, bloodPressureDiastolic: 90 },
  medications: [
    { name: 'Amoxicillin', dosage: '500mg', quantity: 20, instruction: '1 เม็ด 3 เวลาหลังอาหาร', price: 150 },
    { name: 'Paracetamol', dosage: '500mg', quantity: 10, instruction: '1-2 เม็ด ทุก 4-6 ชม. เมื่อมีอาการ', price: 20 },
  ]
};

const visitData = ref(null);
const prescriptionList = ref([]);
const pharmacistNotes = ref([]);
const isEditingMedications = ref(false);
const showPatientMenu = ref(false);
const postDispenseDialog = ref(false);

const currentPharmacist = ref('ภญ.สมหญิง ใจดี'); // Hardcoded pharmacist name
const editingMedIndex = ref(null); // To track which medication is being edited
const editMedicationModel = reactive({ name: '', dosage: '', quantity: '', instruction: '' });

// --- Prescription Print Dialog State ---
const showPrescriptionDialog = ref(false);
const prescriptionPrintData = reactive({
    patientName: '',
    patientId: '',
    doctorName: '',
    doctorCode: '',
    pharmacistName: '',
    totalCost: 0,
});

const medicationOptions = ref(['Paracetamol 500mg', 'Amoxicillin 500mg', 'Ibuprofen 400mg', 'Loratadine 10mg']);
const dosageOptions = ref(['500mg', '250mg', '10mg', '20mg']);
const quantityOptions = ref([7, 10, 14, 20, 28, 30, 60]);
const instructionOptions = ref(['1 เม็ด วันละครั้ง หลังอาหารเช้า', '1 เม็ด 3 เวลา หลังอาหาร', '1-2 เม็ด ทุก 4-6 ชั่วโมง เมื่อมีอาการ']);
const pharmacistNoteOptions = ref(['ควรรับประทานยาติดต่อกันจนหมด', 'ยานี้อาจทำให้ง่วงซึม ควรหลีกเลี่ยงการขับขี่', 'หากมีอาการผิดปกติให้หยุดยาและปรึกษาแพทย์ทันที']);
const filteredMedicationOptions = ref([]);
const filteredPharmacistNoteOptions = ref([]);

const pageStatus = ref('รอจัดยา');

const statusChipColor = computed(() => {
  switch (pageStatus.value) {
    case 'รอจัดยา': return 'deep-orange';
    case 'กำลังรับยา': return 'light-blue-7';
    case 'จัดยาแล้ว': return 'positive';
    default: return 'grey-7';
  }
});

const statusIcon = computed(() => {
  switch (pageStatus.value) {
    case 'รอจัดยา': return 'o_hourglass_top';
    case 'กำลังรับยา': return 'o_sync';
    case 'จัดยาแล้ว': return 'o_task_alt';
    default: return 'o_label';
  }
});

const allMedsDispensed = computed(() => {
  if (prescriptionList.value.length === 0) return false;
  return prescriptionList.value.every(med => med.dispensed);
});

onMounted(() => {
  setTimeout(() => {
    visitData.value = mockVisitData;
    prescriptionList.value = mockVisitData.medications.map(med => ({
      ...med,
      dispensed: false,
      originalState: { ...med }, // Store the original state
      isEdited: false,
      editedBy: null,
      editedAt: null,
    }));
    filteredMedicationOptions.value = [...medicationOptions.value];
    filteredPharmacistNoteOptions.value = [...pharmacistNoteOptions.value];
    playTitleRevealSound();
  }, 500);
});

const resetEditForm = () => {
  editingMedIndex.value = null;
  editMedicationModel.name = '';
  editMedicationModel.dosage = '';
  editMedicationModel.quantity = '';
  editMedicationModel.instruction = '';
};

const startEdit = (index) => {
  playClickSound();
  editingMedIndex.value = index;
  const medToEdit = prescriptionList.value[index];
  Object.assign(editMedicationModel, medToEdit);
  isEditingMedications.value = true;
};

const cancelEdit = () => {
  playRemoveSound();
  resetEditForm();
  isEditingMedications.value = false;
};

const saveOrUpdateMedication = () => {
  playClickSound();
  // Update existing medication
  if (editingMedIndex.value !== null) {
    const medToUpdate = prescriptionList.value[editingMedIndex.value];
    Object.assign(medToUpdate, editMedicationModel);
    medToUpdate.isEdited = true;
    medToUpdate.editedBy = currentPharmacist.value;
    medToUpdate.editedAt = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  } else { // Add new medication
    if (editMedicationModel.name && editMedicationModel.quantity) {
      prescriptionList.value.push({
        ...editMedicationModel,
        dispensed: false,
        originalState: null, // This is a new item, no original state
        isEdited: false,
      });
    } else {
      $q.notify({ type: 'warning', message: 'กรุณากรอกชื่อยาและจำนวน', position: 'top' });
      return;
    }
  }
  resetEditForm();
};


const markAsInProgress = () => {
  playClickSound();
  if (pageStatus.value !== 'กำลังรับยา') {
    pageStatus.value = 'กำลังรับยา';
  }
  const progressData = {
    ...visitData.value,
    medications: [...prescriptionList.value],
    pharmacistNotes: pharmacistNotes.value,
    lastSaved: new Date().toISOString()
  };
  console.log(`Progress saved at: ${progressData.lastSaved}`, progressData);
  $q.notify({
    classes: 'themed-notify themed-notify-info',
    icon: 'o_save',
    message: "บันทึกข้อมูลล่าสุดเรียบร้อยแล้ว",
    position: 'top',
    timeout: 2000
  });
};

const saveDispensingRecord = () => {
  $q.loading.show({ message: 'กำลังบันทึกข้อมูล...' });
  const finalDispensingRecord = {
    ...visitData.value,
    medications: [...prescriptionList.value],
    pharmacistNotes: pharmacistNotes.value,
    dispensedAt: new Date().toISOString()
  };
  console.log("Final Dispensing Record to save:", finalDispensingRecord);

  setTimeout(() => {
    $q.loading.hide();
    pageStatus.value = 'จัดยาแล้ว';
    isEditingMedications.value = false;
    $q.notify({
      classes: 'themed-notify themed-notify-positive',
      icon: 'cloud_done',
      message: 'บันทึกการจ่ายยาเรียบร้อยแล้ว!',
      position: 'top'
    });
    postDispenseDialog.value = true;
  }, 1500);
};

const filterFn = (val, update, sourceOptions, targetRef) => {
  update(() => {
    if (val === '') {
      targetRef.value = sourceOptions.value;
    } else {
      const needle = val.toLowerCase();
      targetRef.value = sourceOptions.value.filter(v => v.toLowerCase().indexOf(needle) > -1);
    }
  });
};

const filterMedication = (val, update) => filterFn(val, update, medicationOptions, filteredMedicationOptions);
const filterPharmacistNotes = (val, update) => filterFn(val, update, pharmacistNoteOptions, filteredPharmacistNoteOptions);

const isAbnormal = (value, type) => {
  if (value === null || value === undefined) return false;
  switch (type) {
    case 'temp': return value >= 37.5;
    case 'bp': return value.bloodPressureSystolic >= 140 || value.bloodPressureDiastolic >= 90;
    default: return false;
  }
};

const removeMedication = (index, med) => {
  playRemoveSound();
  $q.dialog({
    class: 'themed-dialog',
    dark: true,
    title: ' ',
    message: `<div class="final-confirm-dialog"><div class="dialog-icon-wrapper"><i class="q-icon notranslate material-icons">warning</i></div><div class="dialog-title-text">ยืนยันการลบ</div><div class="dialog-message-text">คุณต้องการลบรายการยา "<span class="text-weight-medium">${med.name}</span>" ใช่หรือไม่?</div></div>`,
    html: true,
    persistent: true,
    ok: { label: 'ลบ', class: 'dialog-positive-btn' },
    cancel: { label: 'ยกเลิก', class: 'dialog-secondary-btn' },
  }).onOk(() => {
    playClickSound();
    prescriptionList.value.splice(index, 1);
    $q.notify({
      classes: 'themed-notify themed-notify-positive',
      message: `ลบรายการยา ${med.name} เรียบร้อยแล้ว`,
      icon: 'delete_sweep', position: 'top'
    });
  });
};

const confirmDispensing = () => {
  playDialogSound();
  $q.dialog({
    class: 'themed-dialog',
    dark: true,
    title: ' ',
    message: `<div class="final-confirm-dialog"><div class="dialog-icon-wrapper"><i class="q-icon notranslate material-icons">task_alt</i></div><div class="dialog-title-text">ยืนยันการจ่ายยา</div><div class="dialog-message-text">คุณได้ตรวจสอบและจ่ายยาทั้งหมดครบถ้วนแล้วใช่หรือไม่?</div></div>`,
    html: true,
    persistent: true,
    ok: { label: 'ยืนยัน', class: 'dialog-positive-btn' },
    cancel: { label: 'ยกเลิก', class: 'dialog-secondary-btn' },
  }).onOk(() => {
    playClickSound();
    saveDispensingRecord();
  });
};

// --- Print and Save Functions ---
const openPrescriptionDialog = () => {
    if(!visitData.value) return;
    const { patientInfo, doctorNotes } = visitData.value;
    prescriptionPrintData.patientName = patientInfo.name;
    prescriptionPrintData.patientId = patientInfo.patientId;
    prescriptionPrintData.doctorName = doctorNotes.doctorName;
    prescriptionPrintData.doctorCode = doctorNotes.doctorCode;
    prescriptionPrintData.pharmacistName = currentPharmacist.value;
    prescriptionPrintData.totalCost = prescriptionList.value.reduce((sum, med) => sum + (med.price || 0), 0);
    showPrescriptionDialog.value = true;
}

const generateMedicationRows = (meds) => {
  let rows = meds.map(med => `
    <tr>
      <td>${med.name} - ${med.dosage}<br>${med.instruction}</td>
      <td>${med.quantity}</td>
      <td></td>
      <td></td>
    </tr>
  `).join('');
  // Add empty rows to fill the table
  for (let i = meds.length; i < 10; i++) {
    rows += `<tr><td>&nbsp;</td><td></td><td></td><td></td></tr>`;
  }
  return rows;
};

const generateAndPrintDocument = () => {
  const today = new Date();
  const expiryDate = new Date(today);
  expiryDate.setDate(today.getDate() + 7); // Prescription expires in 7 days

  const formatDate = (date) => date.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });

  let printableHTML = `
  <!DOCTYPE html>
  <html lang="th">
  <head>
      <meta charset="UTF-8">
      <title>ใบสั่งยาผู้ป่วยนอก - ${prescriptionPrintData.patientName}</title>
      <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap" rel="stylesheet">
      <style>
          body { font-family: 'Sarabun', sans-serif; margin: 0; color: #000; background: #fff; font-size: 12px; }
          .page { width: 210mm; min-height: 297mm; padding: 10mm; margin: auto; box-sizing: border-box; display: flex; flex-direction: column; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #000; padding-bottom: 5px; }
          .header-left { display: flex; align-items: center; }
          .header-left img { width: 60px; height: 60px; margin-right: 10px; }
          .header-left div { font-size: 14px; font-weight: bold; }
          .header-right { text-align: right; }
          .med-table { width: 100%; border-collapse: collapse; margin-top: 5px; table-layout: fixed; flex-grow: 1; }
          .med-table th, .med-table td { border: 1px solid #000; padding: 4px; vertical-align: top; }
          .med-table th { text-align: center; font-weight: bold; }
          .med-table td { height: 40px; }
          .col-main { width: 50%; }
          .col-qty { width: 10%; }
          .col-pharm { width: 20%; }
          .col-doc { width: 20%; }
          .footer { margin-top: 5px; }
          .footer-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5px 20px; border: 1px solid #000; padding: 5px; }
          .footer-item { display: flex; align-items: baseline; }
          .footer-label { min-width: 80px; }
          .underline { border-bottom: 1px dotted #000; flex-grow: 1; text-align: center; }
          .policy-text { font-size: 10px; margin-top: 5px; }
          .price-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5px 20px; }
      </style>
  </head>
  <body>
      <div class="page">
          <div class="header">
              <div class="header-left">
                  <img src="https://placehold.co/60x60?text=Logo" alt="Hospital Logo">
                  <div>
                      ใบสั่งยาผู้ป่วยนอก<br>
                      โรงพยาบาลสวนดอก
                  </div>
              </div>
              <div class="header-right">
                  <p><strong>HN:</strong> ${prescriptionPrintData.patientId}</p>
                  <p><strong>ชื่อ-สกุล:</strong> ${prescriptionPrintData.patientName}</p>
                  <p><strong>อายุ:</strong> ${visitData.value.patientInfo.age} ปี</p>
                  <p><strong>แพ้ยา:</strong> <span style="font-weight:bold; text-decoration: underline;">${visitData.value.patientInfo.allergies}</span></p>
              </div>
          </div>

          <table class="med-table">
              <thead>
                  <tr>
                      <th class="col-main">ชื่อยา - รูปแบบ - ขนาดยา - วิธีใช้</th>
                      <th class="col-qty">จำนวนยา</th>
                      <th class="col-pharm">★★ สำหรับห้องยา<br>(แจ้ง/ขอข้อมูลเพิ่มเติม)</th>
                      <th class="col-doc">★★★ สำหรับแพทย์ระบุ<br>เหตุผลการไม่สั่งใช้ยา<br>บัญชียาหลักแห่งชาติ</th>
                  </tr>
              </thead>
              <tbody>
                  ${generateMedicationRows(prescriptionList.value)}
              </tbody>
          </table>
          <div class="footer">
              <div style="font-size: 11px; margin-top: 5px;">[ ] มีรายการยาซึ่งสั่งเพิ่มเติมด้านหลัง</div>
              <div class="footer-grid">
                  <div class="footer-item"><span class="footer-label">แพทย์ผู้สั่งยา</span><span class="underline">${prescriptionPrintData.doctorName}</span></div>
                  <div class="footer-item"><span class="footer-label">รหัส</span><span class="underline">${prescriptionPrintData.doctorCode || '&nbsp;'}</span></div>
                  <div class="footer-item"><span class="footer-label">แพทย์</span><span class="underline">&nbsp;</span></div>
                  <div class="footer-item"><span class="footer-label">หมดอายุ</span><span class="underline">${formatDate(expiryDate)}</span></div>
              </div>
              <div class="price-grid">
                  <div class="policy-text">
                      1. ข้าพเจ้าเป็นผู้มีสิทธิ์สั่งยาตามประกาศโรงพยาบาลศิริราช<br>
                      2. การใช้ยานอกบัญชี เป็นไปเพื่อรักษาโรค / ภาวะผิดปกติที่กำหนดตามประกาศโรงพยาบาลศิริราช
                  </div>
                  <div class="price-details">
                      <div class="footer-item"><span class="footer-label">รวมค่ายา</span><span class="underline">${Number(prescriptionPrintData.totalCost).toFixed(2)}</span></div>
                      <div class="footer-item"><span class="footer-label">ราคา ส่วนที่เบิกไม่ได้</span><span class="underline">&nbsp;</span></div>
                      <div class="footer-item"><span class="footer-label">ผู้คิดราคา</span><span class="underline">${prescriptionPrintData.pharmacistName}</span></div>
                  </div>
              </div>
          </div>
      </div>
  </body>
  </html>
  `;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(printableHTML);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
     printWindow.print();
  }, 500);
};

const handleDownloadPDF = () => {
  playClickSound();
  postDispenseDialog.value = false;
  $q.notify({
    classes: 'themed-notify themed-notify-info',
    icon: 'o_picture_as_pdf',
    message: 'กำลังเปิดหน้าต่างพิมพ์เพื่อบันทึกเป็น PDF',
    position: 'top',
    timeout: 2500
  });
  generateAndPrintDocument();
};

const handlePrintRecord = () => {
  playClickSound();
  postDispenseDialog.value = false;
  $q.notify({
    classes: 'themed-notify themed-notify-info',
    icon: 'o_print',
    message: 'กำลังเปิดหน้าต่างพิมพ์',
    position: 'top',
    timeout: 2500
  });
  generateAndPrintDocument();
};

</script>

<style lang="scss" scoped>
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

.subheader-title {
  color: #cce7ff;
  padding-left: 12px;
  border-left: 4px solid #00b8ff;
  text-shadow: 0 0 3px rgba(0, 184, 255, 0.3);
}

.welcome-text { color: #90a4ae; }

.action-btn {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.primary-action-btn, .positive-btn, .negative-action-btn {
  border-radius: 8px;
  transition: color 0.4s ease, background-position 0.4s ease, box-shadow 0.3s ease;
  position: relative;
  z-index: 1;
  background-size: 200% 100%;
  background-position: 100% 0;
}

.primary-action-btn {
  border: 1px solid #00b8ff;
  color: #00b8ff;
  background-image: linear-gradient(to left, transparent 50%, #00b8ff 50%);
  &:hover {
    color: white;
    background-position: 0 0;
    box-shadow: 0 0 12px rgba(0, 184, 255, 0.7);
  }
}

.positive-btn {
  border: 1px solid #26a69a;
  color: #26a69a;
  background-image: linear-gradient(to left, transparent 50%, #26a69a 50%);
  &:hover {
    color: white;
    background-position: 0 0;
    box-shadow: 0 0 12px rgba(38, 166, 154, 0.7);
  }
}

.negative-action-btn {
  border: 1px solid #ff5252;
  color: #ff5252;
  background-image: linear-gradient(to left, transparent 50%, #ff5252 50%);
  &:hover {
    color: white;
    background-position: 0 0;
    box-shadow: 0 0 12px rgba(255, 82, 82, 0.7);
  }
}

.main-card {
  background: linear-gradient(135deg, rgba(38, 50, 56, 0.5), rgba(38, 50, 56, 0.3));
  backdrop-filter: blur(8px);
  border-radius: 12px;
  border: 1px solid rgba(0, 184, 255, 0.2);
  box-shadow: 0 4px 30px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(0, 184, 255, 0.1);
  color: #e0e0e0;
}

.popup-card {
  border: 1px solid rgba(0, 184, 255, 0.4);
  box-shadow: 0 0 25px rgba(0, 184, 255, 0.2);
}

.interactive-card {
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  &:hover {
    transform: translateY(-6px) scale(1.02);
    border-color: rgba(0, 184, 255, 0.5);
    box-shadow: 0 8px 40px rgba(0,0,0,0.2);
  }
}

.control-panel .patient-header-item, .control-panel .status-item {
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.control-panel .patient-header-item:hover, .control-panel .status-item:hover {
  background-color: rgba(0, 184, 255, 0.1);
}

.warning-card-dark {
  background-color: rgba(255, 196, 61, 0.05);
  border-color: rgba(255, 196, 61, 0.3);
}

.info-row { display: flex; align-items: flex-start; font-size: 1rem; }
.vital-sign-item { padding: 8px; }
.vital-sign-item .q-item__label--caption { font-size: 0.8rem; }
.vital-sign-item .q-item__label { font-size: 1.1rem; font-weight: 500; }

.med-list {
  border-radius: 8px;
  border: 1px solid rgba(0, 184, 255, 0.2);
  background-color: rgba(0, 0, 0, 0.1);
}
.med-item {
  transition: background-color 0.3s;
  min-height: 88px;
}
.med-item.dispensed {
  background-color: rgba(38, 166, 154, 0.1);
}
.med-item.dispensed .q-item__label {
  text-decoration: line-through;
  opacity: 0.6;
}

.change-log {
  color: #ffc107 !important;
  font-size: 0.75rem;
  font-style: italic;
  margin-top: 4px;
}

.action-footer {
  background-color: rgba(0, 0, 0, 0.1);
  border-top: 1px solid rgba(0, 184, 255, 0.2);
}

.pulsing-glow {
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0% { box-shadow: 0 0 5px rgba(38, 166, 154, 0.4); }
  50% { box-shadow: 0 0 20px rgba(38, 166, 154, 0.8); }
  100% { box-shadow: 0 0 5px rgba(38, 166, 154, 0.4); }
}

.certificate-dialog-card {
    width: 900px;
    max-width: 95vw;
    background-color: #16222c;
    border: 1px solid rgba(0, 184, 255, 0.3);
}

.part-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #cce7ff;
  border-left: 4px solid #00b8ff;
  padding-left: 12px;
  margin-bottom: 1rem;
}

.tooltip-glassy {
  background: rgba(38, 50, 56, 0.8);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(0, 184, 255, 0.2);
  color: white;
}

.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ellipsis-3-lines {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
}

.detail-dialog-card {
  width: 700px;
  max-width: 95vw;
  box-sizing: border-box;
}

.detail-dialog-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.1rem;
  margin-bottom: 12px;
}
.detail-dialog-list .q-item {
  padding: 12px 0;
}
.detail-dialog-list .q-item__label--caption {
  font-size: 1rem;
  color: #90a4ae;
}

:deep(.q-field--outlined.q-field--dark .q-field__control) {
  background-color: rgba(20, 38, 51, 0.7) !important;
  border-color: rgba(0, 184, 255, 0.2) !important;
}
:deep(.q-field--outlined.q-field--dark .q-field__control:hover) {
  border-color: rgba(0, 184, 255, 0.5) !important;
}
:deep(.q-field--outlined.q-field--dark.q-field--focused .q-field__control) {
  border-color: #00b8ff !important;
  box-shadow: 0 0 10px rgba(0, 184, 255, 0.6) !important;
}
</style>

<style lang="scss">
/* Global styles */
.list-item-animation {
  opacity: 0;
  animation: floatUp 0.6s ease-out forwards;
}
@keyframes floatUp {
  from { opacity: 0; transform: translateY(30px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.themed-dialog .q-dialog__inner {
  backdrop-filter: blur(4px);
  background-color: rgba(10, 25, 40, 0.5);
}
.themed-dialog .q-card, .themed-dialog-card {
  background-color: #16222c !important;
  border-radius: 12px;
  color: #e0e0e0;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(0, 184, 255, 0.3);
}
.final-confirm-dialog {
  padding: 32px 24px;
  text-align: center;
}
.dialog-icon-wrapper {
  margin-bottom: 20px;
  font-size: 3.5rem;
  line-height: 1;
  color: #ffc107;
  filter: drop-shadow(0 0 10px rgba(255, 193, 7, 0.6));
}
.dialog-title-text {
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 12px;
}
.dialog-message-text {
  font-size: 1rem;
  line-height: 1.6;
  color: #b0bec5;
  margin-bottom: 24px;
}
.themed-dialog .q-card__actions {
  gap: 16px;
  padding: 0 24px 24px 24px !important;
}
.dialog-positive-btn, .dialog-secondary-btn {
  flex: 1;
  border-radius: 8px;
  text-transform: none !important;
  padding: 12px 20px !important;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}
.dialog-positive-btn {
  background: #ffc107 !important;
  color: #111 !important;
  box-shadow: 0 2px 10px rgba(255, 193, 7, 0.3);
}
.dialog-positive-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 193, 7, 0.5);
}
.dialog-secondary-btn {
  color: #e0e0e0 !important;
  background-color: rgba(255, 255, 255, 0.1) !important;
}
.dialog-secondary-btn:hover {
  background-color: rgba(255, 255, 255, 0.15) !important;
}

.bg-dark-2 {
  background-color: #202b33;
}
</style>
