<template>
  <q-page class="pharmacy-bg">

    <div v-if="!visitData && isInternalLoading" class="fullscreen column flex-center bg-dark-glass">
      <q-spinner-tail color="accent" size="60px" />
      <div class="q-mt-lg text-h6 text-accent">กำลังเตรียมข้อมูลยา...</div>
    </div>

    <div v-else class="cinema-screen">
      <div class="layout-wrapper">

        <header class="top-bar">
          <div class="row items-center no-wrap full-width justify-between">

            <div class="col-auto row items-center q-mr-lg" style="min-width: 250px;">
              <q-btn flat round icon="arrow_back_ios_new" color="white" @click="goBack" class="hover-scale" />
              <div class="q-ml-md">
                <div class="text-h6 text-weight-bold text-white leading-tight">ห้องจ่ายยา & การเงิน</div>
                <div class="text-caption text-grey-4">Dispensing & Cashier</div>
              </div>
            </div>

            <div class="col flex-center row">
              <div class="control-bar-group row no-wrap items-center">
                <div class="date-glass-box row items-center justify-center cursor-pointer q-mr-sm relative-position">
                  <q-icon name="event" color="cyan-3" size="20px" class="q-mr-sm" />
                  <div class="text-body2 text-white text-weight-medium">{{ displayDateLabel }}</div>
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date v-model="selectedDate" mask="YYYY-MM-DD" color="accent" dark>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="ปิด" color="white" flat />
                        <q-btn v-close-popup label="ดูทั้งหมด" color="accent" flat @click="selectedDate = 'all'" />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </div>

                <div class="switcher-glass-panel row items-center no-wrap">
                  <q-btn flat round dense icon="chevron_left" :color="canGoPrev ? 'white' : 'grey-7'" :disable="!canGoPrev" class="nav-btn" @click="goToPrevPatient" />
                  <q-scroll-area horizontal class="switcher-scroll-area" ref="patientScrollAreaRef" :thumb-style="{ display: 'none' }">
                    <div class="row no-wrap items-center q-px-sm q-py-xs full-height" style="min-width: max-content;">
                      <div v-if="isQueueLoading" class="text-accent q-px-md row items-center full-height"><q-spinner size="20px" class="q-mr-sm"/> โหลดคิว...</div>
                      <div v-else-if="patientQueue.length === 0" class="text-grey-5 q-px-md row items-center full-height">ไม่พบผู้ป่วย</div>
                      <div v-else v-for="(patient, index) in patientQueue" :key="patient.visit_id" class="patient-item-box column flex-center" :class="{ 'active': isPatientActive(patient.visit_id) }" @click="switchPatient(patient.visit_id)" :id="`patient-item-${index}`">
                        <div class="avatar-ring">
                            <q-avatar size="36px" class="avatar-content">
                              <img v-if="patient.avatarUrl" :src="patient.avatarUrl" />
                              <span v-else class="text-weight-bold">{{ patient.patientName ? patient.patientName.charAt(0) : '?' }}</span>
                            </q-avatar>
                        </div>
                        <div class="status-dot" :class="getStatusColorClass(patient.status)"></div>
                        <q-tooltip class="glass-tooltip" :offset="[0, 10]">
                            <div class="text-subtitle2">{{ patient.patientName }}</div>
                            <div class="text-caption text-cyan-2">เวลา: {{ patient.time }}</div>
                        </q-tooltip>
                      </div>
                    </div>
                  </q-scroll-area>
                  <q-btn flat round dense icon="chevron_right" :color="canGoNext ? 'white' : 'grey-7'" :disable="!canGoNext" class="nav-btn" @click="goToNextPatient" />
                </div>
              </div>
            </div>

            <div class="col-auto row items-center q-gutter-x-sm justify-end" style="min-width: 250px;">
              <div class="status-badge-neon" :class="statusColorClass">
                 <q-icon :name="statusIcon" class="q-mr-sm" size="18px"/>
                 <span class="text-weight-bold">{{ pageStatus }}</span>
                 <div class="status-glow"></div>
              </div>

              <q-btn flat round icon="receipt_long" color="cyan-3" @click="openReceiptDialog">
                 <q-tooltip>พิมพ์ใบเสร็จ</q-tooltip>
              </q-btn>

              <q-btn v-if="!isCaseClosed" unelevated rounded color="white" text-color="dark" label="บันทึก" icon="save" @click="markAsInProgress" class="action-btn-small" />
              <q-btn v-if="!isCaseClosed" unelevated rounded class="action-btn-confirm pulse-shadow" icon="check_circle" label="ยืนยัน" @click="confirmDispensing" :disable="!allMedsDispensed" />
            </div>
          </div>
        </header>

        <div class="main-grid relative-position">

          <transition name="fade">
              <div v-if="isPanelLoading" class="absolute-full z-top flex flex-center bg-loading-glass">
                  <div class="column items-center">
                      <q-spinner-tail color="accent" size="50px" />
                      <div class="text-accent q-mt-md text-weight-bold">กำลังโหลดข้อมูล...</div>
                  </div>
              </div>
          </transition>

          <aside class="left-panel">
            <q-card class="glass-card profile-card q-mb-md overflow-hidden">
              <q-card-section class="row items-center no-wrap q-pa-md">
                <div class="avatar-container-outer q-mr-md">
                    <div class="avatar-wrapper" @click="openImagePreview(visitData?.patientInfo?.avatarUrl)">
                        <q-avatar size="72px" class="shadow-3 bg-white text-primary">
                            <img v-if="visitData?.patientInfo?.avatarUrl" :src="visitData.patientInfo.avatarUrl" style="object-fit: cover;">
                            <q-icon v-else name="person" />
                        </q-avatar>
                        <div class="zoom-overlay"><q-icon name="zoom_in" color="white" size="24px"/></div>
                    </div>
                </div>
                <div class="col overflow-hidden">
                  <div class="text-h6 text-white ellipsis text-weight-bold leading-tight">
                    {{ visitData?.patientInfo?.name || '...' }}
                  </div>
                  <div class="text-caption text-cyan-3 q-mb-sm font-mono">
                    ID: {{ visitData?.patientInfo?.patientId || '-' }}
                  </div>
                  <div class="row q-gutter-x-sm">
                    <div class="info-tag" :class="visitData?.patientInfo?.gender === 'ชาย' ? 'tag-male' : (visitData?.patientInfo?.gender === 'หญิง' ? 'tag-female' : 'tag-neutral')">
                        <q-icon :name="visitData?.patientInfo?.gender === 'ชาย' ? 'male' : (visitData?.patientInfo?.gender === 'หญิง' ? 'female' : 'transgender')" size="12px" />
                        {{ visitData?.patientInfo?.gender }}
                    </div>
                    <div class="info-tag tag-neutral">
                        {{ visitData?.patientInfo?.age }} ปี
                    </div>
                    <div class="info-tag tag-blood" v-if="visitData?.patientInfo?.bloodGroup">
                        <q-icon name="bloodtype" size="12px" class="q-mr-xs"/>
                        {{ visitData?.patientInfo?.bloodGroup }}
                    </div>
                  </div>
                </div>
              </q-card-section>
              <q-separator dark class="opacity-10" />
              <div class="q-pa-md q-gutter-y-sm">
                 <div v-if="visitData?.patientInfo?.allergies && visitData.patientInfo.allergies !== 'ไม่มีข้อมูล'" class="alert-row alert-red">
                    <div class="alert-icon"><q-icon name="medication_liquid" /></div>
                    <div class="col">
                        <div class="alert-label">แพ้ยา</div>
                        <div class="alert-value">{{ visitData.patientInfo.allergies }}</div>
                    </div>
                 </div>
                 <div v-if="visitData?.patientInfo?.foodAllergies && visitData.patientInfo.foodAllergies !== 'ไม่มีข้อมูล'" class="alert-row alert-orange">
                    <div class="alert-icon"><q-icon name="restaurant" /></div>
                    <div class="col">
                        <div class="alert-label">แพ้อาหาร</div>
                        <div class="alert-value">{{ visitData.patientInfo.foodAllergies }}</div>
                    </div>
                 </div>
                 <div v-if="visitData?.patientInfo?.underlyingDisease && visitData.patientInfo.underlyingDisease !== 'ไม่มีข้อมูล'" class="alert-row alert-blue">
                    <div class="alert-icon"><q-icon name="monitor_heart" /></div>
                    <div class="col">
                        <div class="alert-label">โรคประจำตัว</div>
                        <div class="alert-value">{{ visitData.patientInfo.underlyingDisease }}</div>
                    </div>
                 </div>
              </div>
            </q-card>

            <div class="vitals-grid q-mb-md">
              <div class="vital-box" @click="showDetailDialog({ icon: 'thermostat', title: 'อุณหภูมิ', type: 'vitalSigns', content: visitData?.vitalSigns })">
                <div class="label">Temp</div>
                <div class="value">{{ visitData?.vitalSigns?.temperature || '-' }}</div>
                <div class="unit">°C</div>
              </div>
              <div class="vital-box" @click="showDetailDialog({ icon: 'favorite', title: 'ความดัน', type: 'vitalSigns', content: visitData?.vitalSigns })">
                <div class="label">BP</div>
                <div class="value text-small">{{ visitData?.vitalSigns?.blood_pressure_systolic || '-' }}/{{ visitData?.vitalSigns?.blood_pressure_diastolic || '-' }}</div>
                <div class="unit">mmHg</div>
              </div>
              <div class="vital-box" @click="showDetailDialog({ icon: 'monitor_heart', title: 'ชีพจร', type: 'vitalSigns', content: visitData?.vitalSigns })">
                <div class="label">Pulse</div>
                <div class="value">{{ visitData?.vitalSigns?.pulse || '-' }}</div>
                <div class="unit">bpm</div>
              </div>
              <q-btn unelevated class="full-width q-mt-sm glass-btn-small" icon="read_more" label="ดูสัญญาณชีพทั้งหมด" @click="showDetailDialog({ icon: 'monitor_heart', title: 'สัญญาณชีพทั้งหมด', type: 'vitalSigns', content: visitData?.vitalSigns })"/>
            </div>

            <q-card class="glass-card doctor-note-card col-grow">
              <div class="card-header">
                <q-icon name="medical_services" color="accent" /> คำสั่งแพทย์
              </div>
              <q-scroll-area class="fit q-pa-sm">
                <div class="note-section">
                  <div class="note-label">Diagnosis</div>
                  <div class="note-content text-cyan-2 text-weight-bold" style="white-space: pre-wrap;">{{ visitData?.doctorNotes?.diagnosis || '-' }}</div>
                </div>
                <q-separator dark class="q-my-sm opacity-20" />
                <div class="note-section">
                  <div class="note-label">Treatment Plan</div>
                  <div class="note-content text-white" style="white-space: pre-wrap;">{{ visitData?.doctorNotes?.plan || '-' }}</div>
                </div>
                <q-separator dark class="q-my-sm opacity-20" />
                <div class="note-section">
                  <div class="note-label text-pink-accent row items-center"><q-icon name="sticky_note_2" class="q-mr-xs"/>Doctor's Note</div>
                  <div class="note-content text-grey-4 bg-dark-translucent rounded-borders q-pa-sm q-mt-xs" style="white-space: pre-wrap; font-style: italic;">
                    <q-icon name="format_quote" size="sm" class="opacity-50 q-mr-xs"/>
                    {{ visitData?.doctorNotes?.note && visitData?.doctorNotes?.note !== '-' ? visitData?.doctorNotes?.note : 'ไม่มีคำแนะนำเพิ่มเติม' }}
                  </div>
                </div>
              </q-scroll-area>
            </q-card>
          </aside>

          <main class="right-panel">
            <q-card class="glass-card full-height flex column">
              <div class="workspace-header row items-center justify-between q-px-md q-py-sm">
                <div class="text-h6 text-white row items-center">
                  <q-icon name="medication" class="q-mr-sm text-accent" /> รายการยา (Prescriptions)
                  <q-badge color="accent" text-color="black" class="q-ml-sm rounded-borders">{{ prescriptionList.length }}</q-badge>
                </div>
                <q-btn v-if="!isCaseClosed" unelevated rounded color="primary" icon="add" label="เพิ่มยา" @click="openEditDialog(null)" class="add-med-btn" />
              </div>

              <div class="col relative-position bg-dark-translucent">
                <q-scroll-area class="fit">
                  <div class="q-pa-md">
                    <div v-if="prescriptionList.length === 0" class="empty-state">
                      <q-icon name="vaccines" size="60px" color="grey-7" />
                      <div class="text-grey-5 q-mt-md">ยังไม่มีรายการยา</div>
                    </div>
                    <transition-group name="list" tag="div" class="medication-list">
                      <div v-for="(med, index) in prescriptionList" :key="index" class="med-card" :class="{'dispensed': med.dispensed}">
                        <div class="med-check">
                          <q-checkbox v-model="med.dispensed" color="accent" keep-color dense size="lg" @update:model-value="() => { playSelectionSound(); handleUserAction(); }" :disable="isCaseClosed" />
                        </div>
                        <div class="med-info">
                          <div class="med-name">{{ med.name }}</div>
                          <div class="med-meta"><span class="med-dosage">{{ med.dosage }}</span><span class="med-instruction">{{ med.instruction }}</span></div>
                          <div v-if="med.isEdited" class="med-edited"><q-icon name="edit_note" /> แก้ไขโดย {{ med.editedBy }}</div>
                        </div>
                        <div class="med-qty column items-end q-mr-md" style="min-width: 80px;">
                            <div class="text-caption text-grey-5">ราคา</div>
                            <div class="text-subtitle2 text-cyan-3">{{ formatCurrency(med.price) }}</div>
                        </div>
                        <div class="med-qty"><div class="qty-num">{{ med.quantity }}</div><div class="qty-unit">QTY</div></div>
                        <div class="med-actions" v-if="!isCaseClosed">
                          <q-btn flat round icon="edit" color="blue-4" size="sm" @click="openEditDialog(index)" />
                          <q-btn flat round icon="delete" color="red-4" size="sm" @click="removeMedication(index, med)" />
                        </div>
                      </div>
                    </transition-group>
                  </div>
                </q-scroll-area>
              </div>

              <div class="workspace-footer q-pa-md">
                <div class="row items-center justify-between">
                    <q-input dark filled v-model="pharmacistNotesStr" placeholder="หมายเหตุเภสัชกร (Pharmacist Note)..." dense bg-color="transparent" class="note-input col-grow q-mr-md" @update:model-value="updateNotes" :disable="isCaseClosed">
                       <template v-slot:prepend><q-icon name="edit_note" color="grey-5" /></template>
                    </q-input>
                    <div class="text-right">
                        <div class="text-caption text-grey-5">รวมเงิน (Total)</div>
                        <div class="text-h5 text-accent text-weight-bold">{{ formatCurrency(grandTotal) }}</div>
                    </div>
                </div>
              </div>
            </q-card>
          </main>
        </div>
      </div>
    </div>

    <q-dialog v-model="isEditDialogVisible" persistent transition-show="scale" transition-hide="scale">
      <q-card class="glass-dialog form-card-neon">
        <div class="dialog-header-gradient">
          <div class="text-h6 text-white row items-center">
            <q-icon name="medication" class="q-mr-sm"/>
            {{ editingMedIndex !== null ? 'แก้ไขรายการยา' : 'เพิ่มรายการยา' }}
          </div>
          <q-btn flat round icon="close" v-close-popup color="white" />
        </div>

        <q-card-section class="q-pa-lg q-gutter-y-md">
          <div class="input-group">
              <div class="label-text">Drug Name</div>
              <q-select dark outlined v-model="editMedicationModel.name"
                placeholder="พิมพ์ชื่อยา..."
                :options="filteredMedicationOptions"
                use-input @filter="filterMedication"
                new-value-mode="add-unique"
                class="neon-input"
                behavior="menu">
                <template v-slot:prepend><q-icon name="search" color="accent" /></template>
              </q-select>
          </div>

          <div class="row q-col-gutter-md">
              <div class="col-4">
                <div class="input-group">
                  <div class="label-text">Dosage</div>
                  <q-select dark outlined v-model="editMedicationModel.dosage" :options="dosageOptions" use-input new-value-mode="add-unique" class="neon-input"/>
                </div>
              </div>
              <div class="col-4">
                <div class="input-group">
                    <div class="label-text">Quantity</div>
                    <q-input dark outlined v-model.number="editMedicationModel.quantity" type="number" class="neon-input"/>
                </div>
              </div>
              <div class="col-4">
                <div class="input-group">
                    <div class="label-text">Price/Unit</div>
                    <q-input dark outlined v-model.number="editMedicationModel.price" type="number" class="neon-input"/>
                </div>
              </div>
          </div>

          <div class="input-group">
              <div class="label-text">Instruction</div>
              <q-select dark outlined v-model="editMedicationModel.instruction" :options="instructionOptions" use-input new-value-mode="add-unique" type="textarea" autogrow class="neon-input">
                <template v-slot:prepend><q-icon name="description" color="grey-5" /></template>
              </q-select>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md bg-dark-translucent">
          <q-btn flat label="ยกเลิก" color="grey-5" v-close-popup class="q-mr-sm hover-text-white"/>
          <q-btn unelevated label="บันทึกข้อมูล" class="btn-gradient-neon" icon="save" @click="saveOrUpdateMedication" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="postDispenseDialog" persistent>
      <q-card class="glass-dialog text-center q-pa-lg" style="width: 350px">
        <q-icon name="check_circle" color="accent" size="80px" class="q-mb-md pulse-shadow" />
        <div class="text-h5 text-white text-weight-bold">เสร็จสิ้น</div>
        <div class="text-grey-4 q-mb-lg">จ่ายยาและตัดสต็อกเรียบร้อยแล้ว</div>
        <q-btn unelevated rounded label="ตกลง" color="accent" text-color="dark" class="full-width" @click="finishAndRedirect" />
      </q-card>
    </q-dialog>

    <q-dialog v-model="isDetailDialogVisible">
      <q-card class="glass-dialog vital-popup-card">
        <div class="dialog-header-neon">
          <div class="text-h6 row items-center">
            <q-icon :name="selectedDetail.icon" class="q-mr-sm text-white"/>
            <span class="text-weight-bold">{{ selectedDetail.title }}</span>
          </div>
          <q-btn flat round icon="close" v-close-popup color="white" />
        </div>

        <q-card-section class="q-pa-lg">
           <div v-if="selectedDetail.type === 'vitalSigns'" class="vital-dashboard-grid">
              <div class="vital-metric-box">
                  <div class="metric-label">Temperature</div>
                  <div class="metric-value text-pink-accent">{{ selectedDetail.content.temperature || '-' }} <span class="metric-unit">°C</span></div>
                  <div class="metric-bar"><div class="bar-fill" style="width: 37%"></div></div>
              </div>
              <div class="vital-metric-box">
                  <div class="metric-label">Pulse Rate</div>
                  <div class="metric-value text-purple-accent">{{ selectedDetail.content.pulse || '-' }} <span class="metric-unit">bpm</span></div>
                  <div class="metric-bar"><div class="bar-fill" style="width: 72%"></div></div>
              </div>
              <div class="vital-metric-box span-2">
                  <div class="metric-label">Blood Pressure</div>
                  <div class="metric-value text-white">
                    {{ selectedDetail.content.blood_pressure_systolic || '-' }}<span class="text-grey-5">/</span>{{ selectedDetail.content.blood_pressure_diastolic || '-' }}
                    <span class="metric-unit">mmHg</span>
                  </div>
                  <div class="metric-bar"><div class="bar-fill" style="width: 60%"></div></div>
              </div>
              </div>
           <div v-else>
              <pre class="text-white code-block">{{ JSON.stringify(selectedDetail.content, null, 2) }}</pre>
           </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showImageDialog" backdrop-filter="blur(10px)">
      <div class="relative-position shadow-24" style="border-radius: 12px; overflow: hidden; max-width: 90vw; max-height: 90vh;">
         <img :src="previewImageUrl" style="display: block; max-width: 100%; max-height: 85vh; object-fit: contain;">
         <div class="absolute-top-right q-ma-sm">
            <q-btn round dense color="black" text-color="white" icon="close" v-close-popup class="glass-btn" />
         </div>
      </div>
    </q-dialog>

    <q-dialog v-model="showReceiptDialog" full-height full-width>
      <q-card class="bg-white text-black column" style="max-width: 900px; margin: 0 auto;">

        <q-toolbar class="bg-grey-9 text-white shadow-2">
          <q-icon name="receipt_long" size="24px" class="q-mr-sm"/>
          <q-toolbar-title>ตัวอย่างใบเสร็จรับเงิน (Print Preview)</q-toolbar-title>
          <q-btn flat label="สั่งพิมพ์ (Print)" icon="print" color="cyan-3" @click="printReceipt" />
          <q-btn flat round icon="close" v-close-popup />
        </q-toolbar>

        <q-scroll-area class="col bg-grey-3 q-pa-lg">

          <div id="receipt-content" class="bg-white q-pa-xl shadow-3" style="min-height: 297mm; width: 210mm; margin: 0 auto; position: relative; font-family: 'Sarabun', sans-serif;">

            <div class="header-section row items-start justify-between">
               <div class="col-8">
                  <div class="row items-center q-mb-sm">
                    <q-icon name="local_hospital" size="32px" color="primary" class="q-mr-sm"/>
                    <div class="hospital-name text-h5 text-weight-bold">โรงพยาบาลสมาร์ทแคร์ (Smart Care Hospital)</div>
                  </div>
                  <div class="hospital-info text-grey-8">
                    123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110<br>
                    โทรศัพท์: 02-123-4567 | เว็บไซต์: www.smartcare-hospital.com<br>
                    เลขประจำตัวผู้เสียภาษี: 0105551234567 (สำนักงานใหญ่)
                  </div>
               </div>
               <div class="col-4 text-right">
                  <div class="text-h6 text-weight-bold text-uppercase">ใบเสร็จรับเงิน</div>
                  <div class="text-subtitle2 text-grey-7">RECEIPT / TAX INVOICE</div>
                  <div class="q-mt-sm" style="border: 1px solid #000; padding: 5px; display: inline-block;">
                    ต้นฉบับ / ORIGINAL
                  </div>
               </div>
            </div>

            <q-separator class="q-my-md" color="black" size="2px" />

            <div class="info-grid row q-col-gutter-x-lg q-mb-lg">
               <div class="col-6">
                  <div class="row q-mb-xs"><div class="col-3 text-weight-bold">HN:</div><div class="col">{{ visitData?.patientInfo?.patientId || '-' }}</div></div>
                  <div class="row q-mb-xs"><div class="col-3 text-weight-bold">ผู้ป่วย:</div><div class="col">{{ visitData?.patientInfo?.name || '-' }}</div></div>
                  <div class="row q-mb-xs"><div class="col-3 text-weight-bold">อายุ:</div><div class="col">{{ visitData?.patientInfo?.age || '-' }} ปี</div></div>
                  <div class="row q-mb-xs"><div class="col-3 text-weight-bold">สิทธิ์:</div><div class="col">ชำระเงินเอง (Cash)</div></div>
               </div>
               <div class="col-6">
                  <div class="row q-mb-xs"><div class="col-4 text-weight-bold">เลขที่ใบเสร็จ:</div><div class="col">RCP-{{ String(visitData?.visitId || '000').padStart(6, '0') }}</div></div>
                  <div class="row q-mb-xs"><div class="col-4 text-weight-bold">วันที่:</div><div class="col">{{ new Date().toLocaleDateString('th-TH') }} {{ new Date().toLocaleTimeString('th-TH') }}</div></div>
                  <div class="row q-mb-xs"><div class="col-4 text-weight-bold">แพทย์:</div><div class="col">พญ. สมหญิง รักษาดี</div></div>
                  <div class="row q-mb-xs"><div class="col-4 text-weight-bold">แผนก:</div><div class="col">อายุรกรรม (OPD)</div></div>
               </div>
            </div>

            <table class="q-mb-lg full-width" style="border-collapse: collapse;">
              <thead>
                <tr style="background: #f5f5f5;">
                  <th width="5%" class="text-center" style="border: 1px solid #ddd; padding: 8px;">#</th>
                  <th width="50%" style="border: 1px solid #ddd; padding: 8px;">รายการ (Description)</th>
                  <th width="10%" class="text-center" style="border: 1px solid #ddd; padding: 8px;">จำนวน</th>
                  <th width="15%" class="text-right" style="border: 1px solid #ddd; padding: 8px;">หน่วยละ</th>
                  <th width="20%" class="text-right" style="border: 1px solid #ddd; padding: 8px;">จำนวนเงิน</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in prescriptionList" :key="index">
                  <td class="text-center" style="border: 1px solid #ddd; padding: 8px;">{{ index + 1 }}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">
                    <div class="text-weight-bold">{{ item.name }}</div>
                    <div class="text-caption text-grey-7">{{ item.instruction || '-' }}</div>
                  </td>
                  <td class="text-center" style="border: 1px solid #ddd; padding: 8px;">{{ item.quantity }}</td>
                  <td class="text-right" style="border: 1px solid #ddd; padding: 8px;">{{ formatCurrency(item.price || 0).replace('฿', '') }}</td>
                  <td class="text-right" style="border: 1px solid #ddd; padding: 8px;">{{ formatCurrency((item.price || 0) * item.quantity).replace('฿', '') }}</td>
                </tr>
                <tr>
                  <td class="text-center" style="border: 1px solid #ddd; padding: 8px;">{{ prescriptionList.length + 1 }}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">
                    <div class="text-weight-bold">ค่าบริการทางการแพทย์ (Medical Service Fee)</div>
                  </td>
                  <td class="text-center" style="border: 1px solid #ddd; padding: 8px;">1</td>
                  <td class="text-right" style="border: 1px solid #ddd; padding: 8px;">150.00</td>
                  <td class="text-right" style="border: 1px solid #ddd; padding: 8px;">150.00</td>
                </tr>
                <tr>
                  <td class="text-center" style="border: 1px solid #ddd; padding: 8px;">{{ prescriptionList.length + 2 }}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">
                    <div class="text-weight-bold">ค่าบริการโรงพยาบาล (Hospital Service Fee)</div>
                  </td>
                  <td class="text-center" style="border: 1px solid #ddd; padding: 8px;">1</td>
                  <td class="text-right" style="border: 1px solid #ddd; padding: 8px;">50.00</td>
                  <td class="text-right" style="border: 1px solid #ddd; padding: 8px;">50.00</td>
                </tr>
              </tbody>
            </table>

            <div class="row justify-end q-mb-lg">
               <div class="col-5">
                  <div class="row justify-between q-mb-sm">
                    <div>รวมเงิน (Subtotal)</div>
                    <div>{{ formatCurrency(grandTotal + 200).replace('฿', '') }}</div>
                  </div>
                  <div class="row justify-between q-mb-sm text-grey-7">
                    <div>ส่วนลด (Discount)</div>
                    <div>0.00</div>
                  </div>
                  <q-separator class="q-my-sm" color="black" />
                  <div class="row justify-between items-center">
                    <div class="text-h6 text-weight-bold">ยอดสุทธิ (Grand Total)</div>
                    <div class="text-h5 text-weight-bold">{{ formatCurrency(grandTotal + 200) }}</div>
                  </div>
               </div>
            </div>

            <div class="text-right text-italic text-grey-8 q-mb-xl q-pr-xs">
              ( {{ ThaiNumberToText(grandTotal + 200) }} )
            </div>

            <div class="footer-section row justify-between q-mt-xl" style="margin-top: 80px;">
               <div class="col-5 text-center">
                  <div style="border-bottom: 1px dotted #000; height: 30px;"></div>
                  <div class="q-mt-sm">ผู้รับเงิน / Cashier</div>
                  <div class="text-caption text-grey-6">{{ new Date().toLocaleString('th-TH') }}</div>
               </div>
               <div class="col-5 text-center">
                  <div style="border-bottom: 1px dotted #000; height: 30px;"></div>
                  <div class="q-mt-sm">ผู้จ่ายยา / Pharmacist</div>
               </div>
            </div>

            <div class="absolute-bottom q-pa-lg text-center text-caption text-grey-6">
              เอกสารนี้ออกโดยระบบคอมพิวเตอร์ ใบเสร็จรับเงินนี้จะสมบูรณ์ต่อเมื่อเรียกเก็บเงินตามเช็คได้เรียบร้อยแล้ว
            </div>

          </div>
        </q-scroll-area>
      </q-card>
    </q-dialog>

  </q-page>
