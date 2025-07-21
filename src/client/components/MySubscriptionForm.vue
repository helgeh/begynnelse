<template>
    <v-btn 
      v-if="!isLoggedIn"
      @click="overlay = true"
      class="mx-auto"
      prepend-icon="mdi-login"
    >
      Slipp meg inn
    </v-btn>
    <v-spacer></v-spacer>
    <v-btn 
      v-if="isLoggedIn"
      @click="onDelete"
      :prepend-icon="warned ? 'mdi-alert-octagram' : 'mdi-alert'"
      :size="warned ? 'small' : 'x-small'"
      :color="warned ? 'warning' : 'normal'"
      variant="tonal" class="me-2"
      ref="delete-btn"
    >
      {{ warned ? 'SLETT MEG?!' : 'Slett meg' }}
    </v-btn>
    <v-btn 
      v-if="isLoggedIn"
      @click="emit('logout')"
      variant="outlined"
      prepend-icon="mdi-hand-wave"
    >
      Logg ut
    </v-btn>
    
    <v-dialog max-width="600" v-model="overlay">

      <v-card
        prepend-icon="mdi-lock"
        class="px-3 mx-auto"
        :title="register ? 'Bli med!' : 'Slipp meg inn'"
        min-width="320"
        max-width="450"
      >
        <v-text-field
          v-model="usr"
          density="compact"
          label="brukernavn"
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
          label="passord"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="pwVisible = !pwVisible"
          @keypress="onKeyPress($event, 1)"
          ref="second-input"
        ></v-text-field>
        <v-alert type="error" variant="outlined" v-if="loginError">
          Ouf: {{ loginError }}
        </v-alert>
        <template v-slot:actions>

          <v-btn v-if="notVerified" @click="emit('verify')" size="small" variant="tonal">
            Send epost
          </v-btn>

          <v-btn 
            v-if="!isLoggedIn && !notVerified"
            @click="register = !register"
            size="x-small"
            color="normal"
            variant="tonal"
          >
            {{ register ? 'Logge inn' : 'Registrere'}}
          </v-btn>

          <v-spacer></v-spacer>

          <v-btn @click="overlay = false" variant="plain" color="">Avbryt</v-btn>

          <v-btn @click="onSubmit()" variant="tonal" color="success">OK</v-btn>
        </template>
      </v-card>

    </v-dialog>

</template>

<script setup>
  import { shallowRef, useTemplateRef, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import { onClickOutside } from '@vueuse/core'

  import { useUserStore } from '../stores'

  const emailReg = /\S+\@\S+\.\S+/

  const emit = defineEmits(['register', 'login', 'logout', 'verify', 'delete'])

  const userStore = useUserStore()
  const { isLoggedIn, notVerified, loginError } = storeToRefs(userStore)

  const firstInput = useTemplateRef('first-input')
  const secondInput = useTemplateRef('second-input')
  const deleteBtn = useTemplateRef('delete-btn')
  const usr = shallowRef('')
  const pw = shallowRef('')
  const pwVisible = shallowRef(false)
  const sorry = shallowRef('')
  const register = shallowRef(false)
  const warned = shallowRef(false)
  const overlay = shallowRef(false)

  watch(isLoggedIn, (newState, oldState) => {
    if (newState && overlay.value) {
      sorry.value = ''
      usr.value = ''
      pw.value = ''
      pwVisible.value = false
      register.value = false
      warned.value = false
      overlay.value = false
    }
  })

  onClickOutside(deleteBtn, event => {
    if (warned.value)
      warned.value = false
  })

  async function onSubmit() {
    if (usr.value.length < 1 || pw.value.length < 1)
      return loginError.value = 'Du må iallfall skrive NOE her...'
    if (!emailReg.test(usr.value))
      return loginError.value = 'Brukernavn må nødt å være epost'
    loginError.value = ''
    if (register.value)
      emit('register', usr.value, pw.value)
    else
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
