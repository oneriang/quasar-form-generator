<template>
  <div>
    <q-list dense bordered separator>
      <q-item clickable v-ripple v-for="item in list3" :key="item.id">
        <q-item-section>
          {{ item[0] }} : {{ typeof (item[1]) }} : {{ item[1] }}
          <template v-if="typeof (item[1]) === 'boolean'">
            <q-toggle v-model="cps[selected_cp.ref][item[0]]" dense />
          </template>
          <template v-else-if="typeof (item[1]) === 'string'">
            <template v-if="['color', 'bgColor', 'labelColor'].includes(item[0])">
              <q-select filled v-model="cps[selected_cp.ref][item[0]]" :options="options" dense options-dense
                emit-value>
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section avatar>
                      <q-icon name="square" :color="scope.opt.value" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ scope.opt.label }}</q-item-label>
                      <q-item-label caption>{{ scope.opt.description }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </template>
            <template v-else>
              <q-input v-model="cps[selected_cp.ref][item[0]]" dense borderless />
            </template>
          </template>
          <template v-else>
          </template>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import draggable from 'vuedraggable'
import { storeToRefs } from "pinia";

import { useStore } from '../stores/main.ts'
const store = useStore()

// const list3 = ref([])
// list3.value = store.list3
// const list3 = storeToRefs
const { list3, cps, selected_cp  } = storeToRefs(store);
// const cps = store.cps
// const selected_cp = store.selected_cp
const options = [
  {
    label: 'red',
    value: 'red',
    description: 'red',
  },
  {
    label: 'pink',
    value: 'pink',
    description: 'pink',
  },
  {
    label: 'purple',
    value: 'purple',
    description: 'purple',
  },
  {
    label: 'deep-purple',
    value: 'deep-purple',
    description: 'deep-purple',
  },
  {
    label: 'indigo',
    value: 'indigo',
    description: 'indigo',
  },
]
</script>
