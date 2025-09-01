<template>
  <q-layout view="hHh Lpr fFf">
    <audio ref="audioPlayer" :src="currentSongSrc" loop></audio>

    <q-header class="header-glassy text-white">
      <q-toolbar class="full-height-toolbar">
        <q-btn
          flat
          round
          dense
          icon="menu"
          class="q-mr-sm header-icon-btn"
          @click="toggleDrawer"
          aria-label="Menu"
        />
        <q-toolbar-title class="logo-wrapper">
          <div class="text-weight-bold">
            <div class="text-h5 logo-text">
              <span>E</span> • <span>M</span> • <span>R</span>
            </div>
            <div class="logo-subtext">electronic medical record</div>
          </div>
        </q-toolbar-title>

        <q-space />

        <q-btn flat round dense icon="skip_next" @click="changeSong" class="header-icon-btn">
          <q-tooltip class="tooltip-glassy">เพลงถัดไป</q-tooltip>
        </q-btn>

        <q-btn
          flat
          round
          dense
          icon="music_note"
          @click="togglePlayback"
          :class="['header-icon-btn', { 'music-active-animation': isPlaying }]"
        >
          <q-tooltip class="tooltip-glassy">{{ isPlaying ? 'หยุดเพลง' : 'เล่นเพลง' }}</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :breakpoint="768"
      :width="isDrawerCollapsed ? 80 : 250"
      class="drawer-glassy"
      :mini="isDrawerCollapsed"
    >
      <q-list padding>
        <q-item clickable v-ripple to="/myemr-app/emr-home" class="menu-item" active-class="menu-item-active">
          <q-item-section avatar><q-icon name="home" /></q-item-section>
          <q-item-section v-if="!isDrawerCollapsed">หน้าหลัก</q-item-section>
          <q-tooltip v-if="isDrawerCollapsed" anchor="center right" self="center left" :offset="[15, 15]" class="tooltip-glassy">หน้าหลัก</q-tooltip>
        </q-item>

        <q-item clickable v-ripple to="/dashboard" class="menu-item" active-class="menu-item-active">
          <q-item-section avatar><q-icon name="o_dashboard" /></q-item-section>
          <q-item-section v-if="!isDrawerCollapsed">ภาพรวมระบบ</q-item-section>
          <q-tooltip v-if="isDrawerCollapsed" anchor="center right" self="center left" :offset="[15, 15]" class="tooltip-glassy">ภาพรวมระบบ</q-tooltip>
        </q-item>

        <q-item clickable v-ripple to="/patient-list" class="menu-item" active-class="menu-item-active">
          <q-item-section avatar><q-icon name="person" /></q-item-section>
          <q-item-section v-if="!isDrawerCollapsed">ผู้ป่วย</q-item-section>
          <q-tooltip v-if="isDrawerCollapsed" anchor="center right" self="center left" :offset="[15, 15]" class="tooltip-glassy">ผู้ป่วย</q-tooltip>
        </q-item>

        <q-separator class="q-my-md" dark />

        <!-- === START: NURSE MENU EDIT === -->
        <q-expansion-item
          v-if="!isDrawerCollapsed"
          class="menu-item"
          active-class="menu-item-active"
          default-opened
        >
          <template v-slot:header>
            <q-item-section avatar>
              <q-icon name="medical_services" />
            </q-item-section>
            <q-item-section>
              ส่วนของพยาบาล
            </q-item-section>
          </template>

          <q-item clickable v-ripple to="/nurse/patient-list" class="menu-item sub-menu-item" active-class="menu-item-active">
            <q-item-section avatar><q-icon name="list_alt" /></q-item-section>
            <q-item-section>รายชื่อผู้ป่วย</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/add-procedure" class="menu-item sub-menu-item" active-class="menu-item-active">
            <q-item-section avatar><q-icon name="edit_note" /></q-item-section>
            <q-item-section>บันทึกข้อมูล</q-item-section>
          </q-item>
        </q-expansion-item>

        <!-- Collapsed (mini) version of the Nurse menu -->
        <div v-else>
          <q-item clickable v-ripple to="/nurse/patient-list" class="menu-item" active-class="menu-item-active">
            <q-item-section avatar><q-icon name="medical_services" /></q-item-section>
            <q-tooltip anchor="center right" self="center left" :offset="[15, 15]" class="tooltip-glassy">ส่วนของพยาบาล</q-tooltip>
          </q-item>
        </div>
        <!-- === END: NURSE MENU EDIT === -->


        <q-item clickable v-ripple to="/procedures-list" class="menu-item" active-class="menu-item-active">
          <q-item-section avatar><q-icon name="healing" /></q-item-section>
          <q-item-section v-if="!isDrawerCollapsed">หมอ</q-item-section>
          <q-tooltip v-if="isDrawerCollapsed" anchor="center right" self="center left" :offset="[15, 15]" class="tooltip-glassy">หมอ</q-tooltip>
        </q-item>

        <q-item clickable v-ripple to="/medicine-list" class="menu-item" active-class="menu-item-active">
          <q-item-section avatar><q-icon name="medication" /></q-item-section>
          <q-item-section v-if="!isDrawerCollapsed">เภสัชกร</q-item-section>
          <q-tooltip v-if="isDrawerCollapsed" anchor="center right" self="center left" :offset="[15, 15]" class="tooltip-glassy">เภสัชกร</q-tooltip>
        </q-item>

        <q-space />

        <q-separator class="q-my-md" dark />

        <q-item clickable v-ripple to="/settings" class="menu-item" active-class="menu-item-active">
          <q-item-section avatar><q-icon name="settings" /></q-item-section>
          <q-item-section v-if="!isDrawerCollapsed">ตั้งค่า</q-item-section>
          <q-tooltip v-if="isDrawerCollapsed" anchor="center right" self="center left" :offset="[15, 15]" class="tooltip-glassy">ตั้งค่า</q-tooltip>
        </q-item>

        <q-item clickable v-ripple to="/myemr-app/login" class="menu-item" active-class="menu-item-active">
          <q-item-section avatar><q-icon name="logout" /></q-item-section>
          <q-item-section v-if="!isDrawerCollapsed">ล็อคเอาท์</q-item-section>
          <q-tooltip v-if="isDrawerCollapsed" anchor="center right" self="center left" :offset="[15, 15]" class="tooltip-glassy">ล็อคเอาท์</q-tooltip>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, onMounted, computed, nextTick } from 'vue';

