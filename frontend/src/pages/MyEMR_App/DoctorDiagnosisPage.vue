<template>
  <q-page class="dashboard-background">
    <div v-if="visitData" class="q-pa-md">

      <div class="row items-center justify-between q-mb-md list-item-animation" style="animation-delay: 0.1s;">
        <div class="col-auto">
            <div class="row items-center">
            <q-icon name="o_summarize" size="lg" class="q-mr-md header-icon" />
            <div class="text-h4 text-weight-bold header-title">ใบสรุปและวินิจฉัยการรักษา</div>
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
                        <div class="q-mt-xs"><span class="text-weight-bold">การแพ้ยา:</span> <span :class="{'text-negative text-weight-bolder': visitData.patientInfo.allergies !== 'ไม่มีข้อมูล'}">{{ visitData.patientInfo.allergies || 'ไม่มี' }}</span></div>
                        <div class="q-mt-xs"><span class="text-weight-bold">การแพ้อาหาร:</span> <span :class="{'text-orange-9': visitData.patientInfo.foodAllergies !== 'ไม่มีข้อมูล'}">{{ visitData.patientInfo.foodAllergies || 'ไม่มี' }}</span></div>
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

                <div class="row items-center q-pa-sm q-gutter-sm">
                  <q-btn label="กำลังรักษา" icon="o_save" @click="() => { saveProgress(); playClickSound(); }" @mouseenter="throttledPlayHoverSound" class="primary-action-btn" unelevated />
                  <q-btn label="รักษาเสร็จสิ้น" icon="task_alt" @click="confirmTreatmentComplete" @mouseenter="throttledPlayHoverSound" class="positive-btn" unelevated />
                  <q-btn label="ใบรับรองแพทย์" icon="o_description" @click="openCertificateDialog" @mouseenter="throttledPlayHoverSound" color="secondary" unelevated class="action-btn" />
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
            <div class="row items-center justify-between"><div class="text-subtitle1 text-weight-bold q-mb-sm subheader-title">ข้อมูลซักประวัติ</div><q-btn v-if="!isHistoryEditing" label="แก้ไข" icon="edit" @click="isHistoryEditing = true" flat dense color="primary" /></div>
            <q-card
              class="main-card interactive-card"
              @mouseenter="throttledPlayHoverSound"
              :class="{ 'cursor-pointer': !isHistoryEditing }"
              @click="!isHistoryEditing && showDetailDialog({
                icon: 'o_history',
                title: 'ข้อมูลซักประวัติ',
                type: 'history',
                content: {
                  chiefComplaint: historyData.chiefComplaint,
                  presentIllness: historyData.presentIllness,
                  reviewOfSystems: visitData.symptoms.reviewOfSystems
                }
              })"
            >
              <q-card-section>
                <div v-if="!isHistoryEditing">
                  <q-field label="อาการสำคัญ" stack-label readonly filled dark class="q-mb-md"><template v-slot:control><div class="self-center full-width no-outline ellipsis" tabindex="0">{{ historyData.chiefComplaint }}</div></template></q-field>
                  <q-field label="รายละเอียด" stack-label readonly filled dark class="q-mb-md"><template v-slot:control><div class="self-center full-width no-outline ellipsis-3-lines" tabindex="0" style="white-space: pre-wrap;">{{ historyData.presentIllness }}</div></template></q-field>
                  <div class="text-weight-medium q-mb-sm">ซักประวัติตามระบบ:</div>
                  <div v-for="(symptoms, system) in visitData.symptoms.reviewOfSystems" :key="system"><div v-if="symptoms.length > 0" class="q-mb-sm"><b>{{ formatSystemName(system) }}:</b><div class="q-gutter-xs q-mt-xs"><q-chip v-for="symptom in symptoms" :key="symptom" dense color="blue-grey-10" text-color="blue-grey-2">{{ symptom }}</q-chip></div></div></div>
                </div>
                <div v-else>
                  <q-input dark v-model="historyData.chiefComplaint" label="อาการสำคัญ" outlined dense class="q-mb-sm" @focus="playFormFocusSound"/><q-input dark v-model="historyData.presentIllness" label="รายละเอียดประวัติปัจจุบัน" outlined dense type="textarea" autogrow @focus="playFormFocusSound"/><div class="q-mt-md text-right"><q-btn label="ยกเลิก" flat @click="cancelHistoryEdit" /><q-btn label="บันทึก" class="primary-action-btn" @click="saveHistory"/></div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <div class="col-12 col-md-7">
          <div class="list-item-animation" style="animation-delay: 0.5s;">
            <div class="text-subtitle1 text-weight-bold q-mb-sm subheader-title">ส่วนของแพทย์</div>
            <q-card class="main-card q-mb-lg interactive-card" @mouseenter="throttledPlayHoverSound">
              <q-card-section>
                <div class="text-h6">การวินิจฉัยและแผนการรักษา</div>
                <q-separator dark class="q-my-sm" />
                <q-select dark label="การวินิจฉัย (Diagnosis)" v-model="assessmentPlan.diagnosis" use-input input-debounce="0" :options="filteredDiagnosisOptions" @filter="filterDiagnosis" outlined multiple use-chips stack-label class="q-mb-sm" @popup-show="playFormFocusSound" @update:model-value="playSelectionSound" @remove="playRemoveSound"/>
                <q-input dark v-if="assessmentPlan.diagnosis.includes('Other')" v-model="assessmentPlan.diagnosisOtherText" label="ระบุการวินิจฉัยอื่น ๆ" outlined dense class="q-mt-sm q-mb-md" @focus="playFormFocusSound"/>
                <q-select dark label="แผนการรักษา (Plan)" v-model="assessmentPlan.plan" use-input input-debounce="0" :options="filteredPlanOptions" @filter="filterPlan" new-value-mode="add-unique" outlined @popup-show="playFormFocusSound" @update:model-value="playSelectionSound"/>
              </q-card-section>
            </q-card>
          </div>
          <div class="list-item-animation" style="animation-delay: 0.6s;">
            <q-card class="main-card q-mb-lg interactive-card" @mouseenter="throttledPlayHoverSound">
              <q-card-section>
                <div class="text-h6">การรับบริการ</div>
                <q-separator dark class="q-my-sm" />
                <q-select dark label="เลือกบริการที่ได้รับ" v-model="servicesReceived.selected" :options="serviceOptions" multiple use-chips stack-label outlined class="q-mb-sm" @popup-show="playFormFocusSound" @update:model-value="playSelectionSound" @remove="playRemoveSound"/>
                <q-input dark v-if="servicesReceived.selected.includes('Other')" v-model="servicesReceived.otherText" label="ระบุบริการอื่น ๆ" outlined dense class="q-mt-sm" @focus="playFormFocusSound"/>
              </q-card-section>
            </q-card>
          </div>
          <div class="list-item-animation" style="animation-delay: 0.7s;">
            <q-card class="main-card q-mb-lg interactive-card" @mouseenter="throttledPlayHoverSound">
              <q-card-section>
                <div class="text-h6">หัตถการ</div>
                <q-separator dark class="q-my-sm" />
                <q-select dark label="เลือกหัตถการ" v-model="proceduresPerformed.selected" :options="procedureOptions" multiple use-chips stack-label outlined class="q-mb-sm" @popup-show="playFormFocusSound" @update:model-value="playSelectionSound" @remove="playRemoveSound"/>
                <q-input dark v-if="proceduresPerformed.selected.includes('Other')" v-model="proceduresPerformed.otherText" label="ระบุหัตถการอื่น ๆ" outlined dense class="q-mt-sm" @focus="playFormFocusSound"/>
              </q-card-section>
            </q-card>
          </div>
          <div class="list-item-animation" style="animation-delay: 0.8s;">
            <q-card class="main-card interactive-card" @mouseenter="throttledPlayHoverSound">
              <div v-if="showCapsuleAnimation" class="capsule-animation-container">
                <div class="capsule">
                  <div class="capsule-part part-one"></div>
                  <div class="capsule-part part-two"></div>
                </div>
              </div>

              <q-card-section>
                <div class="text-h6">การสั่งยา (Prescription)</div>
                <q-separator dark class="q-my-sm" />
                <div class="hightech-choice-container q-mb-md">
                  <div class="choice-btn" :class="{ 'active': prescriptionChoice === 'prescribe' }" @click="prescriptionChoice = 'prescribe'; playBulbSound();">
                    <q-icon name="o_vaccines" />
                    <span>สั่งยา</span>
                  </div>
                  <div class="choice-btn choice-btn--danger" :class="{ 'active': prescriptionChoice === 'no_prescribe' }" @click="prescriptionChoice = 'no_prescribe'; playBulbSound();">
                    <q-icon name="o_do_not_disturb_on" />
                    <span>ไม่สั่งยา</span>
                  </div>
                </div>

                <div v-if="prescriptionChoice === 'prescribe'">
                  <div class="row q-col-gutter-sm items-start q-mb-md">
                    <div class="col-12 col-md-6"><q-select dark dense outlined v-model="newMedication.name" label="ชื่อยา" use-input :options="filteredMedicationOptions" @filter="filterMedication" new-value-mode="add-unique" @popup-show="playFormFocusSound" @update:model-value="playSelectionSound"/></div>
                    <div class="col-12 col-md-6"><q-select dark dense outlined v-model="newMedication.dosage" label="ขนาด" use-input :options="dosageOptions" new-value-mode="add-unique" @popup-show="playFormFocusSound" @update:model-value="playSelectionSound"/></div>
                    <div class="col-6 col-md-3"><q-select dark dense outlined v-model="newMedication.quantity" label="จำนวน" use-input :options="quantityOptions" new-value-mode="add-unique" type="number" @popup-show="playFormFocusSound" @update:model-value="playSelectionSound"/></div>
                    <div class="col-12 col-md-9"><q-select dark dense outlined v-model="newMedication.instruction" label="วิธีใช้" use-input :options="instructionOptions" new-value-mode="add-unique" @popup-show="playFormFocusSound" @update:model-value="playSelectionSound"/></div>

                    <transition name="fade-scale">
                      <div v-if="isMedicationFormValid" class="col-12 q-mt-sm">
                        <q-btn label="เพิ่มรายการยา" icon="add" class="primary-action-btn full-width" @click="addMedication" @mouseenter="throttledPlayHoverSound"/>
                      </div>
                    </transition>
                  </div>

                  <q-list bordered separator dark v-if="prescriptions.length > 0" class="med-list">
                    <q-item v-for="(med, index) in prescriptions" :key="index">
                      <q-item-section><q-item-label>{{ med.name }} ({{ med.dosage }})</q-item-label><q-item-label caption class="welcome-text">จำนวน: {{ med.quantity }} | วิธีใช้: {{ med.instruction }}</q-item-label></q-item-section>
                      <q-item-section side><q-btn flat round color="negative" icon="delete" @click="() => { removeMedication(index); playRemoveSound(); }" /></q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </q-card-section>

              <transition name="fade-scale">
                <q-card-actions v-if="prescriptions.length > 0" align="right" class="q-pa-md action-footer">
                  <q-btn label="บันทึกและส่งต่อห้องยา" icon="send" class="primary-action-btn pulsing-glow" @click="() => { handleSaveAndForward(); playClickSound(); }" @mouseenter="throttledPlayHoverSound" />
                </q-card-actions>
              </transition>
            </q-card>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center q-pa-xl">
      <q-spinner-dots color="primary" size="40px" />
      <div class="q-mt-md">กำลังโหลดข้อมูล...</div>
    </div>

    <q-dialog v-model="showCertificateDialog" persistent transition-show="scale" transition-hide="scale">
        <q-card class="certificate-dialog-card">
            <q-bar class="bg-primary text-white no-print">
                <q-icon name="o_description" />
                <div>ใบรับรองแพทย์</div>
                <q-space />
                <q-btn dense flat icon="print" @click="printCertificate">
                    <q-tooltip class="tooltip-glassy">พิมพ์</q-tooltip>
                </q-btn>
                <q-btn dense flat icon="close" v-close-popup>
                    <q-tooltip class="tooltip-glassy">ปิด</q-tooltip>
                </q-btn>
            </q-bar>
            <q-card-section class="q-pa-lg scroll" style="height: 80vh;">
                <div class="text-h6 text-center q-mb-md">กรอกข้อมูลสำหรับใบรับรองแพทย์</div>
                <div class="part-title">ส่วนที่ 1: ของผู้ขอรับใบรับรองสุขภาพ</div>
                <div class="row q-col-gutter-md">
                    <div class="col-4"><q-select dark dense outlined v-model="certificateData.patientTitle" :options="['นาย', 'นาง', 'นางสาว', 'ด.ช.', 'ด.ญ.']" label="คำนำหน้า" /></div>
                    <div class="col-8"><q-input dark dense outlined v-model="certificateData.patientName" label="ชื่อ-นามสกุล ผู้ป่วย" /></div>
                </div>
                <q-input dark dense outlined v-model="certificateData.patientAddress" label="สถานที่อยู่ (ที่สามารถติดต่อได้)" class="q-mt-sm" type="textarea" autogrow/>
                <q-input dark dense outlined v-model="certificateData.patientId" label="หมายเลขบัตรประชาชน" class="q-mt-sm" />
                <div class="text-subtitle1 q-mt-md">ประวัติสุขภาพ:</div>
                <div class="row q-gutter-sm items-center"><q-checkbox dark v-model="certificateData.hasChronicDisease" label="โรคประจำตัว" /><q-input class="col" dark dense outlined v-if="certificateData.hasChronicDisease" v-model="certificateData.chronicDiseaseDetail" label="ระบุ" /></div>
                <div class="row q-gutter-sm items-center"><q-checkbox dark v-model="certificateData.hasAccident" label="อุบัติเหตุ และ ผ่าตัด" /><q-input class="col" dark dense outlined v-if="certificateData.hasAccident" v-model="certificateData.accidentDetail" label="ระบุ" /></div>
                <div class="row q-gutter-sm items-center"><q-checkbox dark v-model="certificateData.hasHospitalization" label="เคยเข้ารับการรักษาใน รพ." /><q-input class="col" dark dense outlined v-if="certificateData.hasHospitalization" v-model="certificateData.hospitalizationDetail" label="ระบุ" /></div>
                <div class="row q-gutter-sm items-center"><q-checkbox dark v-model="certificateData.hasOtherHistory" label="ประวัติอื่นที่สำคัญ" /><q-input class="col" dark dense outlined v-if="certificateData.hasOtherHistory" v-model="certificateData.otherHistoryDetail" label="ระบุ" /></div>

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
                <div class="row q-gutter-sm items-center q-mt-md">
                    <q-toggle dark color="green" v-model="certificateData.isBodyNormal" label="สภาพร่างกายอยู่ในเกณฑ์ปกติ" />
                    <q-input class="col" dark dense outlined v-if="!certificateData.isBodyNormal" v-model="certificateData.abnormalDetail" label="ระบุความผิดปกติ" />
                </div>
                <q-input class="q-mt-sm" dark dense outlined v-model="certificateData.doctorOpinion" label="ความเห็นแพทย์ (เกี่ยวกับโรคไม่ติดต่อร้ายแรง)" type="textarea" autogrow />
                <div class="text-subtitle1 q-mt-md">การรับรองเกี่ยวกับโรคติดต่อ:</div>
                <q-checkbox dark v-model="certificateData.hasLeprosy" label="ไม่ปรากฎอาการโรคเรื้อน" />
                <q-checkbox dark v-model="certificateData.hasTuberculosis" label="ไม่ปรากฎอาการวัณโรคในระยะอันตราย" />
                <q-checkbox dark v-model="certificateData.hasElephantiasis" label="ไม่ปรากฎอาการโรคเท้าช้าง" />
                <div class="row q-gutter-sm items-center"><q-checkbox dark v-model="certificateData.needsExtraLab" label="จำเป็นต้องตรวจเพิ่มเติม" /><q-input class="col" dark dense outlined v-if="certificateData.needsExtraLab" v-model="certificateData.extraLabDetail" label="ระบุ" /></div>
                <q-input class="q-mt-md" dark dense outlined v-model="certificateData.doctorRecommendation" label="สรุปความเห็นและข้อแนะนำ" type="textarea" autogrow />
            </q-card-section>
        </q-card>
    </q-dialog>

    <q-dialog v-model="isDetailDialogVisible">
      <q-card style="width: 700px; max-width: 90vw;" class="main-card">
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

          <div v-if="selectedDetail.type === 'history'">
            <div class="q-mb-md">
              <div class="text-subtitle1 text-weight-bold text-primary">อาการสำคัญ</div>
              <p class="text-body1 q-pl-sm" style="white-space: pre-wrap;">{{ selectedDetail.content.chiefComplaint }}</p>
            </div>
            <div class="q-mb-md">
              <div class="text-subtitle1 text-weight-bold text-primary">รายละเอียด</div>
              <p class="text-body1 q-pl-sm" style="white-space: pre-wrap;">{{ selectedDetail.content.presentIllness }}</p>
            </div>
            <div>
              <div class="text-subtitle1 text-weight-bold text-primary">ซักประวัติตามระบบ</div>
              <div v-for="(symptoms, system) in selectedDetail.content.reviewOfSystems" :key="system">
                <div v-if="symptoms.length > 0" class="q-mb-sm q-mt-sm">
                  <b class="text-light-blue-3">{{ formatSystemName(system) }}:</b>
                  <div class="q-gutter-sm q-mt-xs">
                    <q-chip v-for="symptom in symptoms" :key="symptom" dense color="blue-grey-10" text-color="blue-grey-2">{{ symptom }}</q-chip>
                  </div>
                </div>
              </div>
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
            <q-item>
              <q-item-section><q-item-label caption>ส่วนสูง</q-item-label></q-item-section>
              <q-item-section side><q-item-label class="text-body1">{{ selectedDetail.content.height || '-' }} ซม.</q-item-label></q-item-section>
            </q-item>
            <q-item>
              <q-item-section><q-item-label caption>น้ำหนัก</q-item-label></q-item-section>
              <q-item-section side><q-item-label class="text-body1">{{ selectedDetail.content.weight || '-' }} กก.</q-item-label></q-item-section>
            </q-item>
            <q-item>
              <q-item-section><q-item-label caption>BMI</q-item-label></q-item-section>
              <q-item-section side><q-item-label class="text-body1">{{ selectedDetail.content.bmi || '-' }}</q-item-label></q-item-section>
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
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

