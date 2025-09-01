<template>
  <q-page class="dashboard-background flex flex-center">
    <canvas ref="canvasRef" class="metaballs-canvas"></canvas>

    <q-card class="register-card main-card"> <q-card-section class="q-pa-xl">

        <div class="text-center q-mb-xl">
          <q-avatar size="60px" font-size="32px" color="primary" text-color="white" icon="o_person_add" /> <div class="text-h4 text-weight-bold q-mt-md header-title">สร้างบัญชีใหม่</div> <p class="welcome-text q-mt-sm">เริ่มต้นเส้นทางสู่การจัดการข้อมูลที่ง่ายขึ้น</p> </div>

        <q-form ref="myForm" @submit.prevent="handleRegister" class="q-gutter-y-md"> <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-4">
              <q-select
                dark outlined v-model="formData.prefix" :options="prefixOptions" label="คำนำหน้า *"
                :rules="[val => !!val || 'กรุณาเลือกคำนำหน้า']"
                @update:model-value="playNextNote" @popup-show="playNextNote" @mouseenter="playNextNote"
                class="custom-q-input"
              />
            </div>
            <div class="col-12 col-sm-4">
              <q-input
                dark outlined v-model="formData.firstName" label="ชื่อ *"
                :rules="[val => !!val && val.length > 0 || 'กรุณากรอกชื่อ']"
                @mouseenter="playNextNote"
                class="custom-q-input"
              />
            </div>
            <div class="col-12 col-sm-4">
              <q-input
                dark outlined v-model="formData.lastName" label="นามสกุล *"
                :rules="[val => !!val && val.length > 0 || 'กรุณากรอกนามสกุล']"
                @mouseenter="playNextNote"
                class="custom-q-input"
              />
            </div>
          </div>

          <div class="q-mt-lg">
            <q-input
              dark outlined v-model="formData.email" label="อีเมล *" type="email"
              :rules="[ val => !!val || 'กรุณากรอกอีเมล', val => /.+@.+\..+/.test(val) || 'รูปแบบอีเมลไม่ถูกต้อง']"
              @mouseenter="playNextNote"
              class="custom-q-input"
            />
            <q-input
              dark outlined v-model="formData.phone" label="เบอร์โทรศัพท์" mask="###-###-####"
              class="q-mt-md custom-q-input" @mouseenter="playNextNote"
            />
          </div>

          <div class="row q-col-gutter-md q-mt-lg">
            <div class="col-12 col-sm-6">
              <q-input
                dark outlined v-model="formData.password" label="รหัสผ่าน *"
                :type="isPwd1 ? 'password' : 'text'"
                :rules="[val => val && val.length >= 6 || 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร']"
                @mouseenter="playNextNote"
                class="custom-q-input"
              >
                <template v-slot:append>
                  <q-icon :name="isPwd1 ? 'o_visibility_off' : 'o_visibility'" class="cursor-pointer welcome-text" @click="isPwd1 = !isPwd1; playNextNote();" /> </template>
              </q-input>
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                dark outlined v-model="formData.confirmPassword" label="ยืนยันรหัสผ่าน *"
                :type="isPwd2 ? 'password' : 'text'"
                :rules="[ val => !!val || 'กรุณายืนยันรหัสผ่าน', val => val === formData.password || 'รหัสผ่านไม่ตรงกัน']"
                @mouseenter="playNextNote"
                class="custom-q-input"
              >
                <template v-slot:append>
                  <q-icon :name="isPwd2 ? 'o_visibility_off' : 'o_visibility'" class="cursor-pointer welcome-text" @click="isPwd2 = !isPwd2; playNextNote();" /> </template>
              </q-input>
            </div>
          </div>

          <q-separator dark class="q-my-xl" /> <q-select
            dark outlined v-model="formData.userType" :options="userTypes" label="ประเภทผู้ใช้งาน *"
            :rules="[val => !!val || 'กรุณาเลือกประเภทผู้ใช้งาน']"
            @update:model-value="playNextNote" @popup-show="playNextNote" @mouseenter="playNextNote"
            class="custom-q-input"
          />

          <div v-if="formData.userType" class="q-gutter-y-md q-mt-md">
            <q-input
              dark outlined v-model="formData.licenseNumber" label="เลขที่ใบประกอบวิชาชีพ"
              @mouseenter="playNextNote"
              class="custom-q-input"
            />
            <q-input
              dark outlined v-model="formData.workplace" label="สถานที่ทำงาน"
              @mouseenter="playNextNote"
              class="custom-q-input"
            />
            <q-select
              dark outlined v-model="formData.department" :options="departmentOptions" label="แผนก"
              @update:model-value="playNextNote" @popup-show="playNextNote" @mouseenter="playNextNote"
              class="custom-q-input"
            />
            <q-select
              dark outlined v-model="formData.position" :options="positionOptions" label="ตำแหน่ง"
              @update:model-value="playNextNote" @popup-show="playNextNote" @mouseenter="playNextNote"
              class="custom-q-input"
            />
          </div>

          <q-checkbox v-model="acceptTerms" class="q-mt-xl accept-terms-checkbox" :rules="[val => val === true || 'กรุณายอมรับเงื่อนไขการใช้งาน']" @click="playNextNote"> <span class="welcome-text">ฉันยอมรับ <router-link to="#" class="link" @click="playNextNote">ข้อตกลงและเงื่อนไข</router-link> การใช้งาน</span>
          </q-checkbox>

          <div class="q-mt-lg">
            <q-btn
              label="ยืนยันการลงทะเบียน" type="submit" color="primary" class="full-width login-btn"
              unelevated rounded size="lg" padding="12px"
              @click="playNextNote" @mouseenter="playNextNote"
            />
          </div>
        </q-form>
      </q-card-section>

      <q-card-section class="text-center q-pb-lg">
        <div class="welcome-text">มีบัญชีอยู่แล้ว? <router-link to="/myemr-app/login" class="link text-weight-bold" @click="playNextNote">เข้าสู่ระบบที่นี่</router-link></div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { AuthService } from '../../services/auth.service.js';

