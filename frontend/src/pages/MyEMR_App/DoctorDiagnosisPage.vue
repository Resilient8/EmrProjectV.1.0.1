<template>
  <q-page class="doctor-bg">

    <div v-if="!visitData" class="fullscreen column flex-center bg-dark-glass">
      <q-spinner-dots color="primary" size="60px" />
      <div class="q-mt-lg welcome-text">กำลังโหลดข้อมูล...</div>
    </div>

    <div v-else class="cinema-screen">

      <div class="external-header">
        <div class="row items-center justify-between no-wrap full-width" style="height: 100%;">

          <div class="col-auto row items-center q-gutter-x-md" style="min-width: 250px;">
            <q-btn class="back-button-custom" icon="arrow_back_ios_new" round unelevated @click="goBack">
              <q-tooltip class="tooltip-glassy">ย้อนกลับ</q-tooltip>
            </q-btn>
            <div>
              <div class="text-h5 text-weight-bold text-white leading-tight">ห้องตรวจแพทย์</div>
              <div class="text-caption text-grey-4">Doctor Consultation</div>
            </div>
          </div>

          <div class="col row justify-center">
            <div class="switcher-glass-panel">
              <q-btn flat round dense icon="chevron_left" color="cyan-3" class="nav-btn" @click="scrollSwitcher('left')" />
              <q-scroll-area
                horizontal
                class="switcher-scroll-area"
                ref="patientScrollArea"
                :thumb-style="{ display: 'none' }"
                :content-style="{ display: 'flex', alignItems: 'center', height: '100%' }"
                :content-active-style="{ display: 'flex', alignItems: 'center', height: '100%' }"
              >
                <div class="row no-wrap items-center full-height q-px-sm" style="flex-wrap: nowrap;">
                  <div
                    v-for="patient in filteredPatientQueue"
                    :key="patient.id"
                    class="patient-avatar-wrapper"
                    :class="{ 'active': activePatientId === patient.id }"
                    @click="switchPatient(patient.id)"
                  >
                    <div class="avatar-container">
                      <q-avatar size="44px" class="avatar-img">
                        <img v-if="patient.avatarUrl" :src="patient.avatarUrl" style="object-fit: cover;" />
                        <span v-else class="text-weight-bold">{{ patient.name ? patient.name.charAt(0) : '?' }}</span>
                      </q-avatar>
                    </div>
                    <q-badge v-if="patient.visits && patient.visits.length > 1" color="red-5" floating rounded class="notification-badge">{{ patient.visits.length }}</q-badge>
                    <q-tooltip class="glass-tooltip" anchor="bottom middle" self="top middle" :offset="[0, 8]">
                      {{ patient.name }}
                    </q-tooltip>
                  </div>
                  <div v-if="filteredPatientQueue.length === 0" class="text-grey-5 text-caption q-mx-md">
                    ไม่มีคนไข้รอตรวจสำหรับท่าน
                  </div>
                </div>
              </q-scroll-area>
              <q-btn flat round dense icon="chevron_right" color="cyan-3" class="nav-btn" @click="scrollSwitcher('right')" />
            </div>
          </div>

          <div class="col-auto row justify-end items-center q-gutter-x-md" style="min-width: 250px;">
            <div class="doctor-filter" style="min-width: 250px;">
  <div class="row items-center no-wrap bg-dark-translucent q-pa-sm rounded-borders border-light shadow-2">
    <q-avatar size="32px" class="q-mr-sm shadow-1" color="grey-10">
       <q-icon name="verified_user" color="cyan-3" size="20px" />
    </q-avatar>
    <div class="column justify-center">
      <div class="text-caption text-grey-5 leading-none">เข้าใช้งานโดยแพทย์:</div>
      <div class="text-subtitle2 text-cyan-2 text-weight-bold">
        {{ authStore.userName || 'กำลังโหลดชื่อ...' }}
      </div>
    </div>
  </div>