// --- SOUND SYSTEM (existing + new) ---
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
const capsuleSynth = createSynth(Tone.NoiseSynth, { noise: { type: 'white' }, envelope: { attack: 0.005, decay: 0.05, sustain: 0 } }, -15);
let lastHoverTime = 0;
const throttleDelay = 100;
let isRemoving = false;
const playSound = (synth, note, duration) => { if (Tone.context.state !== 'running') Tone.context.resume(); synth.triggerAttackRelease(note, duration); };
const playTitleRevealSound = () => playSound(revealSynth, ["C3", "E3", "G3"], "1s");
const throttledPlayHoverSound = () => { const now = Date.now(); if (now - lastHoverTime > throttleDelay) { playSound(hoverSynth, "C4", "8n"); lastHoverTime = now; } };
const playClickSound = () => playSound(clickSynth, "C5", "32n");
const playFormFocusSound = () => playSound(formFocusSynth, "G5", "32n");
const playSelectionSound = () => { if (!isRemoving) playSound(selectionSynth, "C6", "16n"); };
const playRemoveSound = () => { playSound(removeSynth, "C2", "8n"); isRemoving = true; setTimeout(() => { isRemoving = false; }, 50); };
const playBulbSound = () => playSound(bulbSynth, "G5", "16n");
const playDialogSound = () => playSound(dialogSynth, "C4", "2n");
const playCapsuleSound = () => {
  if (Tone.context.state !== 'running') Tone.context.resume();
  const now = Tone.now();
  capsuleSynth.triggerAttack(now);
  capsuleSynth.triggerAttack(now + 0.05);
  capsuleSynth.triggerAttack(now + 0.1);
  capsuleSynth.triggerAttackRelease(now + 0.15);
};
// --- END OF SOUNDS ---