// --- Tone.js Sound Engine (คัดลอกมาจาก Dashboard.vue) ---
import * as Tone from 'tone';

const meloSynth = new Tone.FMSynth({
    harmonicity: 3.1,
    modulationIndex: 20,
    envelope: { attack: 0.001, decay: 0.1, sustain: 0.1, release: 0.8 },
    modulationEnvelope: { attack: 0.01, decay: 0.5, sustain: 0, release: 0.8 },
}).toDestination();
meloSynth.volume.value = -10;

const clearSoundSynth = new Tone.MetalSynth({
    frequency: 800,
    envelope: {
        attack: 0.001,
        decay: 0.1,
        sustain: 0,
        release: 0.1,
    },
    harmonicity: 5.1,
    modulationIndex: 15,
    resonance: 10000,
    octaves: 2,
}).toDestination();
clearSoundSynth.volume.value = -6;

const noteSequence = [
    { note: 'C4', duration: '4n' }, { note: 'C4', duration: '4n' }, { note: 'G4', duration: '4n' }, { note: 'G4', duration: '4n' },
    { note: 'A4', duration: '4n' }, { note: 'A4', duration: '4n' }, { note: 'G4', duration: '2n' },
    { note: 'F4', duration: '4n' }, { note: 'F4', duration: '4n' }, { note: 'E4', duration: '4n' }, { note: 'E4', duration: '4n' },
    { note: 'D4', duration: '4n' }, { note: 'D4', duration: '4n' }, { note: 'C4', duration: '2n' },
    { note: 'G4', duration: '4n' }, { note: 'G4', duration: '4n' }, { note: 'F4', duration: '4n' }, { note: 'F4', duration: '4n' },
    { note: 'E4', duration: '4n' }, { note: 'E4', duration: '4n' }, { note: 'D4', duration: '2n' },
    { note: 'G4', duration: '4n' }, { note: 'G4', duration: '4n' }, { note: 'F4', duration: '4n' }, { note: 'F4', duration: '4n' },
    { note: 'E4', duration: '4n' }, { note: 'E4', duration: '4n' }, { note: 'D4', duration: '2n' },
    { note: 'C4', duration: '4n' }, { note: 'C4', duration: '4n' }, { note: 'G4', duration: '4n' }, { note: 'G4', duration: '4n' },
    { note: 'A4', duration: '4n' }, { note: 'A4', duration: '4n' }, { note: 'G4', duration: '2n' },
    { note: 'F4', duration: '4n' }, { note: 'F4', duration: '4n' }, { note: 'E4', duration: '4n' }, { note: 'E4', duration: '4n' },
    { note: 'D4', duration: '4n' }, { note: 'D4', duration: '4n' }, { note: 'C4', duration: '2n' },
];
const noteIndex = ref(0);

