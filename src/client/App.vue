<template>
  <!-- <v-app class="throw-ups"> -->
  <v-app class="">
    <!-- <CatTax /> -->

    <div class="page-content">
      <RouterView />
    </div>

    <RouterView name="bottom" />
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
