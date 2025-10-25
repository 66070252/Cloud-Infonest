<template>
  <div>
    <NavigationBar />
    <div class="profile-container">
      <h1>My Posts</h1>
      <div v-if="isLoading" class="loading">Loading...</div>
      <div v-else-if="myPosts.length > 0" class="info-container">
        <InfoFrame 
          v-for="info in myPosts"
          :key="info._id"
          :imgSrc="getImageUrl(info.imageUrl)"
          :title="info.title" 
          :to="{ name: 'ArticlePage', params: { id: info._id }}"/>
      </div>
      <div v-else class="no-posts">
        <p>You haven't created any posts yet.</p>
        <router-link to="/create-post" class="create-link">Create your first post</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/authStore';
import NavigationBar from '../components/NavigationBar.vue';
import InfoFrame from '../components/InfoFrame.vue';

// 1. (เพิ่ม) กำหนด API URL ที่นี่
const API_URL = 'http://infonest-app-env.eba-2pmq3au2.us-east-1.elasticbeanstalk.com';

const myPosts = ref([]);
const isLoading = ref(true);
const authStore = useAuthStore();

// 2. (เพิ่ม) ฟังก์ชันอัจฉริยะสำหรับจัดการ URL รูปภาพ
const getImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return null; // ถ้าไม่มี URL ก็ส่งค่า null
  }
  // ถ้า URL เป็น URL เต็ม (เช่น จาก S3) ให้ใช้มันเลย
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  // มิฉะนั้น (ถ้าเป็นรูปเก่า /uploads/...) ให้เติม API_URL เข้าไป
  return `${API_URL}${imageUrl}`;
};

onMounted(async () => {
  if (!authStore.token) {
    isLoading.value = false;
    return;
  }
  try {
    // 3. (แก้ไข) อัปเดต URL
    const res = await fetch(`${API_URL}/api/info/mine`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });
    if (res.ok) {
      const data = await res.json();
      myPosts.value = data;
    } else {
      console.error('Failed to fetch my posts');
    }
  } catch (error) {
    console.error('API Error:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.profile-container {
  max-width: 1200px;
  margin: 100px auto;
  padding: 20px;
}
.info-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.loading, .no-posts {
  text-align: center;
  margin-top: 50px;
  font-size: 1.2em;
  color: #666;
}
.no-posts .create-link {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #FF7F32;
  color: white;
  text-decoration: none;
  border-radius: 5px;
}
</style>
