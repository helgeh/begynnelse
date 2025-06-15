<script setup>
    import { computed } from 'vue'
	const props = defineProps(['link', 'size'])
    const ico = computed(() => {
        const domain = props.link.href?.replace('https://', '')
        return `https://favicone.com/${domain}?s=${props.size}`
    })
</script>

<template>
	<v-card
        density="compact"
        :href="link.href"
        :disabled="link.href === null"
        class=""
    >
        <v-card-item class="justify-center">
            <v-avatar 
                class=""
                height="200"
                cover
                :image="ico"
                :size="size"
            ></v-avatar>
        </v-card-item>
        <v-card-text class="pa-1 text-caption text-truncate text-center">
            {{ link.title }}
        </v-card-text>
        <!-- <v-card-text>
            {{`(#${link.index+1}/${link.max})`}}
        </v-card-text> -->
    </v-card>
</template>