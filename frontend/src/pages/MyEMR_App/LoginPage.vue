<template>
  <q-page class="dashboard-background flex flex-center">
    <canvas ref="canvasRef" class="metaballs-canvas"></canvas>

    <q-card class="login-card main-card">
      <q-card-section class="q-pa-xl">
        <div class="text-center q-mb-xl">
          <q-avatar size="60px" font-size="32px" color="primary" text-color="white" icon="o_local_hospital" />
          <div class="text-h4 text-weight-bold q-mt-md header-title">เข้าสู่ระบบ</div>
          <p class="welcome-text q-mt-sm">ยินดีต้อนรับสู่ระบบจัดการคลินิก</p>
        </div>

        <q-form ref="myForm" @submit.prevent="handleLogin" class="q-gutter-y-md">
          <q-input
            dark outlined v-model="formData.username"
            label="อีเมล หรือ ชื่อผู้ใช้งาน"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'กรุณากรอกชื่อผู้ใช้งาน']"
            @mouseenter="playNextNote"
            class="custom-q-input"
            autocomplete="username"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="primary" />
            </template>
          </q-input>

          <q-input
            dark outlined v-model="formData.password" label="รหัสผ่าน"
            :type="isPwd ? 'password' : 'text'"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'กรุณากรอกรหัสผ่าน']"
            @mouseenter="playNextNote"
            class="custom-q-input"
            autocomplete="current-password"
          >
            <template v-slot:prepend>
              <q-icon name="lock" color="primary" />
            </template>
            <template v-slot:append>
              <q-icon :name="isPwd ? 'o_visibility_off' : 'o_visibility'" class="cursor-pointer welcome-text" @click="isPwd = !isPwd; playNextNote();" />
            </template>
          </q-input>

          <div class="row items-center justify-between">
            <q-checkbox
              dark
              v-model="rememberMe"
              label="จำชื่อผู้ใช้"
              color="primary"
              @mouseenter="playNextNote"
            />
            <a href="#" class="link welcome-text" @click.prevent="playNextNote">ลืมรหัสผ่าน?</a>
          </div>

          <div>
            <q-btn
              label="เข้าสู่ระบบ" type="submit" color="primary" class="full-width login-btn"
              unelevated rounded size="lg" padding="12px"
              :loading="isLoading"
              @mouseenter="playNextNote"
            />
          </div>

          <div class="row items-center q-my-lg">
            <q-separator dark class="col" /> <div class="col-auto welcome-text q-mx-md">หรือเข้าสู่ระบบด้วย</div> <q-separator dark class="col" />
          </div>

          <div>
            <q-btn
              class="full-width google-btn"
              unelevated rounded size="lg" padding="12px"
              @click="() => { handleGoogleLogin(); playNextNote(); }" @mouseenter="playNextNote"
            >
              <div class="row items-center justify-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google logo" class="google-logo">
                <span class="q-ml-sm welcome-text">เข้าสู่ระบบด้วย Google</span>
              </div>
            </q-btn>
          </div>
        </q-form>
      </q-card-section>

      <q-card-section class="text-center q-pb-lg">
        <div class="welcome-text">ยังไม่มีบัญชี? <router-link to="/myemr-app/user-registration" class="link text-weight-bold" @click="playNextNote">สร้างบัญชีที่นี่</router-link></div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import axios from 'axios';
import * as Tone from 'tone';

// 👇 1. Import Store
import { useAuthStore } from 'src/store/auth';

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();

// --- Tone.js Sound Engine ---
const meloSynth = new Tone.FMSynth({ harmonicity: 3.1, modulationIndex: 20, envelope: { attack: 0.001, decay: 0.1, sustain: 0.1, release: 0.8 }, modulationEnvelope: { attack: 0.01, decay: 0.5, sustain: 0, release: 0.8 }, }).toDestination();
meloSynth.volume.value = -10;

// เสียง Error
const clearSoundSynth = new Tone.MetalSynth({ frequency: 800, envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1, }, harmonicity: 5.1, modulationIndex: 15, resonance: 10000, octaves: 2, }).toDestination();
clearSoundSynth.volume.value = -6;

