<template>
  <q-layout view="hHh lpR fFr">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>
        <div>Quasar v{{ $q.version }}</div>
        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify"
        narrow-indicator>
        <q-tab name="mails" label="Mails" />
        <q-tab name="alarms" label="Alarms" />
        <q-tab name="movies" label="Movies" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="mails">
          <div class="text-h6">Mails</div>
          <ElementListComponent></ElementListComponent>
        </q-tab-panel>

        <q-tab-panel name="alarms">
          <div class="text-h6">Alarms</div>
          <tool-bar @changeGrid="changeGrid"></tool-bar>
        </q-tab-panel>

        <q-tab-panel name="movies">
          <div class="text-h6">Movies</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>
      </q-tab-panels>

    </q-drawer>

    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
      <q-scroll-area style="height: calc(100%); margin-top: 0px">
        <PropertyListComponent></PropertyListComponent>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue';
import ElementListComponent from 'components/ElementListComponent.vue';
import PropertyListComponent from 'components/PropertyListComponent.vue';
import ToolBar from '../components/toolbar/ToolBar.vue';
import { storeToRefs } from "pinia";
import { useStore } from '../stores/main.ts'
const store = useStore()
const { cps, gridX, gridY, rects, verticalGridLinesCount, horizontalGridLinesCount, gridVisibility, wrapperSize } = storeToRefs(store);
import { uid } from 'quasar'

const leftDrawerOpen = ref(false)

const rightDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value
}

const tab = ref('mails')

// function cloneDog(item) {
//   console.log(item)
//   const c_item = JSON.parse(JSON.stringify(item))
//   const id = uid()
//   store.add_cps(id)
//   c_item.ref = id
//   return c_item
// }

const changeGrid = (visibility, gridSize) => {
  console.log('changeGrid')
  gridVisibility.value = visibility;

  gridX.value = gridSize.gridX;
  gridY.value = gridSize.gridY;

  if (!gridVisibility.value) {
    verticalGridLinesCount.value = 0;
    horizontalGridLinesCount.value = 0;
    return;
  }

  verticalGridLinesCount.value = Math.floor(wrapperSize.value.width / gridX.value);
  horizontalGridLinesCount.value = Math.floor(wrapperSize.value.height / gridY.value);
};

</script>