</template>
<script setup>
import { ref, onMounted, computed, reactive, watch, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar, date } from 'quasar';
import axios from 'axios';
import * as Tone from 'tone';

// 🔥 1. นำเข้า Auth Store เพื่อระบุตัวตนเภสัชกรผู้ใช้งาน (สำหรับบันทึกผู้ดำเนินการ)
import { useAuthStore } from 'src/store/auth';

// =================================================================================
// 1. SETUP & UTILS (ระบบเสียงและเครื่องมือพื้นฐาน)
// =================================================================================
const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore(); // ✅ เรียกใช้งาน Store สำหรับดึงชื่อและ ID

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

// =================================================================================
// 2. DATA MODELS & STATES
// =================================================================================
const visitData = ref(null);
const prescriptionList = ref([]);
const pharmacistNotesStr = ref('');
const isEditDialogVisible = ref(false);
const editingMedIndex = ref(null);

// โมเดลสำหรับเพิ่ม/แก้ไขยา (รองรับการเปรียบเทียบค่าเดิมเพื่อบันทึกประวัติการแก้)
const editMedicationModel = reactive({
  name: '',
  dosage: '',
  quantity: 1,
  instruction: '',
  price: 0,
  // ฟิลด์สำหรับเก็บค่าดั้งเดิมที่หมอสั่งมา (ใช้เทียบว่าเภสัชแก้อะไรไปบ้าง)
  originalName: '',
  originalDosage: '',
  originalQuantity: ''
});