// --- NEW: DIALOG LOGIC ---
const isDetailDialogVisible = ref(false);
const selectedDetail = ref({});
const showDetailDialog = (detail) => {
  selectedDetail.value = detail;
  isDetailDialogVisible.value = true;
  playClickSound();
};
// --- END: NEW DIALOG LOGIC ---

const router = useRouter();
const $q = useQuasar();
const showPatientMenu = ref(false);
const showCapsuleAnimation = ref(false);

const mockVisitData = {
  patientInfo: { name: 'นายสมชาย ใจดี', patientId: 'HXH0001', gender: 'ชาย', age: 12, allergies: 'Penicillin', foodAllergies: 'ไม่มี', underlyingDisease: 'ความดันโลหิตสูง' },
  recordDateTime: '14/07/2025 12:25',
  vitalSigns: { temperature: 38.5, pulse: 92, breathing: 20, bloodPressureSystolic: 145, bloodPressureDiastolic: 90, height: 170, weight: 65, bmi: '22.5' },
  symptoms: { chiefComplaint: 'มีไข้ ไอ เจ็บคอ 2 วัน', presentIllness: '2 วันก่อนเริ่มเจ็บคอ วันนี้ไอมากขึ้นและมีไข้สูง รู้สึกปวดเมื่อยตามตัว', reviewOfSystems: { general: ['มีไข้', 'หนาวสั่น', 'อ่อนเพลีย / ไม่มีแรง'], headAndNeck: ['ปวดศีรษะ', 'เจ็บคอ'], respiratory: ['ไอ', 'ไอมีเสมหะ'], cardiovascular: [], gastrointestinal: ['เบื่ออาหาร'], skin: [], } },
  initialProcedures: [ { service: 'ตรวจรักษา', procedure: 'วัดความดัน', diagnosis: 'ซักประวัติ', notes: '' } ],
  services: { selected: ['ตรวจรักษพยาบาล', 'ตรวจร่างกาย'], otherText: '' }
};

