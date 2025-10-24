<template>
  <NavigationBar />
  <div class="top-liked-container">
    <h1>Top Liked</h1>
    <div class="info-container">
      <InfoFrame
        v-for="info in topInfos"
        :key="info._id"
        :imgSrc="getImageUrl(info.imageUrl)"
        :title="info.title"
        :to="{ name: 'ArticlePage', params: { id: info._id }}"
      />
    </div>
  </div>
  <h1>All Articles</h1>
  <div class="info-container">
    <InfoFrame 
      v-for="info in infoList"
      :key="info._id"
      :imgSrc="getImageUrl(info.imageUrl)"
      :title="info.title" 
      :to="{ name: 'ArticlePage', params: { id: info._id }}"/>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import InfoFrame from '../components/InfoFrame.vue'
import NavigationBar from '../components/NavigationBar.vue'

// --- 1. (แนะนำ) สร้างตัวแปรสำหรับ API URL เพื่อให้แก้ง่ายในอนาคต ---
const API_URL = 'http://infonest-app-env.eba-2pmq3au2.us-east-1.elasticbeanstalk.com'; 
// (ในอนาคต เมื่อ Deploy ให้เปลี่ยนค่านี้เป็น URL ของ Elastic Beanstalk)

const infoList = ref([])
const topInfos = ref([])

// --- 2. นี่คือ "ฟังก์ชันอัจฉริยะ" ที่เราเพิ่มเข้ามา ---
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


// ดึงข้อมูลเมื่อ component ถูก mount
onMounted(() => {
  // --- 3. เปลี่ยนไปใช้ตัวแปร API_URL ---
  fetch(`${API_URL}/api/info`)
    .then(res => res.json())
    .then(data => {
      // (โค้ดส่วนที่เหลือของคุณเหมือนเดิม)
      const sorted = [...data].sort((a, b) => (b.likes || 0) - (a.likes || 0))
      topInfos.value = sorted.slice(0, 3)
      const topIds = new Set(topInfos.value.map(i => i._id))
      infoList.value = data.filter(i => !topIds.has(i._id))
    })
    .catch(err => {
      console.error('API error:', err)
    })
})
</script>

<style>
.top-liked-container {
  margin: 150px 0px 100px 0px;
  text-align: center;
}
.info-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

</style>