const isSoundPlaying = ref(false);

const playNextNote = () => {
    if (isSoundPlaying.value) return;

    if (Tone.context.state !== 'running') {
        Tone.context.resume();
    }

    isSoundPlaying.value = true;

    const { note, duration } = noteSequence[noteIndex.value];

    if (note) {
        meloSynth.triggerAttackRelease(note, duration);
    }

    const delay = Tone.Time(duration).toMilliseconds();

    setTimeout(() => {
        isSoundPlaying.value = false;
    }, delay);

    noteIndex.value = (noteIndex.value + 1) % noteSequence.length;
};

const playClearSound = () => {
    if (Tone.context.state !== 'running') {
        Tone.context.resume();
    }
    clearSoundSynth.triggerAttackRelease("C5", "32n");
};
// --- END Tone.js Sound Engine ---

// --- Canvas Animation (Metaballs/Fireflies) from Landing Page/Login Page ---
const canvasRef = ref(null);
let animationFrameId = null;

onMounted(() => {
    const canvas = canvasRef.value;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let metaballs = [];

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    class Metaball {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 1;
            this.vy = (Math.random() - 0.5) * 1;
            this.baseRadius = Math.random() * 30 + 20;
            this.currentRadius = this.baseRadius;
            this.flickerSpeed = Math.random() * 0.01 + 0.005;
            this.flickerPhase = Math.random() * Math.PI * 2;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x > canvas.width + this.baseRadius || this.x < -this.baseRadius) this.vx *= -1;
            if (this.y > canvas.height + this.baseRadius || this.y < -this.baseRadius) this.vy *= -1;
            this.flickerPhase += this.flickerSpeed;
            const flickerAmount = Math.max(0, Math.sin(this.flickerPhase)) * this.baseRadius * 0.5;
            this.currentRadius = this.baseRadius + flickerAmount;
        }
        draw() {
            ctx.beginPath();
            const gradient = ctx.createRadialGradient(this.x, this.y, 1, this.x, this.y, this.currentRadius);
            gradient.addColorStop(0, 'white');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = gradient;
            ctx.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const createMetaballs = () => {
        metaballs = [];
        const ballCount = 8;
        for (let i = 0; i < ballCount; i++) {
            metaballs.push(new Metaball());
        }
    };

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        metaballs.forEach(ball => {
            ball.update();
            ball.draw();
        });
        animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', () => {
        resizeCanvas();
        createMetaballs();
    });

    resizeCanvas();
    createMetaballs();
    animate();
});

onUnmounted(() => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
});
// --- END Canvas Animation ---


const $q = useQuasar();
const router = useRouter(); // ต้อง import useRouter
const myForm = ref(null);
const isPwd1 = ref(true);
const isPwd2 = ref(true);
const acceptTerms = ref(false);

const formData = reactive({
    prefix: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: null,
    licenseNumber: '',
    workplace: '',
    department: null,
    position: null,
});

const userTypes = ['Doctor', 'Nurse', 'Pharmacist', 'Admin'];
const prefixOptions = ['นาย', 'นาง', 'นางสาว', 'นพ.', 'พญ.', 'ภก.', 'ภกญ.'];
const departmentOptions = ['อายุรกรรม', 'ศัลยกรรม', 'สูตินรีเวช', 'กุมารเวชกรรม', 'อื่นๆ'];
const positionOptions = ['แพทย์ประจำบ้าน', 'แพทย์เฉพาะทาง', 'พยาบาลวิชาชีพ', 'เภสัชกร', 'อื่นๆ'];

