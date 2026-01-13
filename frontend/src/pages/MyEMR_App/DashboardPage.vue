<template>
  <q-page class="dashboard-background">
    <div class="q-pa-lg">

      <div class="header-section">
        <div>
          <div class="text-h5 text-weight-bold header-title">ภาพรวมระบบ (Hospital Dashboard)</div>
          <div v-if="currentUser" class="text-subtitle1 welcome-text q-mt-xs fade-in">
            ยินดีต้อนรับ, {{ currentUser.prefix }}{{ currentUser.firstName }} {{ currentUser.lastName }}
            <q-badge :color="getRoleColor(currentUser.role)" class="q-ml-sm text-bold">{{ currentUser.role }}</q-badge>
          </div>
        </div>

        <div class="row items-center q-gutter-x-md">
            <div style="min-width: 300px;">
                <q-select
                    dense outlined dark
                    v-model="selectedUserRole"
                    :options="realUsersList"
                    option-label="fullName"
                    option-value="id"
                    label="⚡ Quick Switch User (Dev Only)"
                    class="custom-select"
                    :loading="loadingUsers"
                    @update:model-value="handleSwitchUser"
                >
                    <template v-slot:prepend>
                        <q-icon name="manage_accounts" color="cyan-3"/>
                    </template>
                    <template v-slot:option="scope">
                        <q-item v-bind="scope.itemProps" class="bg-dark text-white">
                            <q-item-section avatar>
                                <q-icon :name="getRoleIcon(scope.opt.role)" :color="getRoleColor(scope.opt.role)" />
                            </q-item-section>
                            <q-item-section>
                                <q-item-label>{{ scope.opt.fullName }}</q-item-label>
                                <q-item-label caption class="text-grey-5">{{ scope.opt.role }} (ID: {{ scope.opt.id }})</q-item-label>
                            </q-item-section>
                        </q-item>
                    </template>
                </q-select>
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
      </div>

      <div class="row q-col-gutter-lg fade-in">
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stat-card">
            <q-card-section class="row items-center no-wrap">
              <div class="stat-icon-wrapper bg-blue-1">
                <q-icon name="o_people" size="28px" class="stat-icon text-blue-4" />
              </div>
              <div class="q-ml-md">
                <div class="stat-value text-weight-bold">{{ stats.totalPatients }}</div>
                <div class="stat-label">ผู้ป่วยทั้งหมด</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stat-card">
            <q-card-section class="row items-center no-wrap">
              <div class="stat-icon-wrapper bg-green-1">
                <q-icon name="o_event_available" size="28px" class="stat-icon text-green-4" />
              </div>
              <div class="q-ml-md">
                <div class="stat-value text-weight-bold">{{ stats.todayAppointments }}</div>
                <div class="stat-label">นัดหมายวันนี้</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stat-card">
            <q-card-section class="row items-center no-wrap">
              <div class="stat-icon-wrapper bg-orange-1">
                <q-icon name="o_pending_actions" size="28px" class="stat-icon text-orange-4" />
              </div>
              <div class="q-ml-md">
                <div class="stat-value text-weight-bold">{{ stats.pendingResults }}</div>
                <div class="stat-label">รอผลตรวจ</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stat-card">
            <q-card-section class="row items-center no-wrap">
              <div class="stat-icon-wrapper bg-purple-1">
                <q-icon name="o_medication" size="28px" class="stat-icon text-purple-4" />
              </div>
              <div class="q-ml-md">
                <div class="stat-value text-weight-bold">{{ stats.pendingMeds }}</div>
                <div class="stat-label">รอจ่ายยา</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div class="row q-col-gutter-lg q-mt-lg fade-in" style="animation-delay: 0.2s;">

        <div class="col-12 col-lg-8">
          <q-card class="main-card">
            <q-card-section>
              <div class="text-h6 card-header row items-center justify-between">
                  <span>ตารางงานของฉัน (My Schedule)</span>
                  <q-badge color="dark" text-color="cyan-3">{{ currentUser ? currentUser.role : 'Guest' }} View</q-badge>
              </div>

              <div class="text-center q-pa-xl placeholder-content">
                <div v-if="currentUser && currentUser.role === 'Doctor'">
                    <q-icon name="medical_services" size="4rem" color="cyan-3" class="q-mb-md"/>
                    <div class="text-h6 text-white">คิวตรวจวันนี้: 5 ราย</div>
                    <div class="text-grey-5">กำลังรอตรวจ: 2 | ตรวจเสร็จสิ้น: 3</div>
                    <q-btn unelevated color="primary" class="q-mt-md" label="เข้าสู่ห้องตรวจ" to="/doctor-station"/>
                </div>
                <div v-else-if="currentUser && currentUser.role === 'Pharmacist'">
                    <q-icon name="medication" size="4rem" color="purple-3" class="q-mb-md"/>
                    <div class="text-h6 text-white">คิวจ่ายยา: 12 ราย</div>
                    <div class="text-grey-5">รอเรียกคิว: 4 | กำลังจัดยา: 8</div>
                    <q-btn unelevated color="purple" class="q-mt-md" label="ไปที่ห้องยา" to="/medicine-list"/>
                </div>
                <div v-else-if="currentUser && currentUser.role === 'Nurse'">
                    <q-icon name="healing" size="4rem" color="pink-3" class="q-mb-md"/>
                    <div class="text-h6 text-white">จุดคัดกรองผู้ป่วย</div>
                    <div class="text-grey-5">รอซักประวัติ: 10 คน</div>
                    <q-btn unelevated color="pink-6" class="q-mt-md" label="ไปที่จุดคัดกรอง" to="/nurse-station"/>
                </div>
                <div v-else>
                    <q-icon name="o_calendar_today" size="4rem" />
                    <p class="q-mt-md">ยังไม่มีข้อมูลตารางนัดหมาย</p>
                </div>
              </div>

            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-lg-4">
          <q-card class="main-card">
            <q-card-section>
              <div class="text-h6 card-header">ข้อมูลผู้ใช้งาน (Current User)</div>
            </q-card-section>
            <q-list separator class="user-info-list" v-if="currentUser">
              <q-item>
                <q-item-section avatar><q-icon name="o_badge" /></q-item-section>
                <q-item-section>
                  <q-item-label overline>ชื่อ-นามสกุล</q-item-label>
                  <q-item-label class="text-white text-weight-bold">{{ currentUser.prefix }} {{ currentUser.firstName }} {{ currentUser.lastName }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar><q-icon name="o_alternate_email" /></q-item-section>
                <q-item-section>
                  <q-item-label overline>อีเมล</q-item-label>
                  <q-item-label>{{ currentUser.email }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar><q-icon name="o_work_outline" /></q-item-section>
                <q-item-section>
                  <q-item-label overline>ตำแหน่ง</q-item-label>
                  <q-item-label :class="getRoleTextColor(currentUser.role)">{{ currentUser.role }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar><q-icon name="fingerprint" /></q-item-section>
                <q-item-section>
                  <q-item-label overline>User ID</q-item-label>
                  <q-item-label class="text-mono text-cyan-3">{{ currentUser.id }}</q-item-label>
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
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import axios from 'axios'; // 🔥 ต้องใช้ axios ยิงหา User จริง
import { useAuthStore } from 'src/store/auth'; // 🔥 ใช้ Store หลัก

export default {
  setup() {
    const router = useRouter();
    const $q = useQuasar();
    const authStore = useAuthStore(); // ใช้ Pinia Store แทน Mock

    const realUsersList = ref([]);
    const loadingUsers = ref(false);

    // Stats
    const stats = ref({
        totalPatients: '1,234',
        todayAppointments: 56,
        pendingResults: 8,
        pendingMeds: 12
    });

    onMounted(async () => {
        // 1. โหลดข้อมูล User ปัจจุบันจาก Store มาแสดง
        updateStats(authStore.user);

        // 2. 🔥 โหลดรายชื่อ User จริงๆ จาก Database มาใส่ Dropdown
        await fetchRealUsers();
    });

    // ฟังก์ชันดึง User ทั้งหมดจาก DB
    const fetchRealUsers = async () => {
        loadingUsers.value = true;
        try {
            // ยิง API ไปเอา Users ทั้งหมด (ต้องมี endpoint นี้ หรือใช้ /api/users ถ้ามี)
            // ถ้าไม่มี endpoint รวม ให้ใช้ /api/doctors หรือ mock ชั่วคราวก่อนก็ได้
            // แต่เพื่อให้ดีที่สุด ควรสร้าง endpoint GET /api/users ที่ backend ครับ

            // สมมติว่าใช้ /api/users
            const response = await axios.get('http://localhost:3000/api/users');

            realUsersList.value = response.data.map(u => ({
                id: u.user_id || u.id,
                prefix: u.prefix,
                firstName: u.first_name,
                lastName: u.last_name,
                email: u.email,
                role: u.role, // ต้องมั่นใจว่าใน DB เก็บ role เป็น Doctor, Nurse (ตัวใหญ่) หรือแปลงเอา
                fullName: `${u.prefix || ''}${u.first_name} ${u.last_name}`,
                avatar_url: u.avatar_url
            }));

        } catch (error) {
            console.error("Error fetching users:", error);
            $q.notify({ type: 'negative', message: 'ไม่สามารถโหลดรายชื่อผู้ใช้ได้' });
        } finally {
            loadingUsers.value = false;
        }
    };

    // ใน DashboardPage.vue

const handleSwitchUser = (selectedUser) => {
    if (!selectedUser) return;

    // เตรียมข้อมูล
    const userForStore = {
        id: selectedUser.id,
        email: selectedUser.email,
        prefix: selectedUser.prefix,
        first_name: selectedUser.firstName, // เช็คให้ตรงกับ key ที่ Database ส่งมา
        last_name: selectedUser.lastName,
        role: selectedUser.role, // สำคัญมาก! Sidebar จะดูตรงนี้
        fullName: selectedUser.fullName
    };

    // ❌ อันเก่า: authStore.login(...) <--- ลบออก มันจะไปยิง Server

    // ✅ อันใหม่: ยัดข้อมูลลง Store เลย
    authStore.setUser(userForStore);

    updateStats(userForStore);

    $q.notify({
        type: 'positive',
        message: `สลับสิทธิ์เป็น: ${selectedUser.fullName}`,
        timeout: 1000
    });

    // 🔥 บังคับ Refresh หน้าจอ เพื่อให้ Sidebar และ Permission คำนวณใหม่
    // เนื่องจาก MainLayout มัน mount ไปแล้ว การเปลี่ยน state บางทีเมนูอาจจะไม่ render ใหม่ทันที
    setTimeout(() => {
        window.location.reload();
    }, 500);
};

    const updateStats = (user) => {
        if (!user) return;
        const role = user.role || user.Role; // เผื่อ case sensitive
        if(role === 'Doctor') {
            stats.value = { totalPatients: '1,234', todayAppointments: 12, pendingResults: 5, pendingMeds: 0 };
        } else if (role === 'Pharmacist') {
            stats.value = { totalPatients: '-', todayAppointments: '-', pendingResults: 0, pendingMeds: 45 };
        } else if (role === 'Nurse') {
            stats.value = { totalPatients: '1,234', todayAppointments: 56, pendingResults: 8, pendingMeds: 12 };
        }
    };

    const handleLogout = () => {
        authStore.logout(); // ใช้ function ใน Store
        router.push('/myemr-app/login');
    };

    // UI Helpers
    const getRoleColor = (role) => {
        switch(role) {
            case 'Doctor': return 'cyan-4';
            case 'Nurse': return 'pink-4';
            case 'Pharmacist': return 'purple-4';
            default: return 'grey-5';
        }
    };
    const getRoleTextColor = (role) => {
        switch(role) {
            case 'Doctor': return 'text-cyan-4';
            case 'Nurse': return 'text-pink-4';
            case 'Pharmacist': return 'text-purple-4';
            default: return 'text-grey-5';
        }
    };
    const getRoleIcon = (role) => {
        switch(role) {
            case 'Doctor': return 'medical_services';
            case 'Nurse': return 'healing';
            case 'Pharmacist': return 'medication';
            default: return 'person';
        }
    };

    return {
      currentUser: computed(() => {
          // แปลงข้อมูลจาก Store ให้ template ใช้ง่ายๆ
          const u = authStore.user;
          if(!u) return null;
          return {
              id: u.id,
              prefix: u.prefix,
              firstName: u.first_name,
              lastName: u.last_name,
              role: u.role,
              email: u.email
          }
      }),
      selectedUserRole: ref(null), // ผูกกับ Dropdown
      realUsersList,
      loadingUsers,
      stats,
      handleSwitchUser,
      handleLogout,
      getRoleColor,
      getRoleTextColor,
      getRoleIcon
    };
  },
};
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600;700&display=swap');

.dashboard-background {
  background-color: #0d1a26;
  font-family: 'Sarabun', sans-serif;
  color: #e0e0e0;
  min-height: 100vh;
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
  text-shadow: 0 0 10px rgba(0, 184, 255, 0.5);
}

.welcome-text { color: #b0bec5; }

.logout-btn {
  border: 1px solid #ef5350;
  color: #ef5350;
  border-radius: 8px;
  transition: all 0.3s;
}
.logout-btn:hover {
  background-color: rgba(239, 83, 80, 0.1);
  box-shadow: 0 0 10px rgba(239, 83, 80, 0.4);
}

.stat-card, .main-card {
  background-color: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s;
  height: 100%;
  color: #e0e0e0;
}

.stat-card:hover {
  border-color: rgba(0, 184, 255, 0.6);
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 184, 255, 0.15);
}

.stat-icon-wrapper {
  border-radius: 12px;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.05);
}
.bg-blue-1 { background: rgba(3, 169, 244, 0.15); }
.bg-green-1 { background: rgba(76, 175, 80, 0.15); }
.bg-orange-1 { background: rgba(255, 152, 0, 0.15); }
.bg-purple-1 { background: rgba(156, 39, 176, 0.15); }

.stat-value { color: #ffffff; font-size: 2rem; line-height: 1; letter-spacing: -0.5px; }
.stat-label { color: #90a4ae; font-weight: 500; font-size: 0.9rem; margin-top: 4px; }

.card-header {
  color: #ffffff;
  font-weight: 700;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 16px;
}

.custom-select :deep(.q-field__control) {
    background: rgba(255,255,255,0.05) !important;
    border-radius: 8px;
}

.fade-in { animation: fadeIn 0.6s ease-out forwards; opacity: 0; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.text-mono { font-family: 'Courier New', Courier, monospace; }
</style>
