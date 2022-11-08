<template>
<div v-if="data">
    <q-card-section class="bg-blue-grey-8 text-white">
        <q-item>
            <q-item-section>
                <q-item-label class="text-h6 text-uppercase	">{{data.name}}</q-item-label>
                <q-item-section top class="col-3 gt-sm">
                    <q-item-label class="q-mt-sm">Creation time: {{creationTime}}</q-item-label>
                </q-item-section>
            </q-item-section>
            <q-item-section top side>
                <q-item-label>
                    <q-chip square color="secondary" text-color="white">
                        <q-avatar color="primary" text-color="white">ID:</q-avatar>
                        {{network}}
                    </q-chip>
                </q-item-label>
                <q-item-label>
                    <q-chip square color="light-green-8" text-color="white" icon="lock" v-if="data.private==true">
                        Private
                    </q-chip>
                    <q-chip square color="light-blue-8" text-color="white" icon="public" v-else>
                        Public
                    </q-chip>
                </q-item-label>
            </q-item-section>
        </q-item>

    </q-card-section>

    <div class="q-md q-gutter-md">
        <q-card>
            <q-toolbar class="bg-grey-2">
                <q-tabs v-model="tab" @update:modelValue="SetTab(tab)" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify" narrow-indicator>
                    <q-tab name="settings" label="Settings" />
                    <q-tab name="members" label="Members" />
                    <q-tab name="rules" label="rules" />
                </q-tabs>
            </q-toolbar>

            <q-tab-panels v-model="tab" animated>
                <q-tab-panel name="settings">
                    <network-settings :data="data" class="q-mt-sm" @event="updateTable"></network-settings>
                </q-tab-panel>

                <q-tab-panel name="members">
                    <div class="text-h6">Members</div>
                    <network-members :membersList="membersList" :network="network" class="q-mt-sm"></network-members>
                </q-tab-panel>
                <q-tab-panel name="rules">
                    <div class="text-h6">Rules</div>
                    <div class="q-pa-md">
                        <q-banner inline-actions class="text-white bg-info">
                            Rules will be added later
                        </q-banner>
                    </div>
                </q-tab-panel>
            </q-tab-panels>
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
var membersList = ref([])
var tab = ref()
const store = useStore()
export default defineComponent({
    name: "NetworkTable",
    props: ['network'],
    components: {
        NetworkSettings: defineAsyncComponent(() => import('components/details/NetworkSettings')),
        NetworkMembers: defineAsyncComponent(() => import('components/details/NetworkMembers')),
    },
    mounted: function () {
        this.data = null
        this.tab = this.$store.state.tab
    },
    setup(props) {
        Loading.show()
        var server = localStorage.getItem('server')
        var api_key = localStorage.getItem('api_key')
        var creationTime = ref("")
        var networkId = props.network
        var membersList = ref([])
        api.get(`/controller/network/${props.network}?rhost=${server}&x-zt1-auth=${api_key}`, {
                timeout: 5000
            })
            .then(response => {
                data.value = response.data
                creationTime.value = date.formatDate(response.data.creationTime, 'YYYY-MM-DD HH:mm:ss')
                Loading.hide()
            })
            .catch(function (error) {
                Loading.hide()
                Notify.create({
                    type: 'negative',
                    position: 'top',
                    html: true,
                    progress: true,
                    message: `<strong> ${error}</strong>`
                })
            })

        api.get(`/controller/network/${props.network}/member?rhost=${server}&x-zt1-auth=${api_key}`, {
                timeout: 5000
            })
            .then(response => {
  
                for (const [key, value] of Object.entries(response.data)) {
                    membersList.value.push(key)
                }
                Loading.hide()
            })
            .catch(function (error) {
                Loading.hide()
                Notify.create({
                    type: 'negative',
                    position: 'top',
                    html: true,
                    progress: true,
                    message: `<strong> ${error}</strong>`
                })
            })

        return {
            data,
            creationTime,
            networkId,
            membersList,
            tab
        }
    },
    methods: {
        SetTab(tab) {
            localStorage.setItem('tab', tab)
        },
        updateTable() {
            var server = localStorage.getItem('server')
            var api_key = localStorage.getItem('api_key')
            var creationTime = ref("")
            api.get(`/controller/network/${this.networkId}?rhost=${server}&x-zt1-auth=${api_key}`, {
                    timeout: 5000
                })
                .then(response => {
                    data.value = response.data
                    creationTime.value = date.formatDate(response.data.creationTime, 'YYYY-MM-DD HH:mm:ss')
                    Loading.hide()
                })
                .catch(function (error) {
                    Loading.hide()
                    Notify.create({
                        type: 'negative',
                        position: 'top',
                        html: true,
                        progress: true,
                        message: `<strong> ${error}</strong>`
                    })
                })
        }
    }
})
</script>
