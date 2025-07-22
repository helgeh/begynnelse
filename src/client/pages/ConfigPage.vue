<template>
  
  <v-card variant="text" class="mx-auto ma-8 pa-5"  elevation="0" max-width="800">
    
    <v-card-item :prepend-icon="'mdi-account'">
      <v-card-title>
        <greeter-panel />
      </v-card-title>
    </v-card-item>

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
