<template>
  <div>
    <h1>Liste des utilisateurs</h1>
    <div v-if="loading">Chargement...</div>
    <div v-if="error">{{ error.message }}</div>
    <ul v-if="users">
      <li v-for="user in users" :key="user.id">{{ user.name }}</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useFetchApiCrud } from '../composables/useFetchApiCrud.js';

const { readAll } = useFetchApiCrud('users');

const users = ref(null);
const error = ref(null);
const loading = ref(true);

onMounted(() => {
  readAll()
    .then(response => {
      users.value = response.data;
      loading.value = false;
    })
    .catch(err => {
      error.value = err;
      loading.value = false;
    });
});
</script>