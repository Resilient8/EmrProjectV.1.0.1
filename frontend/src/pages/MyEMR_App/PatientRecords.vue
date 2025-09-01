<template>
  <q-page class="page-container">
    <!-- Header Section -->
    <div class="patient-header-card list-item-animation" style="animation-delay: 0.1s;">
      <div class="row items-center no-wrap">
        <q-icon name="o_summarize" size="lg" class="q-mr-md header-icon" />
        <div class="text-h5 text-weight-bold header-title">
          สรุปข้อมูลผู้ป่วย
        </div>
        <q-space />
        <q-btn flat round icon="o_arrow_back" class="primary-action-btn" @click="goBack">
          <q-tooltip class="tooltip-glassy">กลับไปทะเบียนผู้ป่วย</q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- Main Content -->
    <div class="summary-column">
      <!-- Loading Skeleton -->
      <div v-if="loading" class="list-item-animation" style="animation-delay: 0.2s;">
        <q-card class="main-card" flat>
          <q-card-section>
            <q-skeleton type="text" height="40px" class="q-mb-md" />
            <q-separator dark spaced />
            <q-skeleton type="text" height="200px" class="q-mt-md" />
          </q-card-section>
        </q-card>
      </div>

      <!-- Error Display -->
      <div v-else-if="error" class="list-item-animation" style="animation-delay: 0.2s;">
        <q-card flat class="no-data-card main-card">
          <q-card-section class="text-center q-pa-xl">
            <q-icon name="o_error_outline" size="6em" class="placeholder-icon text-negative" />
            <div class="text-h5 welcome-text q-mt-md">เกิดข้อผิดพลาด</div>
            <p class="welcome-text">{{ error }}</p>
            <q-btn label="ลองอีกครั้ง" @click="fetchPatientData" class="primary-action-btn q-mt-md" icon="o_refresh" />
          </q-card-section>
        </q-card>
      </div>

      <!--
        [!!!] KEY CHANGE HERE [!!!]
        We now render PatientSummary as soon as loading is false.
        We DO NOT pass the `:patient` prop, allowing it to use its own demo data.
      -->
      <PatientSummary v-if="!loading" class="list-item-animation" style="animation-delay: 0.2s;" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router';
import PatientSummary from "./PatientSummary.vue"; // Ensure the path is correct

const router = useRouter();

const loading = ref(true);
const error = ref(null);

// This function now only simulates a network delay.
// In the future, you can put your real API call back here.
const fetchPatientData = async () => {
  loading.value = true;
  error.value = null;
  // Simulate loading time
  await new Promise(resolve => setTimeout(resolve, 700));
  loading.value = false;
  // We don't need to fetch any data because PatientSummary has its own.
  // You can add your real fetch logic here later and handle potential errors.
};

const goBack = () => {
  router.push({ name: 'PatientRegistry' }); // Make sure this route name is correct
}

onMounted(fetchPatientData);
</script>

<style scoped lang="scss">
.page-container {
  padding: 24px;
  background-color: #0d1a26;
  font-family: 'Sarabun', sans-serif;
  color: #e0e0e0;
}

.summary-column {
  max-width: 1200px;
  margin: 0 auto;
}

.patient-header-card {
  max-width: 1200px;
  margin: 0 auto 24px auto;
  background: rgba(38, 50, 56, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(0, 184, 255, 0.2);
  padding: 16px 24px;
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
  border: 1px solid #00b8ff;
  color: #00b8ff;
  background: transparent;
  border-radius: 50%;
  transition: all 0.3s;
  &:hover {
    background-color: #00b8ff;
    color: white;
    box-shadow: 0 0 10px #00b8ff;
    transform: scale(1.1);
  }
}

.main-card {
  background-color: rgba(25, 38, 46, 0.6);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  border: 1px solid transparent;
  border-image: linear-gradient(135deg, rgba(0, 184, 255, 0.3), rgba(38, 50, 56, 0.1)) 1;
  color: #e0e0e0;
}

.no-data-card {
  border: 2px dashed rgba(0, 184, 255, 0.2);
}
.placeholder-icon {
  color: rgba(0, 184, 255, 0.3);
}

.tooltip-glassy {
  background: rgba(38, 50, 56, 0.8);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(0, 184, 255, 0.2);
  color: white;
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
