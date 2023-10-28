<template>

    <v-sheet
        class="mx-auto mt-8"
        max-width="400"
        rounded="lg"
    >
        <my-file-list 
            ref="zipList"
            v-if="showZiplist"
            @clicked="downloadZip" 
            @alt-clicked="removeZip"
        ></my-file-list>
    </v-sheet>

    <a href="#" ref="anchor"></a>

</template>

<script setup>
    import { ref, inject, onMounted } from 'vue'

    const service = inject('service')
    const zipList = ref(null)
    const showZiplist = ref(true)
    const canRemoveItems = ref(false)
    const anchor = ref(null)
    const items = ref([])
    const isAdmin = true

    function downloadZip(data) {
        const item = items.value[data.index]
        anchor.value.setAttribute('href', item.value)
        anchor.value.click()
    }

    function removeZip(data) {
        const item = items.value[data.index]
        console.log('want to remove ' + item.text + '?', item.value)
    }

    function fetchZips(argument) {
        service.getZipList()
        .then(files => {
            if (isAdmin)
                files.forEach(item => (item.alt = true) && (item.altIcon = 'mdi-close'))
            items.value = files
            zipList.value.load(items.value)
        })
    }

// onMounted(() => {
    fetchZips()
// })

</script>

<style scoped></style>