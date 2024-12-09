<script setup>
import HelloWorld from './components/HelloWorld.vue';
import UserList from './components/UserList.vue';
import SignUp from './components/SignUp.vue';

</script>

<template>
  <!-- <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
  <div id="app">
    <UserList />
  </div> -->
  <SignUp />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

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