const showPatientMenu = ref(false);
const postDispenseDialog = ref(false);
const isDetailDialogVisible = ref(false);
const selectedDetail = ref({});
const patientQueue = ref([]);
const patientScrollAreaRef = ref(null);
const isInternalLoading = ref(false);
const isQueueLoading = ref(false);
const isPanelLoading = ref(false);

const selectedDate = ref(date.formatDate(Date.now(), 'YYYY-MM-DD'));

// ตัวแปรสำหรับใบเสร็จและการแสดงผลภาพ
const showReceiptDialog = ref(false);
const showImageDialog = ref(false);
const previewImageUrl = ref('');

// =================================================================================
// 3. OPTIONS & FILTERING (คืนค่า Dropdown ที่หายไปทั้งหมด)
// =================================================================================
const medicationOptions = ref([]);
const medicationMap = ref({});
const filteredMedicationOptions = ref([]);

const dosageOptions = ref(['1 เม็ด', '2 เม็ด', '1 ซอง', '10 ml', '15 ml', '500mg', '1000mg']);
const filteredDosageOptions = ref([...dosageOptions.value]);

const quantityOptions = ref(['5', '10', '15', '20', '30', '1 ขวด', '3 ซอง', '5 ซอง']);
const filteredQuantityOptions = ref([...quantityOptions.value]);

