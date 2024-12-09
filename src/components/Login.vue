<template>
  <div>
    <h1>Connexion</h1>
    <form @submit.prevent="loginUser">
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div>
        <label for="password">Mot de passe:</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit">Se connecter</button>
    </form>
    <div v-if="error">{{ error.message }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useFetchApiCrud } from '../composables/useFetchApiCrud.js';

const { create } = useFetchApiCrud('users/login');

const email = ref('');
const password = ref('');
const error = ref(null);

const loginUser = () => {
  const loginData = {
    email: email.value,
    password: password.value,
  };

  create(loginData)
    .then(response => {
      console.log('Utilisateur connecté:', response);
      // Rediriger ou afficher un message de succès
    })
    .catch(err => {
      console.error('Erreur lors de la connexion:', err);
      error.value = err;
    });
};
</script>