const visitData = ref(null);
const pageStatus = ref('รอการวินิจฉัย');
const assessmentPlan = reactive({ diagnosis: [], diagnosisOtherText: '', plan: '' });
const prescriptions = ref([]);
const newMedication = reactive({ name: '', dosage: '', quantity: '', instruction: '' });
const isHistoryEditing = ref(false);
const historyData = reactive({ chiefComplaint: '', presentIllness: '' });
const servicesReceived = reactive({ selected: [], otherText: '' });
const proceduresPerformed = reactive({ selected: [], otherText: '' });
const prescriptionChoice = ref('prescribe');

// Medical Certificate State
const showCertificateDialog = ref(false);
const certificateData = reactive({
  volume: '1', number: '', patientTitle: 'นาย', patientName: '', patientAddress: '', patientId: '',
  hasChronicDisease: false, chronicDiseaseDetail: '', hasAccident: false, accidentDetail: '',
  hasHospitalization: false, hospitalizationDetail: '', hasOtherHistory: false, otherHistoryDetail: '',
  examDate: new Date().toISOString().substr(0, 10).replace(/-/g, '/'),
  doctorName: 'พญ.ใจดี มีเมตตา', doctorLicense: 'ว.12345', hospitalName: 'คลินิกสุขภาพดี',
  vitals: { weight: '', height: '', temperature: '', pulse: '', bloodPressure: '' },
  isBodyNormal: true, abnormalDetail: '',
  doctorOpinion: 'ไม่เป็นผู้มีร่างกายทุพพลภาพจนไม่สามารถปฏิบัติหน้าที่ได้ ไม่ปรากฏอาการของโรคจิต หรือจิตฟั่นเฟือน หรือปัญญาอ่อน ไม่ปรากฏอาการของการติดยาเสพติดให้โทษและอาการของโรคพิษสุราเรื้อรัง',
  hasLeprosy: true,
  hasTuberculosis: true,
  hasElephantiasis: true,
  needsExtraLab: false,
  extraLabDetail: '',
  doctorRecommendation: 'สุขภาพแข็งแรงสมบูรณ์ สามารถทำงานได้',
  doctorSignature: 'ใจดี มีเมตตา'
});

