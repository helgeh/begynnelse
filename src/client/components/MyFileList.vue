<template>

    <v-card class="mx-auto">

        <v-list 
            density="compact" 
            v-model:selected="selected" 
            ref="fileList"
        >

            <v-list-item
                v-for="(item, i) in fileItems"
                :key="i"
                :value="item"
                :active="activeIndex === i"
                color="primary"
                select-strategy="classic"
                @click="onClick(i)"
            >

                <v-list-item-title v-text="item.text"></v-list-item-title>

                <template v-slot:append>
                    <v-btn 
                        rounded="xl" 
                        size="small" 
                        color="deep-orange-lighten-1" 
                        variant="outlined" 
                        class="ms-2" 
                        @click.stop="onClickAlt(i)"
                        v-if="item.alt"
                    >
                        <v-icon :icon="item.altIcon"></v-icon>
                    </v-btn>
                </template>

            </v-list-item>

        </v-list>

    </v-card>

</template>

<script setup>

    import { ref, watch } from 'vue'

    defineProps({activeIndex: {type: Number}})

    const emit = defineEmits(['clicked', 'altClicked'])
    const fileList = ref(null)
    const fileItems = ref([])
    const selected = ref([])
    // const activeIndex = ref(0)

    function onClick (index) {
        const item = fileItems.value[index]
        emit('clicked', {index, value: item.value})
    }

    function onClickAlt (index) {
        const item = fileItems.value[index]
        emit('altClicked', {index, value: item.value})
    }

    // watch the <selected> array and de-select everything always
    watch(selected, async (cur, old) => {
        if (cur.length > 0) {
            activeIndex.value = fileItems.value.indexOf(cur[0], false)
            fileList.value.select(activeIndex.value)
        }
    })

    defineExpose({
        load(files) {
            fileItems.value = files
        }
    })

</script>

<style scoped>
    .v-btn--size-small {
        min-width: 40px;
    }
</style>
