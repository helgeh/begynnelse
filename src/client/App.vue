<template>
  <!-- <v-app class="throw-ups"> -->
  <v-app class="">
    <!-- <CatTax /> -->

    <div class="page-content">
      <RouterView />
    </div>

    <v-bottom-navigation mode="shift" color="primary">
      <v-btn to="/">
        <v-icon>mdi-list-box</v-icon>
        <span>Links</span>
      </v-btn>

      <v-btn to="/config">
        <v-icon>mdi-playlist-edit</v-icon>
        <span>Config</span>
      </v-btn>

      <!-- <v-btn to="/mira">
        <v-icon>mdi-dog</v-icon>
        <span>Mira</span>
      </v-btn> -->

      <v-btn to="/zips">
        <v-icon>mdi-folder-zip</v-icon>
        <span>Zips</span>
      </v-btn>

      <v-btn to="/videos">
        <v-icon>mdi-movie</v-icon>
        <span>Movies</span>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script setup></script>

<style scoped>
  .page-content {
    position: relative;
    margin-bottom: 50px;
  }

  /*.logo {
height: 6em;
padding: 1.5em;
will-change: filter;
transition: filter 300ms;
}
.logo:hover {
filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
filter: drop-shadow(0 0 2em #42b883aa);
}*/
</style>
