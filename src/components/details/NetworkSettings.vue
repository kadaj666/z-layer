<template>
<q-card>
    <q-toolbar class="bg-grey-2">
        <q-toolbar-title> Basics
        </q-toolbar-title>
    </q-toolbar>
    <q-card-section class="q-pa-sm row">
        <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
                Network Name
            </q-item-section>
        </q-item>
        <q-item class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
            <q-item-section>
                <q-input filled v-model="netname" @blur="SetNetname(netname)" />
            </q-item-section>
        </q-item>
        <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
                Network Type
            </q-item-section>
        </q-item>
        <q-item class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
            <q-item-section>
                <q-btn-toggle v-model="netType" spread no-caps toggle-color="secondary" color="white" text-color="black" :options="netoptions" @update:modelValue="SelectType(netType)">
                    <template v-slot:private>
                        <div class="items-center no-wrap">
                            <div class="text-center text-h6">
                                Private
                            </div>
                            <div class="text-left text-caption">
                                Nodes must be authorized to become members
                            </div>
                        </div>
                    </template>
                    <template v-slot:public>
                        <div class="items-center no-wrap">
                            <div class="text-center  text-h6">
                                Public
                            </div>
                            <div class="text-left text-caption">
                                Any node can become a member. Members cannot be de-authorized or deleted. Members that haven't been online in 30 days will be removed, but can rejoin.
                            </div>
                        </div>
                    </template>
                </q-btn-toggle>
            </q-item-section>
        </q-item>
        <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
                Broadcast
            </q-item-section>
        </q-item>
        <q-item class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
            <q-item-section>
                <q-btn-toggle v-model="broadcast" @update:modelValue="SelectBroadcast(broadcast)" unelevated toggle-color="secondary" color="white" text-color="primary" :options="[
          {label: 'Enabled', value: true},
          {label: 'Disabled', value: false}
        ]" />
            </q-item-section>
        </q-item>
    </q-card-section>

    <q-separator />

    <q-toolbar class="bg-grey-2">
        <q-toolbar-title> Advanced
        </q-toolbar-title>
    </q-toolbar>
    <q-card-section class="q-pa-sm row">
        <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
                Managed Routes
            </q-item-section>
        </q-item>
        <q-item class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
            <q-item-section>
                <q-card class="my-card">
                    <q-card-section class="bg-white ">
                        <q-list dense>
                            <q-item v-for="target in routes">
                                <q-item-section avatar>
                                    <q-btn dense rounded flat icon="delete_forever" size="sm" @click="DeleteRoute(target.target, target.via)" />
                                </q-item-section>
                                <q-item-section>{{target.target}}</q-item-section>
                                <template v-if="target.via">
                                    <q-item-section>via</q-item-section>

                                    <q-item-section side>{{target.via}}</q-item-section>
                                </template>
                                <template v-else>
                                    <q-item-section side>(LAN)</q-item-section>
                                </template>
                            </q-item>
                        </q-list>
                    </q-card-section>
                    <q-card flat bordered class="my-card bg-grey-1">
                        <q-card-section>
                            <div class="text-subtitle2">New route</div>
                            <q-banner inline-actions class="bg-grey-1">
                                <div class="row">
                                    <div class="col-6">
                                        <q-item>
                                            <q-input dense outlined v-model="route_dest" class="full-width" label="Destination" placeholder="10.147.17.3/32" />
                                        </q-item>
                                    </div>
                                    <div class="col-6">
                                        <q-item>
                                            <q-input dense outlined v-model="route_via" class="full-width" label="Via" placeholder="10.147.17.1" />
                                        </q-item>
                                    </div>
                                </div>
                                <template v-slot:action>
                                    <q-btn color="secondary" label="Add route" @click="AddRoute(route_dest, route_via)" />
                                </template>
                            </q-banner>
                        </q-card-section>
                    </q-card>
                </q-card>
            </q-item-section>
        </q-item>

        <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
                IPv4 Auto-Assign
            </q-item-section>
        </q-item>
        <q-item class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
            <q-item-section>
                <q-card class="my-card">

                    <q-card-section>
                        <q-btn-toggle v-model="ip_assign" toggle-color="primary" spread :options="addressPool1" @update:modelValue="SelectRange(ip_assign)" />
                        <br>
                        <q-btn-toggle v-model="ip_assign" toggle-color="primary" spread :options="addressPool2" @update:modelValue="SelectRange(ip_assign)" />
                        <br>
                        <q-btn-toggle v-model="ip_assign" toggle-color="primary" spread :options="addressPool3" @update:modelValue="SelectRange(ip_assign)" />
                    </q-card-section>
                    <q-banner class="bg-grey-1">
                        {{ip_assign}} Range: {{ipRangeStart}} - {{ipRangeEnd}} ({{ipSize}} IP Addresses)
                    </q-banner>
                </q-card>
            </q-item-section>
        </q-item>

        <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
                Auto-Assign
            </q-item-section>
        </q-item>
        <q-item class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
            <q-item-section>
                <q-card class="my-card">
                    <div class="row">
                        <div class="col-6">
                            <q-card-section>
                                <div class="text-subtitle2">IPv4</div>
                                <div>
                                    <q-checkbox v-model="v4_zt" @update:modelValue="Select_v4_zt(v4_zt)" label="IPv4 addresses auto-assigned from IPv4 Auto-Assign (ZT)" />
                                </div>
                            </q-card-section>
                        </div>
                        <div class="col-6">
                            <q-card-section>
                                <div class="text-subtitle2">IPv6</div>
                                <div>
                                    <q-checkbox v-model="v6_zt" disabled label="IPv6 addresses auto-assigned from IPv6 Auto-Assign (ZT)" />
                                </div>
                                <div>
                                    <q-checkbox v-model="v6_rfc4193" disabled label="ZeroTier RFC4193 (/128 for each device)" />
                                </div>
                            </q-card-section>
                        </div>
                    </div>
                </q-card>
            </q-item-section>
        </q-item>
        <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
                Other settings
            </q-item-section>
        </q-item>
        <q-item class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
            <q-item-section>
                <q-card class="my-card">
                    <div class="row">
                        <div class="col-6">
                            <q-card-section>
                                Multicast Recipient Limit: {{ multicast }}
                                <q-item>
                                    <q-slider v-model="multicast" :min="0" :max="96" :step="8" snap label color="secondary" @change="SetMulticast(multicast)"/>
                                </q-item>
                            </q-card-section>
                        </div>
                        <div class="col-6">
                            <q-card-section>
                                MTU:
                                <q-item>
                                    <q-input v-model="mtu" dense outlined class="full-width" type="number" @blur="SetMtu(mtu)" />
                                </q-item>
                            </q-card-section>
                        </div>
                    </div>
                </q-card>
            </q-item-section>
        </q-item>
    </q-card-section>
    <q-separator />
