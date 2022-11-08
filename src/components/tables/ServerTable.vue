<template>
<div v-if="data">
    <q-card-section class="bg-blue-grey-8 text-white">
        <q-item>
            <q-item-section>
                <q-item-label class="text-h6 text-uppercase	">{{$route.params.key}}</q-item-label>
                <q-item-section top class="col-3 gt-sm">
                    <q-item-label class="q-mt-sm">Server time: {{server_time}}</q-item-label>
                </q-item-section>
            </q-item-section>
            <q-item-section top side>
                <q-chip square color="green" text-color="white" icon="check_circle" v-if="data.online==true">
                    Online
                </q-chip>
                <q-chip square color="red" text-color="white" icon="error" v-else>
                    Offline
                </q-chip>
                <q-item-label class="q-mt-sm">
                    <div class="text-grey-1 q-gutter-xs">
                        Controller version: {{data.version}}
                    </div>
                </q-item-label>
            </q-item-section>
        </q-item>
        <q-expansion-item expand-separator icon="info" label="Controller Settings">
            <q-card>
                <q-card-section class="text-grey-7">
                    <q-list>
                        <q-item>
                            <q-item-section>
                                <q-item-label overline>address</q-item-label>
                                <q-item-label>{{data.address}}</q-item-label>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label overline>allowManagementFrom</q-item-label>
                                <q-item-label v-for="item in data.config.settings.allowManagementFrom" :key="item">
                                    {{ item }};
                                </q-item-label>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label overline>listeningOn</q-item-label>
                                <q-item-label>
                                    <span v-for="item in data.config.settings.listeningOn">
                                        {{ item }};
                                    </span>
                                </q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item>
                            <q-item-section>
                                <q-item-label overline>primaryPort</q-item-label>
                                <q-item-label>{{data.config.settings.primaryPort}}</q-item-label>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label overline>softwareUpdate</q-item-label>
                                <q-item-label>{{data.config.settings.softwareUpdate}}</q-item-label>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label overline>softwareUpdateChannel</q-item-label>
                                <q-item-label>{{data.config.settings.softwareUpdateChannel}}</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item>
                            <q-item-section>
                                <q-item-label overline>portMappingEnabled</q-item-label>
                                <q-item-label>{{data.config.settings.portMappingEnabled}}</q-item-label>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label overline>allowTcpFallbackRelay</q-item-label>
                                <q-item-label>{{data.config.settings.allowTcpFallbackRelay}}</q-item-label>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label overline>tcpFallbackActive</q-item-label>
                                <q-item-label>{{data.tcpFallbackActive}}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-card-section>
            </q-card>
        </q-expansion-item>
    </q-card-section>

    <div class="q-md q-gutter-md">

        <q-card>
            <q-toolbar class="bg-grey-2">
                <q-toolbar-title class="text-white">
                </q-toolbar-title>
                <q-btn outline color="secondary" label="Create new network" @click="CreateNew(data.address)" />
            </q-toolbar>
            <q-card-section v-if="networks.length == 0" class="q-pa-none">
                <div class="q-pa-md">
                    <q-banner inline-actions class="text-white bg-green">
                        You don't have any networks, please create one.
                    </q-banner>
                </div>
            </q-card-section>
            <q-card-section v-else v-for="network in networks" class="q-pa-none">
                <network-details :network="network" :server="$route.params.key" class="q-mt-sm"></network-details>
            </q-card-section>
            <q-separator />
        </q-card>
    </div>
</div>
</template>

<script>
import {
    defineComponent,
    ref,
    computed,
    defineAsyncComponent,
} from 'vue'
import {
    api
} from 'boot/axios'
import {
    useStore
} from 'vuex'
import axios from 'axios'
import {
    Loading,
    date,
    Notify
} from 'quasar'

var data = ref()
var networks = ref([])
var server_time = ref()
var dockerNames = require('docker-names');

export default defineComponent({
    name: "ProvidersTable",
    components: {
        NetworkDetails: defineAsyncComponent(() => import('components/details/NetworkDetails')),
    },
    mounted: function () {
        this.data = null
    },
    setup() {
        
        Loading.show()
        var server = localStorage.getItem('server')
        var api_key = localStorage.getItem('api_key')
        api.get(`/status?rhost=${server}&x-zt1-auth=${api_key}`, {
                timeout: 5000
            })
            .then(response => {
                data.value = response.data
                server_time.value = date.formatDate(response.data.clock, 'YYYY-MM-DD HH:mm:ss')
                Loading.hide()
            })
            .catch(function (error) {
                Loading.hide()
                Notify.create({
                    type: 'negative',
                    position: 'top',
                    html: true,
                    progress: true,
                    message: `<strong> ${error}</strong>: Can't connect to ${server}, check if you use right <strong>Server</strong> and <strong>Api key</strong>`
                })
            })

        api.get(`/controller/network?rhost=${server}&x-zt1-auth=${api_key}`, {
                timeout: 5000
            })
            .then(response => {
                networks.value = response.data
                Loading.hide()
            })
            .catch(function (error) {
                Loading.hide()
                Notify.create({
                    type: 'negative',
                    position: 'top',
                    html: true,
                    progress: true,
                    message: `<strong> ${error}</strong>: Can't retrive networks`
                })
            })
        return {
            data,
            server_time,
            networks
        }
    },
    methods: {
        CreateNew(controllerID) {
            var server = localStorage.getItem('server')
            var api_key = localStorage.getItem('api_key')
            var networkGen = controllerID + '______'
            api
                .post(`/controller/network/${networkGen}?rhost=${server}&x-zt1-auth=${api_key}`, { name: dockerNames.getRandomName() } , {
                    timeout: 5000
                })
                .then(response => {
                    window.location.reload();
                })
                .catch(error => {
                    if (error.response) {
                        for (const property in error.response.data) {
                            Notify.create({
                                type: 'negative',
                                position: 'top',
                                html: true,
                                message: `<strong>${property.toUpperCase()}</strong>: ${error.response.data[property]}`
                            })
                        }
                        console.log(JSON.stringify(error.response.data))
                    } else if (error.message) {
                        console.log(JSON.stringify(error.message))
                    } else {
                        console.log(JSON.stringify(error))
                    }
                })
        },

    }
})
</script>

<style scoped>

</style>
