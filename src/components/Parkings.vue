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
    </div>
    <div class="cards-container">
      <div v-for="parking in filteredParkings" :key="parking._id" class="parking-card" @click="goToDetail(parking._id)">
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
          <button class="parking-button">Me parquer</button>
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

const { readAll } = useFetchApiCrud('parks');
const parkings = ref([]);
const searchQuery = ref('');
const error = ref(null);
const userPosition = ref(null);
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

const filteredParkings = computed(() => {
  return parkings.value.filter(parking => 
    parking.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
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

onMounted(() => {
  fetchParkings();
});
</script>

<style scoped>
body, html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: #d9d9d9; /* Fond gris partout */
}

.home {
  width: 100%;
  min-height: 100vh;
  background-color: #d9d9d9; /* Fond gris partout */
  overflow: hidden;
  text-align: left;
  font-size: 12px;
  color: #68a2a4;
  font-family: 'Lexend', sans-serif;
  display: flex;
  flex-direction: column; /* Aligner les éléments verticalement */
  align-items: center; /* Centrer les éléments horizontalement */
  padding: 20px;
  box-sizing: border-box;
}

.search-container {
  width: 100%;
  display: flex;
  justify-content: center; /* Centrer la barre de recherche */
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
  width: 20px; /* Ajustez la taille de l'icône si nécessaire */
  height: 20px;
}

.logout-icon-wrapper {
  position: absolute;
  right: 20px;
  top: 20px;
  width: 40px;
  height: 40px;
  background-color: #ff0000; /* Vert foncé */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.logout-icon {
  width: 20px; /* Ajustez la taille de l'icône si nécessaire */
  height: 20px;
}

.search-bar {
  width: 100%;
  padding: 10px 40px 10px 40px; /* Espace pour les icônes de loupe et de déconnexion */
  border: 1px solid #68a2a4; /* Contour vert */
  border-radius: 20px;
  font-size: 16px;
  box-sizing: border-box;
  background-color: transparent; /* Fond transparent */
  color: #68a2a4; /* Texte vert */
}

.search-bar::placeholder {
  color: #68a2a4; /* Couleur du placeholder en vert */
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start; /* Aligner les cartes en haut */
  width: 100%;
}

.parking-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.13);
  margin: 10px;
  overflow: hidden;
  flex: 1 1 calc(33.333% - 20px); /* 3 cartes par ligne */
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  max-width: 450px; /* Taille maximale des cartes */
  height: 200px; /* Hauteur fixe des cartes */
  cursor: pointer; /* Ajouter un curseur pointeur pour indiquer que la carte est cliquable */
}

.parking-image-container {
  width: 150px;
  height: 100%; /* Hauteur de l'image égale à la hauteur de la carte */
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
  justify-content: center; /* Centrer verticalement le contenu */
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
    flex: 1 1 calc(50% - 20px); /* 2 cartes par ligne sur tablette */
  }
}

@media (max-width: 768px) {
  .parking-card {
    flex: 1 1 100%; /* 1 carte par ligne sur mobile */
  }
}
</style>