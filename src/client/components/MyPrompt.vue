<template>
  <v-dialog v-model="show" width="auto" persistent>
    <v-card>
      <v-card-title class="text-h5">
        {{ title }}
      </v-card-title>

      <v-card-text>
        <slot />
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="green-darken-1" variant="text" @click="cancel">
          {{ cancelText }}
        </v-btn>

        <v-btn color="red-darken-1" variant="text" @click="confirm">
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { ref } from 'vue'

  const props = defineProps(['cancelText', 'confirmText', 'title'])
  const emit = defineEmits(['cancel', 'confirm'])
  const show = ref(false)

  function cancel() {
    emit('cancel')
  }

  function confirm() {
    emit('confirm')
  }

  defineExpose({
    show() {
      show.value = true
    },
    hide() {
      show.value = false
    },
  })
</script>
