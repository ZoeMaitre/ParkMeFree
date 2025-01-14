<template>
    <div class="add-car-container">
      <div class="title">ParkMeFree</div>
      <div class="background"></div>
      <form @submit.prevent="handleSubmit" class="add-car-form">
        <p class="explanation">L'inscription s'est bien passée. Veuillez maintenant ajouter une voiture pour compléter votre profil.</p>
        <div class="form-group">
          <label for="model" class="label">Modèle</label>
          <input type="text" id="model" v-model="model" required class="input" />
          <span v-if="errors.model" class="error-message">{{ errors.model }}</span>
        </div>
        <div class="form-group">
          <label for="height" class="label">Hauteur (cm)</label>
          <input type="number" id="height" v-model="height" required class="input" />
          <span v-if="errors.height" class="error-message">{{ errors.height }}</span>
        </div>
        <div class="form-group">
          <label for="license_plate" class="label">Plaque d'immatriculation</label>
          <input type="text" id="license_plate" v-model="license_plate" required class="input" />
          <span v-if="errors.license_plate" class="error-message">{{ errors.license_plate }}</span>
        </div>
        <div class="button-group">
          <div class="back-icon-wrapper" @click="goBack">
            <span class="material-symbols-outlined back-icon">arrow_left_alt</span>
          </div>
          <button type="submit" class="submit-button">Ajouter</button>
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
  const { create } = useFetchApiCrud('cars/create');
  const { update } = useFetchApiCrud('users/update');
  
  const model = ref('');
  const height = ref(0);
  const license_plate = ref('');
  const error = ref(null);
  const errors = ref({});
  
  const validateForm = () => {
    errors.value = {};
    if (!model.value) errors.value.model = 'Modèle requis';
    if (!height.value) errors.value.height = 'Hauteur requise';
    if (!license_plate.value) errors.value.license_plate = 'Plaque d\'immatriculation requise';
    return Object.keys(errors.value).length === 0;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
  
    try {
      const carData = {
        model: model.value,
        height: height.value,
        license_plate: license_plate.value,
      };
  
      const token = localStorage.getItem('token'); // Récupérez le jeton d'authentification depuis le local storage
      const userId = localStorage.getItem('user_id'); // Récupérez l'ID de l'utilisateur depuis le local storage
      if (!token || !userId) {
        throw new Error('Jeton d\'authentification ou ID utilisateur non trouvé');
      }
  
      const response = await create(carData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Voiture ajoutée:', response);
  
      if (!response._id) {
        throw new Error('Réponse de l\'API invalide : ID voiture non trouvé');
      }
  
      // Mettre à jour l'utilisateur avec l'ID de la voiture
      const updateResponse = await update(userId, { car_id: response._id }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      console.log('Réponse de mise à jour de l\'utilisateur:', updateResponse);
  
      if (!updateResponse || !updateResponse._id) {
        throw new Error(`Erreur lors de la mise à jour de l'utilisateur: ${updateResponse.statusText || 'Statut inconnu'}`);
      }
  
      localStorage.setItem('car_id', response._id); // Stocker l'ID de la voiture dans le localStorage
      router.push('/parkings'); // Rediriger vers la page des parkings après l'ajout de la voiture
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la voiture:', err);
      error.value = err;
    }
  };
  
  const goBack = () => {
    router.back();
  };
  </script>
  
  
  <style scoped>
  .add-car-container {
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
  
  .explanation {
    margin-bottom: 20px;
    font-size: 16px;
    color: #68a2a4;
    text-align: center;
  }
  
  /* Formulaire d'ajout de voiture */
  .add-car-form {
    display: flex;
    flex-direction: column;
    gap: 2vh;
    width: 90%;
    max-width: 320px;
    z-index: 2;
    margin-top: 27vh; /* Déplace le formulaire vers le bas */
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
    .add-car-form {
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
    .add-car-form {
      margin-top: 30vh;
    }
  }
  </style>