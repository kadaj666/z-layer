<template>
<q-list bordered v-if="member">
    <q-item>
        <q-item-section avatar>
            <q-btn v-if="!data.authorized" padding="none" text-color="white" color="orange-8" icon="check_box_outline_blank" @click="AllowAddress"></q-btn>
            <q-btn v-else padding="none" text-color="white" color="light-green-8" icon="check_box" @click="DenyAddress"></q-btn>
        </q-item-section>
        <q-item-section>
            <q-item-label lines="1" class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase">
                <span>{{data.address}}</span> <span class="text-caption">V.{{data.vMajor}}.{{data.vMinor}}.{{data.vRev}}</span>
            </q-item-label>
            <q-item-label caption>Created: {{creationTime}}</q-item-label>
        </q-item-section>
        <q-item-section class="col-2" v-if="ipaddr.length">
            <q-item-section v-for="ip, id in ipaddr">
                <div class="cursor-pointer ">
                    <q-chip square>
                        <q-avatar icon="edit" color="secondary" text-color="white" />
                        <span class="vertical-middle"> {{ip}} </span>
                    </q-chip>
                    <q-popup-edit v-model="ipaddr[id]" auto-save buttons v-slot="scope" @save="(val) => setIp(val)">
                        <q-input v-model="scope.value" dense autofocus counter>
                            <template v-slot:append>
                                <q-item-label caption> Set empty value to delete</q-item-label>
                            </template>
                        </q-input>
                    </q-popup-edit>
                </div>
            </q-item-section>
        </q-item-section>
        <q-item-section class="col-3" v-else>
            <q-item-section>
               <div class="cursor-pointer ">
                    <q-item-label caption> No ip assigned </q-item-label>
                </div>
                <q-popup-edit v-model="ipaddr" auto-save buttons v-slot="scope" @save="(val) => setIp(val)">
                        <q-input v-model="scope.value" dense autofocus counter>
                            <template v-slot:append>
                                <q-item-label caption> Set empty value to delete</q-item-label>
                            </template>
                        </q-input>
                    </q-popup-edit>
            </q-item-section>
        </q-item-section>
        <q-item-section class="col-5">
            <div class="q-pa-md q-gutter-sm">
                <q-toggle v-model="activeBridge" color="green" label="Active bridge" @update:modelValue="SetBridge(activeBridge)" />
            </div>
        </q-item-section>
        <q-item-section side>
            <div class="q-pa-md q-gutter-sm">
                <q-btn round padding="none" color="deep-orange" icon="delete_forever" @click="DeleteMember"/>
            </div>
        </q-item-section>
    </q-item>
</q-list>
</template>

<script>
import {
    defineComponent,
    computed,
    ref
} from 'vue';

import {
    Loading,
    date,
    Notify
} from 'quasar'

import {
    api
} from 'boot/axios'

var data = ref({})
var creationTime = ref()
var lastAuthorizedTime = ref()
var lastDeauthorizedTime = ref()
var networkId = ref()
var ipaddr = ref([])
var tags = ref([])
var activeBridge = ref()
export default defineComponent({
    name: "Members",
    props: ['member', 'network'],

    setup(props) {
        Loading.show()
        var server = localStorage.getItem('server')
        var api_key = localStorage.getItem('api_key')
        var creationTime = ref("")
        var networkId = props.network
        var data = ref({})
        var ipaddr = ref([])
        var activeBridge = ref()
        api.get(`/controller/network/${props.network}/member/${props.member}?rhost=${server}&x-zt1-auth=${api_key}`, {
                timeout: 5000
            })
            .then(response => {
                data.value = response.data
                ipaddr.value = response.data.ipAssignments
                activeBridge.value = response.data.activeBridge
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
        return {
            data,
            creationTime,
            networkId,
            ipaddr,
            activeBridge,
            lastAuthorizedTime,
            lastDeauthorizedTime,
            tags
        }
    },
    methods: {
        SetBridge(val) {
            var payload = {
                activeBridge: val
            }
            this.UpdateConfig(payload)
        },
        setIp(val) {
            var payload = {
                ipAssignments: [val]
            }
            this.UpdateConfig(payload)
        },
        setTag(val) {
            console.log(val)
            var payload = {
                tags: val
            }
            this.UpdateConfig(payload)
        },
        AllowAddress() {
            var payload = {
                authorized: true
            }
            this.UpdateConfig(payload)
        },

        DenyAddress() {
            var payload = {
                authorized: false
            }
            this.UpdateConfig(payload)
        },

        UpdateConfig(payload) {
            Loading.show()
            var server = localStorage.getItem('server')
            var api_key = localStorage.getItem('api_key')
            api
                .post(`/controller/network/${this.networkId}/member/${this.data.address}?rhost=${server}&x-zt1-auth=${api_key}`, payload, {
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
        
        DeleteMember(payload) {
            Loading.show()
            var server = localStorage.getItem('server')
            var api_key = localStorage.getItem('api_key')
            api
                .delete(`/controller/network/${this.networkId}/member/${this.data.address}?rhost=${server}&x-zt1-auth=${api_key}`, {
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
        }
    }
})
</script>
