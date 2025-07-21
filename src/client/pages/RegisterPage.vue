<template>
  
  <v-card variant="text" :prepend-icon="'mdi-account'" class="mx-auto ma-8 pa-5"  elevation="0" max-width="800">
    
    <template v-slot:title>
      <greeter-panel />
    </template>

    <v-card-text class="py-4">
      <edit-links />
    </v-card-text>

    <v-card-actions class="bg-surface-light">
      <login-panel />
    </v-card-actions>

  </v-card>

</template>

<script setup></script>

<style scoped></style>