</q-card>
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

import {
    IPv4CidrRange
} from "ip-num/IPRange";
import {
    RangedSet
} from "ip-num/IPRange";

const addressPool1 = [{
        label: "10.20.30.0/24",
        value: "10.20.30.0/24",
    },
    {
        label: "10.20.31.0/24",
        value: "10.20.31.0/24",
    },
    {
        label: "10.20.32.0/24",
        value: "10.20.32.0/24",
    },
    {
        label: "10.20.0.0/22",
        value: "10.20.0.0/22",
    },
    {
        label: "10.20.0.0/19",
        value: "10.20.0.0/19",
    },

]

const addressPool2 = [{
        label: "172.20.30.0/24",
        value: "172.20.30.0/24",
    },
    {
        label: "172.20.31.0/24",
        value: "172.20.31.0/24",
    },
    {
        label: "172.20.32.0/24",
        value: "172.20.32.0/24",
    },
    {
        label: "172.20.0.0/22",
        value: "172.20.0.0/22",
    },
    {
        label: "172.20.0.0/19",
        value: "172.20.0.0/19",
    },
]

const addressPool3 = [{
        label: "192.168.30.0/24",
        value: "192.168.30.0/24",
    },
    {
        label: "192.168.31.0/24",
        value: "192.168.31.0/24",
    },
    {
        label: "192.168.32.0/24",
        value: "192.168.32.0/24",
    },
    {
        label: "192.168.33.0/24",
        value: "192.168.33.0/24",
    },
    {
        label: "192.168.34.0/24",
        value: "192.168.34.0/24",
    },
];