const procedureOptions = ref(['ตรวจการได้ยิน', 'remove wax/foreignbody', 'dressing/suture/stitch off', 'ekg 12 leads', 'dtx /blood exam', 'on IV', 'ฉีดยาต่างๆ', 'Aspiration', 'refer', 'oxygen therapy/พ่นยา', 'CPR/Intubation', 'ทำคลอด', 'ทำรองเท้า/เฝือก กายอุปกรณ์', 'ตรวจเต้านม', 'ตรวจมะเร็งปากมดลูก', 'Xray', 'สัตว์กัด/ขีดข่วน', 'Other']);
const serviceOptions = ref(['ตรวจรักษพยาบาล', 'ฝังเข็ม', 'ตรวจร่างกาย', 'เยี่ยมบ้าน', 'กายภาพ', 'นวดประคบแผนไทย', 'Other']);
const diagnosisOptions = ref(['Infections bacterial diseases อาทิเช่น... (AGE, Diarrhea, Syphilis, STDs)', 'Viral infections, Mycoses, Protozoal diseases, Helminthiases เช่น... (AIDS, เริม)', 'Neoplasms มะเร็ง', 'Diseases of the blood and blood-forming organs เช่น... (โลหิตจาง)', 'Endocrine, nutritional and metabolic diseases เช่น... (ไทรอยด์, เบาหวาน, Dyslipidaemia)', 'Mental and behavioural disorders เช่น... (เมาสุรา, ซึมเศร้า, Hyperventilation)', 'Diseases of the nervous system เช่น... (Epilepsy, Parkinson\'s disease, ไมเกรน)', 'Diseases of the eye and adnexae โรคทางตา', 'Diseases of the ear and mastoid process โรคทางหู คอ จมูก', 'Diseases of the circulatory system เช่น... (โรคหัวใจ, CVA)', 'Diseases of the respiratory system รวมถึงโรคดีสคอมมู', 'Diseases of the digestive system ระบบทางเดินอาหาร', 'Diseases of the skin and subcutaneous tissue ทางผิวหนัง ผื่นแพ้', 'Diseases of the musculoskeletal system and connective tissue โรคกระดูก ข้อเสื่อม', 'Diseases of the genitourinary system ระบบสืบพันธุ์ ทางเดินปัสสาวะ', 'Pregnancy, childbirth and the puerperium', 'Symptoms, signs and abnormal clinical and laboratory findings not อาการผิดปกติอื่นๆ', 'Accident / สารพิษ', 'เช็คความดัน', 'Other']);
const planOptions = ref(['Prescribe antibiotics and rest', 'Symptomatic treatment', 'Advise hydration and diet control', 'Follow up in 1 week', 'Refer to specialist']);
const medicationOptions = ref(['Paracetamol 500mg', 'Amoxicillin 500mg', 'Ibuprofen 400mg', 'Loratadine 10mg', 'Metformin 500mg', 'Amlodipine 5mg']);
const dosageOptions = ref(['500mg', '250mg', '10mg', '5mg', '15ml', '60ml']);
const instructionOptions = ref(['1 เม็ด วันละครั้ง หลังอาหารเช้า', '1 เม็ด วันละครั้ง ก่อนนอน', '1 เม็ด 3 เวลา หลังอาหาร', '1-2 เม็ด ทุก 4-6 ชั่วโมง เมื่อมีอาการ', 'ทาบริเวณที่เป็น วันละ 2 ครั้ง เช้า-เย็น']);
const quantityOptions = ref(['10', '20', '30', '1']);
const filteredDiagnosisOptions = ref([]);
const filteredPlanOptions = ref([]);
const filteredMedicationOptions = ref([]);

const isMedicationFormValid = computed(() => newMedication.name && newMedication.quantity);

const statusChipColor = computed(() => {
  switch (pageStatus.value) {
    case 'รอการวินิจฉัย': return 'deep-orange';
    case 'กำลังรักษา': return 'light-blue-7';
    case 'รอส่งต่อห้องยา': return 'primary';
    case 'รักษาเสร็จสิ้น': return 'positive';
    default: return 'grey-7';
  }
});

const statusIcon = computed(() => {
  switch (pageStatus.value) {
    case 'รอการวินิจฉัย': return 'o_hourglass_top';
    case 'กำลังรักษา': return 'o_sync';
    case 'รอส่งต่อห้องยา': return 'o_move_to_inbox';
    case 'รักษาเสร็จสิ้น': return 'o_task_alt';
    default: return 'o_label';
  }
});

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

const filterDiagnosis = (val, update) => filterFn(val, update, diagnosisOptions, filteredDiagnosisOptions);
const filterPlan = (val, update) => filterFn(val, update, planOptions, filteredPlanOptions);
const filterMedication = (val, update) => filterFn(val, update, medicationOptions, filteredMedicationOptions);

onMounted(() => {
  visitData.value = mockVisitData;
  if (visitData.value) {
    if (visitData.value.symptoms) {
      historyData.chiefComplaint = visitData.value.symptoms.chiefComplaint;
      historyData.presentIllness = visitData.value.symptoms.presentIllness;
    }
    if (visitData.value.services) {
      servicesReceived.selected = [...visitData.value.services.selected] || [];
      servicesReceived.otherText = visitData.value.services.otherText || '';
    }
  }
  filteredDiagnosisOptions.value = [...diagnosisOptions.value];
  filteredPlanOptions.value = [...planOptions.value];
  filteredMedicationOptions.value = [...medicationOptions.value];
  setTimeout(() => { playTitleRevealSound(); }, 200);
});

// --- Medical Certificate Functions ---
const openCertificateDialog = () => {
  if (visitData.value) {
    const { patientInfo, vitalSigns } = visitData.value;
    certificateData.patientName = patientInfo.name;
    certificateData.patientId = patientInfo.patientId;
    certificateData.vitals.weight = vitalSigns.weight;
    certificateData.vitals.height = vitalSigns.height;
    certificateData.vitals.temperature = vitalSigns.temperature;
    certificateData.vitals.pulse = vitalSigns.pulse;
    certificateData.vitals.bloodPressure = `${vitalSigns.bloodPressureSystolic}/${vitalSigns.bloodPressureDiastolic}`;
    if (patientInfo.underlyingDisease && patientInfo.underlyingDisease !== 'ไม่มี') {
        certificateData.hasChronicDisease = true;
        certificateData.chronicDiseaseDetail = patientInfo.underlyingDisease;
    }
  }
  showCertificateDialog.value = true;
};

