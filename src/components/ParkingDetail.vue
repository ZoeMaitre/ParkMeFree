<template>
  <div class="parking-detail">
    <div class="background-blur"></div>
    <div class="back-icon-wrapper" @click="goBack">
      <span class="material-symbols-outlined back-icon">arrow_left_alt</span>
    </div>
    <div class="detail-card">
      <div class="content-wrapper">
        <img :src="parking.picture" alt="Parking Image" class="parking-image">
        <div class="parking-info">
          <h1 class="parking-name">{{ parking.name }}</h1>
          <p class="address">{{ parking.address }}</p>
          <div class="details">
            <div class="detail-item">
              <p class="label">Capacité</p>
              <p class="value">{{ parking.capacity }} places</p>
            </div>
            <div class="detail-item">
              <p class="label">Temps gratuit</p>
              <p class="value">{{ parking.freeTime }} heures</p>
            </div>
            <div class="detail-item">
              <p class="label">Hauteur</p>
              <p class="value">{{ parking.height === 0 || parking.height === null ? 'Parking en plein air' : `${parking.height} mètres` }}</p>
            </div>
          </div>
          <div class="button-container">
            <button class="park-button" @click="createParkingSession">Me parquer</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFetchApiCrud } from '../composables/useFetchApiCrud.js';

const route = useRoute();
const router = useRouter();
const parking = ref({});
const user = ref({});

const { read } = useFetchApiCrud('parks');
const { read: readUser } = useFetchApiCrud('users');

const fetchParkingDetail = async (id) => {
  try {
    const data = await read(id);
    const address = await getAddressFromCoordinates(data.geolocation[0], data.geolocation[1]);
    parking.value = { ...data, address };
  } catch (err) {
    console.error('Erreur lors de la récupération des détails du parking:', err);
  }
};

const fetchUserDetail = async (userId) => {
  try {
    const data = await readUser(userId);
    user.value = data;
  } catch (err) {
    console.error('Erreur lors de la récupération des détails de l\'utilisateur:', err);
  }
};

const getAddressFromCoordinates = async (lat, lng) => {
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`);
  const data = await response.json();
  if (data && data.address) {
    const { house_number, road, city, town, village, state } = data.address;
    return `${house_number || ''} ${road || ''}, ${city || town || village || ''}, ${state || ''}`;
  } else {
    return 'Adresse non disponible';
  }
};

const createParkingSession = async () => {
  try {
    const token = localStorage.getItem('token'); // Récupérez le jeton d'authentification depuis le local storage
    const userId = localStorage.getItem('user_id'); // Récupérez l'ID de l'utilisateur depuis le local storage
    if (!token || !userId) {
      throw new Error('Jeton d\'authentification ou ID utilisateur non trouvé');
    }

    await fetchUserDetail(userId); // Récupérez les détails de l'utilisateur
    const carId = user.value.car_id; // Récupérez l'ID de la voiture depuis les détails de l'utilisateur

    if (!carId) {
      throw new Error('ID de la voiture non trouvé');
    }

    const apiUrl = import.meta.env.VITE_API_URL; // Utilisez l'URL de base définie dans les variables d'environnement

    const response = await fetch(`${apiUrl}/parkingSessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        start_time: new Date(),
        end_time: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), // 2 heures plus tard
        park_id: parking.value._id,
        user_id: userId, // Utilisez l'ID de l'utilisateur actuel
        car_id: carId, // Utilisez l'ID de la voiture actuelle
        geolocation: parking.value.geolocation
      })
    });
    const responseText = await response.text(); // Lire la réponse en tant que texte brut
    console.log('Réponse brute du serveur:', responseText); // Afficher la réponse brute dans la console
    if (!response.ok) {
      throw new Error(`Erreur lors de la création de la session de parking: ${responseText}`);
    }
    const data = JSON.parse(responseText); // Parser la réponse en JSON
    console.log('Session de parking créée:', data);
    router.push('/parkingSession'); // Rediriger vers la page de session de parking
  } catch (err) {
    console.error('Erreur:', err);
  }
};

onMounted(() => {
  fetchParkingDetail(route.params.id);
});

const goBack = () => {
  router.back();
};
</script>

<style scoped>
body, html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: #d9d9d9; /* Fond gris partout */
  overflow: auto; /* Permettre le défilement */
}

.parking-detail {
  width: 100%;
  position: relative;
  background-color: #d9d9d9;
  min-height: 100vh; /* Utiliser min-height pour permettre le défilement */
  overflow: auto; /* Permettre le défilement */
  text-align: left;
  font-size: 16px;
  color: #68a2a4;
  font-family: 'Lexend', sans-serif;
}

.background-blur {
  position: absolute;
  top: 0px;
  left: 0px;
  backdrop-filter: blur(4px);
  background-color: #d9d9d9;
  width: 100%;
  height: 100%;
}

.back-icon-wrapper {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 40px;
  height: 40px;
  background-color: #A9C8C9; /* Vert foncé */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10; /* Assurez-vous que la flèche est au-dessus de la carte */
}

.back-icon {
  font-size: 24px; /* Ajustez la taille de l'icône si nécessaire */
  color: white; /* Couleur de l'icône */
}

.detail-card {
  position: relative;
  margin: 80px auto 0; /* Ajoutez une marge en haut de la carte */
  width: 90%;
  max-width: 1000px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.13);
  padding: 20px;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
}

.parking-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 20px;
  object-fit: cover; /* Recadrer l'image sans la déformer */
}

.parking-info {
  text-align: left; /* Alignez le texte à gauche */
}

.parking-name {
  font-size: 25px;
  font-weight: 600;
  margin-bottom: 10px;
}

.address {
  font-size: 18px;
  margin-bottom: 20px;
}

.details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.detail-item {
  text-align: center;
  flex: 1;
}

.label {
  font-weight: bold;
  margin-bottom: 5px;
}

.value {
  font-size: 1.2rem;
}

.button-container {
  display: flex;
  justify-content: center;
}

.park-button {
  background-color: #68a2a4;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease;
}

.park-button:hover {
  background-color: #5b8e8f;
}

@media (max-width: 800px) {
  .details {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .detail-item {
    width: 48%; /* Ajustez la largeur pour deux colonnes */
    margin-bottom: 10px;
  }

  .parking-detail, html, body {
    overflow: auto;
  }
}

@media (min-width: 800px) {
  .parking-detail {
    overflow: auto;
  }
  .content-wrapper {
    flex-direction: row;
  }

  .parking-image {
    width: 50%;
    margin-bottom: 0;
  }

  .parking-info {
    width: 50%;
    padding-left: 20px;
  }
}
</style>