const handleRegister = async () => {
    const success = await myForm.value.validate();
    if (!success) {
        $q.notify({
            color: 'negative',
            icon: 'warning',
            message: 'กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง',
            position: 'top-right'
        });
        playClearSound(); // เล่นเสียงเมื่อ validation ไม่ผ่าน
        return;
    }

    $q.loading.show({ message: 'กำลังลงทะเบียน...' });

    try {
        const response = await AuthService.register(formData); // AuthService ต้อง import
        console.log('Registration successful:', response.data);

        $q.loading.hide();
        $q.notify({
            color: 'positive',
            icon: 'cloud_done',
            message: 'ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบ',
            position: 'top-right'
        });
        playNextNote(); // เล่นเสียงเมื่อสำเร็จ

        router.push('/myemr-app/login'); // พาไปหน้า login หลังลงทะเบียนสำเร็จ

    } catch (error) {
        $q.loading.hide();
        const errorMessage = error.response?.data?.message || 'เกิดข้อผิดพลาดในการลงทะเบียน';
        $q.notify({
            color: 'negative',
            icon: 'error',
            message: errorMessage,
            position: 'top-right'
        });
        playClearSound(); // เล่นเสียงเมื่อ Error
    } finally {
        $q.loading.hide();
    }
};

// ตรวจสอบให้แน่ใจว่า AuthService ถูก import
// import { AuthService } from '../../services/auth.service.js'; // ต้องแน่ใจว่า path ถูกต้อง

</script>

<style scoped lang="scss">
@use "sass:color"; // สำคัญมากสำหรับการใช้ฟังก์ชัน Sass Module

// Sass variables (คัดลอกมาจาก Dashboard.vue และ Landing Page)
$primary-color: #00b8ff;
$dark-bg-color: #0d1a26; // พื้นหลังหลักของ Dashboard
$card-bg-color: rgba(38, 50, 56, 0.5); // พื้นหลัง Card โปร่งแสงใน Dashboard
$text-light: #e0e0e0; // สีข้อความอ่อน
$text-muted: #90a4ae; // สีข้อความรอง (welcome-text)
$border-light: rgba(0, 184, 255, 0.2); // สีขอบ Card/Table

.dashboard-background { // ใช้ class นี้จาก Dashboard
  background-color: $dark-bg-color;
  font-family: 'Sarabun', sans-serif;
  color: $text-light;
  position: relative; /* สำหรับให้ canvas อยู่ข้างหลัง */
  overflow: hidden; /* ซ่อน scrollbar ถ้ามี */
}

.metaballs-canvas { /* จาก Landing Page */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1; /* อยู่ด้านหลังเนื้อหา register card */
  filter: blur(20px) contrast(30); /* คง effect เดิมไว้ */
}

.register-card { /* ปรับจาก register-card เดิมให้เป็น main-card concept */
  position: relative; /* อยู่ด้านบน canvas */
  z-index: 2; /* อยู่ด้านบน canvas */

  width: 90vw;
  max-width: 700px; /* รักษา max-width เดิมเพื่อให้ฟอร์มมีพื้นที่พอ */

  /* คัดลอก style จาก .main-card ใน Dashboard */
  background-color: $card-bg-color;
  backdrop-filter: blur(5px);
  border-radius: 12px; /* ใช้ 12px เหมือน main-card */
  border: 1px solid $border-light;
  box-shadow: 0 0 15px rgba($primary-color, 0.2); /* เงาเรืองแสง */
  transition: all 0.3s ease; /* เพิ่ม transition สำหรับ hover effect (ถ้ามีการ์ดโฮเวอร์) */
  color: $text-light; /* สีข้อความภายใน card */

  /* animation: fadeInSlideUp 0.8s ease-out forwards; ถ้าต้องการ animation เมื่อโหลดหน้า */
}