</div>

            <div class="glassy-tab-group">
                <q-btn class="elegant-tab-btn" :class="{ 'active': currentMainTab === 'doctor' }" no-caps unelevated label="การรักษา" icon="medical_services" @click="() => { currentMainTab = 'doctor'; playClickSound(); }" />
                <q-btn class="elegant-tab-btn" :class="{ 'active': currentMainTab === 'medication' }" no-caps unelevated label="สั่งยา" icon="medication" @click="() => { currentMainTab = 'medication'; playClickSound(); }" />
                <q-btn class="elegant-tab-btn" :class="{ 'active': currentMainTab === 'summary' }" no-caps unelevated label="สรุปผล" icon="assignment" @click="() => { currentMainTab = 'summary'; playClickSound(); }" />
            </div>
          </div>

        </div>
      </div>

      <div class="layout-container-wrapper">
        <div class="layout-container">

          <div class="internal-header-bar">
            <q-item class="patient-header-item" @mouseenter="showPatientMenu = true; throttledPlayHoverSound();" @mouseleave="showPatientMenu = false">
              <q-item-section avatar>
                <q-avatar v-if="activePatient && activePatient.avatarUrl" size="36px"><img :src="activePatient.avatarUrl"></q-avatar>
                <q-avatar v-else size="36px" color="primary" text-color="white" :icon="activePatientGender"></q-avatar>
              </q-item-section>
              <q-item-section>
                <div class="text-weight-bold text-white">{{ visitData.patientInfo.name }}</div>
                <div class="text-caption text-cyan-2">ID: {{ visitData.patientInfo.patientId }}</div>
              </q-item-section>

              <q-menu v-model="showPatientMenu" anchor="bottom start" self="top start" :offset="[0, 10]" class="bg-transparent no-shadow">
                <q-card class="glass-dialog popover-card" style="min-width: 350px;">
                    <q-card-section class="q-pa-md">
                      <div class="row items-center q-mb-md">
                          <q-avatar size="50px" color="primary" text-color="white" class="q-mr-md shadow-3">{{ visitData.patientInfo.name.charAt(0) }}</q-avatar>
                          <div>
                            <div class="text-h6 text-white leading-tight">{{ visitData.patientInfo.name }}</div>
                            <div class="text-caption text-grey-4">อายุ: {{ visitData.patientInfo.age }} ปี | เพศ: {{ visitData.patientInfo.gender }}</div>
                          </div>
                      </div>
                      <q-separator dark class="q-mb-md opacity-20"/>
                      <div class="info-row q-mb-sm"><q-icon name="badge" class="q-mr-sm text-cyan-3"/><span class="text-grey-4">ID:</span> <span class="text-white q-ml-xs">{{ visitData.patientInfo.patientId }}</span></div>
                      <div class="bg-dark-translucent rounded-borders q-pa-sm q-mt-sm">
                          <div class="row items-center q-mb-xs"><q-icon name="warning" color="red-4" class="q-mr-sm"/><span class="text-red-4 text-weight-bold">แพ้ยา:</span><span class="text-white q-ml-sm">{{ visitData.patientInfo.allergies || 'ไม่มี' }}</span></div>
                          <div class="row items-center"><q-icon name="medical_information" color="orange-4" class="q-mr-sm"/><span class="text-orange-4 text-weight-bold">โรคประจำตัว:</span><span class="text-white q-ml-sm">{{ visitData.patientInfo.underlyingDisease || 'ไม่มี' }}</span></div>
                      </div>
                    </q-card-section>
                </q-card>
              </q-menu>
            </q-item>

            <div class="row q-gutter-x-md items-center">
              <div class="row items-center q-mr-sm transition-all" style="min-width: 140px; justify-content: flex-end;">
                <div v-if="isAutoSaving" class="row items-center text-caption text-accent fade-in">
                    <q-spinner-dots size="1.2em" class="q-mr-xs"/> กำลังบันทึก...
                </div>
                <div v-else-if="lastSavedTime" class="row items-center text-caption text-grey-5 fade-in">
                    <q-icon name="cloud_done" class="q-mr-xs"/> บันทึก {{ lastSavedTime }}
                </div>
              </div>

              <q-chip dense :icon="statusIcon" :label="pageStatus" class="status-pill" :class="statusChipClass" />

              <div class="control-buttons-group">
                  <q-btn class="premium-btn btn-cert" icon="description" label="ใบรับรอง" @click="openCertificateDialog" unelevated />

                  <q-btn class="premium-btn btn-save" icon="save" label="บันทึก" @click="saveProgress" unelevated />
                  <q-btn class="premium-btn btn-complete" icon="check_circle" label="เสร็จสิ้น" @click="confirmTreatmentComplete" unelevated />
              </div>
            </div>
          </div>

          <div class="content-grid">

            <aside class="left-panel-content">
              <q-scroll-area class="fit q-pr-sm" :thumb-style="{ width: '4px' }">
                  <div class="list-item-animation" style="animation-delay: 0.1s;">
                    <div class="text-subtitle2 text-grey-5 q-mb-xs q-pl-xs text-weight-bold header-spacing">ALERT INFO</div>
                    <div class="stats-group">
                      <div class="stat-bar non-clipping-hover" :class="{'stat-bar--warning': visitData.patientInfo.allergies !== 'ไม่มี' && visitData.patientInfo.allergies !== 'ไม่มีข้อมูล'}" @click="showDetailDialog({ icon: 'warning', title: 'ข้อมูลสำคัญผู้ป่วย', type: 'patientInfo', content: visitData.patientInfo })">
                          <span class="stat-label"><q-icon name="warning" class="q-mr-sm"/>แพ้ยา</span>
                          <span class="stat-value ellipsis" :class="getVitalColor(visitData.patientInfo.allergies, 'allergy')">{{ visitData.patientInfo.allergies || 'ไม่มีข้อมูล' }}</span>
                      </div>
                      <div class="stat-bar non-clipping-hover" @click="showDetailDialog({ icon: 'badge', title: 'ข้อมูลสำคัญผู้ป่วย', type: 'patientInfo', content: visitData.patientInfo })">
                          <span class="stat-label"><q-icon name="restaurant" class="q-mr-sm"/>แพ้อาหาร</span>
                          <span class="stat-value ellipsis" :class="getVitalColor(visitData.patientInfo.foodAllergies, 'allergy')">{{ visitData.patientInfo.foodAllergies || 'ไม่มีข้อมูล' }}</span>
                      </div>
                      <div class="stat-bar non-clipping-hover" @click="showDetailDialog({ icon: 'badge', title: 'ข้อมูลสำคัญผู้ป่วย', type: 'patientInfo', content: visitData.patientInfo })">
                          <span class="stat-label"><q-icon name="medical_information" class="q-mr-sm"/>โรคประจำตัว</span>
                          <span class="stat-value ellipsis" :class="visitData.patientInfo.underlyingDisease !== 'ไม่มี' ? 'text-orange-4' : 'text-grey-5'">{{ visitData.patientInfo.underlyingDisease || 'ไม่มีข้อมูล' }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="list-item-animation" style="animation-delay: 0.2s;">
                    <div class="row items-center justify-between q-mb-xs q-pl-xs header-spacing">
                        <div class="text-subtitle2 text-grey-5 text-weight-bold">VITAL SIGNS</div>
                        <q-btn flat dense size="xs" color="cyan-3" icon="open_in_new" label="ดูทั้งหมด" @click="showDetailDialog({ icon: 'monitor_heart', title: 'สัญญาณชีพ', type: 'vitalSigns', content: visitData.vitalSigns })"/>
                    </div>
                    <div class="stats-grid-2col">
                        <div class="stat-box non-clipping-hover" @click="showDetailDialog({ icon: 'monitor_heart', title: 'สัญญาณชีพ', type: 'vitalSigns', content: visitData.vitalSigns })">
                          <div class="stat-label-mini"><q-icon name="thermostat" color="orange-4"/> Temp</div>
                          <div class="stat-val-mini" :class="getVitalColor(visitData.vitalSigns.temperature, 'temp')">{{ visitData.vitalSigns.temperature || '-' }}</div>
                          <div class="stat-unit-mini">°C</div>
                        </div>
                        <div class="stat-box non-clipping-hover" @click="showDetailDialog({ icon: 'monitor_heart', title: 'สัญญาณชีพ', type: 'vitalSigns', content: visitData.vitalSigns })">
                          <div class="stat-label-mini"><q-icon name="speed" color="green-4"/> BP</div>
                          <div class="stat-val-mini" :class="getBpColor(visitData.vitalSigns.blood_pressure_systolic, visitData.vitalSigns.blood_pressure_diastolic)">{{ visitData.vitalSigns.blood_pressure_systolic }}/{{ visitData.vitalSigns.blood_pressure_diastolic }}</div>
                          <div class="stat-unit-mini">mmHg</div>
                        </div>
                        <div class="stat-box non-clipping-hover" @click="showDetailDialog({ icon: 'monitor_heart', title: 'สัญญาณชีพ', type: 'vitalSigns', content: visitData.vitalSigns })">
                          <div class="stat-label-mini"><q-icon name="favorite" color="red-4"/> Pulse</div>
                          <div class="stat-val-mini" :class="getVitalColor(visitData.vitalSigns.pulse, 'pulse')">{{ visitData.vitalSigns.pulse || '-' }}</div>
                          <div class="stat-unit-mini">bpm</div>
                        </div>
                        <div class="stat-box non-clipping-hover" @click="showDetailDialog({ icon: 'monitor_heart', title: 'สัญญาณชีพ', type: 'vitalSigns', content: visitData.vitalSigns })">
                          <div class="stat-label-mini"><q-icon name="monitor_weight" color="blue-4"/> Weight</div>
                          <div class="stat-val-mini">{{ visitData.vitalSigns.weight || '-' }}</div>
                          <div class="stat-unit-mini">kg</div>
                        </div>
                        <div class="stat-box non-clipping-hover full-width-span" @click="showDetailDialog({ icon: 'water_drop', title: 'ออกซิเจนในเลือด (O2 Sat)', type: 'vitalSigns', content: visitData.vitalSigns })">
                          <div class="row justify-between items-center full-width q-px-sm">
                              <span class="stat-label-mini row items-center"><q-icon name="water_drop" color="cyan-4" class="q-mr-xs"/> O2 Sat</span>
                              <div class="row items-baseline">
                                <span class="stat-val-mini text-cyan-4 text-weight-bold">{{ visitData.vitalSigns.oxygen_saturation || '-' }}</span>
                                <span class="stat-val-mini text-cyan-4 q-ml-xs text-weight-bold">%</span>
                              </div>
                          </div>
                        </div>
                    </div>
                  </div>

                  <div class="list-item-animation" style="animation-delay: 0.3s;">
                    <div class="row items-center justify-between q-mb-xs q-pl-xs header-spacing">
                        <div class="text-subtitle2 text-grey-5 text-weight-bold">HISTORY</div>
                        <q-btn flat dense round size="sm" color="cyan-3" :icon="isHistoryEditing ? 'save' : 'edit'" @click="isHistoryEditing ? saveHistory() : (isHistoryEditing = true)"/>
                    </div>
                    <div v-if="!isHistoryEditing" class="stats-group">
                        <div class="stat-bar column-layout non-clipping-hover" @click="showDetailDialog({ icon: 'campaign', title: 'อาการสำคัญ (CC)', type: 'history', content: historyData })">
                          <span class="stat-label text-accent"><q-icon name="campaign" class="q-mr-sm"/>CC (อาการสำคัญ)</span>
                          <span class="stat-value text-white text-left multi-line">{{ historyData.chiefComplaint || '-' }}</span>
                        </div>
                        <div class="stat-bar column-layout non-clipping-hover" @click="showDetailDialog({ icon: 'history_edu', title: 'ประวัติปัจจุบัน (PI)', type: 'history', content: historyData })">
                          <span class="stat-label"><q-icon name="history_edu" class="q-mr-sm"/>PI (ประวัติปัจจุบัน)</span>
                          <span class="stat-value text-grey-4 text-left text-caption multi-line">{{ historyData.presentIllness || '-' }}</span>
                        </div>
                    </div>
                    <div v-else class="q-pa-sm bg-dark-glass rounded-borders border-accent">
                        <q-input dark dense outlined v-model="historyData.chiefComplaint" label="CC" class="q-mb-sm"/>
                        <q-input dark dense outlined v-model="historyData.presentIllness" label="PI" type="textarea" autogrow/>
                        <div class="row justify-end q-mt-sm"><q-btn flat size="sm" label="ยกเลิก" color="grey" @click="cancelHistoryEdit"/></div>
                    </div>
                  </div>
              </q-scroll-area>
            </aside>

            <main class="right-panel-content">
              <q-card class="glass-card fit">
                  <q-tab-panels v-model="currentMainTab" animated class="bg-transparent fit">

                    <q-tab-panel name="doctor" class="q-pa-none fit">
                        <q-scroll-area class="fit q-pa-lg">

                          <div class="section-box q-mb-lg">
                              <div class="text-h6 text-accent q-mb-md row items-center"><q-icon name="biotech" class="q-mr-sm"/>การวินิจฉัย (Diagnosis)</div>

                              <q-select
                                dark outlined
                                v-model="assessmentPlan.diagnosis"
                                @update:model-value="handleAutoSave"
                                :options="filteredDiagnosisOptions"
                                use-input multiple use-chips stack-label
                                label="พิมพ์ชื่อโรค หรือรหัส ICD-10"
                                @filter="filterDiagnosis"
                                new-value-mode="add-unique"
                                class="custom-input"
                              />

                              <div v-if="assessmentPlan.diagnosis.length > 0" class="q-mt-md bg-dark-translucent rounded-borders q-pa-sm border-light">
                                <q-list dense separator dark>
                                    <q-item v-for="(diag, idx) in assessmentPlan.diagnosis" :key="idx" class="q-py-sm">
                                      <q-item-section avatar><q-avatar size="24px" color="accent" text-color="dark" font-size="12px">{{ idx + 1 }}</q-avatar></q-item-section>
                                      <q-item-section class="text-body2">{{ diag }}</q-item-section>
                                      <q-item-section side><q-btn flat round dense icon="close" color="red-4" size="sm" @click="removeDiagnosisItem(idx)"/></q-item-section>
                                    </q-item>
                                </q-list>
                              </div>
                          </div>

                          <div class="section-box q-mb-lg">
                              <div class="text-h6 text-green-4 q-mb-md row items-center"><q-icon name="assignment_turned_in" class="q-mr-sm"/>แผนการรักษา (Plan)</div>
                              <div class="q-mb-md">
                                  <div class="text-subtitle2 text-grey-4 q-mb-xs">แผนการรักษา / การส่งตัว</div>
                                  <q-select
                                    dark outlined
                                    v-model="assessmentPlan.plan"
                                    @update:model-value="handleAutoSave"
                                    :options="filteredPlanOptions"
                                    use-input
                                    label="เลือกแผนการรักษา"
                                    @filter="filterPlan"
                                    new-value-mode="add-unique"
                                    class="custom-input"
                                  />
                              </div>
                              <div>
                                  <div class="text-subtitle2 text-grey-4 q-mb-xs">คำแนะนำแพทย์เพิ่มเติม (Doctor's Note)</div>
                                  <q-input dark outlined v-model="referralNotes" type="textarea" rows="3" label="ระบุคำแนะนำ หรือหมายเหตุเพิ่มเติม..." class="custom-input"/>
                              </div>
                          </div>

                          <div class="section-box">
                              <div class="text-h6 text-cyan-3 q-mb-md row items-center"><q-icon name="medical_services" class="q-mr-sm"/>บริการและหัตถการ</div>

                              <div class="q-mb-md">
                                  <div class="text-subtitle2 text-grey-4 q-mb-xs">บริการ (Services)</div>
                                  <q-select
                                    dark outlined
                                    v-model="servicesReceived.selected"
                                    @update:model-value="handleAutoSave"
                                    :options="filteredServiceOptions"
                                    use-input multiple use-chips stack-label
                                    label="เลือกบริการ"
                                    @filter="filterServices"
                                    new-value-mode="add-unique"
                                    class="custom-input"
                                  />
                                  <div v-if="servicesReceived.selected.length > 0" class="q-mt-sm bg-dark-translucent rounded-borders q-pa-sm border-light">
                                      <q-list dense separator dark>
                                          <q-item v-for="(item, idx) in servicesReceived.selected" :key="idx" class="q-py-sm">
                                              <q-item-section avatar><q-icon name="medical_services" color="cyan-3" size="xs"/></q-item-section>
                                              <q-item-section class="text-body2">{{ item }}</q-item-section>
                                              <q-item-section side><q-btn flat round dense icon="close" color="red-4" size="sm" @click="removeServiceItem(idx)"/></q-item-section>
                                          </q-item>
                                      </q-list>
                                  </div>
                              </div>

                              <div>
                                  <div class="text-subtitle2 text-grey-4 q-mb-xs">หัตถการ (Procedures)</div>
                                  <q-select
                                    dark outlined
                                    v-model="proceduresPerformed.selected"
                                    @update:model-value="handleAutoSave"
                                    :options="filteredProcedureOptions"
                                    use-input multiple use-chips stack-label
                                    label="เลือกหัตถการ"
                                    @filter="filterProcedures"
                                    new-value-mode="add-unique"
                                    class="custom-input"
                                  />
                                  <div v-if="proceduresPerformed.selected.length > 0" class="q-mt-sm bg-dark-translucent rounded-borders q-pa-sm border-light">
                                      <q-list dense separator dark>
                                          <q-item v-for="(item, idx) in proceduresPerformed.selected" :key="idx" class="q-py-sm">
                                              <q-item-section avatar><q-icon name="healing" color="orange-3" size="xs"/></q-item-section>
                                              <q-item-section class="text-body2">{{ item }}</q-item-section>
                                              <q-item-section side><q-btn flat round dense icon="close" color="red-4" size="sm" @click="removeProcedureItem(idx)"/></q-item-section>
                                          </q-item>
                                      </q-list>
                                  </div>
                              </div>
                          </div>

                        </q-scroll-area>
                    </q-tab-panel>

                    <q-tab-panel name="medication" class="q-pa-none fit">
                        <q-scroll-area class="fit q-pa-lg">
                          <div class="section-box fit flex column">
                              <div class="text-h6 text-white q-mb-md"><q-icon name="medication" class="q-mr-sm text-pink-4"/>รายการยา (Prescription)</div>
                              <div class="row q-col-gutter-md q-mb-lg bg-dark-glass q-pa-md rounded-borders border-light">
                                <div class="col-5"><q-select dark outlined dense v-model="newMedication.name" label="ชื่อยา" :options="filteredMedicationOptions" use-input @filter="filterMedication" class="custom-input"/></div>
                                <div class="col-2"><q-select dark outlined dense v-model="newMedication.dosage" label="ขนาด" :options="dosageOptions" use-input new-value-mode="add-unique" class="custom-input"/></div>
                                <div class="col-2"><q-select dark outlined dense v-model="newMedication.quantity" label="จำนวน" :options="quantityOptions" use-input new-value-mode="add-unique" class="custom-input"/></div>
                                <div class="col-3"><q-btn unelevated rounded color="accent" text-color="dark" icon="add" label="เพิ่มรายการ" class="full-width full-height shadow-2" @click="addMedication" :disable="!isMedicationFormValid"/></div>
                                <div class="col-12"><q-select dark outlined dense v-model="newMedication.instruction" label="วิธีใช้" :options="instructionOptions" use-input new-value-mode="add-unique" class="custom-input"/></div>
                              </div>
                              <q-list separator class="med-list-container bg-dark-translucent rounded-borders col-grow scroll border-light">
                                <div v-if="prescriptions.length === 0" class="flex flex-center text-grey-5 full-height column"><q-icon name="vaccines" size="50px" class="q-mb-sm opacity-50"/><div>ยังไม่มีรายการยา</div></div>
                                <q-item v-for="(med, idx) in prescriptions" :key="idx" class="q-py-md hover-effect">
                                    <q-item-section avatar><q-avatar color="blue-grey-9" text-color="white" icon="pill" size="md"/></q-item-section>
                                    <q-item-section><q-item-label class="text-weight-bold text-white text-subtitle1">{{ med.name }}</q-item-label><q-item-label caption class="text-accent">{{ med.dosage }} - {{ med.instruction }}</q-item-label></q-item-section>
                                    <q-item-section side><div class="row items-center"><q-chip color="dark" text-color="white" class="q-mr-md">Qty: {{ med.quantity }}</q-chip><q-btn flat round dense icon="delete_outline" color="red-4" @click="removeMedication(idx)"/></div></q-item-section>
                                </q-item>
                              </q-list>
                              <div class="q-mt-md text-right" v-if="prescriptions.length > 0"><q-btn unelevated rounded color="green-6" label="ยืนยันใบสั่งยา" icon-right="send" @click="handleSaveAndForward" class="q-px-lg"/></div>
                          </div>
                        </q-scroll-area>
                    </q-tab-panel>

                    <q-tab-panel name="summary" class="q-pa-none fit">
                        <q-scroll-area class="fit q-pa-lg">
                          <div class="section-box fit">
                              <div class="row items-center justify-between q-mb-md">
                                <div class="text-h6 text-white"><q-icon name="assignment" class="q-mr-sm text-yellow-4"/>สรุปผลการรักษา</div>
                                <q-tabs v-model="summaryTab" dense class="text-grey-5" active-color="accent" indicator-color="accent">
                                    <q-tab name="all" label="ภาพรวม" />
                                    <q-tab name="diagnosis" label="เฉพาะวินิจฉัย" />
                                    <q-tab name="services" label="เฉพาะบริการ" />
                                </q-tabs>
                              </div>
                              <q-separator dark class="q-mb-md opacity-20"/>
                              <q-tab-panels v-model="summaryTab" animated class="bg-transparent">
                                <q-tab-panel name="all" class="q-pa-none">
                                    <q-table dark flat bordered :rows="summaryAllData" :columns="summaryAllColumns" row-key="id" hide-bottom class="glass-table" :pagination="{ rowsPerPage: 0 }">
                                      <template v-slot:body-cell-category="props"><q-td :props="props" style="width: 150px;"><q-chip :color="props.row.color" text-color="white" dense size="sm" class="text-weight-bold full-width justify-center">{{ props.value }}</q-chip></q-td></template>
                                      <template v-slot:body-cell-value="props"><q-td :props="props" class="text-white">{{ props.value }}</q-td></template>
                                    </q-table>
                                </q-tab-panel>
                                <q-tab-panel name="diagnosis" class="q-pa-none">
                                    <q-list bordered separator dark class="rounded-borders border-light bg-dark-glass">
                                      <q-item v-if="summaryDiagnosis.length === 0" class="text-grey-5 flex flex-center">ไม่มีข้อมูล</q-item>
                                      <q-item v-for="d in summaryDiagnosis" :key="d.id"><q-item-section avatar><q-icon name="biotech" color="red-4"/></q-item-section><q-item-section>{{ d.value }}</q-item-section></q-item>
                                    </q-list>
                                </q-tab-panel>
                                <q-tab-panel name="services" class="q-pa-none">
                                    <q-list bordered separator dark class="rounded-borders border-light bg-dark-glass">
                                      <q-item v-if="summaryServices.length === 0" class="text-grey-5 flex flex-center">ไม่มีข้อมูล</q-item>
                                      <q-item v-for="s in summaryServices" :key="s.id"><q-item-section avatar><q-icon name="medical_services" color="green-4"/></q-item-section><q-item-section>{{ s.value }}</q-item-section></q-item>
                                    </q-list>
                                </q-tab-panel>
                              </q-tab-panels>
                          </div>
                        </q-scroll-area>
                    </q-tab-panel>

                  </q-tab-panels>
              </q-card>
            </main>

          </div>
        </div>
      </div>

    </div>

    <q-dialog v-model="isDetailDialogVisible" @hide="selectedDetail = {}" transition-show="scale" transition-hide="scale">
      <q-card class="glass-dialog" style="min-width: 500px; max-width: 650px;">
          <q-toolbar class="bg-dark-glass border-bottom-light">
            <q-icon :name="selectedDetail.icon" size="sm" class="text-accent q-mr-sm"/>
            <div class="text-h6 text-white">{{ selectedDetail.title }}</div>
            <q-space/>
            <q-btn flat round icon="close" color="white" v-close-popup/>
          </q-toolbar>
          <q-card-section class="q-pa-lg">
            <div v-if="selectedDetail.type === 'patientInfo'" class="column q-gutter-y-md">
                <div class="row q-col-gutter-md">
                  <div class="col-12"><div class="bg-dark-glass q-pa-md rounded-borders border-accent" :class="{'border-red': selectedDetail.content.allergies !== 'ไม่มี'}"><div class="text-subtitle2 text-grey-4 q-mb-sm">การแพ้ยา</div><div class="text-h6" :class="selectedDetail.content.allergies !== 'ไม่มี' ? 'text-red-4' : 'text-green-4'">{{ selectedDetail.content.allergies || 'ไม่มีข้อมูล' }}</div></div></div>
                  <div class="col-6"><div class="bg-dark-glass q-pa-md rounded-borders"><div class="text-caption text-grey-4">การแพ้อาหาร</div><div class="text-body1 text-white">{{ selectedDetail.content.foodAllergies || 'ไม่มี' }}</div></div></div>
                  <div class="col-6"><div class="bg-dark-glass q-pa-md rounded-borders"><div class="text-caption text-grey-4">โรคประจำตัว</div><div class="text-body1 text-white">{{ selectedDetail.content.underlyingDisease || 'ไม่มี' }}</div></div></div>
                </div>
            </div>
            <div v-else-if="selectedDetail.type === 'vitalSigns'" class="row q-col-gutter-md">
                <div class="col-6" v-for="(v, k) in {'อุณหภูมิ': {val: selectedDetail.content.temperature, unit: '°C'}, 'ความดัน (BP)': {val: selectedDetail.content.blood_pressure_systolic + '/' + selectedDetail.content.blood_pressure_diastolic, unit: 'mmHg'}, 'ชีพจร': {val: selectedDetail.content.pulse, unit: 'bpm'}, 'การหายใจ': {val: selectedDetail.content.respiration, unit: '/min'}, 'ออกซิเจน (O2 Sat)': {val: selectedDetail.content.oxygen_saturation, unit: '%'}, 'น้ำหนัก': {val: selectedDetail.content.weight, unit: 'kg'}, 'ส่วนสูง': {val: selectedDetail.content.height, unit: 'cm'}, 'BMI': {val: selectedDetail.content.bmi, unit: ''}, 'รอบเอว': {val: selectedDetail.content.waist_circumference, unit: 'cm'}}" :key="k">
                  <div class="stat-bar bg-dark-glass"><span class="stat-label text-grey-4">{{ k }}</span><span class="stat-value text-white">{{ v.val || '-' }} <span class="text-caption text-grey-5">{{ v.unit }}</span></span></div>
                </div>
            </div>
            <div v-else-if="selectedDetail.type === 'history'" class="column q-gutter-y-md">
                <div class="bg-dark-glass q-pa-md rounded-borders"><div class="text-accent q-mb-xs">อาการสำคัญ (CC)</div><div class="text-white" style="font-size: 1.1rem;">{{ selectedDetail.content.chiefComplaint || '-' }}</div></div>
                <div class="bg-dark-glass q-pa-md rounded-borders"><div class="text-grey-4 q-mb-xs">ประวัติปัจจุบัน (PI)</div><div class="text-white" style="white-space: pre-wrap;">{{ selectedDetail.content.presentIllness || '-' }}</div></div>
            </div>
            <pre v-else class="text-white" style="white-space: pre-wrap; font-family: inherit;">{{ selectedDetail.content }}</pre>
          </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showCertificateDialog" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card class="bg-dark-glass backdrop-blur-md">
        <q-bar class="bg-black text-white">
          <q-icon name="description" color="cyan-3" />
          <div class="text-subtitle1">ออกใบรับรองแพทย์ (Medical Certificate)</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup />
        </q-bar>

        <q-card-section class="row full-height q-pa-none">

          <div class="col-12 col-md-4 bg-dark-translucent q-pa-md scroll" style="border-right: 1px solid rgba(255,255,255,0.1);">
            <div class="text-h6 text-cyan-3 q-mb-md">ข้อมูลใบรับรอง</div>

            <div class="q-gutter-y-md">
              <q-input dark dense outlined v-model="certificateData.examDate" label="วันที่ตรวจ" mask="####-##-##">
                <template v-slot:append><q-icon name="event" class="cursor-pointer text-cyan-3"><q-popup-proxy><q-date v-model="certificateData.examDate" mask="YYYY-MM-DD" dark color="cyan-6"/></q-popup-proxy></q-icon></template>
              </q-input>

              <div class="text-subtitle2 text-grey-4">ผู้ป่วย</div>
              <q-input dark dense outlined v-model="certificateData.patientName" label="ชื่อ-นามสกุล" />
              <q-input dark dense outlined v-model="certificateData.patientAge" label="อายุ" />
              <q-input dark dense outlined v-model="certificateData.patientIdCard" label="เลขบัตร ปชช." />
              <q-input dark dense outlined v-model="certificateData.patientAddress" label="ที่อยู่" type="textarea" autogrow />

              <q-separator dark class="q-my-sm opacity-20" />

              <div class="text-subtitle2 text-grey-4">เนื้อหาการแพทย์</div>
              <q-input dark dense outlined v-model="certificateData.diagnosis" label="การวินิจฉัย (Diagnosis)" type="textarea" rows="3" />
              <q-input dark dense outlined v-model="certificateData.opinion" label="ความเห็นแพทย์ (Opinion)" type="textarea" rows="3" />

              <div class="row q-col-gutter-xs">
                 <div class="col-6"><q-input dark dense outlined v-model="certificateData.vitals.weight" label="Weight (kg)" /></div>
                 <div class="col-6"><q-input dark dense outlined v-model="certificateData.vitals.height" label="Height (cm)" /></div>
                 <div class="col-6"><q-input dark dense outlined v-model="certificateData.vitals.bp" label="BP (mmHg)" /></div>
                 <div class="col-6"><q-input dark dense outlined v-model="certificateData.vitals.pulse" label="Pulse (bpm)" /></div>
                 <div class="col-6"><q-input dark dense outlined v-model="certificateData.vitals.temperature" label="Temp (°C)" /></div>
              </div>

              <q-separator dark class="q-my-sm opacity-20" />

              <div class="text-subtitle2 text-grey-4">แพทย์</div>
              <q-input dark dense outlined v-model="certificateData.doctorName" label="ชื่อแพทย์" />
              <q-input dark dense outlined v-model="certificateData.doctorLicense" label="เลขที่ใบอนุญาต" />
            </div>
          </div>

          <div class="col-12 col-md-8 bg-grey-9 flex flex-center scroll relative-position">
             <MedicalCertificate
                :patient-name="certificateData.patientName"
                :patient-age="certificateData.patientAge"
                :patient-id-card="certificateData.patientIdCard"
                :patient-address="certificateData.patientAddress"
                :doctor-name="certificateData.doctorName"
                :doctor-license="certificateData.doctorLicense"
                :date="certificateData.examDate"
                :vitals="certificateData.vitals"
                :diagnosis="certificateData.diagnosis"
                :opinion="certificateData.opinion"
              />
          </div>

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

// 🔥 1. นำเข้า Component และ Auth Store
import MedicalCertificate from 'src/components/MedicalCertificate.vue';
import { useAuthStore } from 'src/store/auth';

// =================================================================================
// 1. SETUP & UTILS
// =================================================================================
const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const isInternalLoading = ref(false);

// ระบบเสียงประกอบการใช้งาน (Sound System)
const playSound = (note) => {
  try {
    if (Tone.context.state !== 'running') Tone.context.resume();
    const synth = new Tone.Synth().toDestination();
    synth.volume.value = -15;
    synth.triggerAttackRelease(note || "C5", "8n");
  } catch(e){}
};
const playClickSound = () => playSound("C5");
const playSelectionSound = () => playSound("G5");
const playSuccessSound = () => playSound("E6");
const playRemoveSound = () => playSound("C2");
const throttledPlayHoverSound = () => {};

// =================================================================================
// 2. DATA MODELS & IDENTITY
// =================================================================================
const visitData = ref(null);
const patientQueue = ref([]);
const activePatientId = ref(null);
const patientScrollArea = ref(null);

// ✅ ตัวแปรแสดงชื่อแพทย์ (ผูกกับ Store userName)
const currentDoctor = ref(authStore.userName || 'กำลังตรวจสอบสิทธิ์แพทย์...');

// เฝ้าดูถ้า AuthStore มีการอัปเดตชื่อ
watch(
  () => authStore.userName,
  (newName) => {
    if (newName) {
      currentDoctor.value = newName;
      console.log("👨‍⚕️ [DEBUG] ชื่อแพทย์ในหน้าจอถูกอัปเดตเป็น:", newName);
    }
  },
  { immediate: true }
);

// ข้อมูลพื้นฐานคนไข้
const patientInfo = ref({
  id: '',
  name: '',
  patientId: '',
  gender: '',
  age: null,
  drugAllergies: '',
  foodAllergies: '',
  underlyingDisease: '',
  avatarUrl: null
});

const historyData = ref({ chiefComplaint: '', presentIllness: '' });
const assessmentPlan = ref({ diagnosis: [], diagnosisOtherText: '', plan: '' });
const referralNotes = ref('');
const servicesReceived = ref({ selected: [], otherText: '' });
const proceduresPerformed = ref({ selected: [], otherText: '' });
const prescriptions = ref([]);
const newMedication = ref({ name: '', dosage: '', quantity: '', instruction: '' });
const symptomDetails = ref([]);
const presentIllness = ref('');
const reviewOfSystems = ref({ general: [], headAndNeck: [], respiratory: [], cardiovascular: [], gastrointestinal: [], skin: [] });

// ข้อมูลสัญญาณชีพ (Vital Signs)
const newVitalSign = reactive({
  temperature: null,
  pulse: null,
  breathing: null,
  bloodPressureSystolic: null,
  bloodPressureDiastolic: null,
  oxygenSaturation: null,
  waist: null,
  height: null,
  weight: null,
  bmi: ''
});

// UI State Management
const currentMainTab = ref('doctor');
const summaryTab = ref('all');
const isHistoryEditing = ref(false);
const showPatientMenu = ref(false);
const isDetailDialogVisible = ref(false);
const selectedDetail = ref({});
const showVisitSelector = ref(false);
const isAutoSaving = ref(false);
const lastSavedTime = ref('');

// ตัวแปรสำหรับใบรับรองแพทย์
const showCertificateDialog = ref(false);
const certificateData = reactive({
  patientName: '',
  patientAddress: '',
  patientIdCard: '',
  patientAge: '',
  doctorName: '',
  doctorLicense: 'ว.12345',
  examDate: '',
  vitals: { weight: '', height: '', bp: '', pulse: '', temperature: '' },
  diagnosis: '',
  opinion: ''
});

// =================================================================================
// 3. HELPER FUNCTIONS
// =================================================================================
const getVitalColor = (val, type) => {
  if (!val) return '';
  const num = parseFloat(val);
  switch (type) {
    case 'temp': if (num > 37.5) return 'text-red-5'; return 'text-green-4';
    case 'pulse': if (num < 60 || num > 100) return 'text-orange-4'; return 'text-green-4';
    case 'allergy': if (val !== 'ไม่มี' && val !== 'ไม่มีข้อมูล') return 'text-red-4 text-weight-bold'; return 'text-grey-5';
    default: return 'text-white';
  }
};

const getBpColor = (sys, dia) => {
  if (!sys || !dia) return '';
  const s = parseInt(sys); const d = parseInt(dia);
  if (s > 140 || d > 90) return 'text-red-5';
  if (s < 90 || d < 60) return 'text-orange-4';
  return 'text-green-4';
};

const calculateBMI = () => {
  const h = parseFloat(newVitalSign.height) / 100;
  const w = parseFloat(newVitalSign.weight);
  if (h > 0 && w > 0) {
    newVitalSign.bmi = (w / (h * h)).toFixed(2);
  } else { newVitalSign.bmi = ''; }
};

const formatTime = (isoString) => {
  if (!isoString) return '-';
  return new Date(isoString).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
};

const translateStatusToThai = (s) => {
  const statusMap = {
    'รอพบแพทย์': 'รอตรวจ',
    'กำลังรักษา': 'กำลังตรวจ',
    'รักษาเสร็จสิ้น': 'เสร็จสิ้น',
    'รอรับยา': 'รอรับยา',
    'จ่ายยาแล้ว': 'จ่ายยาแล้ว'
  };
  return statusMap[s] || s;
};

const getStatusChipClass = (status) => {
  const base = 'glass-chip';
  if (status === 'รอพบแพทย์') return `${base} text-orange-4`;
  if (status === 'กำลังรักษา') return `${base} text-blue-4`;
  if (status === 'รักษาเสร็จสิ้น' || status === 'เสร็จสิ้น') return `${base} text-green-4`;
  return `${base} text-grey-4`;
};

// =================================================================================
// 4. STATIC DATA & OPTIONS (ICD-10, ยา, บริการ)
// =================================================================================
const allDoctors = ref([]);
const diagnosisOptions = ref([]); const filteredDiagnosisOptions = ref([]);
const planOptions = ref(['Follow up', 'Referral', 'Discharge', 'Admit', 'Observation']); const filteredPlanOptions = ref([...planOptions.value]);
const serviceOptions = ref([]); const filteredServiceOptions = ref([]);
const procedureOptions = ref([]); const filteredProcedureOptions = ref([]);
const medicationOptions = ref([]); const filteredMedicationOptions = ref([]);
const medicationMap = ref({});
const diagnosisMap = ref({});

// 🚩 [คืนค่าที่หายไป] Dropdown Options สำหรับสั่งยา
const dosageOptions = ref(['1 เม็ด', '2 เม็ด', '1 ซอง', '10 ml', '15 ml']);
const filteredDosageOptions = ref([...dosageOptions.value]);

const quantityOptions = ref(['10 เม็ด', '20 เม็ด', '30 เม็ด', '1 ขวด', '3 ซอง', '5 ซอง']);
const filteredQuantityOptions = ref([...quantityOptions.value]);

const instructionOptions = ref([
  'รับประทานครั้งละ 1 เม็ด ทุก 4-6 ชั่วโมง เมื่อมีอาการ',
  'รับประทานครั้งละ 1 เม็ด 3 ครั้ง หลังอาหาร',
  'รับประทานครั้งละ 1 เม็ด 1 ครั้ง ก่อนนอน',
  'รับประทานครั้งละ 1 ซอง ละลายน้ำ 1 แก้ว'
]);
const filteredInstructionOptions = ref([...instructionOptions.value]);

// ฟังก์ชัน Filter สำหรับ Dropdown ทั้งหมด
const filterOptions = (val, update, optionsRef, masterOptions) => {
  update(() => {
    if (val === '') { optionsRef.value = masterOptions; }
    else { const needle = val.toLowerCase(); optionsRef.value = masterOptions.filter(v => v.toLowerCase().includes(needle)); }
  });
};

const filterDiagnosis = (val, update) => filterOptions(val, update, filteredDiagnosisOptions, diagnosisOptions.value);
const filterPlan = (val, update) => filterOptions(val, update, filteredPlanOptions, planOptions.value);
const filterServices = (val, update) => filterOptions(val, update, filteredServiceOptions, serviceOptions.value);
const filterProcedures = (val, update) => filterOptions(val, update, filteredProcedureOptions, procedureOptions.value);
const filterMedication = (val, update) => filterOptions(val, update, filteredMedicationOptions, medicationOptions.value);

// 🚩 [คืนค่าที่หายไป] ฟังก์ชัน Filter สำหรับสั่งยา (Dosage, Quantity, Instruction)
const filterDosage = (val, update) => filterOptions(val, update, filteredDosageOptions, dosageOptions.value);
const filterQuantity = (val, update) => filterOptions(val, update, filteredQuantityOptions, quantityOptions.value);
const filterInstruction = (val, update) => filterOptions(val, update, filteredInstructionOptions, instructionOptions.value);

// =================================================================================
// 5. COMPUTED PROPERTIES
// =================================================================================

const filteredPatientQueue = computed(() => {
  if (currentDoctor.value === 'ทั้งหมด') return patientQueue.value;
  const myId = String(authStore.userId);
  return patientQueue.value.filter(patient => {
    if (!patient.visits || patient.visits.length === 0) return false;
    return patient.visits.some(v => String(v.referral_doctor || '') === myId);
  });
});

const doctorSelectOptions = computed(() => {
  const options = ['ทั้งหมด'];
  if (allDoctors.value.length > 0) {
    allDoctors.value.forEach(d => { if (!options.includes(d.name)) options.push(d.name); });
  }
  if (authStore.userName && !options.includes(authStore.userName)) options.push(authStore.userName);
  return options;
});

const activePatient = computed(() => activePatientId.value ? patientQueue.value.find(p => p.id === activePatientId.value) : null);
const activePatientGender = computed(() => patientInfo.value.gender === 'หญิง' ? 'o_female' : 'o_male');
const isMedicationFormValid = computed(() => newMedication.value.name && newMedication.value.dosage && newMedication.value.quantity && newMedication.value.instruction);

const summaryAllData = computed(() => {
  const data = [];
  assessmentPlan.value.diagnosis.forEach((item, i) => data.push({ id: `d${i}`, category: 'วินิจฉัย', value: item, color: 'red-9' }));
  if (assessmentPlan.value.plan) data.push({ id: 'p1', category: 'แผนการรักษา', value: assessmentPlan.value.plan, color: 'blue-9' });
  servicesReceived.value.selected.forEach((item, i) => data.push({ id: `s${i}`, category: 'บริการ', value: item, color: 'green-9' }));
  proceduresPerformed.value.selected.forEach((item, i) => data.push({ id: `pr${i}`, category: 'หัตถการ', value: item, color: 'purple-9' }));
  prescriptions.value.forEach((item, i) => data.push({ id: `m${i}`, category: 'ยา', value: `${item.name} (${item.dosage}) - ${item.instruction}`, color: 'teal-9' }));
  return data;
});

const summaryDiagnosis = computed(() => assessmentPlan.value.diagnosis.map((item, i) => ({ id: `d${i}`, value: item })));
const summaryServices = computed(() => servicesReceived.value.selected.map((item, i) => ({ id: `s${i}`, value: item })));
const summaryAllColumns = [ { name: 'category', label: 'หมวดหมู่', field: 'category', align: 'left', style: 'width: 130px' }, { name: 'value', label: 'รายละเอียด', field: 'value', align: 'left' } ];

// =================================================================================
// 6. SAVE SYSTEM
// =================================================================================

const performSave = async (statusToSave = null, isSilent = false) => {
  const visitId = route.query.visitId;
  if (!visitId) return;

  try {
    const apiCalls = [];

    // 1. เตรียมข้อมูล Visit หลัก และ Vitals (แนบ ID หมอเพื่อบันทึกคนบันทึกล่าสุด)
    const visitPayload = {
      chief_complaint: historyData.value.chiefComplaint,
      present_illness: historyData.value.presentIllness,
      referral_department: assessmentPlan.value.plan,
      referral_notes: referralNotes.value,
      referral_doctor: String(authStore.userId), // หมอที่รับช่วงต่อ

      // 🔥 [เพิ่มใหม่] ID หมอผู้ที่กำลังกดบันทึก (สำหรับช่อง recorder_id ใน Visits)
      UserID: authStore.userId,

      temperature: newVitalSign.temperature,
      pulse: newVitalSign.pulse,
      respiration: newVitalSign.breathing,
      blood_pressure_systolic: newVitalSign.bloodPressureSystolic,
      blood_pressure_diastolic: newVitalSign.bloodPressureDiastolic,
      oxygen_saturation: newVitalSign.oxygenSaturation,
      height: newVitalSign.height,
      weight: newVitalSign.weight,
      waist_circumference: newVitalSign.waist,
      bmi: newVitalSign.bmi
    };

    if (statusToSave) visitPayload.status = statusToSave;

    // คำสั่งที่ 1: อัปเดตข้อมูล Visit & Vital Signs
    apiCalls.push(axios.put(`http://localhost:3000/api/visits/${visitId}`, visitPayload));

    // 2. เตรียมข้อมูลการวินิจฉัย และหัตถการ (แนบ ID หมอเพื่อบันทึก doctor_id และ recorded_by)
    const diagnosesPayload = assessmentPlan.value.diagnosis.map(dName => {
      const code = diagnosisMap.value[dName] || dName;
      return { name: dName, diagnosis_name: dName, diagnosis_code: code, code: code, icd10_code: code };
    });

    // 🔥 [แก้ไขโครงสร้าง] ห่อข้อมูลเป็น Object เพื่อส่ง doctor_id ไปด้วย
    const proceduresWrappedPayload = {
      diagnoses: diagnosesPayload,
      procedures: proceduresPerformed.value.selected.map(pName => ({ name: pName })),
      services: servicesReceived.value.selected.map(sName => ({ name: sName })),
      // 🔥 แนบ ID หมอเพื่อบันทึกคนวินิจฉัยและคนสั่งหัตถการ
      doctor_id: authStore.userId
    };

    // คำสั่งที่ 2: บันทึกการวินิจฉัย/หัตถการ
    apiCalls.push(axios.put(`http://localhost:3000/api/visits/${visitId}/procedures`, proceduresWrappedPayload));

    // 3. เตรียมข้อมูลการสั่งยา (แนบ ID หมอเพื่อบันทึก prescribed_by)
    if (prescriptions.value.length >= 0) {
      const medsList = prescriptions.value.map(med => ({
        drug_name: med.name,
        drug_id: medicationMap.value[med.name] || null,
        dosage: med.dosage,
        quantity: med.quantity,
        instruction: med.instruction,
        // 🔥 แนบ ID หมอลงในแต่ละรายการยาเพื่อความชัวร์
        prescribed_by: authStore.userId
      }));

      // 🔥 [แก้ไขโครงสร้าง] ห่อรายการยาพร้อม ID หมอผู้สั่ง
      const prescriptionsWrappedPayload = {
        items: medsList,
        doctor_id: authStore.userId
      };

      // คำสั่งที่ 3: บันทึกใบสั่งยา
      apiCalls.push(axios.post(`http://localhost:3000/api/prescriptions/visit/${visitId}`, prescriptionsWrappedPayload));
    }

    // ทำการยิง API ทั้งหมดพร้อมกันแบบ Transaction-like
    await Promise.all(apiCalls);

    if (!isSilent) {
      $q.notify({
        type: 'positive',
        message: 'บันทึกการรักษาเรียบร้อย โดย: ' + authStore.userName,
        icon: 'o_save',
        position: 'top'
      });
    }

  } catch (error) {
    console.error("❌ Doctor Save Error:", error);
    $q.notify({
      type: 'negative',
      message: 'บันทึกไม่สำเร็จ',
      caption: error.response?.data?.message || 'กรุณาตรวจสอบการเชื่อมต่อ',
      icon: 'error',
      position: 'top'
    });
  }
};

let autoSaveTimer = null;
const handleAutoSave = async () => {
  clearTimeout(autoSaveTimer);
  if (isInternalLoading.value) return;
  isAutoSaving.value = true;
  await performSave('กำลังรักษา', true);
  const now = new Date();
  lastSavedTime.value = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  setTimeout(() => { isAutoSaving.value = false; }, 1000);
};

// =================================================================================
// 7. ACTIONS & NAVIGATION
// =================================================================================
const addMedication = () => { if (!isMedicationFormValid.value) return; playSelectionSound(); prescriptions.value.push({ ...newMedication.value }); newMedication.value = { name: '', dosage: '', quantity: '', instruction: '' }; handleAutoSave(); }
const removeMedication = (index) => { playRemoveSound(); prescriptions.value.splice(index, 1); handleAutoSave(); }
const removeDiagnosisItem = (i) => { playRemoveSound(); assessmentPlan.value.diagnosis.splice(i, 1); handleAutoSave(); };
const removeServiceItem = (i) => { playRemoveSound(); servicesReceived.value.selected.splice(i, 1); handleAutoSave(); };
const removeProcedureItem = (i) => { playRemoveSound(); proceduresPerformed.value.selected.splice(i, 1); handleAutoSave(); };

const confirmTreatmentComplete = () => {
  $q.dialog({
    title: 'ยืนยันปิดเคส',
    message: 'คุณต้องการบันทึกการรักษาและปิดเคสนี้ใช่หรือไม่?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    await performSave('รักษาเสร็จสิ้น');
    $q.notify({ type: 'positive', message: 'ปิดเคสเรียบร้อย' });
    router.back();
  });
};

const handleSaveAndForward = async () => {
  await performSave('รอรับยา');
  $q.notify({ type: 'primary', message: `ส่งข้อมูลไปห้องยาเรียบร้อย`, icon: 'o_send', position: 'top' });
};

const switchPatient = (patientId) => {
  if (activePatientId.value === patientId) return;
  playClickSound();
  const group = patientQueue.value.find(p => p.id === patientId);
  if (!group) return;
  activePatientId.value = patientId;
  const target = group.visits.find(v => ['รอพบแพทย์', 'กำลังรักษา'].includes(v.status)) || group.visits[0];
  router.replace({ query: { ...route.query, visitId: target.visit_id, patientId: patientId } });
  loadVisitDetail(target.visit_id);
};

const scrollSwitcher = (d) => {
  const s = patientScrollArea.value;
  if(s) s.setScrollPosition('horizontal', s.getScrollPosition().left + (d==='left'?-150:150), 300);
};

const showDetailDialog = (d) => { selectedDetail.value = d; isDetailDialogVisible.value = true; };
const goBack = () => router.back();

const openCertificateDialog = () => {
  if (!patientInfo.value.id) return;
  certificateData.patientName = patientInfo.value.name;
  certificateData.patientIdCard = patientInfo.value.patientId;
  certificateData.patientAge = patientInfo.value.age || '-';
  certificateData.doctorName = authStore.userName;
  certificateData.examDate = date.formatDate(Date.now(), 'YYYY-MM-DD');
  certificateData.diagnosis = assessmentPlan.value.diagnosis.join(', ') || 'อยู่ระหว่างตรวจวินิจฉัย';
  showCertificateDialog.value = true;
};

// =================================================================================
// 8. DATA LOADERS
// =================================================================================
const loadVisitDetail = async (id) => {
  if (!id) return;
  isInternalLoading.value = true;
  try {
    const response = await axios.get(`http://localhost:3000/api/visits/details/${id}`);
    const data = response.data;
    visitData.value = data;

    if (data.visit) {
      assessmentPlan.value.plan = data.visit.referral_department || '';
      referralNotes.value = data.visit.referral_notes || '';
    }

    assessmentPlan.value.diagnosis = (data.diagnoses || []).map(d => {
      const name = d.name || d.diagnosis_name;
      diagnosisMap.value[name] = d.diagnosis_code || d.code || d.icd10_code;
      return name;
    });

    servicesReceived.value.selected = (data.services || []).map(s => s.name);
    proceduresPerformed.value.selected = (data.procedures || []).map(p => p.name);

    if (data.patientInfo) patientInfo.value = { ...data.patientInfo };

    if (data.vitalSigns) {
      Object.assign(newVitalSign, {
        temperature: data.vitalSigns.temperature, pulse: data.vitalSigns.pulse,
        breathing: data.vitalSigns.respiration, bloodPressureSystolic: data.vitalSigns.blood_pressure_systolic,
        bloodPressureDiastolic: data.vitalSigns.blood_pressure_diastolic, oxygenSaturation: data.vitalSigns.oxygen_saturation,
        height: data.vitalSigns.height, weight: data.vitalSigns.weight, waist: data.vitalSigns.waist_circumference
      });
      calculateBMI();
    }

    if (data.symptoms) {
      historyData.value.chiefComplaint = (data.symptoms.chiefComplaints || []).map(c => c.name).join(', ') || data.visit?.chief_complaint || '';
      historyData.value.presentIllness = data.symptoms.PresentIllness || data.visit?.present_illness || '';
    }

    const resMeds = await axios.get(`http://localhost:3000/api/prescriptions/visit/${id}`);
    const meds = Array.isArray(resMeds.data) ? resMeds.data : (resMeds.data.items || []);
    prescriptions.value = meds.map(p => ({
      name: p.drug_name || p.name, dosage: p.dosage, quantity: p.quantity, instruction: p.instruction
    }));

  } catch (error) { console.error("❌ Load Detail Error:", error); }
  finally { setTimeout(() => { isInternalLoading.value = false; }, 800); }
};

const loadPatientQueue = async (queryDate) => {
  try {
    const response = await axios.get('http://localhost:3000/api/doctors/patient-queue', {
      params: { date: queryDate, doctor_id: authStore.userId }
    });
    const rawVisits = response.data;

    const enrichedVisits = await Promise.all(rawVisits.map(async (visit) => {
      try {
        if(visit.visit_id) {
          const detailRes = await axios.get(`http://localhost:3000/api/visits/details/${visit.visit_id}`);
          return { ...visit, referral_doctor: detailRes.data.visit?.referral_doctor };
        }
        return visit;
      } catch (e) { return visit; }
    }));

    const groups = {};
    enrichedVisits.forEach(p => {
      const pid = p.patient_id_string || p.patient_id;
      if (!groups[pid]) {
        groups[pid] = {
          id: pid,
          name: p.name || `${p.prefix || ''}${p.first_name} ${p.last_name}`.trim(),
          avatarUrl: p.avatar_url,
          visits: []
        };
      }
      groups[pid].visits.push(p);
    });
    patientQueue.value = Object.values(groups);
  } catch (error) { console.error('❌ Error fetching queue:', error) }
};

const loadMasterData = async () => {
  try {
    const API_BASE = 'http://localhost:3000/api/masterdata';
    const [diagRes, serviceRes, procedureRes, medicationRes] = await Promise.all([
      axios.get(`${API_BASE}/diagnosis`), axios.get(`${API_BASE}/services`),
      axios.get(`${API_BASE}/procedures`), axios.get(`${API_BASE}/medications`)
    ]);

    diagnosisOptions.value = diagRes.data.map(item => {
      const name = item.diagnosis_name || item.name;
      diagnosisMap.value[name] = item.diagnosis_code || item.code || item.icd10_code || name;
      return name;
    });
    serviceOptions.value = serviceRes.data.map(item => item.service_name || item.name);
    procedureOptions.value = procedureRes.data.map(item => item.procedure_name || item.name);
    medicationOptions.value = medicationRes.data.map(item => {
      const name = item.generic_name || item.name;
      medicationMap.value[name] = item.id;
      return name;
    });

    filteredDiagnosisOptions.value = diagnosisOptions.value;
    filteredMedicationOptions.value = medicationOptions.value;

    // 🚩 รีเซ็ต Filtered Options ให้เท่ากับค่าตั้งต้น
    filteredDosageOptions.value = dosageOptions.value;
    filteredQuantityOptions.value = quantityOptions.value;
    filteredInstructionOptions.value = instructionOptions.value;

  } catch (error) { console.error("❌ Master Data Load Error"); }
};

const fetchDoctors = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/doctors');
    allDoctors.value = res.data.map(d => ({ id: d.id, name: d.name, department: d.department }));
  } catch(e){}
};

