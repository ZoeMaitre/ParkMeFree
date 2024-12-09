<template>
    <div class="signup-form">
        <h2>Créer un compte</h2>
        <form @submit.prevent="handleSubmit">

            <div>
                <label for="firstname">Prénom:</label>
                <input type="text" id="firstname" v-model="firstname" required />
            </div>
            <div>
                <label for="lastname">Nom:</label>
                <input type="text" id="lastname" v-model="lastname" required />
            </div>
            <div>
                <label for="username">Nom d'utilisateur:</label>
                <input type="text" id="username" v-model="username" required />
            </div>
            <div>
                <label for="email">Email:</label>
                <input type="email" id="email" v-model="email" required />
            </div>
            <div>
                <label for="password">Mot de passe:</label>
                <input type="password" id="password" v-model="password" required />
            </div>
            <button type="submit">S'inscrire</button>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            firstname: '',
            lastname: '',
            username: '',
            email: '',
            password: ''
        };
    },
    methods: {
        async handleSubmit() {
            // Logique pour gérer la soumission du formulaire
            const userData = {
                firstname: this.firstname,
                lastname: this.lastname,
                username: this.username,
                email: this.email,
                password: this.password
            };
            console.log('User Data:', userData);
            // Vous pouvez ajouter ici une requête pour envoyer les données à votre APi

            try {
                const response = await fetch(import.meta.env.VITE_API_URL + 'users/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                console.log('Success:', result);
                // Traitez la réponse de l'API ici (par exemple, rediriger l'utilisateur, afficher un message de succès, etc.)
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
                // Gérez les erreurs ici (par exemple, afficher un message d'erreur à l'utilisateur)
            }

        }
    }
};
</script>

<style scoped>
.signup-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 1em;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.signup-form div {
    margin-bottom: 1em;
}

.signup-form label {
    margin-bottom: .5em;
    color: #ffffff;
    display: block;
}

.signup-form input {
    border: 1px solid #CCCCCC;
    padding: .5em;
    font-size: 1em;
    width: 100%;
    box-sizing: border-box;
}

.signup-form button {
    padding: 0.7em;
    color: #fff;
    background-color: #007BFF;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.signup-form button:hover {
    background-color: #0056b3;
}
</style>