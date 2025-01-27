<template>
  <div class="parking-session-container">
    <div class="title">ParkMeFree</div>
    <div class="background"></div>
    <div class="content">
      <h1>Vous êtes parqué</h1>
      <p>{{ countdownMessage }}</p>
      <button @click="endParkingSession" class="end-parking-button">Fin du parking</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useFetchApi } from '../composables/useFetchApi.js';

const router = useRouter();
const route = useRoute();
const countdownMessage = ref('');
let intervalId;

const notificationToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzU5YTg4OTNkNWEyOTAzNTYwMzc5OTAiLCJleHAiOjE3MzQ1MzQwMDcsImlhdCI6MTczMzkyOTIwN30.mF_51SZVPYfA63jnOh-zMRKrSFYfRM2NZl-8m2KubDM';

const sendNotification = async (token, message) => {
  try {
    await useFetchApi({
      method: 'POST',
      endpoint: 'notifications/send',
      data: { token, message },
    });
    console.log('Notification envoyée');
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification:', error);
  }
};

const calculateCountdown = (remainingTime) => {
  const endTime = new Date(new Date().getTime() + remainingTime * 60 * 60 * 1000); // Convertir les heures en millisecondes
  intervalId = setInterval(async () => {
    const now = new Date().getTime();
    const distance = endTime - now;

    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (distance < 0) {
      clearInterval(intervalId);
      countdownMessage.value = 'Il n\'y a plus de temps gratuit disponible';
      await sendNotification(notificationToken, 'Votre temps gratuit est terminé.');
    } else {
      countdownMessage.value = `Vous avez encore ${hours}h ${minutes}m ${seconds}s jusqu'à la fin du temps gratuit.`;
    }
  }, 1000);
};

const startParkingSession = () => {
  const freeTime = parseFloat(route.params.freeTime); // Récupérer la durée du temps gratuit depuis les paramètres de la route et la convertir en nombre
  calculateCountdown(freeTime);
};

const endParkingSession = () => {
  clearInterval(intervalId);
  countdownMessage.value = 'Parking terminé';
  router.push('/parkings'); // Rediriger vers la page des parkings
};

onMounted(() => {
  startParkingSession();
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>
  
  <style scoped>
  .parking-session-container {
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
  
  .content {
    z-index: 2;
    margin-top: 15vh; /* Déplace le contenu vers le bas */
    color: #68a2a4;
  }
  
  h1 {
    font-size: 2em;
    margin-bottom: 20px;
  }
  
  p {
    font-size: 1.2em;
    margin-bottom: 20px;
  }
  
  .end-parking-button {
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
  
  .end-parking-button:hover {
    background: #5b8e8f;
  }
  
  @media (max-width: 1024px) {
    .title {
      font-size: 8vw;
    }
    .background {
      top: 30vh;
      height: 80%;
    }
    .content {
      margin-top: 15vh;
    }
    h1 {
      font-size: 1.8em;
    }
    p {
      font-size: 1em;
    }
    .end-parking-button {
      width: 60vw;
      height: 8vh;
    }
  }
  
  @media (max-width: 768px) {
    .title {
      font-size: 10vw;
    }
    .background {
      top: 25vh;
      height: 80%;
    }
    .content {
      margin-top: 15vh;
    }
    h1 {
      font-size: 1.6em;
    }
    p {
      font-size: 0.9em;
    }
    .end-parking-button {
      width: 70vw;
      height: 8vh;
    }
  }
  </style>