// =================================================================================
// 9. WATCHERS & LIFECYCLE
// =================================================================================

watch(() => authStore.userId, (newId) => {
  if (newId) {
    if (authStore.role === 'Doctor') currentDoctor.value = authStore.userName;
    const targetDate = route.query.date || date.formatDate(new Date(), 'YYYY-MM-DD');
    loadPatientQueue(targetDate);
  }
}, { immediate: true });

watch([assessmentPlan, historyData, referralNotes, prescriptions], () => {
  handleAutoSave();
}, { deep: true });

onMounted(async () => {
  const { visitId, patientId, date: qDate } = route.query;
  const targetDate = qDate || date.formatDate(new Date(), 'YYYY-MM-DD');

  console.log("🛠 [DEBUG] ข้อมูลแพทย์จาก Store:", {
    userName: authStore.userName,
    userId: authStore.userId,
    userRole: authStore.userRole
  });

  await Promise.all([
    loadMasterData(),
    fetchDoctors(),
    loadPatientQueue(targetDate)
  ]);

  if (visitId) {
    activePatientId.value = patientId;
    await loadVisitDetail(visitId);
  }
});
</script>

<style scoped lang="scss">
/* --- Master Layout --- */
$bg-dark: #000;
$accent-color: #00e5ff;
$glass-border: 1px solid rgba(255, 255, 255, 0.08);
$glass-border-light: 1px solid rgba(255, 255, 255, 0.15);

