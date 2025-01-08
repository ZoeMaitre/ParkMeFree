<template>
  <div class="login-container">
    <div class="background"></div>
    <div class="title">ParkMeFree</div>
    <form @submit.prevent="loginUser" class="login-form">
      <div class="form-group">
        <label for="email" class="label">E-mail</label>
        <input
          type="email"
          id="email"
          v-model="email"
          required
          class="input"
        />
      </div>
      <div class="form-group">
        <label for="password" class="label">Mot de passe</label>
        <input
          type="password"
          id="password"
          v-model="password"
          required
          class="input"
        />
      </div>
      <div class="button-group">
        <div class="back-icon-wrapper" @click="goBack">
          <span class="material-symbols-outlined back-icon">arrow_left_alt</span>
        </div>
        <button type="submit" class="submit-button">Se connecter</button>
      </div>
    </form>
    <div v-if="error" class="error-message">{{ error.message }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useFetchApiCrud } from '../composables/useFetchApiCrud.js';

const router = useRouter();
const { create } = useFetchApiCrud('login');

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
      localStorage.setItem('token', response.token); // Stocker le token dans le localStorage
      router.push('/parkings'); // Rediriger vers la page des parkings
    })
    .catch(err => {
      console.error('Erreur lors de la connexion:', err);
      error.value = err;
    });
};

const goBack = () => {
  router.back();
};
</script>

<style scoped>
/* Conteneur principal */
.login-container {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #a9c8c9;
  overflow: hidden; /* Permettre le défilement */
  text-align: center;
  font-size: 16px;
  color: #d9d9d9;
  font-family: 'Lexend', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Arrière-plan flou beige */
.background {
  position: absolute;
  top: 30vh;
  left: 0;
  backdrop-filter: blur(4px);
  border-top-left-radius: 25px; /* Arrondir les bords en haut à gauche */
  border-top-right-radius: 25px;
  background-color: #d9d9d9;
  width: 100%;
  height: 80%;
}

/* Titre principal */
.title {
  position: absolute;
  top: 7vh;
  left: 50%;
  transform: translateX(-50%);
  font-size: 5.5vw;
  font-family: 'Paytone One';
  display: flex;
  justify-content: center;
  width: 80%;
  max-width: 285px;
  height: auto;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* Formulaire de connexion */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 2vh;
  width: 90%;
  max-width: 320px;
  z-index: 2;
  margin-top: 15vh; /* Déplace le formulaire vers le bas */
}

/* Groupe de champs */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 1vh;
}

/* Libellé des champs */
.label {
  color: #68a2a4;
  font-size: 1.1rem;
  font-family: 'Lexend', sans-serif;
  font-weight: 500;
  line-height: 1.5em;
}

/* Champ d'entrée */
.input {
  padding: 1vh 1.5vh;
  background: white;
  box-shadow: 0px 0.1vh 0.2vh rgba(16, 24, 40, 0.05);
  border-radius: 0.8vh;
  border: 0.1vh solid #bad6cc;
  font-size: 1rem;
  font-family: 'Lexend', sans-serif;
  color: #68a2a4;
  outline: none;
}

/* Bouton de soumission */
.submit-button {
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.13);
  border-radius: 25px;
  box-sizing: border-box;
  width: 50vw;
  max-width: 210px;
  height: 7vh;
  max-height: 49px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em;
  margin: 10px auto; /* Centrer le bouton */
  background-color: #68a2a4;
  border: 1px solid #68a2a4;
  color: #fffaf5;
  cursor: pointer;
  transition: background 0.3s ease;
}

.submit-button:hover {
  background: #5b8e8f;
}

/* Groupe de boutons */
.button-group {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px; /* Espace entre les boutons */
  width: 100%;
  max-width: 320px;
  margin: 10px auto; /* Centrer le groupe de boutons */
}

/* Icône de retour */
.back-icon-wrapper {
  width: 40px;
  height: 40px;
  background-color: #A9C8C9; /* Vert foncé */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.back-icon {
  font-size: 24px; /* Ajustez la taille de l'icône si nécessaire */
  color: white; /* Couleur de l'icône */
}

/* Message d'erreur */
.error-message {
  color: red;
  font-size: 0.875rem;
  margin-top: 1vh;
  text-align: center;
}

@media (max-width: 1024px) {
  .label {
    font-size: 1rem;
  }
  .background{
    top: 30vh;
    height: 80%;
  }
  .input {
    font-size: 0.9rem;
  }
  .submit-button {
    width: 60vw;
    height: 8vh;
  }
  .title {
    font-size: 8vw;
  }
  
}

@media (max-width: 768px) {
  .label {
    font-size: 0.9rem;
  }
  .background{
    top: 25vh;
    height: 80%;
  }
  .input {
    font-size: 0.8rem;
  }
  .submit-button {
    width: 70vw;
    height: 8vh;
  }
  .title {
    font-size: 10vw;
  }
  .login-form {
    margin-top: 5vh;
  }
}
</style>