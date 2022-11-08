<template>
<q-list>

    <template v-for="menu_item, key in menu">
        <q-item :to="'/'+key" active-class="text-orange" @click="setServer(menu_item)">
            <q-item-section>
                <q-item-label>{{key}}</q-item-label>
            </q-item-section>
        </q-item>

    </template>
</q-list>
</template>

<script>
import {
    defineComponent,
    computed
} from 'vue'

import {
    useStore
} from 'vuex'

import settings from 'assets/settings.json'

export default defineComponent({
    name: "LeftMenu",
    setup() {
        const store = useStore()
        return {
            menu: computed(() => store.state.menu),
        }
    },

    beforeCreate() {
        const store = useStore()
        store.state.menu = settings.SERVERS
        store.state.data = []
    },

    methods: {
        setServer(menu_item) {
            for (var key in menu_item) {
                localStorage.setItem('server', key)
                localStorage.setItem('api_key', menu_item[key])
            }
            
        
        }
    }
})
</script>

<style scoped>

</style>
