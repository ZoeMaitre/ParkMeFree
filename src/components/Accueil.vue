<template>
  <div class="login">
    <div class="login-child"></div>
    <div class="title">ParkMeFree</div>
    <div class="buttons-container">
      <div class="login-item">
        <router-link to="/signUp" class="button-link">S’inscrire</router-link>
      </div>
      <div class="ou">ou</div>
      <div class="login-inner">
        <router-link to="/login" class="button-link">Se connecter</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #a9c8c9;
  overflow: hidden;
  text-align: center;
  font-size: 16px;
  color: #d9d9d9;
  font-family: 'Lexend', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.login-child {
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

.buttons-container {
  position: absolute;
  top: 40vh;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-item, .login-inner {
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
  margin: 10px 0;
}

.login-item {
  background-color: #68a2a4;
  border: 1px solid #68a2a4;
}

.login-inner {
  background-color: #d9d9d9;
  border: 2px solid #68a2a4;
  color: #68a2a4;
}

.button-link {
  color: inherit;
  text-decoration: none;
  font-size: 1em;
  font-family: 'Lexend', sans-serif;
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

.ou {
  font-size: 1.5vw;
  color: #68a2a4;
  display: inline-block;
  width: auto;
  height: auto;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  text-align: center;
  margin: 5px 0;
}

@media (max-width: 1024px) {
  .login-child {
    top: 30vh;
    height: 80%;
  }
  .login-item, .login-inner {
    width: 60vw;
    height: 8vh;
  }
  .title {
    font-size: 8vw;
  }
  .ou {
    font-size: 2vw;
  }
}

@media (max-width: 768px) {
  .login-child {
    top: 30vh;
    height: 80%;
  }
  .login-item, .login-inner {
    width: 70vw;
    height: 8vh;
  }
  .title {
    font-size: 10vw;
  }
  .ou {
    font-size: 3.5vw;
  }
}
</style>