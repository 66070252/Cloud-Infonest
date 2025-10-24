<template>
  <div class="nav-bar" :class="{ 'is-logged-in': authStore.isLoggedIn }">
    
    <router-link to="/" class="app-name">
      <div class="logo">Info_Nest</div>
    </router-link>

    <div class="nav-center">
      <div class="loggedIn-controls">
        <span class="buttons">
          <router-link to="/my-posts">My Posts</router-link>
          <router-link to="/create-post">Create</router-link>
          <router-link to="/archive">Archive</router-link>
        </span>
      </div>
      
      <div class="search-container">
        <form @submit.prevent="performSearch">
          <input type="text" v-model="searchQuery" placeholder="Search posts..." />
          <button type="submit">🔍</button>
        </form>
      </div>
    </div>

    <div class="nav-right">
      <div class="is-login" v-if="!authStore.isLoggedIn">
        <span class="sign-up-q">Did you have an account? </span>
        <span><router-link to="/login" class="sign-up-link">Login</router-link></span>
      </div>
      <div class="is-login" v-else>
        <a href="#" @click.prevent="authStore.logout()" class="logout-link">Logout</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();
const router = useRouter();
const searchQuery = ref('');

const performSearch = () => {
  if (!searchQuery.value.trim()) return;
  // สั่งให้ Router พาไปที่หน้า SearchPage พร้อมกับส่งคำค้นหาไปด้วย
  router.push({ name: 'SearchPage', query: { q: searchQuery.value } });
};
</script>

<style>
.nav-bar {
  background-color: #0E418F;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  padding: 0 20px;
  box-sizing: border-box;
}

/* --- ส่วนซ้าย: Logo --- */
.app-name {
  font-weight: 700;
  color: #fff;
  font-family: 'KoHo', KoHo;
  text-decoration: none;
}
.logo {
  font-size: 42px;
  padding-bottom: 10px;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

/* --- ส่วนกลาง --- */
.nav-center {
  flex-grow: 1;
  display: flex;
  justify-content: center;
}

/* --- กลุ่ม Control สำหรับตอนล็อกอิน --- */
.loggedIn-controls {
  display: flex;
  align-items: center;
  gap: 30px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease-in-out, visibility 0.2s;
}

.nav-bar.is-logged-in .loggedIn-controls {
  opacity: 1;
  visibility: visible;
}

/* --- ส่วนขวา --- */
.nav-right { /* ไม่ต้องแก้ */ }
.is-login { display: flex; align-items: center; gap: 6px; }

/* V V V V V  นี่คือจุดที่แก้ไข  V V V V V */

.search-container form { display: flex; }

.search-container input {
  padding: 8px 12px;
  border-radius: 20px 0 0 20px;
  
  /* 1. เปลี่ยนให้เป็นสีขาวเสมอ */
  background-color: white;
  border: 1px solid #ccc;
  border-right: none;
  
  /* (ลบ transition และ background-color: transparent ออกไป) */
}

/* 2. ลบกฎ CSS ที่ซ่อนช่องค้นหาตอนยังไม่ล็อกอินทิ้งไป */
/* (บล็อก .nav-bar.is-logged-in .search-container input ถูกลบไปแล้ว) */

.search-container button {
  padding: 8px 12px;
  border: none;
  background-color: #FF7F32;
  color: white;
  border-radius: 0 20px 20px 0;
  cursor: pointer;
}
/* (โค้ด CSS ที่เหลือเหมือนเดิม) */
.nav-bar a { color: #fff; text-decoration: none; margin: 0 10px; font-size: 18px; transition: color 0.2s; padding: 6px 10px; border-radius: 4px; }
.nav-bar .buttons a:hover,
.nav-bar .buttons a.router-link-exact-active { background: rgba(255,255,255,0.15); color: #FFD700; }
.logout-link:hover { color: #ef9a9a; }
.sign-up-q { font-size: 16px; color: white; }
.sign-up-link { color: #FFD700; font-size: 16px; }
.sign-up-link:hover { text-decoration: underline; color: #FFD700; }
</style>