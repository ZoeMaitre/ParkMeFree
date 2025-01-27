<template>
  <div class="home">
    <div class="search-container">
      <div class="search-bar-wrapper">
        <img src="/SearchIcon.svg" alt="Search Icon" class="search-icon" />
        <input type="text" v-model="searchQuery" placeholder="Rechercher un parking..." class="search-bar" />
      </div>
      <div class="logout-icon-wrapper" @click="logoutUser">
        <img src="/LogOut.svg" alt="Logout Icon" class="logout-icon" />
      </div>
      <button class="create-parking-button" @click="goToCreateParking">Créer un Parking</button>
    </div>
    <div class="cards-container">
      <div v-for="parking in sortedParkings" :key="parking._id" class="parking-card" @click="goToDetail(parking._id)">
        <div class="parking-image-container">
          <img :src="parking.picture" alt="Parking Image" class="parking-image">
        </div>
        <div class="parking-info">
          <div class="parking-name">{{ parking.name }}</div>
          <div class="parking-location">
            <span>{{ parking.address }}</span>
          </div>
          <div class="parking-capacity">Capacité: {{ parking.capacity }} place{{ parking.capacity > 1 ? 's' : '' }}</div>
          <div class="parking-free-time">Temps gratuit: {{ parking.freeTime }} heure{{ parking.freeTime > 1 ? 's' : '' }}</div>
          <button class="parking-button" @click.stop="createParkingSession(parking._id)">Me parquer</button>
        </div>
      </div>
    </div>
    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useFetchApiCrud } from '../composables/useFetchApiCrud.js';

const { readAll, read } = useFetchApiCrud('parks');
const { read: readUser } = useFetchApiCrud('users');
const parkings = ref([]);
const searchQuery = ref('');
const error = ref(null);
const user = ref({});
const userLocation = ref(null);
const router = useRouter();

const fetchParkings = async () => {
  try {
    const data = await readAll();
    parkings.value = await Promise.all(data.map(async parking => {
      const address = await getAddressFromCoordinates(parking.geolocation[0], parking.geolocation[1]);
      return { ...parking, address };
    }));
  } catch (err) {
    error.value = err.message;
  }
};

const goToCreateParking = () => {
  router.push('/createParkings');
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

const getUserLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      userLocation.value = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
    }, err => {
      console.error('Erreur lors de la récupération de la localisation de l\'utilisateur:', err);
    });
  } else {
    console.error('La géolocalisation n\'est pas supportée par ce navigateur.');
  }
};

const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const toRad = x => x * Math.PI / 180;
  const R = 6371; // Rayon de la Terre en km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const sortedParkings = computed(() => {
  if (!userLocation.value) return parkings.value;
  return parkings.value
    .map(parking => ({
      ...parking,
      distance: calculateDistance(userLocation.value.lat, userLocation.value.lng, parking.geolocation[0], parking.geolocation[1])
    }))
    .sort((a, b) => a.distance - b.distance)
    .filter(parking => parking.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const logoutUser = () => {
  localStorage.removeItem('token');
  router.push('/');
};

const goToDetail = (id) => {
  if (id) {
    router.push({ name: 'ParkingDetail', params: { id } });
  } else {
    console.error('ID du parking manquant');
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

const createParkingSession = async (parkingId) => {
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

    const parking = await read(parkingId);
    const freeTime = parking.freeTime;

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
        park_id: parkingId,
        user_id: userId, // Utilisez l'ID de l'utilisateur actuel
        car_id: carId, // Utilisez l'ID de la voiture actuelle
        geolocation: parkings.value.find(parking => parking._id === parkingId).geolocation
      })
    });
    const responseText = await response.text(); // Lire la réponse en tant que texte brut
    console.log('Réponse brute du serveur:', responseText); // Afficher la réponse brute dans la console
    if (!response.ok) {
      throw new Error(`Erreur lors de la création de la session de parking: ${responseText}`);
    }
    const data = JSON.parse(responseText); // Parser la réponse en JSON
    console.log('Session de parking créée:', data);
    router.push({ name: 'ParkingSession', params: { id: parkingId, freeTime } });
  } catch (err) {
    console.error('Erreur:', err);
  }
};

onMounted(() => {
  fetchParkings();
  getUserLocation();
});
</script>

<style scoped>
body,
html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: #d9d9d9;
  /* Fond gris partout */
}

.home {
  width: 100%;
  min-height: 100vh;
  background-color: #d9d9d9;
  /* Fond gris partout */
  overflow: hidden;
  text-align: left;
  font-size: 12px;
  color: #68a2a4;
  font-family: 'Lexend', sans-serif;
  display: flex;
  flex-direction: column;
  /* Aligner les éléments verticalement */
  align-items: center;
  /* Centrer les éléments horizontalement */
  padding: 20px;
  box-sizing: border-box;
}

.search-container {
  width: 100%;
  display: flex;
  justify-content: center;
  /* Centrer la barre de recherche */
  margin-bottom: 20px;
}

.search-bar-wrapper {
  position: relative;
  width: 100%;
  max-width: 350px;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  /* Ajustez la taille de l'icône si nécessaire */
  height: 20px;
}

.logout-icon-wrapper {
  position: absolute;
  right: 20px;
  top: 20px;
  width: 40px;
  height: 40px;
  background-color: #ff0000;
  /* Vert foncé */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.logout-icon {
  width: 20px;
  /* Ajustez la taille de l'icône si nécessaire */
  height: 20px;
}

.create-parking-button {
  position: absolute;
  right: 100px;
  top: 0px;
  height: 40px;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #68a2a4;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-bar {
  width: 100%;
  padding: 10px 40px 10px 40px;
  /* Espace pour les icônes de loupe et de déconnexion */
  border: 1px solid #68a2a4;
  /* Contour vert */
  border-radius: 20px;
  font-size: 16px;
  box-sizing: border-box;
  background-color: transparent;
  /* Fond transparent */
  color: #68a2a4;
  /* Texte vert */
}

.search-bar::placeholder {
  color: #68a2a4;
  /* Couleur du placeholder en vert */
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  /* Aligner les cartes en haut */
  width: 100%;
}

.parking-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.13);
  margin: 10px;
  overflow: hidden;
  flex: 1 1 calc(33.333% - 20px);
  /* 3 cartes par ligne */
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  max-width: 450px;
  /* Taille maximale des cartes */
  height: 200px;
  /* Hauteur fixe des cartes */
  cursor: pointer;
  /* Ajouter un curseur pointeur pour indiquer que la carte est cliquable */
}

.parking-image-container {
  width: 150px;
  height: 100%;
  /* Hauteur de l'image égale à la hauteur de la carte */
  overflow: hidden;
}

.parking-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.parking-info {
  padding: 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* Centrer verticalement le contenu */
}

.parking-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 5px;
}

.parking-location {
  font-size: 14px;
  margin-bottom: 5px;
}

.parking-capacity,
.parking-free-time {
  font-size: 14px;
  margin-bottom: 5px;
}

.parking-button {
  background-color: #68a2a4;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  text-align: center;
  transition: background 0.3s ease;
}

.parking-button:hover {
  background-color: #5b8e8f;
}

.error-message {
  color: red;
  font-size: 0.875rem;
  text-align: center;
}

@media (max-width: 1024px) {
  .parking-card {
    flex: 1 1 calc(50% - 20px);
    /* 2 cartes par ligne sur tablette */
  }
}

@media (max-width: 768px) {
  .parking-card {
    flex: 1 1 100%;
    /* 1 carte par ligne sur mobile */
  }
}
</style>