const printCertificate = () => {
  $q.notify({ message: 'กำลังสร้างเอกสารสำหรับพิมพ์...', icon: 'o_print', position: 'top', timeout: 1500 });

  const {
    volume, number, patientTitle, patientName, patientAddress, patientId,
    hasChronicDisease, chronicDiseaseDetail, hasAccident, accidentDetail,
    hasHospitalization, hospitalizationDetail, hasOtherHistory, otherHistoryDetail,
    examDate, doctorName, doctorLicense, hospitalName, vitals,
    isBodyNormal, abnormalDetail, doctorOpinion,
    hasLeprosy, hasTuberculosis, hasElephantiasis, needsExtraLab, extraLabDetail,
    doctorRecommendation
  } = certificateData;

  const formatDate = (dateStr) => {
    if (!dateStr) return { day: '...', month: '...', year: '...' };
    const date = new Date(dateStr.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1'));
    const day = date.getDate();
    const month = date.toLocaleString('th-TH', { month: 'long' });
    const year = date.getFullYear() + 543;
    return { day, month, year };
  };

  const examFormattedDate = formatDate(examDate);

  const getHistoryLine = (label, has, detail) => {
    return `
      <div class="history-item">
        <span>${label}</span>
        <div class="checkboxes">
          <span>[ ${!has ? '✓' : '&nbsp;'} ] ไม่มี</span>
          <span>[ ${has ? '✓' : '&nbsp;'} ] มี (ระบุ) <span class="underline">${has ? (detail || '&nbsp;'.repeat(20)) : '&nbsp;'.repeat(20)}</span></span>
        </div>
      </div>`;
  };

  const content = `
    <div class="cert-container">
      <div class="cert-header">
        <h1>ใบรับรองแพทย์</h1>
        <div class="doc-id">
          <span>เล่มที่: <span class="underline">${volume || '&nbsp;'.repeat(10)}</span></span>
          <span>เลขที่: <span class="underline">${number || '&nbsp;'.repeat(10)}</span></span>
        </div>
      </div>

      <div class="cert-section">
        <h2>ส่วนที่ 1: ของผู้ขอรับใบรับรองสุขภาพ</h2>
        <p>ข้าพเจ้า (${patientTitle}) <span class="underline">${patientName || '&nbsp;'.repeat(40)}</span></p>
        <p>สถานที่อยู่ (ที่สามารถติดต่อได้) <span class="underline">${patientAddress || '&nbsp;'.repeat(60)}</span></p>
        <p>หมายเลขบัตรประชาชน <span class="underline">${patientId || '&nbsp;'.repeat(25)}</span></p>
        <p class="q-mt-lg">ข้าพเจ้าขอรับรองว่าข้อความข้างต้นเป็นความจริง และได้แจ้งประวัติสุขภาพดังนี้</p>
        ${getHistoryLine('1. โรคประจำตัว', hasChronicDisease, chronicDiseaseDetail)}
        ${getHistoryLine('2. อุบัติเหตุ และ ผ่าตัด', hasAccident, accidentDetail)}
        ${getHistoryLine('3. เคยเข้ารับการรักษาในโรงพยาบาล', hasHospitalization, hospitalizationDetail)}
        <div class="history-item-full">4. ประวัติอื่นที่สำคัญ <span class="underline">${otherHistoryDetail || '&nbsp;'.repeat(70)}</span></div>
        <div class="signature-area-patient">
            <span>ลงชื่อ ..................................................... ผู้ขอรับการตรวจสุขภาพ</span>
            <span>วันที่ ${examFormattedDate.day} เดือน ${examFormattedDate.month} พ.ศ. ${examFormattedDate.year}</span>
        </div>
      </div>

      <div class="cert-section">
        <h2>ส่วนที่ 2: ของแพทย์</h2>
        <p>สถานที่ตรวจ <span class="underline">${hospitalName || '&nbsp;'.repeat(30)}</span> วันที่ <span class="underline">${examFormattedDate.day}</span> เดือน <span class="underline">${examFormattedDate.month}</span> พ.ศ. <span class="underline">${examFormattedDate.year}</span></p>
        <p>ข้าพเจ้า (นายแพทย์/แพทย์หญิง) <span class="underline">${doctorName || '&nbsp;'.repeat(30)}</span> ใบอนุญาตประกอบวิชาชีพเวชกรรมเลขที่ <span class="underline">${doctorLicense || '&nbsp;'.repeat(15)}</span></p>
        <p>ได้ตรวจร่างกายของ (${patientTitle}) <span class="underline">${patientName || '&nbsp;'.repeat(30)}</span> แล้วเมื่อวันที่ <span class="underline">${examDate || '&nbsp;'.repeat(20)}</span> มีรายละเอียดดังนี้</p>
        <div class="vitals-grid">
          <span>น้ำหนัก: <span class="underline">${vitals.weight || '&nbsp;'}</span> กก.</span>
          <span>ส่วนสูง: <span class="underline">${vitals.height || '&nbsp;'}</span> ซม.</span>
          <span>ความดันโลหิต: <span class="underline">${vitals.bloodPressure || '&nbsp;'}</span> มม.ปรอท</span>
          <span>ชีพจร: <span class="underline">${vitals.pulse || '&nbsp;'}</span> ครั้ง/นาที</span>
        </div>
        <p>สภาพร่างกายทั่วไป อยู่ในเกณฑ์ [ ${isBodyNormal ? '✓' : '&nbsp;'} ] ปกติ [ ${!isBodyNormal ? '✓' : '&nbsp;'} ] ผิดปกติ (ระบุ) <span class="underline">${!isBodyNormal ? abnormalDetail : ''}</span></p>
        <p class="opinion-text">ขอรับรองว่าบุคคลดังกล่าว ${doctorOpinion}</p>
        <p class="opinion-text">และไม่ปรากฏอาการและอาการแสดงของโรคดังต่อไปนี้</p>
        <div class="disease-list">
          <div>(๑) โรคเรื้อนในระยะติดต่อหรือในระยะที่ปรากฏอาการเป็นที่รังเกียจแก่สังคม <span class="checkbox-end">[ ${hasLeprosy ? '✓' : '&nbsp;'} ]</span></div>
          <div>(๒) วัณโรคในระยะอันตราย <span class="checkbox-end">[ ${hasTuberculosis ? '✓' : '&nbsp;'} ]</span></div>
          <div>(๓) โรคเท้าช้างในระยะที่ปรากฏอาการเป็นที่รังเกียจแก่สังคม <span class="checkbox-end">[ ${hasElephantiasis ? '✓' : '&nbsp;'} ]</span></div>
          <div>(๔) (ถ้าจำเป็นต้องตรวจหาโรคที่เกี่ยวข้องกับการปฏิบัติงานของผู้รับการตรวจให้ระบุชื่อโรค) <span class="underline">${needsExtraLab ? extraLabDetail : 'ไม่มี'}</span></div>
        </div>
        <p>สรุปความเห็นและข้อแนะนำของแพทย์ <span class="underline-full">${doctorRecommendation || '&nbsp;'}</span></p>
      </div>

      <div class="signature-area">
        <div class="signature-box">
          <p>ลงชื่อ .....................................................</p>
          <p>( ${doctorName || '&nbsp;'.repeat(30)} )</p>
          <p>แพทย์ผู้ตรวจร่างกาย</p>
        </div>
      </div>
      <div class="footer-note">หมายเหตุ (๑) ต้องเป็นแพทย์ซึ่งได้ขึ้นทะเบียนรับใบอนุญาตประกอบวิชาชีพเวชกรรม (๒) ให้แสดงว่าเป็นผู้มีร่างกายสมบูรณ์เพียงใด โดยให้แสดงความเห็นด้วยว่าไม่เป็นอุปสรรคต่อการปฏิบัติงานหรือไม่</div>
    </div>
  `;

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap');
    body { font-family: 'Sarabun', sans-serif; background: #fff; color: #000; margin: 0; padding: 0; font-size: 14px; }
    .cert-container { width: 210mm; min-height: 297mm; padding: 12mm; margin: auto; box-sizing: border-box; }
    .cert-header { text-align: center; position: relative; margin-bottom: 1.5rem; }
    .cert-header h1 { font-size: 1.6rem; margin: 0; font-weight: bold; }
    .doc-id { display: flex; justify-content: flex-end; gap: 2rem; }
    .cert-section { margin-bottom: 1rem; }
    .cert-section h2 { font-size: 1.1rem; font-weight: bold; padding-bottom: 0.25rem; margin-bottom: 0.5rem; }
    p { margin: 0.3rem 0; line-height: 1.7; }
    .underline { border-bottom: 1px dotted #000; padding: 0 0.2em; font-weight: bold; }
    .underline-full { display: block; width: 100%; border-bottom: 1px dotted #000; min-height: 1.5em; margin-top: 0.25rem; }
    .history-item { display: grid; grid-template-columns: 200px 1fr; margin-top: 0.2rem; }
    .history-item-full { margin-top: 0.2rem; }
    .checkboxes { display: flex; gap: 1rem; }
    .signature-area-patient { display: flex; justify-content: space-between; margin-top: 1rem; }
    .vitals-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.2rem 1rem; }
    .opinion-text { text-indent: 2em; }
    .disease-list { padding-left: 2em; }
    .disease-list div { position: relative; padding-right: 25px; }
    .checkbox-end { position: absolute; right: 0; top: 0; }
    .signature-area { display: flex; justify-content: flex-end; margin-top: 2rem; }
    .signature-box { width: 280px; text-align: center; }
    .footer-note { font-size: 10px; margin-top: 2rem; border-top: 1px solid #ccc; padding-top: 0.5rem; }
    @page { size: A4; margin: 0; }
  `;

  setTimeout(() => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>ใบรับรองแพทย์</title>');
    printWindow.document.write(`<style>${styles}</style>`);
    printWindow.document.write('</head><body>');
    printWindow.document.write(content);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }, 500);
};


const isAbnormal = (value, type) => {
  if (value === null || value === undefined) return false;
  if (type === 'temp' && value >= 37.5) return true;
  if (type === 'bp' && (value.bloodPressureSystolic >= 140 || value.bloodPressureDiastolic >= 90)) return true;
  return false;
};

const formatSystemName = (systemKey) => {
  const names = { general: 'ทั่วไป', headAndNeck: 'ศีรษะและลำคอ', respiratory: 'ระบบทางเดินหายใจ', cardiovascular: 'ระบบหัวใจ', gastrointestinal: 'ระบบทางเดินอาหาร', skin: 'ผิวหนัง' };
  return names[systemKey] || systemKey;
};

const saveHistory = () => {
  visitData.value.symptoms.chiefComplaint = historyData.chiefComplaint;
  visitData.value.symptoms.presentIllness = historyData.presentIllness;
  isHistoryEditing.value = false;
};

const cancelHistoryEdit = () => {
    historyData.chiefComplaint = visitData.value.symptoms.chiefComplaint;
    historyData.presentIllness = visitData.value.symptoms.presentIllness;
    isHistoryEditing.value = false;
}

const addMedication = () => {
  if (!isMedicationFormValid.value) return;

  showCapsuleAnimation.value = true;
  playCapsuleSound();

  setTimeout(() => {
    prescriptions.value.push({ ...newMedication });
    newMedication.name = '';
    newMedication.dosage = '';
    newMedication.quantity = '';
    newMedication.instruction = '';
    showCapsuleAnimation.value = false;
  }, 800); // Match animation duration
};

const removeMedication = (index) => {
  prescriptions.value.splice(index, 1);
};

const getFinalRecord = () => {
  saveHistory();
  if (!servicesReceived.selected.includes('Other')) { servicesReceived.otherText = ''; }
  if (!assessmentPlan.diagnosis.includes('Other')) { assessmentPlan.diagnosisOtherText = ''; }
  if (!proceduresPerformed.selected.includes('Other')) { proceduresPerformed.otherText = ''; }
  const finalMedications = prescriptionChoice.value === 'prescribe' ? [...prescriptions.value] : [];
  return { ...visitData.value, doctorNotes: { ...assessmentPlan }, medications: finalMedications, isPrescribing: prescriptionChoice.value === 'prescribe', servicesReceived: { ...servicesReceived }, procedures: { ...proceduresPerformed }, };
}

const saveProgress = () => {
  if (pageStatus.value !== 'กำลังรักษา') { pageStatus.value = 'กำลังรักษา'; }
  const progressData = getFinalRecord();
  console.log("Saving Progress:", progressData);
  $q.notify({
    classes: 'themed-notify themed-notify-info',
    icon: 'o_save',
    message: 'บันทึกข้อมูลล่าสุดเรียบร้อยแล้ว',
    position: 'top',
    timeout: 2000
  });
};

const handleSaveAndForward = () => {
  const finalRecord = getFinalRecord();
  finalRecord.status = 'pending_pharmacy';
  pageStatus.value = 'รอส่งต่อห้องยา';
  console.log("Saving and Forwarding:", finalRecord);
  $q.notify({
    classes: 'themed-notify themed-notify-primary',
    icon: 'send',
    message: 'บันทึกและส่งต่อไปยังห้องยาเรียบร้อยแล้ว!',
    position: 'top',
    timeout: 2500
  });
};

const confirmTreatmentComplete = () => {
  playDialogSound();
  $q.dialog({
    class: 'themed-dialog',
    dark: true,
    title: ' ', // Title is part of the custom message structure
    message: `
      <div class="final-confirm-dialog">
        <div class="dialog-icon-wrapper">
          <i class="q-icon notranslate material-icons">warning</i>
        </div>
        <div class="dialog-title-text">ยืนยันการสิ้นสุดการรักษา</div>
        <div class="dialog-message-text">
          การดำเนินการนี้จะปิดเคสอย่างถาวร กรุณากดยืนยันเมื่อแน่ใจว่าทุกขั้นตอนเสร็จสิ้นแล้วเท่านั้น
        </div>
      </div>
    `,
    html: true,
    persistent: true,
    ok: { label: 'ยืนยันและปิดเคส', class: 'dialog-positive-btn' },
    cancel: { label: 'ยกเลิก', class: 'dialog-secondary-btn' },
    transitionShow: 'fade-in-scale',
    transitionHide: 'fade-out-scale'
  }).onOk(() => {
    playClickSound();
    const finalRecord = getFinalRecord();
    finalRecord.status = 'completed';
    pageStatus.value = 'รักษาเสร็จสิ้น';
    console.log("Completing Case:", finalRecord);
    $q.notify({
      classes: 'themed-notify themed-notify-positive',
      icon: 'task_alt',
      message: 'ปิดเคสผู้ป่วยสำเร็จ',
      position: 'top',
      timeout: 2500
    });
  });
};
</script>

<style lang="scss" scoped>
/* Scoped styles for the component */
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

.welcome-text {
  color: #90a4ae;
}

.action-btn {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.primary-action-btn, .positive-btn {
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
  position: relative; // Needed for capsule animation container
}

.popup-card {
    border: 1px solid rgba(0, 184, 255, 0.4);
    box-shadow: 0 0 25px rgba(0, 184, 255, 0.2);
}

.interactive-card {
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer; /* Make all interactive cards clickable */
  &:hover {
    transform: translateY(-6px) scale(1.02);
    border-color: rgba(0, 184, 255, 0.5);
    box-shadow: 0 8px 40px rgba(0,0,0,0.2);
    background-position: 100% 100%;
  }
}

.control-panel .patient-header-item, .control-panel .status-item {
  padding: 8px 16px;
  cursor: pointer;
}

.warning-card-dark {
  background-color: rgba(255, 196, 61, 0.05);
  border-color: rgba(255, 196, 61, 0.3);
}

.info-row { display: flex; align-items: baseline; font-size: 1rem; }
.vital-sign-item { padding: 8px; }
.vital-sign-item .q-item__label--caption { font-size: 0.8rem; }
.vital-sign-item .q-item__label { font-size: 1.1rem; font-weight: 500; }

.med-list {
  border-radius: 4px;
  border: 1px solid rgba(0, 184, 255, 0.2);
  background-color: rgba(0,0,0,0.2);
}

.action-footer {
  background-color: rgba(0, 0, 0, 0.1);
  border-top: 1px solid rgba(0, 184, 255, 0.2);
}

.pulsing-glow {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 5px rgba(0, 184, 255, 0.4); }
  50% { box-shadow: 0 0 20px rgba(0, 184, 255, 0.8); }
  100% { box-shadow: 0 0 5px rgba(0, 184, 255, 0.4); }
}


.hightech-choice-container {
  display: flex;
  gap: 12px;
  width: 100%;
}

.choice-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid rgba(138, 155, 168, 0.3);
  background: transparent;
  color: #90a4ae;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: 500;
  position: relative;
  overflow: hidden;

  .q-icon {
    font-size: 1.4rem;
    transition: all 0.3s ease;
  }

  &:hover {
    border-color: rgba(0, 184, 255, 0.7);
    color: #e0e0e0;
  }

  &.active {
    background: rgba(0, 184, 255, 0.2);
    border-color: #00b8ff;
    color: #ffffff;
    box-shadow: 0 0 12px rgba(0, 184, 255, 0.5), 0 0 4px rgba(0, 184, 255, 0.8) inset;
    text-shadow: 0 0 5px #ffffff;

    .q-icon {
      color: #00d4ff;
      text-shadow: 0 0 8px #00d4ff;
    }
  }

  &.choice-btn--danger.active {
    $danger-color: #ff5252;
    background: rgba($danger-color, 0.2);
    border-color: $danger-color;
    box-shadow: 0 0 12px rgba($danger-color, 0.5), 0 0 4px rgba($danger-color, 0.8) inset;

    .q-icon {
      color: $danger-color;
      text-shadow: 0 0 8px $danger-color;
    }
  }
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

:deep(.q-checkbox__label) {
  font-size: 1rem;
}

/* Capsule Animation Styles */
.capsule-animation-container {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  pointer-events: none;
}
.capsule {
  width: 50px;
  height: 24px;
  display: flex;
  animation: shake-capsule 0.8s cubic-bezier(.36,.07,.19,.97) both;
}
.capsule-part {
  width: 50%;
  height: 100%;
}
.part-one {
  background-color: #00b8ff;
  border-radius: 20px 0 0 20px;
}
.part-two {
  background-color: #e0e0e0;
  border-radius: 0 20px 20px 0;
}

@keyframes shake-capsule {
  10%, 90% { transform: translate3d(-1px, 0, 0) rotate(5deg); }
  20%, 80% { transform: translate3d(2px, 0, 0) rotate(-5deg); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0) rotate(5deg); }
  40%, 60% { transform: translate3d(4px, 0, 0) rotate(-5deg); }
  100% { transform: scale(0); opacity: 0; }
}

/* Fade Scale Transition */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
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
</style>

<style lang="scss">
/* Global styles that apply everywhere, including Dialogs and Notifications */
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

/* Themed Dialog Animations */
@keyframes fadeInScale {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes fadeOutScale {
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0.95); }
}
.fade-in-scale-enter-active { animation: fadeInScale 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.fade-in-scale-leave-active { animation: fadeOutScale 0.3s cubic-bezier(0.7, 0, 0.84, 0); }

/* Themed Dialog Styles */
.themed-dialog .q-dialog__inner {
  backdrop-filter: blur(4px);
  background-color: rgba(10, 25, 40, 0.5);
}

.themed-dialog .q-card {
  width: 420px;
  max-width: 90vw;
  background-color: #16222c !important;
  border-radius: 12px;
  color: #e0e0e0;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 193, 7, 0.3);
  padding: 0;
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
  display: flex;
  gap: 16px;
  padding: 0 24px 24px 24px !important;
  background-color: transparent !important;
  border-top: none !important;
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

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(255, 193, 7, 0.5);
  }
}

.dialog-secondary-btn {
  color: #e0e0e0 !important;
  background-color: rgba(255, 255, 255, 0.1) !important;

  &:hover {
    background-color: rgba(255, 255, 255, 0.15) !important;
  }
}


/* Themed Notification Styles (Global) */
.themed-notify {
  background-color: #1e2a33 !important;
  backdrop-filter: blur(5px);
  border-radius: 12px !important;
  border: 1px solid;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  color: #e0e0e0 !important;
  padding: 12px 20px !important;
}

.themed-notify-positive {
  border-color: #26a69a;
  box-shadow: 0 0 15px rgba(38, 166, 154, 0.4);
}

.themed-notify-info {
  border-color: #039be5;
  box-shadow: 0 0 15px rgba(3, 155, 229, 0.4);
}

.themed-notify-primary {
  border-color: #00b8ff;
  box-shadow: 0 0 15px rgba(0, 184, 255, 0.4);
}
</style>