const noteSequence = [ { note: 'C4', duration: '4n' }, { note: 'C4', duration: '4n' }, { note: 'G4', duration: '4n' }, { note: 'G4', duration: '4n' }, { note: 'A4', duration: '4n' }, { note: 'A4', duration: '4n' }, { note: 'G4', duration: '2n' }, { note: 'F4', duration: '4n' }, { note: 'F4', duration: '4n' }, { note: 'E4', duration: '4n' }, { note: 'E4', duration: '4n' }, { note: 'D4', duration: '4n' }, { note: 'D4', duration: '4n' }, { note: 'C4', duration: '2n' } ];
const noteIndex = ref(0);
const isSoundPlaying = ref(false);

const playNextNote = () => { if (isSoundPlaying.value) return; if (Tone.context.state !== 'running') { Tone.context.resume(); } isSoundPlaying.value = true; const { note, duration } = noteSequence[noteIndex.value]; if (note) { meloSynth.triggerAttackRelease(note, duration, Tone.now() + 0.1); } const delay = Tone.Time(duration).toMilliseconds(); setTimeout(() => { isSoundPlaying.value = false; }, delay); noteIndex.value = (noteIndex.value + 1) % noteSequence.length; };

const playClearSound = () => {
  if (Tone.context.state !== 'running') { Tone.context.resume(); }
  clearSoundSynth.triggerAttackRelease('C2', '8n', Tone.now());
};
// --- END Tone.js ---

// --- Canvas Animation ---
const canvasRef = ref(null);
let animationFrameId = null;
onMounted(() => {
    const canvas = canvasRef.value; if (!canvas) return; const ctx = canvas.getContext('2d'); let metaballs = [];
    const resizeCanvas = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    class Metaball { constructor() { this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height; this.vx = (Math.random() - 0.5) * 1; this.vy = (Math.random() - 0.5) * 1; this.baseRadius = Math.random() * 30 + 20; this.currentRadius = this.baseRadius; this.flickerSpeed = Math.random() * 0.01 + 0.005; this.flickerPhase = Math.random() * Math.PI * 2; } update() { this.x += this.vx; this.y += this.vy; if (this.x > canvas.width + this.baseRadius || this.x < -this.baseRadius) this.vx *= -1; if (this.y > canvas.height + this.baseRadius || this.y < -this.baseRadius) this.vy *= -1; this.flickerPhase += this.flickerSpeed; const flickerAmount = Math.max(0, Math.sin(this.flickerPhase)) * this.baseRadius * 0.5; this.currentRadius = this.baseRadius + flickerAmount; } draw() { ctx.beginPath(); const gradient = ctx.createRadialGradient(this.x, this.y, 1, this.x, this.y, this.currentRadius); gradient.addColorStop(0, 'white'); gradient.addColorStop(1, 'rgba(255, 255, 255, 0)'); ctx.fillStyle = gradient; ctx.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2); ctx.fill(); } }
    const createMetaballs = () => { metaballs = []; const ballCount = 8; for (let i = 0; i < ballCount; i++) { metaballs.push(new Metaball()); } };
    const animate = () => { ctx.clearRect(0, 0, canvas.width, canvas.height); metaballs.forEach(ball => { ball.update(); ball.draw(); }); animationFrameId = requestAnimationFrame(animate); };
    window.addEventListener('resize', () => { resizeCanvas(); createMetaballs(); });
    resizeCanvas(); createMetaballs(); animate();

    const savedUser = localStorage.getItem('rememberedUser');
    if (savedUser) {
      formData.username = savedUser;
      rememberMe.value = true;
    }
});
onUnmounted(() => { if (animationFrameId) { cancelAnimationFrame(animationFrameId); } });
// --- END Canvas Animation ---

const myForm = ref(null);
const isPwd = ref(true);
const isLoading = ref(false);
const rememberMe = ref(false);

const formData = reactive({
    username: '',
    password: ''
});

