<template>
  <q-page class="q-pa-sm">
    <q-card-section>
        <div class="row items-center no-wrap">
            <div class="col">
              <q-breadcrumbs>
                    <q-breadcrumbs-el label="Dashboard" icon="widgets" to="/" />
                    <q-breadcrumbs-el :label="$route.params.key" :to="'/'+$route.params.key"/>
                    <q-breadcrumbs-el :label="$route.params.network" />
                </q-breadcrumbs>
            </div>
        </div>
    </q-card-section>
    <q-card class="q-mt-sm">
        <network-table :network="$route.params.network" class="q-mt-sm"></network-table>
    </q-card>

  </q-page>






</template>

<script>
import {defineComponent, defineAsyncComponent} from 'vue';

export default defineComponent({
  name: "Networks",
  components: {
    NetworkTable: defineAsyncComponent(() => import('components/tables/NetworkTable')),
  },
})
</script>

<style>

</style>