.doctor-bg {
  background-color: $bg-dark;
  position: fixed; top: 80px; left: 0; right: 0; bottom: 0;
  width: 100vw; height: auto !important; min-height: 0 !important;
  overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  padding: 16px; z-index: 1;
}

.cinema-screen {
  width: 100%; max-width: 1800px; height: 100%;
  display: flex; flex-direction: column;
  background: radial-gradient(circle at center, #1b2631 0%, #0d1a26 100%);
  border-radius: 20px; border: $glass-border;
  box-shadow: 0 0 50px rgba(0,0,0,0.8);
  overflow: hidden; position: relative;
}

/* --- Header & Switcher (แก้ไขใหม่ล่าสุด) --- */
.external-header {
  height: 80px;
  padding: 0 24px;
  display: flex; align-items: center;
  background: rgba(17, 24, 32, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
}

.patient-switcher-header {
  padding: 10px 0; display: flex; justify-content: center;
}

.switcher-glass-panel {
  display: flex; align-items: center;
  background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50px; padding: 4px 12px; backdrop-filter: blur(10px);
  width: 650px; height: 65px;

  /* 🔥 เพิ่มบรรทัดนี้เข้าไปครับ 🔥 */
  overflow: hidden;
}

.switcher-scroll-area {
  flex: 1;
  height: 100%;
  margin: 0 2px;
  display: flex;
  align-items: center; /* ช่วยจัดกึ่งกลาง */
}

.patient-avatar-wrapper {
  position: relative;
  cursor: pointer;
  margin: 0 6px;
  opacity: 0.6;
  transform: scale(0.95);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  align-items: center;
  justify-content: center;

  &.active {
    opacity: 1;
    transform: scale(1.15);
    z-index: 10;

    .avatar-img {
       /* 🔥 กรอบสีฟ้าทึบ ไม่เรืองแสง */
       border: 3px solid #22d3ee;
       box-shadow: none;
       box-sizing: border-box;
    }
  }

  &:hover:not(.active) {
    opacity: 1;
    transform: scale(1.05);
  }
}

.avatar-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-img {
  /* 🔥 สำคัญ: แก้ไขเพื่อให้รูปไม่ทะลุและอยู่กึ่งกลาง */
  border: 3px solid transparent; /* จองพื้นที่ขอบ */
  transition: all 0.3s;
  background: #1e293b;
  border-radius: 50%;
  overflow: hidden; /* ตัดส่วนเกิน */
  box-sizing: border-box; /* รวมขอบในขนาด */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* บังคับรูปภายในให้เต็มและกลาง */
.avatar-img :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.active-dot {
  position: absolute;
  bottom: -6px;
  width: 5px; height: 5px;
  background-color: #22d3ee;
  border-radius: 50%;
  box-shadow: 0 0 5px #22d3ee;
}

.notification-badge {
  border: 2px solid #0f172a;
  font-size: 10px;
  padding: 2px 5px;
  top: -2px; right: -2px;
}

.nav-btn {
  opacity: 0.6;
  transition: 0.3s;
  font-size: 0.8rem;
  &:hover { opacity: 1; background: rgba(255,255,255,0.1); transform: scale(1.1); }
}

/* --- Layout, Tabs, Buttons, Panels (เหมือนเดิม) --- */
.layout-container-wrapper { flex: 1; display: flex; min-height: 0; overflow: hidden; padding: 0; }
.layout-container { width: 100%; display: flex; flex-direction: column; background: transparent; }
.internal-header-bar {
  height: 60px; padding: 0 20px; display: flex; justify-content: space-between; align-items: center;
  background: rgba(0, 0, 0, 0.5); border-bottom: $glass-border; flex-shrink: 0;
}
.control-buttons-group { display: flex; gap: 12px; margin-left: 15px; }
.content-grid { flex: 1; display: flex; overflow: hidden; }
.left-panel-content {
  width: 340px; border-right: $glass-border; background: rgba(0, 0, 0, 0.25);
  display: flex; flex-direction: column; padding: 16px; flex-shrink: 0;
}
.header-spacing { margin-top: 24px; margin-bottom: 8px; }
.stats-group { display: flex; flex-direction: column; gap: 8px; }
.non-clipping-hover {
  transition: all 0.2s ease; cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.05);
  &:hover {
    background-color: rgba(255, 255, 255, 0.08) !important;
    border-color: rgba(255, 255, 255, 0.3) !important;
    box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
  }
}
.stats-grid-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.stat-box {
  background: rgba(255, 255, 255, 0.03); border-radius: 12px; padding: 10px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.full-width-span { grid-column: span 2; }
.stat-label-mini { font-size: 0.75rem; color: #b0bec5; margin-bottom: 2px; }
.stat-val-mini { font-size: 1.1rem; font-weight: bold; color: #fff; }
.stat-unit-mini { font-size: 0.7rem; color: #546e7a; }
.stat-bar {
  /* --- โค้ดเดิมของคุณ 100% (ห้ามแก้) --- */
  display: flex; justify-content: space-between; align-items: center;
  background: rgba(255, 255, 255, 0.04); border-radius: 12px; padding: 12px 16px;
  &.stat-bar--warning { border-color: rgba(244, 67, 54, 0.4); background: rgba(244, 67, 54, 0.08); }

  /* --- เพิ่มแค่นี้ เพื่อบังคับตัวหนังสือข้างใน --- */

  /* ตัวหัวข้อ (ฝั่งซ้าย): ห้ามหด */
  .stat-label {
    flex-shrink: 0;
    margin-right: 10px; /* เว้นระยะห่างนิดนึง */
  }

  /* ตัวเนื้อหา (ฝั่งขวา): ถ้าล้นให้ตัดเป็น ... */
  .stat-value {
    flex: 1;                 /* ให้กินพื้นที่ที่เหลือในกรอบเดิม */
    min-width: 0;            /* สั่งให้หดตัวได้ (สำคัญมาก ไม่งั้นมันจะดันกรอบขยาย) */
    white-space: nowrap;     /* ห้ามขึ้นบรรทัดใหม่ */
    overflow: hidden;        /* ส่วนเกินซ่อน */
    text-overflow: ellipsis; /* ใส่จุด ... */
    text-align: right;       /* ชิดขวาเหมือนเดิม */
  }
}
.column-layout { flex-direction: column; align-items: flex-start; gap: 6px; }
.multi-line { white-space: normal; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.right-panel-content { flex: 1; display: flex; flex-direction: column; padding: 0; min-width: 0; background: rgba(255, 255, 255, 0.015); }
.glass-card { background: transparent; border: none; box-shadow: none; }
.section-box { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
.custom-input :deep(.q-field__control) { background: rgba(0,0,0,0.3) !important; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); }
.glass-table { background: rgba(0,0,0,0.2); border: $glass-border; color: #fff; :deep(thead tr th) { color: $accent-color; border-bottom: $glass-border-light; } }
.glass-dialog { background: #1b2631 !important; border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 20px 60px rgba(0,0,0,0.7); border-radius: 16px; overflow: hidden; }
.popover-card { background: rgba(27, 38, 49, 0.98) !important; backdrop-filter: blur(15px); border: 1px solid rgba(255, 255, 255, 0.1); }
.glassy-tab-group { display: flex; gap: 8px; background: rgba(0,0,0,0.3); padding: 5px; border-radius: 50px; border: 1px solid rgba(255,255,255,0.05); }
.elegant-tab-btn {
  width: 130px; height: 40px; border-radius: 50px; font-weight: 600; font-size: 0.9rem; color: #90a4ae; transition: all 0.3s ease; background: transparent;
  &:hover:not(.active) { color: #fff; background: rgba(255,255,255,0.05); }
  &.active { background: linear-gradient(135deg, $accent-color 0%, #00b0ff 100%); color: #000; box-shadow: 0 0 15px rgba(0, 229, 255, 0.4); text-shadow: none; }
}
.premium-btn {
  height: 44px; padding: 0 24px; border-radius: 8px; font-weight: 700; font-size: 1rem; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.2);
  &.btn-save { background: linear-gradient(135deg, #0288d1 0%, #039be5 100%); color: white; border: 1px solid #0277bd; &:hover { box-shadow: 0 6px 15px rgba(3, 155, 229, 0.4); transform: translateY(-1px); } }
  &.btn-complete { background: linear-gradient(135deg, #2e7d32 0%, #43a047 100%); color: white; border: 1px solid #1b5e20; &:hover { box-shadow: 0 6px 15px rgba(67, 160, 71, 0.4); transform: translateY(-1px); } }
}
.text-cyan-2 { color: #4dd0e1 !important; }
.text-accent { color: $accent-color !important; }
.bg-dark-glass { background: rgba(0, 0, 0, 0.4); }
.bg-dark-translucent { background: rgba(0,0,0,0.3); }
.border-light { border: 1px solid rgba(255,255,255,0.1); }
.fit { width: 100%; height: 100%; }
.col-grow { flex-grow: 1; }
.nav-btn { opacity: 0.7; transition: 0.3s; &:hover { opacity: 1; background: rgba(255,255,255,0.1); } }
</style>
