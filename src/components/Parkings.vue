<template>
    <div class="home">
      <div class="search-container">
        <div class="search-bar-wrapper">
          <img src="/SearchIcon.svg" alt="Search Icon" class="search-icon" />
          <input type="text" v-model="searchQuery" placeholder="Rechercher un parking..." class="search-bar" />
        </div>
      </div>
      <div v-for="parking in filteredParkings" :key="parking.id" class="parking-card">
        <div class="parking-image-container">
          <img :src="parking.picture" alt="Parking Image" class="parking-image">
        </div>
        <div class="parking-info">
          <div class="parking-name">{{ parking.name }}</div>
          <div class="parking-location">
            <span>{{ parking.geolocation[0] }}, </span>
            <b>{{ parking.geolocation[1] }}</b>
          </div>
          <div class="parking-capacity">Capacité: {{ parking.capacity }} place{{ parking.capacity > 1 ? 's' : '' }}</div>
          <div class="parking-free-time">Temps gratuit: {{ parking.freeTime }} heure{{ parking.freeTime > 1 ? 's' : '' }}</div>
          <button class="parking-button">Me parquer</button>
        </div>
      </div>
      <div v-if="error" class="error-message">{{ error }}</div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useFetchApiCrud } from '../composables/useFetchApiCrud.js';
  
  const { readAll } = useFetchApiCrud('parks');
  const parkings = ref([]);
  const searchQuery = ref('');
  const error = ref(null);
  
  const fetchParkings = async () => {
    try {
      parkings.value = await readAll();
    } catch (err) {
      error.value = err.message;
    }
  };
  
  const filteredParkings = computed(() => {
    return parkings.value.filter(parking => 
      parking.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
  
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
    flex-wrap: wrap;
    justify-content: center; /* Centrer les éléments */
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
    max-width: 400px;
  }
  
  .search-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px; /* Ajustez la taille de l'icône si nécessaire */
    height: 20px;
  }
  
  .search-bar {
    width: 100%;
    padding: 10px 10px 10px 40px; /* Espace pour l'icône de loupe */
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
    max-width: 400px; /* Taille maximale des cartes */
    height: 150px; /* Hauteur fixe des cartes */
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