/* Text styles (ใช้จาก Dashboard.vue) */
.header-title {
  color: #ffffff;
  text-shadow: 0 0 5px $primary-color;
}
.welcome-text {
  color: $text-muted;
}

/* Link styles */
.link {
  color: $primary-color; /* ใช้ primary color */
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}
.link:hover {
  color: color.adjust($primary-color, $lightness: 10%); /* แก้ไข lighten() เป็น adjust() */
  text-decoration: underline;
}

/* QInput/QSelect styles (คัดลอกมาจาก Dashboard.vue) */
:deep(.q-field--outlined.q-field--dark .q-field__control) {
  background-color: rgba(38, 50, 56, 0.7) !important;
  border-color: rgba(0, 184, 255, 0.2) !important;
  color: #e0e0e0 !important;
  transition: border-color 0.3s, box-shadow 0.3s, background-color 0.3s;
  border-radius: 12px !important; /* ทำให้ input มีมุมมน */
}

:deep(.q-field--outlined.q-field--dark .q-field__native) {
  color: #e0e0e0 !important;
}

:deep(.q-field--outlined.q-field--dark .q-field__native::placeholder) {
  color: #90a4ae !important;
  opacity: 0.8;
}

:deep(.q-field--dark .q-field__label) {
  color: #90a4ae !important;
}

:deep(.q-field--outlined.q-field--dark .q-field__prepend),
:deep(.q-field--outlined.q-field--dark .q-field__append) {
  color: $primary-color !important;
}

:deep(.q-field--outlined.q-field--dark .q-field__control:hover) {
  border-color: rgba($primary-color, 0.5) !important;
  box-shadow: 0 0 5px rgba($primary-color, 0.2) !important;
}

:deep(.q-field--outlined.q-field--dark.q-field--focused .q-field__control) {
  background-color: rgba(38, 50, 56, 0.9) !important;
  border-color: $primary-color !important;
  box-shadow: 0 0 10px rgba($primary-color, 0.6) !important;
}

// Styles for QSelect dropdown options (คัดลอกมาจาก Dashboard.vue)
:deep(.q-menu.q-position-engine.q-menu--dark) {
  background-color: rgba(38, 50, 56, 0.9) !important;
  backdrop-filter: blur(8px) !important;
  border: 1px solid rgba($primary-color, 0.3) !important;
  border-radius: 8px !important;
}

:deep(.q-menu.q-position-engine.q-menu--dark .q-item) {
  color: #e0e0e0 !important;
}

:deep(.q-menu.q-position-engine.q-menu--dark .q-item--highlighted) {
  background-color: rgba($primary-color, 0.2) !important;
  color: #ffffff !important;
}

:deep(.q-item__label--caption) {
  color: $text-muted !important;
}

:deep(.q-field--stack.q-field--float .q-field__label) {
  transform: translateY(-50%) scale(0.75) !important;
  color: $primary-color !important;
}

/* Primary Registration Button (เหมือน login-btn) */
.q-btn { /* ปรับปุ่มโดยรวมให้มีมุมมนและ font-weight */
  border-radius: 12px !important;
  font-weight: bold;
  text-transform: none;
}
.q-btn[type="submit"] { /* สำหรับปุ่ม submit (ยืนยันการลงทะเบียน) */
    transition: all 0.3s ease;
    &:hover {
        box-shadow: 0 4px 15px -4px $primary-color, 0 0 15px rgba($primary-color, 0.6);
    }
}

/* Styles for QDialog (เพื่อความสอดคล้อง) */
:deep(.q-dialog .main-card) {
  .q-dialog__title {
    padding-bottom: 0;
    margin-bottom: -8px;
    .header-title {
      font-size: 1.1em;
    }
    .text-h6 {
        font-size: 1.25em;
    }
  }
  .q-dialog__actions {
    padding-top: 0;
    padding-bottom: 16px;
    padding-right: 16px;
    .dialog-ok-btn {
        background-color: $primary-color;
        color: white;
        transition: all 0.3s ease;
        &:hover {
            box-shadow: 0 0 10px rgba($primary-color, 0.6);
            transform: translateY(-2px);
        }
    }
  }
}
</style>
