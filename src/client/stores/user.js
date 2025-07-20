import { ref, shallowRef, computed } from 'vue'
import { defineStore } from 'pinia'
import { useFetch } from '@vueuse/core'

import { attachTokenHeader } from '.'

export const useUserStore = defineStore('user', () => {

  const user = shallowRef({name: '', email: ''})
  const isLoggedIn = shallowRef(false)
  const notVerified = shallowRef(false)
  const loginError = shallowRef('')

  async function register(usr, pw) {
    const { data, error, statusCode } = await useFetch('/blimed').post({ usr, pw }).json()
    if (data.value) {
      loginError.value = 'Verifisér din epost ved å klikke linken vi har sendt'
      notVerified.value = false
    }
    if (error.value) {
      loginError.value = 'Kunne ikke registrere'
      if (statusCode.value === 409)
        loginError.value = 'Bruker finnes fra før'
    }
  }

  async function verify(usr, pw) {
    const { data, error, statusCode } = await useFetch('/blimed/godkjenn').post({ usr, pw }).json()
    if (data.value) {
      loginError.value = 'Du skal nå ha fått en epost'
      notVerified.value = false
    }
    if (error.value) {
      loginError.value = 'Kunne ikke sende godkjenning'
    }
  }
  
  async function loadme() {
    const { data, error } = await useFetch('/meg', {
      beforeFetch: attachTokenHeader,
      afterFetch: function (ctx) {
        isLoggedIn.value = !!(ctx.data.email)
        console.log('isLoggedIn ? ', isLoggedIn.value, ctx.data.email)
        return ctx
      }
    }).get().json()
    if (data.value)
      user.value = data.value
    return error
  }

  async function login(usr, pw) {
    const { data, error, statusCode } = await useFetch('/heisann').post({ usr, pw }).json()
    if (data.value) {
      user.value = { email: data.value.email, name: data.value.name }
      localStorage.setItem('mitt-merke', data.value.token)
      isLoggedIn.value = true
      notVerified.value = false
      loginError.value = ''
    }
    if (statusCode.value === 404) {
      loginError.value = 'Fant ikke bruker'
    }
    if (statusCode.value === 403) {
      notVerified.value = true
      loginError.value = 'Ikke godkjent enda'
    }
    if (statusCode.value === 401) {
      loginError.value = 'Feil brukernavn/passord'
    }
    return error
  }

  function logout() {
    localStorage.removeItem('mitt-merke')
    isLoggedIn.value = false
    user.value.email = ''
    user.value.name = ''
  }

  async function deleteme() {
    const { data, error, statusCode } = await useFetch('/slettmeg', {
      beforeFetch: attachTokenHeader
    }).post().json()
    if (error.value) {
      console.log('feil under sletting av bruker', error.value)
    }
    logout()
  }

  loadme()
  
  return {

    // state
    user,
    isLoggedIn,
    notVerified,
    loginError,

    // getters // TODO: move loginError (and others?) to be accessors and stop changing values outside the store

    // methods
    register,
    login,
    logout,
    deleteme,
    verify
  }

})
