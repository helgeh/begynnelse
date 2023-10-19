<template>
  
  <v-card
    class="mx-auto mt-8"
    max-width="400"
    rounded="lg"
    elevation="11"
    v-if="zipItems.length > 0"
  >

    <v-list 
      density="compact" 
      v-model:selected="selected" 
      ref="zipList"
    >

      <v-list-item
        v-for="(item, i) in zipItems"
        :key="i"
        :value="item"
        color="primary"
        select-strategy="classic"
        @click="onClickZip(i)"
      >

        <v-list-item-title v-text="item.text"></v-list-item-title>

        <template v-slot:append>
          <v-btn 
            rounded="xl" 
            size="small" 
            color="deep-orange-lighten-1" 
            variant="outlined" 
            class="ms-2" 
            @click.stop="onClickRemoveZip(i)"
            v-if="props.canRemove"
          >
            <v-icon icon="mdi-close"></v-icon>
          </v-btn>
        </template>

      </v-list-item>

    </v-list>
    
  </v-card>

</template>

<script setup>

  import { ref, watch, inject } from 'vue'

  const service = inject('service')
  const emit = defineEmits(['download', 'slett'])
  const props = defineProps(['canRemove'])
  const zipList = ref(null)
  const zipItems = ref([])
  const selected = ref([])

  function onClickZip (index) {
    const item = zipItems.value[index]
    emit('download', item.value)
  }

  function onClickRemoveZip (index) {
    const item = zipItems.value[index]
    emit('slett', item.value)
  }

  function fetchZips(argument) {
    service.getZipList()
      .then(files => {
        zipItems.value = files
      })
  }

  fetchZips()

  // watch the <selected> array and de-select everything always
  watch(selected, async (cur, old) => {
    if (cur.length > 0) {
      zipList.value.select(zipItems.value.indexOf(cur[0], false))
    }
  })

  defineExpose({
    reload() {
      fetchZips()
    }
  })
  
</script>

<style scoped>
  .v-btn--size-small {
    min-width: 40px;
  }
</style>
