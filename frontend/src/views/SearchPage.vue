<template>
  <div>
    <NavigationBar />
    <div class="search-results-container">
      <h1>Search Results for: "{{ searchTerm }}"</h1>
      <div v-if="isLoading" class="loading">Searching...</div>
      <div v-else-if="results.length > 0" class="info-container">
        <InfoFrame 
          v-for="info in results"
          :key="info._id"
          :imgSrc="getImageUrl(info.imageUrl)"
          :title="info.title" 
          :to="{ name: 'ArticlePage', params: { id: info._id }}"/>
      </div>
      <div v-else class="no-results">
        <p>No posts found matching your search term.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import NavigationBar from '../components/NavigationBar.vue';
import InfoFrame from '../components/InfoFrame.vue';

// 1. (เพิ่ม) กำหนด API URL ที่นี่
const API_URL = 'http://infonest-app-env.eba-2pmq3au2.us-east-1.elasticbeanstalk.com';

const route = useRoute();
const results = ref([]);
const isLoading = ref(true);
const searchTerm = ref(route.query.q || '');

// 2. (เพิ่ม) ฟังก์ชันอัจฉริยะสำหรับจัดการ URL รูปภาพ
const getImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return null; // ถ้าไม่มี URL ก็ส่งค่า null
  }
  // ถ้า URL เป็น URL เต็ม (เช่น จาก S3) ให้ใช้มันเลย
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('http://')) {
    return imageUrl;
  }
  // มิฉะนั้น (ถ้าเป็นรูปเก่า /uploads/...) ให้เติม API_URL เข้าไป
  return `${API_URL}${imageUrl}`;
};

const fetchResults = async (query) => {
  if (!query) return;
  isLoading.value = true;
  try {
    // 3. (แก้ไข) อัปเดต URL
    const res = await fetch(`${API_URL}/api/info/search?q=${encodeURIComponent(query)}`);
    if (res.ok) {
      results.value = await res.json();
    }
  } catch (error) {
    console.error("Search failed:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchResults(searchTerm.value);
});

watch(() => route.query.q, (newQuery) => {
  searchTerm.value = newQuery;
  fetchResults(newQuery);
});
</script>

<style scoped>
.search-results-container { max-width: 100%; margin: 100px auto; padding: 20px; }
.info-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.loading, .no-results { text-align: center; margin-top: 50px; font-size: 1.2em; color: #666; }
</style>