const handleLogin = async () => {
    // 1. Validate Form
    const success = await myForm.value.validate();

    if (success) {
        isLoading.value = true;
        $q.loading.show({ message: 'กำลังเข้าสู่ระบบ...' });

        try {
            // 2. Call API
            const response = await axios.post('http://localhost:3000/api/auth/login', formData);

            // 🔥 IMPORTANT FIX: Check standard HTTP status or your custom status
            if (response.status === 200) {
                const resData = response.data;
                console.log("Login Success:", resData);

                // 3. Update Store
                authStore.login(resData.user, resData.token || 'dummy-token');

                // 4. Remember Username
                if (rememberMe.value) {
                    localStorage.setItem('rememberedUser', formData.username);
                } else {
                    localStorage.removeItem('rememberedUser');
                }

                $q.loading.hide();

                // 5. Notify Success
                const userNameDisplay = resData.user.first_name || authStore.userName || 'ผู้ใช้งาน';
                $q.notify({
                    color: 'positive',
                    icon: 'verified_user',
                    message: `ยินดีต้อนรับ! คุณ ${userNameDisplay}`,
                    position: 'top-right'
                });

                playNextNote();

                // 🚀 6. Redirect Based on Role (or just to Dashboard)
                // You can add logic here: if nurse -> nurse-station, if doctor -> doctor-station
                // For now, let's go to your main nurse page as default
                router.push({ name: 'NursePatientList' }); // 👈 Adjust this route name if needed!

            } else {
                // If status is not 200, treat as error
                throw new Error(response.data?.message || 'Login failed');
            }

        } catch (error) {
            $q.loading.hide();
            console.error("Login Error:", error);

            const errorMessage = error.response?.data?.message || error.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';

            $q.notify({
                color: 'negative',
                icon: 'error',
                message: errorMessage,
                position: 'top-right'
            });

            playClearSound();
        } finally {
            isLoading.value = false;
        }
    }
};

const handleGoogleLogin = () => {
    $q.notify({ color: 'info', message: 'ฟังก์ชันนี้ยังไม่เปิดใช้งาน', position: 'top-right' });
    playNextNote();
};
</script>

<style scoped lang="scss">
@use "sass:color";

$primary-color: #00b8ff;
$dark-bg-color: #0d1a26;
$card-bg-color: rgba(38, 50, 56, 0.5);
$text-light: #e0e0e0;
$text-muted: #90a4ae;
$border-light: rgba(0, 184, 255, 0.2);

.dashboard-background {
  background-color: $dark-bg-color;
  font-family: 'Sarabun', sans-serif;
  color: $text-light;
  position: relative;
  overflow: hidden;
}

.metaballs-canvas {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; filter: blur(20px) contrast(30);
}

.login-card {
  position: relative; z-index: 2; width: 90vw; max-width: 480px;
  background-color: $card-bg-color; backdrop-filter: blur(5px);
  border-radius: 12px; border: 1px solid $border-light;
  box-shadow: 0 0 15px rgba($primary-color, 0.2);
  transition: all 0.3s ease; color: $text-light;
  animation: fadeInSlideUp 0.8s ease-out forwards;
}

@keyframes fadeInSlideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.header-title { color: #ffffff; text-shadow: 0 0 5px $primary-color; }
.welcome-text { color: $text-muted; }
.link { color: $primary-color; text-decoration: none; font-weight: 500; transition: color 0.3s; }
.link:hover { color: color.adjust($primary-color, $lightness: 10%); text-decoration: underline; }

.google-btn {
  background-color: rgba(255, 255, 255, 0.1) !important; color: $text-light !important;
  border: 1px solid rgba($primary-color, 0.3); transition: all 0.3s ease;
  .google-logo { filter: invert(1); width: 20px; height: 20px; margin-right: 8px; }
}
.google-btn:hover { background-color: rgba(255, 255, 255, 0.2) !important; box-shadow: 0 4px 8px rgba($primary-color, 0.2); }

:deep(.q-field--outlined.q-field--dark .q-field__control) {
  background-color: rgba(38, 50, 56, 0.7) !important; border-color: rgba(0, 184, 255, 0.2) !important; color: #e0e0e0 !important;
  transition: border-color 0.3s, box-shadow 0.3s, background-color 0.3s; border-radius: 12px !important;
}
:deep(.q-field--outlined.q-field--dark .q-field__native), :deep(.q-field--outlined.q-field--dark .q-field__input) { color: #e0e0e0 !important; }
:deep(.q-field--outlined.q-field--dark .q-field__control:hover) { border-color: rgba($primary-color, 0.5) !important; box-shadow: 0 0 5px rgba($primary-color, 0.2) !important; }
:deep(.q-field--outlined.q-field--dark.q-field--focused .q-field__control) { background-color: rgba(38, 50, 56, 0.9) !important; border-color: $primary-color !important; box-shadow: 0 0 10px rgba($primary-color, 0.6) !important; }

.login-btn { border-radius: 12px !important; font-weight: bold; text-transform: none; transition: all 0.3s ease; }
.login-btn:hover { box-shadow: 0 4px 15px -4px $primary-color, 0 0 15px rgba($primary-color, 0.6); }
</style>