const instructionOptions = ref([
  'รับประทานครั้งละ 1 เม็ด 3 ครั้ง หลังอาหาร เช้า-กลางวัน-เย็น',
  'รับประทานครั้งละ 1 เม็ด 2 ครั้ง หลังอาหาร เช้า-เย็น',
  'รับประทานครั้งละ 1 เม็ด วันละ 1 ครั้ง ก่อนนอน',
  'รับประทานครั้งละ 1 เม็ด ทุก 4-6 ชั่วโมง เมื่อมีอาการ',
  'รับประทานครั้งละ 1 ซอง ละลายน้ำ 1 แก้ว'
]);
const filteredInstructionOptions = ref([...instructionOptions.value]);

// ฟังก์ชัน Filter กลางเพื่อให้ Searchable Dropdown ทำงานได้
const filterDropdown = (val, update, optionsRef, masterOptions) => {
  update(() => {
    if (val === '') {
      optionsRef.value = masterOptions;
    } else {
      const needle = val.toLowerCase();
      optionsRef.value = masterOptions.filter(v => v.toLowerCase().includes(needle));
    }
  });
};

const filterMedication = (val, update) => filterDropdown(val, update, filteredMedicationOptions, medicationOptions.value);
const filterDosage = (val, update) => filterDropdown(val, update, filteredDosageOptions, dosageOptions.value);
const filterQuantity = (val, update) => filterDropdown(val, update, filteredQuantityOptions, quantityOptions.value);
const filterInstruction = (val, update) => filterDropdown(val, update, filteredInstructionOptions, instructionOptions.value);

// =================================================================================
// 4. COMPUTED PROPERTIES (สำหรับหน้าจอและ Template)
// =================================================================================
const pageStatus = computed(() => visitData.value?.status || 'รอรับยา');
const isCaseClosed = computed(() => pageStatus.value === 'จ่ายยาแล้ว' || (pageStatus.value === 'รักษาเสร็จสิ้น' && allMedsDispensed.value && visitData.value?.status === 'จ่ายยาแล้ว'));
const allMedsDispensed = computed(() => prescriptionList.value.length > 0 && prescriptionList.value.every(m => m.dispensed));

// 🔥 คำนวณยอดเงินรวม (Grand Total) สำหรับใบเสร็จและการบันทึก
const grandTotal = computed(() => {
  return prescriptionList.value.reduce((sum, item) => sum + ((Number(item.price) || 0) * (Number(item.quantity) || 1)), 0);
});

