<template>
  <div>
    <draggable class="dragArea list-group" :list="list1" :group="{ name: 'people1', pull: 'clone', put: false }"
      :clone="cloneDog" item-key="id" style="background-color: aliceblue;" :sort="false">
      <template #item="{ element }">
        <div class="list-group-item">
          <!-- {{ element.name }} -->
          <q-item clickable v-ripple dense @click="click(element)">
            <q-item-section>{{ element.name }}</q-item-section>
            <!-- <q-item-section avatar>
              <q-icon color="primary" name="bluetooth" />
            </q-item-section> -->
          </q-item>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
// import { computed, ref } from 'vue';
import draggable from 'vuedraggable'

import { storeToRefs } from "pinia";

import { useStore } from '../stores/main.ts'
const store = useStore()
const { list, cps} = storeToRefs(store);
import { uid } from 'quasar'

const list1 = [
  { name: 'QInput', id: 1, type: 'q-input', ref: 'qInput', active: false },
  { name: 'QBtn', id: 2, type: 'q-btn', ref: 'qBtn', active: false },
  { name: 'QSelect', id: 3, type: 'q-select', ref: 'qSelect', active: false },
  { name: 'QRadio', id: 4, type: 'q-radio', ref: 'qRadio', active: false },
  { name: 'QSlider', id: 5, type: 'q-slider', ref: 'qSlider', active: false },
  { name: 'QDate', id: 6, type: 'q-date', ref: 'qDate', active: false },
  { name: 'QCheckbox', id: 7, type: 'q-checkbox', ref: 'qCheckbox', active: false },
  { name: 'QAvatar', id: 8, type: 'q-avatar', ref: 'qAvatar', active: false },
  { name: 'QBadge', id: 9, type: 'q-badge', ref: 'qBadge', active: false },
  { name: 'QCard', id: 9, type: 'q-card', ref: 'qCard', active: false },
]

function click(item) {
  console.log(item)
  const c_item = JSON.parse(JSON.stringify(item))
  const id = uid()
  store.add_cps(id)
  c_item.ref = id
  // list.value.push(c_item)
  store.rects[store.activeRectId].elementList.push(c_item)
  // return c_item
}

function cloneDog(item) {
  console.log(item)
  const c_item = JSON.parse(JSON.stringify(item))
  const id = uid()
  store.add_cps(id)
  c_item.ref = id
  return c_item
}

</script>
