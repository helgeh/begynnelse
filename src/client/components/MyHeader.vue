<template>

    <div class="text-center">

        <v-icon
            class="mb-5"
            color="brown-lighten-1"
            icon="mdi-dog"
            size="112"
        ></v-icon>

        <h1 class="mb-4" :title="version">{{ heading }}</h1>

    </div>

</template>

<script setup>

    defineProps(['heading', 'version'])

</script>