const netoptions = [{
        value: true,
        slot: 'private'
    },
    {
        value: false,
        slot: 'public'
    }
]
var range = ref()
var cidr = ref()

export default defineComponent({
    name: "NetworkSettings",
    props: ['data'],
    mounted: function () {
        this.SetRange(this.range)
    },
    setup(props) {
        return {
            netoptions,
            netType: ref(props.data.private),
            netID: props.data.id,
            addressPool1,
            addressPool2,
            addressPool3,
            mtu: ref(props.data.mtu),
            v6_rfc4193: ref(props.data.v6AssignMode.rfc4193),
            v6_zt: ref(props.data.v6AssignMode.zt),
            v4_zt: ref(props.data.v4AssignMode.zt),
            route_dest: ref(),
            route_via: ref(),
            multicast: ref(32),
            broadcast: ref(props.data.enableBroadcast),
            netname: ref(props.data.name),
            routes: ref(props.data.routes),
            ip_assign: ref(),
            range: props.data.ipAssignmentPools[0],
            ipRangeStart: ref(),
            ipRangeEnd: ref(),
            ipSize: ref(),
        }
    },
    methods: {
        SetRange(range) {
            if (range) {
                var cidr = RangedSet.fromRangeString(range.ipRangeStart + '-' + range.ipRangeEnd).toCidrRange().toCidrString()
                this.ip_assign = cidr
                var block = IPv4CidrRange.fromCidr(cidr);
                this.ipRangeStart = block.getFirst().toString()
                this.ipRangeEnd = block.getLast().toString()
                this.ipSize = block.getSize()
            }
        },

        SelectRange(ip_assign) {
            var block = IPv4CidrRange.fromCidr(ip_assign);
            this.ipRangeStart = block.getFirst().toString()
            this.ipRangeEnd = block.getLast().toString()
            this.ipSize = block.getSize()
            var NewRoute = [{
                "target": ip_assign,
            }]
            var payload = {
                ipAssignmentPools: [{
                    "ipRangeStart": this.ipRangeStart,
                    "ipRangeEnd": this.ipRangeEnd
                }],
                routes: NewRoute
            }
            this.routes = NewRoute
            this.UpdateConfig(payload)
        },

        SelectType(netType) {
            var payload = {
                private: netType
            }
            this.UpdateConfig(payload)
        },

        SelectBroadcast(broadcast) {
            var payload = {
                enableBroadcast: broadcast
            }
            this.UpdateConfig(payload)
        },

        Select_v4_zt(v4_zt) {
            var payload = {
                "v4AssignMode": {
                    "zt": v4_zt
                }
            }
            this.UpdateConfig(payload)
        },

        SetNetname(netname) {
            var payload = {
                name: netname
            }
            this.UpdateConfig(payload)
        },

        SetMtu(mtu) {
            var payload = {
                mtu: mtu
            }
            this.UpdateConfig(payload)
        },

        SetMulticast(multicast) {
            var payload = {
                multicastLimit: multicast
            }
            this.UpdateConfig(payload)
        },

        AddRoute(dest, via) {
            var NewRoute = {
                "target": dest,
                "via": via
            }
            this.routes.push(NewRoute)
            var payload = {
                routes: this.routes
            }
            this.UpdateConfig(payload)
        },

        DeleteRoute(dest, via) {
            for (var i = 0; i < this.routes.length; i++) {
                console.log(this.routes[i])
                if (this.routes[i].target === dest && this.routes[i].via === via) {
                    this.routes.splice(i, 1);
                }
            }
            var payload = {
                routes: this.routes
            }
            this.UpdateConfig(payload)
        },

        UpdateConfig(payload) {
            Loading.show()
            var server = localStorage.getItem('server')
            var api_key = localStorage.getItem('api_key')
            api
                .post(`/controller/network/${this.netID}?rhost=${server}&x-zt1-auth=${api_key}`, payload, {
                    timeout: 5000
                })
                .then(response => {
                    this.$emit('event')
                    Loading.hide()
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

<style scoped>

</style>
