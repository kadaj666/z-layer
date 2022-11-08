<template>
<div v-if="membersList.length != 0" v-for="name in membersList">
    <members :member="name" :network="network"></members>
</div>
<div v-else>
    <div class="q-pa-md">
        <q-banner inline-actions class="text-white bg-secondary">
            You don't have any members for this network
        </q-banner>
    </div>
</div>
</template>
<script>
import {
    defineComponent,
    ref,
    defineAsyncComponent,
} from 'vue';

export default defineComponent({
    name: "NetworkMembers",
    props: ['membersList', 'network'],
    components: {
        Members: defineAsyncComponent(() => import('components/cards/Members')),
    },
    setup() {
        return {}
    },
    methods: {}
})
</script>
