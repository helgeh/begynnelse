<template>
  <v-alert
    variant="outlined"
    color="warning"
    icon="$warning"
    class="mt-4"
    :title="props.title"
    v-if="alert === 'open'"
    closable
  >
    <slot />

    <template v-slot:close="{ toggle }">
      <v-btn @click="closeAlert(toggle)">
        <v-icon icon="mdi-close" color="warning"></v-icon>
      </v-btn>
    </template>
  </v-alert>
</template>

<script setup>
  import { ref } from 'vue'

  const props = defineProps(['title'])
  const emit = defineEmits(['onClose'])
  const alert = ref('')

  function closeAlert() {
    emit('onClose')
    alert.value = ''
  }

  defineExpose({
    show(msg) {
      alert.value = 'open'
    },
    close() {
      alert.value = ''
    },
  })
</script>