export default {
  setup() {
    const leftDrawerOpen = ref(true);
    const isDrawerCollapsed = ref(false);
    const preferredDrawerWidth = 250;
    const drawerWidth = ref(preferredDrawerWidth);

    const audioPlayer = ref(null);
    const isPlaying = ref(false);
    const songList = ref([
      '/music/mixkit-beautiful-dream-493.mp3',
      '/music/Marcelo Nami - Lágrima.mp3',
    ]);
    const currentSongIndex = ref(0);
    const currentSongSrc = computed(() => songList.value[currentSongIndex.value]);

    const togglePlayback = async () => {
      if (!audioPlayer.value) return;
      if (isPlaying.value) {
        audioPlayer.value.pause();
      } else {
        try {
          await audioPlayer.value.play();
        } catch (error) {
          console.error("Playback blocked by browser:", error);
          return;
        }
      }
      isPlaying.value = !isPlaying.value;
    };

    const changeSong = async () => {
      currentSongIndex.value = (currentSongIndex.value + 1) % songList.value.length;
      await nextTick();
      if (audioPlayer.value) {
        audioPlayer.value.load();
        try {
          await audioPlayer.value.play();
          isPlaying.value = true;
        } catch (error) {
          console.error("Could not play next song:", error);
          isPlaying.value = false;
        }
      }
    };

    const toggleDrawer = () => {
      isDrawerCollapsed.value = !isDrawerCollapsed.value;
    };

    onMounted(() => {
      // No resize logic needed
    });

    return {
      leftDrawerOpen,
      isDrawerCollapsed,
      drawerWidth,
      toggleDrawer,
      audioPlayer,
      isPlaying,
      togglePlayback,
      changeSong,
      currentSongSrc
    };
  },
};
</script>

