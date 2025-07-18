<template>
  <v-dialog v-model="dialog" max-width="400" persistent>
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" class="mx-auto"> Slipp meg inn </v-btn>
    </template>

    <v-card
      prepend-icon="mdi-lock"
      class="px-3"
      title="Slipp meg inn"
      :subtitle="sorry ? 'Ouf: ' + sorry : ''"
    >
      <v-text-field
        v-model="usr"
        density="compact"
        placeholder="brukernavn"
        prepend-inner-icon="mdi-account-check"
        variant="outlined"
      ></v-text-field>
      <v-text-field
        :append-inner-icon="pwVisible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="pwVisible ? 'text' : 'password'"
        v-model="pw"
        density="compact"
        placeholder="passord"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        @click:append-inner="pwVisible = !pwVisible"
      ></v-text-field>
      <template v-slot:actions>

        <v-btn v-if="ikkeGodkjent" @click="onGodkjenn()"> Godkjenn </v-btn>

        <v-spacer></v-spacer>

        <v-btn @click="dialog = false"> Avbryt </v-btn>

        <v-btn @click="onSubmit()"> OK </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { ref, inject } from 'vue'

  const emit = defineEmits(['godkjent'])

  const usr = ref('')
  const pw = ref('')
  const dialog = ref(false)
  const pwVisible = ref(false)
  const sorry = ref('')
  const tilgang = inject('tilgang')
  const ikkeGodkjent = inject('ikkeGodkjent')

  if (tilgang.allerede())
    emit('godkjent')

  async function onSubmit() {
    try {
      await tilgang.heisann(usr.value, pw.value)
      sorry.value = false
      dialog.value = false
      emit('godkjent')
    } catch (error) {
      sorry.value = error.message
    }
  }

  async function onGodkjenn() {
    try {
      tilgang.godkjenn(usr.value, pw.value)
    }
    catch (error) {
      console.log('feil under godkjenn', error.message)
    }
  }
</script>
