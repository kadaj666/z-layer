<template>
<div class="q-gutter-sm row items-center no-wrap">
    <q-btn round dense flat color="white" :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'" @click="$q.fullscreen.toggle()" v-if="$q.screen.gt.sm">
    </q-btn>
    <div class="q-pa-md">
        <q-btn round flat>
            <q-avatar size="26px">
                <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
            <q-menu>
                <div class="row no-wrap q-pa-md">
                    <div class="column items-center">
                        <q-avatar size="72px">
                            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
                        </q-avatar>
                        <div class="text-subtitle1 q-mt-md q-mb-xs"></div>
                        <q-btn color="primary" label="Logout" push size="sm" v-close-popup @click="logout()" />
                    </div>
                </div>
            </q-menu>
        </q-btn>
    </div>
</div>
</template>

<script>
import {
    defineComponent,
    ref,
    computed
} from 'vue'

import {
    useStore
} from 'vuex'


import {
    api
} from 'boot/axios'
import {
    Notify
} from 'quasar'


export default defineComponent({
    name: "TopMenu",
    components: {
        
    },
    setup() {
        const store = useStore()
        return {
          
        }
    },
    mounted: function () {
    },
    methods: {
        logout() {
            localStorage.setItem('isAuthenticated', false)
            localStorage.setItem('username', "")
            localStorage.setItem('password', "")
            localStorage.setItem('server', "")
            localStorage.setItem('api_key', "")
            this.$router.push('/login')
        }
    },
    beforeCreate() {
        this.$store.commit('initializeStore')
    },

})
</script>

<style scoped>

</style>
