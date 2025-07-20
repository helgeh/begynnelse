<template>
  <div>
    <v-btn v-if="!isLoggedIn" @click="overlay = true" class="mx-auto">Slipp meg inn</v-btn>
    <v-btn v-if="isLoggedIn" @click="emit('logout')" class="me-2">Logg ut</v-btn>
    <v-btn v-if="isLoggedIn" @click="onDelete" :size="warned ? 'small' : 'x-small'" :color="warned ? 'warning' : 'normal'" variant="tonal">{{ warned ? 'SLETT MEG?!' : 'Slett meg' }}</v-btn>
    
    <v-dialog max-width="400" v-model="overlay">

      <v-card
        prepend-icon="mdi-lock"
        class="px-3"
        title="Slipp meg inn"
        :subtitle="loginError ? 'Ouf: ' + loginError : ''"
      >
        <v-text-field
          v-model="usr"
          density="compact"
          placeholder="brukernavn"
          prepend-inner-icon="mdi-account-check"
          variant="outlined"
          @keypress="onKeyPress($event, 0)"
          :autofocus="true"
          ref="first-input"
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
          @keypress="onKeyPress($event, 1)"
          ref="second-input"
        ></v-text-field>
        <template v-slot:actions>

          <v-btn v-if="notVerified" @click="emit('verify')"> Godkjenn </v-btn>

          <v-spacer></v-spacer>

          <v-btn @click="overlay = false"> Avbryt </v-btn>

          <v-btn @click="onSubmit()"> OK </v-btn>
        </template>
      </v-card>

    </v-dialog>

  </div>

</template>

<script setup>
  import { shallowRef, useTemplateRef, watch } from 'vue'
  import { storeToRefs } from 'pinia'

  import { useUserStore } from '../stores'

  const emit = defineEmits(['login', 'logout', 'verify', 'delete'])

  const userStore = useUserStore()
  const { isLoggedIn, notVerified, loginError } = storeToRefs(userStore)

  const firstInput = useTemplateRef('first-input')
  const secondInput = useTemplateRef('second-input')
  const usr = shallowRef('')
  const pw = shallowRef('')
  const pwVisible = shallowRef(false)
  const sorry = shallowRef('')
  const warned = shallowRef(false)
  const overlay = shallowRef(false)

  watch(isLoggedIn, (newState, oldState) => {
    if (newState && overlay.value) {
      sorry.value = false
      usr.value = ''
      pw.value = ''
      overlay.value = false
    }
  })

  async function onSubmit() {
    if (usr.value.length < 1 || pw.value.length < 1)
      return loginError.value = 'Du må iallfall skrive NOE her...'
    emit('login', usr.value, pw.value)
  }

  async function onDelete() {
    if (!warned.value) {
      warned.value = true
      return
    }
    warned.value = false
    emit('delete')
  }

  async function onKeyPress(evt, id) {
    if (evt.code === 'Enter') {
      if (id === 0) 
        secondInput.value.focus()
      else if (id === 1)
        onSubmit()
    }
  }
</script>
