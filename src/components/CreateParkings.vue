<template>
    <div class="add-parkings-container">
        <div class="title">Créer un Parking</div>
        <div class="background"></div>
        <form @submit.prevent="handleSubmit" class="add-parkings-form">
            <div class="form-group">
                <label for="name" class="label">Nom du parking:</label>
                <input type="text" id="name" v-model="name" class="input" required />
            </div>
            <div class="form-group">
                <label for="location" class="label">Emplacement:</label>
                <input type="text" id="location" v-model="geolocation" class="input" required />
            </div>
            <div class="form-group">
                <label for="height" class="label">Hauteur:</label>
                <input type="number" id="height" v-model="height" class="input" required />
            </div>
            <div class="form-group">
                <label for="capacity" class="label">Capacité:</label>
                <input type="number" id="capacity" v-model="capacity" class="input" required />
            </div>
            <div class="form-group">
                <label for="duration" class="label">Durée du parking gratuit:</label>
                <input type="time" id="duration" v-model="freeTime" class="input" required />
            </div>
            <div class="form-group">
                <label for="picture" class="label">Image:</label>
                <input type="file" id="picture" @change="handleImageUpload" class="input" required />
            </div>
            <div class="button-group">
                <div class="back-icon-wrapper" @click="goBack">
                    <span class="material-symbols-outlined back-icon">arrow_left_alt</span>
                </div>
                <button type="submit" class="submit-button">Créer</button>
            </div>
        </form>
        <div v-if="error" class="error-message">{{ error }}</div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useFetchApiCrud } from '../composables/useFetchApiCrud.js';

const router = useRouter();
const { create } = useFetchApiCrud('parks/create');

const name = ref('');
const height = ref(0);
const geolocation = ref('');
const capacity = ref(0);
const freeTime = ref('');
const picture = ref(null);
const error = ref(null);
const errors = ref({});

const validateForm = () => {
    errors.value = {};
    if (!name.value) errors.value.name = 'Nom du parking requis';
    if (!geolocation.value) errors.value.geolocation = 'L\'adresse est requise';
    if (!capacity.value) errors.value.capacity = 'Le nombre de place est requis';
    if (!freeTime.value) errors.value.freeTime = 'La durée de la gratuité du parking est requise';
    if (!picture.value) errors.value.picture = 'L\'image du parking est requise';
    if (!height.value) errors.value.height = 'La hauteur du parking est requise';
    return Object.keys(errors.value).length === 0;
};

const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        picture.value = file;
    }
};

const handleSubmit = async () => {
    if (!validateForm()) return;

    console.log('submit');
    try {
        const formData = new FormData();
        formData.append('name', name.value);
        formData.append('geolocation', geolocation.value);
        formData.append('capacity', capacity.value);
        formData.append('freeTime', freeTime.value);
        formData.append('height', height.value);
        formData.append('picture', picture.value);


        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('user_id');
        if (!token || !userId) {
            throw new Error('Jeton d\'authentification non trouvé');
        }

        const response = await create(FormData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            }

        });
        console.log('Parking crée:', response);
        if (!response.ok) {
            throw new Error('Réponse de l\'API invalide : ID voiture non trouvé');
        }
        localStorage.setItem('parks_id', response._id); // Stocker l'ID de le parking dans le localStorage
        router.push('/parkings'); // Rediriger vers la page des parkings après l'ajout de la voiture
    } catch (err) {
        console.error('Erreur lors de l\'ajout du parking:', err);
        error.value = err;
    }
};

const goBack = () => {
    router.back();
};
</script>

<style scoped>
.add-parkings-container {
    width: 100%;
    height: 100%;
    position: relative;
    background-color: #a9c8c9;
    overflow: auto;
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
    border-top-left-radius: 25px;
    border-top-right-radius: 25px;
    background-color: #d9d9d9;
    width: 100%;
    height: 90%;
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
    /* max-width: 400px; */
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

.add-parkings-form {
    display: flex;
    flex-direction: column;
    gap: 2vh;
    width: 90%;
    max-width: 320px;
    z-index: 2;
    margin-top: 50vh;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 1vh;
}

.label {
    color: #68a2a4;
    font-size: 1.1rem;
    font-family: 'Lexend', sans-serif;
    font-weight: 500;
    line-height: 1.5em;
}

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
    margin: 10px auto;
    background-color: #68a2a4;
    border: 1px solid #68a2a4;
    color: #fffaf5;
    cursor: pointer;
    transition: background 0.3s ease;
}

.submit-button:hover {
    background: #5b8e8f;
}

.button-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 320px;
    margin: 10px auto;
}

.back-icon-wrapper {
    width: 40px;
    height: 40px;
    background-color: #A9C8C9;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.back-icon {
    font-size: 24px;
    color: white;
}

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

    .background {
        top: 30vh;
        height: 90%;
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

    .add-parkings-form {
        margin-top: 50vh;
    }
}

@media (max-width: 768px) {
    .label {
        font-size: 0.9rem;
    }

    .background {
        top: 35vh;
        height: 90%;
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
        top: 2vh;
    }

    .add-parkings-form {
        margin-top: 60vh;
    }
}
</style>
