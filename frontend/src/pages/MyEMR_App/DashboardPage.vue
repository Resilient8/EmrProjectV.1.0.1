<template>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600;700&display=swap" rel="stylesheet">

  <q-page class="dashboard-background">
    <div class="q-pa-lg">
      <div class="header-section">
        <div>
          <div class="text-h5 text-weight-bold header-title">ภาพรวมระบบ</div>
          <div v-if="user" class="text-subtitle1 welcome-text q-mt-xs">
            ยินดีต้อนรับ, {{ user.user.prefix }}{{ user.user.first_name }}
          </div>
        </div>
        <q-btn
          label="ออกจากระบบ"
          class="logout-btn"
          flat
          no-caps
          icon="logout"
          @click="handleLogout"
        />
      </div>

      <div class="row q-col-gutter-lg">
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stat-card">
            <q-card-section class="row items-center no-wrap">
              <div class="stat-icon-wrapper">
                <q-icon name="o_people" size="28px" class="stat-icon" />
              </div>
              <div class="q-ml-md">
                <div class="stat-value text-weight-bold">1,234</div>
                <div class="stat-label">ผู้ป่วยทั้งหมด</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stat-card">
            <q-card-section class="row items-center no-wrap">
              <div class="stat-icon-wrapper">
                <q-icon name="o_event_available" size="28px" class="stat-icon" />
              </div>
              <div class="q-ml-md">
                <div class="stat-value text-weight-bold">56</div>
                <div class="stat-label">นัดหมายวันนี้</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stat-card">
            <q-card-section class="row items-center no-wrap">
              <div class="stat-icon-wrapper">
                <q-icon name="o_pending_actions" size="28px" class="stat-icon" />
              </div>
              <div class="q-ml-md">
                <div class="stat-value text-weight-bold">8</div>
                <div class="stat-label">รอผลตรวจ</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stat-card">
            <q-card-section class="row items-center no-wrap">
              <div class="stat-icon-wrapper">
                <q-icon name="o_medication" size="28px" class="stat-icon" />
              </div>
              <div class="q-ml-md">
                <div class="stat-value text-weight-bold">12</div>
                <div class="stat-label">ต้องจ่ายยา</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div class="row q-col-gutter-lg q-mt-lg">
        <div class="col-12 col-lg-8">
          <q-card class="main-card">
            <q-card-section>
              <div class="text-h6 card-header">ตารางนัดหมาย</div>
              <div class="text-center q-pa-xl placeholder-content">
                <q-icon name="o_calendar_today" size="4rem" />
                <p class="q-mt-md">ยังไม่มีข้อมูลตารางนัดหมาย</p>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-lg-4">
          <q-card class="main-card">
            <q-card-section>
              <div class="text-h6 card-header">ข้อมูลผู้ใช้งาน</div>
            </q-card-section>
            <q-list separator class="user-info-list" v-if="user">
              <q-item>
                <q-item-section avatar><q-icon name="o_badge" /></q-item-section>
                <q-item-section>
                  <q-item-label overline>ชื่อ-นามสกุล</q-item-label>
                  <q-item-label>{{ user.user.prefix }} {{ user.user.first_name }} {{ user.user.last_name }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar><q-icon name="o_alternate_email" /></q-item-section>
                <q-item-section>
                  <q-item-label overline>อีเมล</q-item-label>
                  <q-item-label>{{ user.user.email }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar><q-icon name="o_work_outline" /></q-item-section>
                <q-item-section>
                  <q-item-label overline>ตำแหน่ง</q-item-label>
                  <q-item-label>{{ user.user.role }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { AuthService } from '../../services/auth.service.js';

export default {
  setup() {
    const router = useRouter();
    const user = ref(null);

    onMounted(() => {
      const currentUser = AuthService.getCurrentUser();
      if (currentUser) {
        user.value = currentUser;
      } else {
        // ▼▼▼▼▼ จุดที่แก้ไข 1 ▼▼▼▼▼
        router.push('/myemr-app/login');
        // ▲▲▲▲▲ จุดที่แก้ไข 1 ▲▲▲▲▲
      }
    });

    const handleLogout = () => {
      AuthService.logout();
      // ▼▼▼▼▼ จุดที่แก้ไข 2 ▼▼▼▼▼
      router.push('/myemr-app/login');
      // ▲▲▲▲▲ จุดที่แก้ไข 2 ▲▲▲▲▲
    };

    return {
      user,
      handleLogout
    };
  },
};
</script>

<style lang="scss" scoped>
/* สไตล์จากโค้ดเดิมของคุณทั้งหมด ถูกรวมไว้ที่นี่แล้ว */
.dashboard-background {
  background-color: #0d1a26;
  font-family: 'Sarabun', sans-serif;
  color: #e0e0e0;
}

.header-section {
  padding: 0 0 16px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 184, 255, 0.2);
  margin-bottom: 24px;
}

.header-title {
  color: #ffffff;
  text-shadow: 0 0 6px rgba(0, 184, 255, 0.7);
}

.welcome-text {
  color: #90a4ae;
}

.logout-btn {
  border: 1px solid #00b8ff;
  color: #00b8ff;
  border-radius: 8px;
  transition: background-color 0.3s, color 0.3s, box-shadow 0.3s;
}

.logout-btn:hover {
  background-color: #00b8ff;
  color: white;
  box-shadow: 0 0 10px #00b8ff;
}

.stat-card, .main-card {
  background-color: rgba(38, 50, 56, 0.5);
  backdrop-filter: blur(5px);
  border-radius: 12px;
  border: 1px solid rgba(0, 184, 255, 0.2);
  box-shadow: none;
  transition: transform 0.3s, border-color 0.3s;
  height: 100%;
  color: #e0e0e0;
}

.stat-card:hover, .main-card:hover {
  border-color: rgba(0, 184, 255, 0.5);
  transform: translateY(-4px);
}

.stat-icon-wrapper {
  background-color: rgba(0, 184, 255, 0.1);
  border-radius: 50%;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon {
  color: #00b8ff;
  text-shadow: 0 0 5px #00b8ff;
}

.stat-value {
  color: #ffffff;
  font-size: 1.8rem;
  line-height: 1.2;
}

.stat-label {
  color: #90a4ae;
  font-weight: 500;
}

.card-header {
  color: #ffffff;
  font-weight: 600;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 184, 255, 0.1);
  margin-bottom: 8px;
}

.user-info-list {
  color: #e0e0e0;
}

.user-info-list .q-list--separator > .q-item-type + .q-item-type {
    border-top: 1px solid rgba(0, 184, 255, 0.1);
}

.user-info-list .q-item__section--avatar {
  color: #00b8ff;
  min-width: 48px;
}

.user-info-list .q-item__label--overline {
  color: #90a4ae;
}

.placeholder-content {
  color: #546e7a;
}
.placeholder-content .q-icon {
  color: #37474f;
}

.primary-action-btn {
  border: 1px solid #00b8ff;
  color: #00b8ff;
  background: transparent;
  border-radius: 8px;
  transition: background-color 0.3s, color 0.3s, box-shadow 0.3s;
  &:hover {
    background-color: #00b8ff;
    color: white;
    box-shadow: 0 0 10px #00b8ff;
  }
}

.positive-btn {
  border: 1px solid #26a69a;
  color: #26a69a;
  background: transparent;
  border-radius: 8px;
  transition: background-color 0.3s, color 0.3s, box-shadow 0.3s;
  &:hover {
    background-color: #26a69a;
    color: white;
    box-shadow: 0 0 10px #26a69a;
  }
}

.interactive-card {
  transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s, background-color 0.3s;
  &:hover {
    border-color: rgba(0, 184, 255, 0.5);
    transform: translateY(-4px);
    box-shadow: 0 0 15px rgba(0, 184, 255, 0.2);
    background-color: rgba(58, 70, 76, 0.7);
  }
}

.control-panel .patient-header-item, .control-panel .status-item {
  padding: 8px 16px;
}

.control-panel .patient-header-item {
  cursor: pointer;
}

.status-card {
  border-left-width: 5px;
}
.status-border-orange { border-left-color: #ff5722; }
.status-border-light-blue { border-left-color: #039be5; }
.status-border-primary { border-left-color: #00b8ff; }
.status-border-positive { border-left-color: #26a69a; }
.status-border-grey { border-left-color: #9e9e9a; }


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
}

.action-footer {
  background-color: rgba(0, 184, 255, 0.05);
}

.tooltip-glassy {
  background: rgba(38, 50, 56, 0.8);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(0, 184, 255, 0.2);
  color: white;
}

:deep(.q-field--outlined.q-field--dark .q-field__control) {
  background: rgba(0, 184, 255, 0.05) !important;
}

:deep(.q-field--dark .q-field__label) {
  color: #90a4ae !important;
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