const displayDateLabel = computed(() => {
  if (selectedDate.value === 'all') return 'ทั้งหมด';
  const today = date.formatDate(Date.now(), 'YYYY-MM-DD');
  return selectedDate.value === today ? 'วันนี้' : selectedDate.value;
});

const currentPatientIndex = computed(() => {
  const currentId = route.query.visitId || route.params.visitId;
  if (!currentId || patientQueue.value.length === 0) return -1;
  return patientQueue.value.findIndex(p => String(p.visit_id) === String(currentId));
});
const canGoPrev = computed(() => currentPatientIndex.value > 0);
const canGoNext = computed(() => currentPatientIndex.value !== -1 && currentPatientIndex.value < patientQueue.value.length - 1);

const statusColorClass = computed(() => {
  if (pageStatus.value === 'รอรับยา') return 'status-warning';
  if (pageStatus.value === 'กำลังรับยา') return 'status-primary';
  if (pageStatus.value === 'จ่ายยาแล้ว') return 'status-success';
  return 'status-grey';
});

const statusIcon = computed(() => isCaseClosed.value ? 'verified' : 'hourglass_empty');

// =================================================================================
// 5. HELPER FUNCTIONS (แก้ไขปัญหา "isPatientActive is not a function")
// =================================================================================

// ✅ ฟังก์ชันเช็คสถานะ Active ของคนไข้ในแถบคิว
const isPatientActive = (vid) => {
  const currentId = route.query.visitId || route.params.visitId;
  return String(vid) === String(currentId);
};

// ✅ ฟังก์ชันกำหนดสีสถานะคนไข้
const getStatusColorClass = (status) => {
  if(status === 'รอรับยา') return 'bg-orange-5';
  if(status === 'กำลังรับยา') return 'bg-primary';
  if(status === 'จ่ายยาแล้ว') return 'bg-positive';
  return 'bg-grey';
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(value || 0);
};

const processAvatarUrl = (url) => {
  if (!url) return null;
  let cleanPath = url.replace(/\\/g, '/');
  if (!cleanPath.startsWith('/') && !cleanPath.startsWith('http')) cleanPath = '/' + cleanPath;
  if (cleanPath.startsWith('http')) return cleanPath;
  return `http://localhost:3000${cleanPath}?t=${Date.now()}`;
};

// =================================================================================
// 6. DATA LOADERS (โหลดข้อมูลการตรวจและยา)
// =================================================================================
const loadData = async (vid) => {
  const visitId = vid || route.query.visitId || route.params.visitId;
  if (!visitId) return;

  if (visitData.value) { isPanelLoading.value = true; } else { isInternalLoading.value = true; }

  try {
    const detailRes = await axios.get(`http://localhost:3000/api/visits/details/${visitId}`);
    const pharmaRes = await axios.get(`http://localhost:3000/api/pharmacist/visit/${visitId}`);

    const d = detailRes.data;
    const p = pharmaRes.data;

    visitData.value = {
      visitId: visitId,
      patientInfo: {
        name: d.patientInfo?.name || '-',
        patientId: d.patientInfo?.hn || d.patientInfo?.patientId || '-',
        gender: d.patientInfo?.gender || '-',
        age: d.patientInfo?.age || '-',
        bloodGroup: d.patientInfo?.bloodGroup || '-',
        allergies: d.patientInfo?.allergies || 'ไม่มีข้อมูล',
        foodAllergies: d.patientInfo?.foodAllergies || 'ไม่มีข้อมูล',
        underlyingDisease: d.patientInfo?.underlyingDisease || 'ไม่มีข้อมูล',
        avatarUrl: processAvatarUrl(d.patientInfo?.avatarUrl)
      },
      doctorNotes: {
        diagnosis: d.diagnoses?.map(di => di.name).join(', ') || d.visit?.chief_complaint || '-',
        plan: d.visit?.referral_department || d.visit?.plan || '-',
        note: d.visit?.referral_notes || '-'
      },
      status: p.status || d.visit?.status || 'รอรับยา',
      vitalSigns: d.vitalSigns || {}
    };

    // จัดการรายการยา (แอบเก็บค่า "ต้นฉบับ" ของหมอไว้เทียบตอนเภสัชแก้)
    prescriptionList.value = (p.prescriptions && p.prescriptions.length > 0 ? p.prescriptions : (d.prescriptions || [])).map(m => ({
      id: m.id,
      name: m.name || m.drug_name,
      dosage: m.dosage,
      quantity: m.quantity,
      instruction: m.instruction,
      price: m.price || 0,
      dispensed: (p.status === 'จ่ายยาแล้ว') || !!m.is_dispensed,
      isEdited: m.is_edited || false,
      editedBy: m.edited_by || null,
      editHistory: m.edit_history || '',
      // เก็บข้อมูลต้นฉบับ
      doctorOriginalData: {
        name: m.name || m.drug_name,
        dosage: m.dosage,
        quantity: m.quantity
      }
    }));

    if(p.pharmacist_notes) {
      try { pharmacistNotesStr.value = JSON.parse(p.pharmacist_notes)[0]; }
      catch(e) { pharmacistNotesStr.value = p.pharmacist_notes; }
    }

  } catch(e) {
    console.error("❌ Load Data Error:", e);
    $q.notify({ type: 'negative', message: 'ไม่สามารถโหลดข้อมูลได้' });
  } finally {
    isInternalLoading.value = false;
    isPanelLoading.value = false;
  }
};

const loadPatientQueue = async () => {
  isQueueLoading.value = true;
  try {
    const queryDate = selectedDate.value;
    const res = await axios.get('http://localhost:3000/api/pharmacist/queue', { params: { date: queryDate } });
    patientQueue.value = res.data.map(p => ({
      visit_id: p.visit_id,
      patientName: p.patientName,
      status: p.status,
      avatarUrl: processAvatarUrl(p.avatarUrl),
      time: p.time
    }));
  } catch (e) {
    console.error("Fetch Queue Error:", e);
  } finally {
    isQueueLoading.value = false;
  }
};

const loadMedications = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/masterdata/medications');
    medicationOptions.value = res.data.map(m => m.generic_name || m.name);
    res.data.forEach(m => { medicationMap.value[m.generic_name || m.name] = m.id; });
    filteredMedicationOptions.value = medicationOptions.value;
  } catch (error) { console.error("Load Meds Error"); }
};

// =================================================================================
// 7. SAVE & SYNC ACTIONS (ระบบจำตัวตนเภสัชกรและประวัติการแก้)
// =================================================================================

// ฟังก์ชัน Sync ยาทุกรายการลง DB (บันทึกใครแก้/แก้อะไร)
const syncPrescriptionsToBackend = async () => {
  const visitId = route.query.visitId || route.params.visitId;
  if (!visitId) return;
  try {
    const payload = prescriptionList.value.map(p => ({
      drug_name: p.name,
      drug_id: medicationMap.value[p.name] || null,
      dosage: p.dosage,
      quantity: p.quantity,
      instruction: p.instruction,
      price: p.price,
      is_dispensed: p.dispensed,
      // 🚩 ส่งข้อมูลประวัติแก้ไขลง Database
      is_edited: p.isEdited || false,
      edited_by: p.editedBy || null,
      edit_history: p.editHistory || ''
    }));
    await axios.post(`http://localhost:3000/api/prescriptions/visit/${visitId}`, { items: payload });
    await loadData(visitId);
    $q.notify({ type: 'positive', message: 'อัปเดตรายการยาเรียบร้อย', icon: 'save' });
  } catch (error) {
    console.error("Sync Error:", error);
    $q.notify({ type: 'negative', message: 'บันทึกรายการยาไม่สำเร็จ' });
  }
};

let autoSaveTimer = null;
const handleUserAction = () => {
  if (!visitData.value || isCaseClosed.value) return;
  if(visitData.value.status === 'รอรับยา') visitData.value.status = 'กำลังรับยา';
  clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(async () => {
    const visitId = route.query.visitId || route.params.visitId;
    try {
      await axios.post(`http://localhost:3000/api/pharmacist/update-process/${visitId}`, {
        status: 'กำลังรับยา',
        prescriptions: prescriptionList.value.map(p => ({ id: p.id, dispensed: p.dispensed })),
        notes: [pharmacistNotesStr.value],
        pharmacist_id: authStore.userId // 🚩 บันทึกคนจัดยา
      });
    } catch(e) {}
  }, 1000);
};

