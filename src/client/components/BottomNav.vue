<template>
  
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

</template>