<style scoped>
/* Define color palette based on the Dashboard theme */
:root {
  --primary-color: #00b8ff;
  --dark-bg: #0d1a26;
  --text-primary: #ffffff;
  --text-secondary: #90a4ae;
  --border-color: rgba(0, 184, 255, 0.2);
  --hover-bg: rgba(0, 184, 255, 0.1);
  --glassy-bg: rgba(38, 50, 56, 0.5);
}

/* --- Header & Drawer Styling (Glassmorphism) --- */
.header-glassy, .drawer-glassy {
  background: var(--glassy-bg) !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.header-glassy {
  border-bottom: 1px solid var(--border-color);
  height: 80px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

/* --- ✨ สไตล์สำหรับ Drawer (แถบข้าง) --- */
/* 1. เพิ่ม Keyframes สำหรับอนิเมชันแสงเรืองๆ */
@keyframes drawer-glow-pulse {
  0%, 100% {
    box-shadow: 0 0 10px rgba(0, 184, 255, 0.4);
  }
  50% {
    box-shadow: 0 0 20px rgba(0, 184, 255, 0.7);
  }
}

/* 2. กำหนดให้ Drawer มีเส้นขอบและเรียกใช้อนิเมชัน */
.drawer-glassy {
    border-right: 1px solid var(--border-color);
    animation: drawer-glow-pulse 4s ease-in-out infinite;
}
/* --- จบส่วนของ Drawer --- */


.full-height-toolbar {
  height: 100%;
  align-items: center;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  height: 100%;
}

.logo-text {
  font-weight: 700;
  letter-spacing: 0.15em;
  color: var(--primary-color);
  text-shadow: 0 0 8px var(--primary-color);
}

.logo-subtext {
  font-size: 0.5em;
  margin-top: -0.6em;
  letter-spacing: 0.01em;
  color: var(--text-secondary);
}

.header-icon-btn {
  color: var(--text-secondary);
  transition: color 0.3s;
}
.header-icon-btn:hover {
  color: var(--text-primary);
}

.tooltip-glassy {
  background: rgba(38, 50, 56, 0.8);
  backdrop-filter: blur(5px);
  border: 1px solid var(--border-color);
  color: white;
}

/* --- Music Button Animation --- */
@keyframes music-glow {
  0%, 100% { box-shadow: 0 0 4px rgba(0, 184, 255, 0.3); }
  50% { box-shadow: 0 0 16px rgba(0, 184, 255, 0.7); }
}
.music-active-animation {
  color: var(--primary-color) !important;
  animation: music-glow 3s ease-in-out infinite;
  border-radius: 50%;
}

/* --- Drawer Menu Item Styling --- */
.menu-item {
  color: var(--text-secondary);
  border-radius: 6px;
  margin: 6px 12px;
  transition: color 0.2s, background-color 0.2s;
  font-weight: 500;
  position: relative;
  border-left: 3px solid transparent;
}

.menu-item .q-item__section--avatar {
  min-width: 40px;
  padding-right: 0;
}

.menu-item:hover {
  background-color: var(--hover-bg);
  color: var(--text-primary);
}

.menu-item-active {
  background-color: var(--hover-bg) !important;
  color: var(--primary-color) !important;
  font-weight: 600;
  border-left: 3px solid var(--primary-color);
}

.menu-item-active .q-icon,
.menu-item-active .q-item__section:not(.q-item__section--avatar) {
  color: var(--primary-color) !important;
  text-shadow: 0 0 5px var(--primary-color);
}

/* === START: STYLE EDIT === */
/* Style for submenu items */
.sub-menu-item {
  margin-left: 28px !important; /* Indent submenu items */
  margin-top: 2px !important;
  margin-bottom: 2px !important;
  border-radius: 6px;
}

/* Style for the expansion item header */
:deep(.q-expansion-item__container .q-item) {
  border-radius: 6px;
}
/* === END: STYLE EDIT === */

</style>