const saveDispensingRecord = async () => {
  $q.loading.show({ message: 'กำลังยืนยันการจ่ายยาและประทับตราผู้บันทึก...' });
  try {
    const visitId = route.query.visitId || route.params.visitId;
    await axios.post(`http://localhost:3000/api/pharmacist/dispense/${visitId}`, {
        pharmacist_id: authStore.userId, // 🚩 บันทึกเภสัชกรผู้ปิดเคส
        total_amount: grandTotal.value,
        notes: pharmacistNotesStr.value
    });

    $q.loading.hide();
    playSuccessSound();
    if(visitData.value) visitData.value.status = 'จ่ายยาแล้ว';
    prescriptionList.value.forEach(p => p.dispensed = true);
    postDispenseDialog.value = true;
  } catch (e) {
    $q.loading.hide();
    $q.notify({type: 'negative', message: 'เกิดข้อผิดพลาดในการบันทึก'});
  }
};

// =================================================================================
// 8. DIALOG LOGIC (ปุ่มเพิ่มยาและปุ่มแก้ไข - ใช้ระบบประวัติเดียวกัน)
// =================================================================================

const openEditDialog = (index) => {
  playClickSound();
  editingMedIndex.value = index;

  if (index !== null) {
    // 🚩 กรณีแก้ไข: ดึงค่าปัจจุบันและจดค่าเดิมที่หมอสั่งไว้เทียบ
    const target = prescriptionList.value[index];
    Object.assign(editMedicationModel, target);
    editMedicationModel.originalName = target.doctorOriginalData?.name || target.name;
    editMedicationModel.originalDosage = target.doctorOriginalData?.dosage || target.dosage;
    editMedicationModel.originalQuantity = target.doctorOriginalData?.quantity || target.quantity;
  } else {
    // 🚩 กรณีเพิ่มใหม่: ล้างค่าทั้งหมด (ใช้ตรรกะเพิ่มในนามเภสัชกร)
    Object.assign(editMedicationModel, {
      name: '', dosage: '', quantity: 1, instruction: '', price: 0,
      originalName: '', originalDosage: '', originalQuantity: ''
    });
  }

  // รีเซ็ต Filtered Options ให้กลับมาเป็นค่าเริ่มต้นก่อนเปิด Dropdown
  filteredDosageOptions.value = [...dosageOptions.value];
  filteredQuantityOptions.value = [...quantityOptions.value];
  filteredInstructionOptions.value = [...instructionOptions.value];

  isEditDialogVisible.value = true;
};

const saveOrUpdateMedication = async () => {
  if (!editMedicationModel.name) return;
  playClickSound();

  if (editingMedIndex.value !== null) {
    // --- 🛠 โหมดแก้ไข: ตรวจสอบการเปลี่ยนแปลงจากของเดิมที่หมอสั่ง ---
    const idx = editingMedIndex.value;
    const old = editMedicationModel;
    const current = prescriptionList.value[idx];

    const nameDiff = old.name !== old.originalName;
    const doseDiff = old.dosage !== old.originalDosage;
    const qtyDiff = String(old.quantity) !== String(old.originalQuantity);

    let changeLog = '';
    if (nameDiff || doseDiff || qtyDiff) {
      changeLog = `ภก. ${authStore.userName} แก้ไข: `;
      if (nameDiff) changeLog += `เปลี่ยน [${old.originalName}] -> [${old.name}] `;
      if (doseDiff) changeLog += `เปลี่ยนขนาด [${old.originalDosage}] -> [${old.dosage}] `;
      if (qtyDiff) changeLog += `ปรับจำนวน [${old.originalQuantity}] -> [${old.quantity}]`;
    }

    Object.assign(prescriptionList.value[idx], {
      ...old,
      isEdited: changeLog !== '',
      editedBy: changeLog !== '' ? authStore.userName : current.editedBy,
      editHistory: changeLog !== '' ? changeLog : current.editHistory
    });

  } else {
    // --- ➕ โหมดเพิ่มใหม่: บันทึกตัวตนเภสัชกรทันที ---
    prescriptionList.value.push({
      ...editMedicationModel,
      id: null,
      dispensed: false,
      isEdited: true,
      editedBy: authStore.userName,
      editHistory: `ภก. ${authStore.userName} เป็นผู้เพิ่มรายการยานี้เพิ่มเติมภายหลัง`,
      doctorOriginalData: { name: 'เพิ่มใหม่', dosage: '-', quantity: 0 }
    });
  }

  isEditDialogVisible.value = false;
  await syncPrescriptionsToBackend(); // สั่งบันทึกและส่งประวัติลงฐานข้อมูลทันที
};

const removeMedication = (index) => {
  $q.dialog({ title: 'ลบรายการ?', message: 'ยืนยันการลบรายการยานี้', cancel: true, persistent: true }).onOk(async () => {
    playRemoveSound();
    prescriptionList.value.splice(index, 1);
    await syncPrescriptionsToBackend();
  });
};

// =================================================================================
// 9. UI HELPERS & NAVIGATION
// =================================================================================
const switchPatient = (vid) => {
  if (!vid || String(vid) === String(route.query.visitId)) return;
  playClickSound();
  router.replace({ query: { ...route.query, visitId: vid } });
};

const goToPrevPatient = () => { if (canGoPrev.value) switchPatient(patientQueue.value[currentPatientIndex.value - 1].visit_id); };
const goToNextPatient = () => { if (canGoNext.value) switchPatient(patientQueue.value[currentPatientIndex.value + 1].visit_id); };

const openReceiptDialog = () => { showReceiptDialog.value = true; playClickSound(); };
const openImagePreview = (url) => { if (url) { previewImageUrl.value = url; showImageDialog.value = true; } };
const updateNotes = (val) => { pharmacistNotesStr.value = val; handleUserAction(); };
const goBack = () => router.back();
const finishAndRedirect = () => { router.push({ name: 'MedicineList' }); };

const confirmDispensing = () => {
  playClickSound();
  $q.dialog({
    title: 'ยืนยันการจ่ายยา',
    message: `ยืนยันการปิดเคสและตัดสต็อกในนาม: ภก. ${authStore.userName}`,
    cancel: true,
    ok: { label: 'ยืนยัน', color: 'accent', unelevated: true }
  }).onOk(saveDispensingRecord);
};

const showDetailDialog = (d) => { selectedDetail.value = d; isDetailDialogVisible.value = true; playClickSound(); };

// =================================================================================
// 10. LIFECYCLE & WATCHERS
// =================================================================================
onMounted(() => {
  loadMedications();
  loadPatientQueue();
  if (route.query.visitId) loadData(route.query.visitId);
});

watch(selectedDate, () => loadPatientQueue());
watch(() => route.query.visitId, (newId) => { if (newId) loadData(newId); });

// 🔥 ฟังก์ชันแปลงตัวเลขเป็นคำอ่านภาษาไทย (Baht Text)
const ThaiNumberToText = (amount) => {
  if (!amount || isNaN(amount)) return 'ศูนย์บาทถ้วน';
  const text = amount.toFixed(2).split('.');
  const integerPart = text[0];
  const decimalPart = text[1];
  const digits = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
  const units = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];
  const convert = (num) => {
    let res = '';
    for (let i = 0; i < num.length; i++) {
      let d = parseInt(num.charAt(i));
      let pos = num.length - i - 1;
      if (d !== 0) {
        if (pos % 6 === 1 && d === 1) res += 'สิบ';
        else if (pos % 6 === 1 && d === 2) res += 'ยี่สิบ';
        else if (pos % 6 === 0 && d === 1 && i > 0) res += 'เอ็ด';
        else { res += digits[d]; res += units[pos % 6]; }
      }
      if (pos !== 0 && pos % 6 === 0) res += 'ล้าน';
    }
    return res;
  };
  let result = convert(integerPart) + 'บาท';
  if (decimalPart === '00') result += 'ถ้วน'; else result += convert(decimalPart) + 'สตางค์';
  return result;
};

// 🔥 ฟังก์ชันสั่งพิมพ์ใบเสร็จ
const printReceipt = () => {
  playClickSound();
  const element = document.getElementById('receipt-content');
  if (!element) return;
  const content = element.innerHTML;
  const win = window.open('', '', 'height=800,width=900');
  if (!win) return;
  win.document.write('<html><head><title>Receipt</title><style>@import url("https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;700&display=swap"); body{font-family:"Sarabun",sans-serif;padding:20px; color:#000;}</style></head><body>' + content + '</body></html>');
  win.document.close();
  setTimeout(() => { win.focus(); win.print(); }, 1000);
};
</script>
<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600;700&display=swap');

