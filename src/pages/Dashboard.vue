<template>
<q-page v-if="$route.params.key" class="q-pa-sm">
    <q-card-section>
        <div class="row items-center no-wrap">
            <div class="col">
                <q-breadcrumbs>
                    <q-breadcrumbs-el label="Dashboard" icon="widgets" to="/" />
                    <q-breadcrumbs-el :label="$route.params.key" />
                </q-breadcrumbs>
            </div>
        </div>
    </q-card-section>
    <q-card class="q-mt-sm">
        <server-table :key="$route.params.key" class="q-mt-sm"></server-table>
    </q-card>
</q-page>

<q-page v-else class="q-pa-sm">
    <q-card-section>
        <div class="row items-center no-wrap">
            <div class="col">
                <q-breadcrumbs>
                    <q-breadcrumbs-el label="Dashboard" icon="widgets" to="/" />
                </q-breadcrumbs>
            </div>
        </div>
    </q-card-section>
    <div class="row items-center no-wrap">
        <div v-for="menu_item, key in menu" class="q-pa-xs col-xs-6 col-sm-6 col-md-4 col-lg-3">
            <q-card >
                <q-card-section class="bg-blue-grey-10 text-white">
                    <div class="text-h6 text-uppercase">{{key}} </div>
                </q-card-section>
                <q-card-section class="text-left text-blue-grey-8"  v-for="api_key, server in menu_item">
                    <q-item>
                        <q-item-section>
                            <q-item-label caption lines="2">
                                <span>Server address</span>
                            </q-item-label>
                            <q-item-label lines="1">{{server}}</q-item-label>
                        </q-item-section>
                    </q-item>
                     <q-item>
                        <q-item-section>
                            <q-item-label caption lines="2">
                                <span>Api Key</span>
                            </q-item-label>
                            <q-item-label lines="1">{{api_key}}</q-item-label>
                        </q-item-section>
                    </q-item>
                </q-card-section>
                <q-separator />
                <q-card-actions>
                    <q-space />
                    <q-btn align="between" :to="'/'+key" color="light-green-8" icon-right="play_circle_filled" label="Manage" @click="setServer(menu_item)" />
                </q-card-actions>
            </q-card>
        </div>
    </div>
</q-page>
</template>

<script>
import {
    defineComponent,
    defineAsyncComponent,
    computed,
    ref
} from 'vue'
import {
    useStore
} from 'vuex'

import axios from 'axios'

const store = useStore()

export default defineComponent({
    name: 'PageIndex',
    components: {
        ServerTable: defineAsyncComponent(() => import('components/tables/ServerTable')),
    },
    setup() {
        const store = useStore()
        return {
            menu: computed(() => store.state.menu),
        }
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
