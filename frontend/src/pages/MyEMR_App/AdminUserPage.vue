<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="text-h5 text-white">📋 รายชื่อผู้ใช้งานในระบบ (Admin View)</div>
      <q-space />
      <q-btn icon="refresh" label="รีโหลดข้อมูล" color="primary" outline @click="fetchUsers" :loading="loading" />
    </div>

    <q-table
      title="User List"
      :rows="users"
      :columns="columns"
      row-key="user_id"
      dark
      bordered
      :loading="loading"
      class="bg-grey-9 text-white"
      :pagination="{ rowsPerPage: 10 }"
    >
      <template v-slot:body-cell-role="props">
        <q-td :props="props">
          <q-chip :color="getRoleColor(props.value)" text-color="white" dense>
            {{ props.value }}
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-department="props">
        <q-td :props="props">
          <div v-if="props.value" class="text-cyan-3 text-weight-bold">
            {{ props.value }}
          </div>
          <div v-else class="text-grey-6 text-italic">
            - ไม่ระบุ -
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-created_at="props">
        <q-td :props="props">
          {{ formatDate(props.value) }}
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import axios from 'axios';

const $q = useQuasar();
const loading = ref(false);
const users = ref([]);

// ตั้งค่า Columns ของตาราง
const columns = [
  { name: 'user_id', label: 'ID', field: 'user_id', sortable: true, align: 'left', style: 'width: 50px' },
  { name: 'first_name', label: 'ชื่อ', field: 'first_name', align: 'left' },
  { name: 'last_name', label: 'นามสกุล', field: 'last_name', align: 'left' },
  // 🔥 เพิ่มคอลัมน์ แผนก ตรงนี้
  { name: 'department', label: 'แผนก (Department)', field: 'department', sortable: true, align: 'left' },
  { name: 'role', label: 'ตำแหน่ง', field: 'role', sortable: true, align: 'center' },
  { name: 'email', label: 'อีเมล', field: 'email', align: 'left' },
  // { name: 'phone', label: 'เบอร์โทร', field: 'phone', align: 'left' }, // ซ่อนเบอร์โทรประหยัดที่
  { name: 'created_at', label: 'วันที่สมัคร', field: 'created_at', sortable: true, align: 'right' }
];

// ฟังก์ชันดึงข้อมูลจาก Server จริง
const fetchUsers = async () => {
  loading.value = true;
  try {
    const response = await axios.get('http://localhost:3000/api/users');
    users.value = response.data;
  } catch (error) {
    console.error(error);
    $q.notify({
      color: 'negative',
      message: 'ไม่สามารถดึงข้อมูลได้ (กรุณาตรวจสอบว่าเปิด Server Backend หรือยัง)',
      icon: 'error'
    });
  } finally {
    loading.value = false;
  }
};

// สีของป้ายตำแหน่ง
const getRoleColor = (role) => {
  const r = role?.toLowerCase() || '';
  if (r === 'doctor') return 'primary';
  if (r === 'nurse') return 'pink';
  if (r === 'pharmacist') return 'green';
  if (r === 'admin') return 'orange';
  return 'grey';
};

// จัดรูปแบบวันที่
const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('th-TH', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

onMounted(() => {
  fetchUsers();
});
</script>