/* --- 🎨 Variables & Colors --- */
$bg-dark: #000;
$accent-cyan: #00e5ff;
$neon-pink: #ff00cc;
$neon-purple: #d500f9;
$glass-border: 1px solid rgba(255, 255, 255, 0.08);

/* --- 🖥️ Main Layout --- */
.pharmacy-bg {
  background-color: $bg-dark;
  position: fixed;
  top: 80px; left: 0; right: 0; bottom: 0;
  width: 100vw;
  min-height: 0 !important; height: auto !important;
  overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  padding: 16px; z-index: 1;
}

.cinema-screen {
  width: 100%; max-width: 1600px;
  height: 100%; max-height: 100%;
  display: flex; flex-direction: column;
  background: radial-gradient(circle at center, #1b2631 0%, #0d1a26 100%);
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 0 50px rgba(0,0,0,0.8);
  overflow: hidden; position: relative;
  animation: fadeInScale 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInScale {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.layout-wrapper { height: 100%; display: flex; flex-direction: column; }

/* --- 🔝 Top Bar --- */
.top-bar {
  height: 80px; flex-shrink: 0;
  display: flex; align-items: center; padding: 0 24px;
  background: linear-gradient(to bottom, rgba(17, 24, 32, 0.9), rgba(17, 24, 32, 0.5));
  backdrop-filter: blur(10px); border-bottom: $glass-border; z-index: 10;
}

.control-bar-group {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50px; padding: 4px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
}

.date-glass-box {
  height: 50px; padding: 0 20px; border-right: 1px solid rgba(255, 255, 255, 0.1); transition: all 0.3s;
  display: flex; align-items: center; /* Center Text */
  &:hover { background: rgba(255, 255, 255, 0.05); border-radius: 50px 0 0 50px; }
}

/* --- 🏥 Patient Switcher (🔥 FIXED ALIGNMENT) --- */
.switcher-glass-panel {
  display: flex; align-items: center; height: 50px; padding: 0 8px; width: 500px;
}
.switcher-scroll-area { flex: 1; height: 100%; margin: 0 8px; }

.patient-item-box {
  position: relative;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  margin: 0 10px; /* เพิ่มระยะห่างนิดหน่อย */
  opacity: 0.5;
  transform: scale(0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px; /* Fix ขนาดให้เท่ากัน */
  height: 44px;

  &:hover { opacity: 0.8; transform: scale(0.95); }

  &.active {
    opacity: 1;
    transform: scale(1.15); /* ขยายใหญ่ขึ้นเมื่อเลือก */
    z-index: 2;

    .avatar-ring {
       border-color: #fff;
       border-width: 2px;
       box-shadow: 0 0 15px rgba(0, 229, 255, 0.5);
       background: rgba(255,255,255,0.1);
    }
  }
}

.avatar-ring {
  width: 100%; height: 100%; /* เต็มพื้นที่ box */
  border-radius: 50%;
  padding: 3px; /* ช่องว่างระหว่างรูปกับขอบ */
  border: 2px solid transparent;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-content {
  background: #202b36;
  color: #fff;
  /* ลบ border ที่ตัวรูปออก เพื่อไม่ให้ซ้อนกับ ring */
  /* border: 1px solid rgba(255,255,255,0.1); */
  width: 100% !important;
  height: 100% !important;
}

.status-dot {
  position: absolute;
  bottom: 0px;
  right: 0px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #101419; /* สีขอบให้กลืนกับพื้นหลัง */
  z-index: 3;
}

.nav-btn {
  opacity: 0.7; transition: 0.3s;
  &:hover { opacity: 1; background: rgba(255,255,255,0.1); transform: scale(1.1); }
  &:disabled { opacity: 0.3; cursor: not-allowed; }
}
.glass-tooltip { background: rgba(20, 30, 40, 0.95); border: 1px solid rgba(0, 229, 255, 0.3); backdrop-filter: blur(8px); }

/* --- 🏷️ Status Badges (Glowing) --- */
.status-badge-neon {
  position: relative; display: flex; align-items: center;
  padding: 6px 16px; border-radius: 50px;
  color: white; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px;
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
  overflow: hidden; transition: all 0.3s; margin-right: 8px;
}
.status-warning { background: linear-gradient(90deg, #ff9800, #ffc107); box-shadow: 0 0 15px rgba(255, 152, 0, 0.4); border: none; }
.status-primary { background: linear-gradient(90deg, #2979ff, #00e5ff); box-shadow: 0 0 15px rgba(0, 229, 255, 0.4); border: none; }
.status-success { background: linear-gradient(90deg, #00c853, #69f0ae); box-shadow: 0 0 15px rgba(0, 200, 83, 0.4); border: none; }
.status-grey { background: #424242; color: #aaa; }
.status-glow {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(rgba(255,255,255,0.2), transparent); opacity: 0.3;
}

/* --- 📐 Layout Panels --- */
.main-grid { flex-grow: 1; display: flex; padding: 16px 24px 24px; gap: 20px; overflow: hidden; }

.left-panel {
  width: 350px; flex-shrink: 0;
  display: block; overflow-y: auto; height: 100%;
  padding-right: 6px; padding-bottom: 20px;

  /* Auto-hiding Scrollbar */
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: transparent; border-radius: 10px; }
  &:hover::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); }
}

.right-panel { flex-grow: 1; min-width: 0; display: flex; flex-direction: column; height: 100%; }

.glass-card {
  background: rgba(17, 24, 32, 0.7); backdrop-filter: blur(12px);
  border: $glass-border; border-radius: 16px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

/* --- 👤 Profile Card (Clean Look) --- */
.profile-card {
  flex-shrink: 0; margin-bottom: 20px;
  background: linear-gradient(160deg, #2a2d3e 0%, #1f2029 100%);
  border-radius: 24px;
  /* No Gradient Strip, Clean Border */
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  overflow: hidden; position: relative;
  animation: slideLeft 0.5s ease-out forwards; opacity: 0; transform: translateX(-30px);
}
@keyframes slideLeft { to { opacity: 1; transform: translateX(0); } }

.avatar-container-outer { position: relative; display: inline-block; }
.avatar-wrapper {
  width: 74px; height: 74px; border-radius: 50%; background: white; padding: 3px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.3);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: zoom-in; overflow: hidden;
  &:hover { transform: scale(1.1) rotate(-5deg); .zoom-overlay { opacity: 1; } }
}
.zoom-overlay {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity 0.3s; border-radius: 50%;
}

/* Tags */
.info-tag {
  display: inline-flex; align-items: center; padding: 4px 14px;
  border-radius: 50px; font-size: 0.75rem; font-weight: bold; color: white;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2); gap: 6px;
}
.tag-male { background: linear-gradient(45deg, #4facfe, #00f2fe); }
.tag-female { background: linear-gradient(45deg, #f093fb, #f5576c); }
.tag-neutral { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); }
.tag-blood { background: linear-gradient(45deg, #ff0844, #ffb199); }

/* Alerts */
.alert-row {
  background: rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 10px 14px; margin-bottom: 8px;
  display: flex; align-items: flex-start; gap: 12px; transition: background 0.3s;
  &:hover { background: rgba(255, 255, 255, 0.1); }
  animation: fadeUp 0.4s forwards; opacity: 0; transform: translateY(10px);
}
.alert-row:nth-child(1) { animation-delay: 0.2s; }
.alert-row:nth-child(2) { animation-delay: 0.3s; }
.alert-row:nth-child(3) { animation-delay: 0.4s; }
@keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }

.alert-label { font-size: 0.7rem; opacity: 0.6; margin-bottom: 2px; text-transform: uppercase; }
.alert-value { font-size: 0.9rem; font-weight: 600; color: #fff; }
.alert-icon {
  background: rgba(255,255,255,0.1); width: 32px; height: 32px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; border-radius: 8px;
}
.alert-red .alert-icon { color: #ff6b6b; background: rgba(255, 107, 107, 0.15); }
.alert-orange .alert-icon { color: #feca57; background: rgba(254, 202, 87, 0.15); }
.alert-blue .alert-icon { color: #48dbfb; background: rgba(72, 219, 251, 0.15); }

/* --- 💜 Vitals Grid (Pink/Purple Theme) --- */
.vitals-grid {
  display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;
  flex-shrink: 0; min-height: min-content; margin-bottom: 20px;
  animation: slideInLeft 0.5s 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0; transform: translateX(-20px);
}
@keyframes slideInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }

.vital-box {
  background: rgba(13, 26, 38, 0.6);
  border: 1px solid rgba(213, 0, 249, 0.2); /* Purple border */
  border-radius: 16px; padding: 12px 4px; text-align: center;
  cursor: pointer; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  min-height: 90px; display: flex; flex-direction: column; justify-content: center;
  position: relative; overflow: hidden;

  /* Glow Effect */
  &:hover {
    background: rgba(245, 0, 87, 0.08);
    border-color: $neon-pink;
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(245, 0, 87, 0.2);
  }

  /* Pink Underline */
  &::after {
     content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
     width: 0%; height: 2px; background: $neon-pink; transition: 0.3s;
  }
  &:hover::after { width: 60%; }

  .label { font-size: 0.7rem; color: #aaa; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
  .value {
      font-size: 1.4rem; font-weight: 700; color: #fff; margin: 4px 0;
      text-shadow: 0 0 10px rgba(213, 0, 249, 0.4);
  }
  .unit { font-size: 0.7rem; color: #ff80ab; opacity: 0.9; }
}

.glass-btn-small {
  background: rgba(213, 0, 249, 0.05);
  border: 1px solid rgba(213, 0, 249, 0.2);
  border-radius: 12px; font-size: 0.85rem; color: #e1bee7; transition: all 0.3s;
  &:hover {
      background: rgba(213, 0, 249, 0.15); color: white;
      border-color: $neon-pink; box-shadow: 0 0 15px rgba(213, 0, 249, 0.2);
  }
}

/* --- 📝 Doctor Notes (Clean Look) --- */
.doctor-note-card {
  display: flex; flex-direction: column; overflow: hidden;
  height: 320px; width: 100%; flex-shrink: 0; margin-bottom: 20px;
  background: linear-gradient(160deg, #2a2d3e 0%, #1f2029 100%);

  /* Clean Border like Profile Card */
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 24px; position: relative;
}
.card-header {
  padding: 16px; font-weight: bold; background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: #fff; z-index: 2;
}
.note-section { padding: 8px; }
.note-label { color: #8b9bb4; font-size: 0.8rem; margin-bottom: 4px; }
.note-content { color: #fff; line-height: 1.4; font-size: 0.9rem; }

/* --- 💊 Right Panel (Medications) --- */
.workspace-header { border-bottom: $glass-border; }
.add-med-btn { font-size: 0.85rem; background: linear-gradient(45deg, $accent-cyan, #00b0ff) !important; }

.medication-list { display: flex; flex-direction: column; gap: 10px; }
.list-enter-active, .list-leave-active { transition: all 0.4s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateX(30px); }

.med-card {
  display: flex; align-items: center; background: rgba(255, 255, 255, 0.03);
  border: 1px solid transparent; border-radius: 12px; padding: 12px; transition: all 0.3s;
  &:hover { background: rgba(255, 255, 255, 0.06); border-color: rgba(255, 255, 255, 0.1); transform: translateX(5px); }
  &.dispensed {
    background: rgba(0, 229, 255, 0.05); border-color: rgba(0, 229, 255, 0.2);
    .med-name { text-decoration: line-through; color: #8b9bb4; }
  }
}
.med-check { margin-right: 16px; }
.med-info { flex-grow: 1; }
.med-name { font-size: 1.1rem; font-weight: 600; color: #fff; margin-bottom: 4px; }
.med-meta { font-size: 0.9rem; color: #8b9bb4; }
.med-dosage { color: $accent-cyan; margin-right: 8px; font-weight: 500; }
.med-qty { text-align: right; margin-left: 16px; padding-left: 16px; border-left: 1px solid rgba(255,255,255,0.1); min-width: 80px; }
.qty-num { font-size: 1.4rem; font-weight: bold; color: #fff; line-height: 1; }
.qty-unit { font-size: 0.7rem; color: #5c6b7f; letter-spacing: 1px; margin-top: 4px; }
.workspace-footer { border-top: $glass-border; background: rgba(0, 0, 0, 0.2); }

/* --- 🧬 New Form & Popup Styles --- */
.form-card-neon {
  width: 550px; max-width: 90vw;
  background: #101419 !important; border: 1px solid rgba(255,255,255,0.1);
}
.vital-popup-card {
  width: 600px; max-width: 90vw; background: #121212 !important; border: 1px solid rgba(255,255,255,0.1);
}

.dialog-header-gradient {
  padding: 16px 24px; display: flex; justify-content: space-between; align-items: center;
  background: linear-gradient(90deg, #1a237e 0%, #0277bd 100%);
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.dialog-header-neon {
  padding: 16px 24px; display: flex; justify-content: space-between; align-items: center;
  background: linear-gradient(90deg, #4a148c 0%, #880e4f 100%);
  color: white; border-bottom: 1px solid rgba(255,255,255,0.1);
}

.input-group { margin-bottom: 0; }
.label-text {
  font-size: 0.75rem; color: #00e5ff; margin-bottom: 6px;
  text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;
}

/* Neon Inputs */
.neon-input :deep(.q-field__control) {
  background: rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important; border: 1px solid rgba(255,255,255,0.15); transition: all 0.3s;
}
.neon-input :deep(.q-field__control):hover {
  border-color: #00e5ff; background: rgba(0, 229, 255, 0.05) !important;
}
.neon-input :deep(.q-field__control.text-accent) { /* Focus */
  border-color: #00e5ff !important; box-shadow: 0 0 10px rgba(0, 229, 255, 0.2);
}

/* Dashboard Grid */
.vital-dashboard-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.vital-metric-box {
  background: rgba(255,255,255,0.03); border-radius: 12px; padding: 16px;
  border: 1px solid rgba(255,255,255,0.05); position: relative; overflow: hidden; transition: 0.3s;
  &.span-2 { grid-column: span 2; }
  &:hover { background: rgba(255,255,255,0.06); border-color: rgba(213, 0, 249, 0.3); }
}

.metric-label { font-size: 0.8rem; color: #aaa; text-transform: uppercase; margin-bottom: 4px; }
.metric-value { font-size: 1.8rem; font-weight: 700; color: #fff; line-height: 1.2; }
.metric-unit { font-size: 0.9rem; font-weight: 400; opacity: 0.7; margin-left: 4px; }
.metric-bar { height: 4px; background: rgba(255,255,255,0.1); margin-top: 8px; border-radius: 2px; overflow: hidden; }
.bar-fill { height: 100%; background: linear-gradient(90deg, $neon-purple, $neon-pink); border-radius: 2px; }

/* Buttons & Helpers */
.btn-gradient-neon {
  background: linear-gradient(45deg, #00e5ff, #2979ff); color: white; font-weight: bold;
  padding: 8px 24px; border-radius: 50px; box-shadow: 0 4px 15px rgba(0, 229, 255, 0.3); transition: 0.3s;
  &:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0, 229, 255, 0.5); }
}
.action-btn-confirm {
  background: linear-gradient(45deg, #00e5ff, #00b0ff) !important; color: #000 !important; font-weight: bold;
}
.glass-btn-small { /* override for general use */
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); font-size: 0.8rem; color: #ccc;
  &:hover { background: rgba(255,255,255,0.1); color: white; }
}

.text-pink-accent { color: #ff4081; }
.text-purple-accent { color: #e040fb; }
.text-cyan-accent { color: $accent-cyan; }
.code-block { background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px; }
.bg-dark-translucent { background: rgba(0,0,0,0.2); }
.hover-text-white:hover { color: white !important; }

/* --- Dialogs & Common --- */
.glass-dialog { background: #16202a !important; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 50px rgba(0,0,0,0.5); border-radius: 16px; overflow: hidden; }
.dialog-header { padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); border-bottom: 1px solid rgba(255,255,255,0.05); }
.custom-input :deep(.q-field__control) { background: rgba(0,0,0,0.2) !important; border-radius: 8px; }
.pulse-shadow { animation: pulse 2s infinite; }
@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(0, 229, 255, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(0, 229, 255, 0); } 100% { box-shadow: 0 0 0 0 rgba(0, 229, 255, 0); } }
.hover-scale { transition: transform 0.2s; &:hover { transform: scale(1.1); } }
.bg-dark-glass { background: rgba(10, 16, 22, 0.95); }
.bg-dark-translucent { background: rgba(0,0,0,0.2); }
.full-height { height: 100%; }
.col-grow { flex-grow: 1; }
.opacity-10 { opacity: 0.1; }
.leading-tight { line-height: 1.2; }
.font-mono { font-family: monospace; }
</style>
