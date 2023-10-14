<template>

  <v-divider class="mb-4"></v-divider>

  <v-form action="/upload" method="post" enctype="multipart/form-data" @submit.prevent="submit($event)" ref="form">

    <p class="mb-4">

      <v-file-input 
        :rules="fileRules" 
        :label="fileLabel" 
        multiple 
        variant="underlined"
        id="filer"
        name="filer"
        accept="font/*"
      ></v-file-input>
      <br>
      <v-text-field 
        :rules="textRules" 
        :label="nameLabel" 
        variant="underlined"
        id="nyttnavn"
        name="nyttnavn"
      ></v-text-field>
    </p>

    <v-divider class="mb-4"></v-divider>

    <div class="text-end">
      <v-btn
        variant="outlined"
        width="120"
        height="40"
        type="submit"
      >
        <v-icon icon="mdi-transfer-down" size="32"></v-icon>
      </v-btn>
    </div>

  </v-form>

</template>

<script setup>

  import { ref } from 'vue'

  const fileRules = ref([value => value && value.length > 0 && value[0] instanceof File || props.fileErrorLabel])
  const textRules = ref([value => value && value.length > 0 || props.nameErrorLabel])
  const props = defineProps(['fileLabel', 'nameLabel', 'fileErrorLabel', 'nameErrorLabel'])
  const emit = defineEmits(['submitted'])
  const form = ref(null)

  async function submit(event) {
    const { valid } = await form.value.validate()
    if (!valid)
      return
    const data = new FormData(event.target)
    emit('submitted', data)
  }

  defineExpose({
    reset() {
      form.value.reset()
    }
  })

</script>