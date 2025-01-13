<template>
  <div class="signup-container">
    <div class="title">ParkMeFree</div>
    <div class="background"></div>
    <form @submit.prevent="handleSubmit" class="signup-form">
      <div class="form-group">
        <label for="firstname" class="label">Prénom</label>
        <input type="text" id="firstname" v-model="firstname" required class="input" />
        <span v-if="errors.firstname" class="error-message">{{ errors.firstname }}</span>
      </div>
      <div class="form-group">
        <label for="lastname" class="label">Nom</label>
        <input type="text" id="lastname" v-model="lastname" required class="input" />
        <span v-if="errors.lastname" class="error-message">{{ errors.lastname }}</span>
      </div>
      <div class="form-group">
        <label for="username" class="label">Nom d'utilisateur</label>
        <input type="text" id="username" v-model="username" required class="input" />
        <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
      </div>
      <div class="form-group">
        <label for="email" class="label">E-mail</label>
        <input type="email" id="email" v-model="email" required class="input" />
        <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
      </div>
      <div class="form-group">
        <label for="password" class="label">Mot de passe</label>
        <input type="password" id="password" v-model="password" required class="input" />
        <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
      </div>
      <div class="button-group">
        <div class="back-icon-wrapper" @click="goBack">
          <span class="material-symbols-outlined back-icon">arrow_left_alt</span>
        </div>
        <button type="submit" class="submit-button">S'inscrire</button>
      </div>
    </form>
    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useFetchApiCrud } from '../composables/useFetchApiCrud.js';

const { create } = useFetchApiCrud('users/register');
const router = useRouter();

const firstname = ref('');
const lastname = ref('');
const username = ref('');
const email = ref('');
const password = ref('');
const error = ref(null);
const errors = ref({});

const validateForm = () => {
  errors.value = {};
  if (!firstname.value) errors.value.firstname = 'Prénom requis';
  if (!lastname.value) errors.value.lastname = 'Nom requis';
  if (!username.value) errors.value.username = 'Nom d\'utilisateur requis';
  if (!email.value) errors.value.email = 'E-mail requis';
  if (!password.value) errors.value.password = 'Mot de passe requis';
  return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    const userData = {
      firstName: firstname.value,
      lastName: lastname.value,
      userName: username.value,
      email: email.value,
      password: password.value,
    };

    const response = await create(userData);
    console.log('Utilisateur inscrit:', response);

    // Connexion automatique après inscription
    const loginResponse = await useFetchApiCrud('login').create({ email: email.value, password: password.value });
    console.log('Utilisateur connecté:', loginResponse);

    if (!loginResponse.token) {
      throw new Error('Réponse de l\'API invalide : jeton non trouvé');
    }

    localStorage.setItem('token', loginResponse.token); // Stocker le token dans le localStorage
    localStorage.setItem('user_id', response._id); // Stocker l'ID de l'utilisateur dans le localStorage
    router.push('/addCar'); // Rediriger vers la page d'ajout de voiture
  } catch (err) {
    console.error('Erreur lors de l\'inscription ou de la connexion:', err);
    if (err.response && err.response.data && err.response.data.message) {
      error.value = err.response.data.message;
    } else {
      error.value = 'Une erreur est survenue lors de l\'inscription ou de la connexion.';
    }
  }
};

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.signup-container {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #a9c8c9;
  overflow: auto; /* Permettre le défilement */
  text-align: center;
  font-size: 16px;
  color: #d9d9d9;
  font-family: 'Lexend', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

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

/* Formulaire d'inscription */
.signup-form {
  display: flex;
  flex-direction: column;
  gap: 2vh;
  width: 90%;
  max-width: 320px;
  z-index: 2;
  margin-top: 40vh; /* Déplace le formulaire vers le bas */
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
  justify-content: space-between;
  align-items: center;
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
  text-align: left;
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
  .signup-form {
    margin-top: 35vh;
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
  .signup-form {
    margin-top: 30vh;
  }
}
</style>