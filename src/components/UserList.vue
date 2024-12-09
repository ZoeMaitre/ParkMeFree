<template>
  <div>
    <h1>Liste des utilisateurs</h1>
    <div v-if="loading">Chargement...</div>
    <div v-if="error">{{ error.message }}</div>
    <ul v-if="users.length">
      <li v-for="user in users" :key="user.id">{{ user.name }}</li>
    </ul>
    <div v-else-if="!loading && !error">Aucun utilisateur trouvé.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useFetchApiCrud } from '../composables/useFetchApiCrud.js';

const { readAll } = useFetchApiCrud('users');

const users = ref([]);
const error = ref(null);
const loading = ref(true);

onMounted(() => {
  readAll()
    .then(response => {
      console.log('Données des utilisateurs reçues:', response);
      users.value = response; // Assurez-vous que response contient les données utilisateur
      loading.value = false;
    })
    .catch(err => {
      console.error('Erreur lors de la récupération des utilisateurs:', err);
      error.value = err;
      loading.value = false;
    });
});
</script>