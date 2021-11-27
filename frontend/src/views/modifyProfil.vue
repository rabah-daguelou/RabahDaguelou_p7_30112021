<template>
  <div class="modifyProfil">
    <div id="input-card">
      <input
        v-model="email"
        class="email"
        type="email"
        placeholder=" Votre E-mail"
        required="required"
      />
    </div>

    <div id="input-card">
      <input
        v-model="password"
        class="password"
        type="password"
        placeholder="Votre mot de passe"
        required="required"
      />
    </div>

    <div id="input-card">
      <input
        v-model="name"
        class="name"
        type="text"
        placeholder="Votre nom"
        required="required"
      />
    </div>
  </div>
</template>