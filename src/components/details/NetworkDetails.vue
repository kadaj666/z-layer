<template>
<div class="q-pa-md">
    <q-dialog v-model="purgeConfirm" transition-show="scale" transition-hide="scale">
        <q-card>
            <q-card-section class="bg-negative text-white">
                <div class="text-h6">Delete network {{network}}</div>
            </q-card-section>
            <q-card-section class="row items-center">
                <q-avatar icon="delete_forever" color="red" text-color="white" />
                <span class="q-ml-sm">Are you sure you want to delete this Network ? <br> All settings and members will be deleted too.</span>
            </q-card-section>
            <q-card-actions align="right" class="bg-white text-negative">
                <q-btn flat label="Cancel" color="primary" v-close-popup />
                <q-btn flat label="DELETE" color="negative" @click="SureDelete" />
            </q-card-actions>
        </q-card>
    </q-dialog>
    <q-list bordered>
        <q-item-label header>
            <q-chip square color="secondary" text-color="white">
                <q-avatar color="primary" text-color="white">ID:</q-avatar>
                {{network}}
            </q-chip>
        </q-item-label>
        <q-item>
            <q-item class="col-3">
                <q-item-section avatar>
                    <q-avatar v-if="netdata.private" text-color="white" color="light-green-8" icon="lock"></q-avatar>
                    <q-avatar v-else text-color="white" color="light-blue-8" icon="public"></q-avatar>
                </q-item-section>

                <q-item-section>
                    <q-item-label class="text-h6 text-secondary text-bold">{{netdata.name}}</q-item-label>
                    <q-item-label caption>Creation time: {{creationTime}}</q-item-label>
                </q-item-section>
            </q-item>
            <q-item-section>
                <div class="row">
                    <div class="col-3">
                        <q-item>
                            <q-item-section avatar>
                                <q-avatar color="blue" text-color="white" icon="people" />
                            </q-item-section>
                            <q-item-section>
                                <q-item-label class="text-h6 text-blue text-bold">{{members}}</q-item-label>
                                <q-item-label caption>Members</q-item-label>
                            </q-item-section>
                        </q-item>
                    </div>
                    <div class="col-3">
                        <q-item>
                            <q-item-section avatar>
                                <q-avatar color="teal-8" text-color="white" icon="receipt_long" />
                            </q-item-section>
                            <q-item-section>
                                <q-item-label class="text-h6 text-teal-8 text-bold">{{poolSize}}</q-item-label>
                                <q-item-label caption>IP Pools</q-item-label>
                            </q-item-section>
                        </q-item>
                    </div>
                    <div class="col-3">
                        <q-item>
                            <q-item-section avatar>
                                <q-avatar color="amber-8" text-color="white" icon="route" />
                            </q-item-section>
                            <q-item-section>
                                <q-item-label class="text-h6 text-amber-8 text-bold">{{routeSize}}</q-item-label>
                                <q-item-label caption>Routes</q-item-label>
                            </q-item-section>
                        </q-item>
                    </div>
                    <div class="col-3">
                        <q-item>
                            <q-item-section avatar>
                                <q-avatar color="light-green-8" text-color="white" icon="fact_check" />
                            </q-item-section>
                            <q-item-section>
                                <q-item-label class="text-h6 text-light-green-8 text-bold">{{ruleSize}}</q-item-label>
                                <q-item-label caption>Rules</q-item-label>
                            </q-item-section>
                        </q-item>
                    </div>
                </div>
            </q-item-section>
            <q-item-section top side>
                <div class="q-pa-md q-gutter-sm">
                    <q-btn square color="secondary" icon="settings" :to="'/' + server +'/'+ network" />
                    <q-btn square color="deep-orange" icon="delete_forever" @click="purgeConfirm = true" />
                </div>
            </q-item-section>
        </q-item>
    </q-list>
</div>
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

export default defineComponent({
    name: "NetworkDetails",
    props: ['network', 'server'],

    setup(props) {
        Loading.show()
        var server = localStorage.getItem('server')
        var api_key = localStorage.getItem('api_key')
        var netdata = ref({})
        var poolSize = ref()
        var routeSize = ref()
        var ruleSize = ref()
        var members = ref()
        var creationTime = ref("")
        api.get(`/controller/network/${props.network}?rhost=${server}&x-zt1-auth=${api_key}`, {
                timeout: 5000
            })
            .then(response => {
                netdata.value = response.data
                creationTime.value = date.formatDate(response.data.creationTime, 'YYYY-MM-DD HH:mm:ss')
                Loading.hide()
                poolSize.value = response.data.ipAssignmentPools.length
                routeSize.value = response.data.routes.length
                ruleSize.value = response.data.rules.length

            })
            .catch(function (error) {
                Loading.hide()
                Notify.create({
                    type: 'negative',
                    position: 'top',
                    html: true,
                    progress: true,
                    message: `<strong> ${error}</strong>: Can't retrive network info.`
                })
            })

        api.get(`/controller/network/${props.network}/member?rhost=${server}&x-zt1-auth=${api_key}`, {
                timeout: 5000
            })
            .then(response => {
                var size = 0, key;
                for (key in response.data) {
                    size++;
                }
                members.value = size
                Loading.hide()
            })
            .catch(function (error) {
                Loading.hide()
                Notify.create({
                    type: 'negative',
                    position: 'top',
                    html: true,
                    progress: true,
                    message: `<strong> ${error}</strong>: Can't retrive network info.`
                })
            })

        return {
            netdata,
            creationTime,
            routeSize,
            poolSize,
            ruleSize,
            members,
            purgeConfirm: ref(false),
            changeName: ref(false),
        }
    },
    methods: {

        SureDelete() {
            var server = localStorage.getItem('server')
            var api_key = localStorage.getItem('api_key')
            api
                .delete(`/controller/network/${this.network}?rhost=${server}&x-zt1-auth=${api_key}`, {
                    timeout: 5000
                })
                .then(response => {
                    this.purgeConfirm = false
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
