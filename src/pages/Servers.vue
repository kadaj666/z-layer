<template>
  <q-page class="q-pa-sm">
    
    <servers-table class="q-mt-sm"></servers-table>

  </q-page>
</template>

<script>
import {defineComponent, defineAsyncComponent} from 'vue';

export default defineComponent({
  name: "Servers",
  components: {
    ServersTable: defineAsyncComponent(() => import('components/tables/ServersTable')),
  },
})
</script>

<style>

</style>
