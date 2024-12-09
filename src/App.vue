<template>
  <div id="app">
    <nav>
      <router-link to="/">Accueil</router-link><br>
      <router-link to="/login">Connexion</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useFetchApiCrud } from './composables/useFetchApiCrud.js';

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