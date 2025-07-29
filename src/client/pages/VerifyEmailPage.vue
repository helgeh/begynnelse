<template>
  <v-card class="mx-auto my-8" elevation="16" max-width="344">
    <v-card-item>
      <v-card-title>{{ ok ? "Godkjent!" : err ? "Feil" : "Godkjenner..." }}</v-card-title>

      <v-card-subtitle></v-card-subtitle>
    </v-card-item>

    <v-card-text>
      <p v-if="ok">
        Din epost skal nå være godkjent og du kan logge inn <a href="/config">her</a>.
      </p>
      <v-alert v-else-if="err" type="warning">
        <p>{{ err }}</p>
        <p>&nbsp;</p>
        <p>Du kan gå til login-skjema <a href="/#/my">her</a></p>
      </v-alert>
      <p v-else>
        Sender forespørsel til server om godkjenning av din epost...
        <v-icon icon="fa:fas fa-circle-notch fa-spin"></v-icon>
      </p>
    </v-card-text>

  </v-card>
</template>

<script setup>
  import { shallowRef, ref, inject } from 'vue'
  import { useUrlSearchParams } from '@vueuse/core'

  import { useUserStore } from '../stores'

  const userStore = useUserStore()

  const ok = ref(false)
  const err = ref('')
  const params = useUrlSearchParams('history')
  const { email, token } = params
  if (email && token) {
    userStore.comply(email, token)
      .then(result => {
        ok.value = true
      })
      .catch(error => {
        err.value = 'Kunne ikke godkjenne. Har du allerede godkjent? Har det gått mer enn 5 minutter siden du registrerte?'
      })
  }
  else {
    err.value = 'Mangler info. Forsøk å klikke på linken i eposten igjen.'
  }
</script>

<style scoped></style>
