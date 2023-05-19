<template>
  <div>
    <div class="row">
      <div class="col-12" v-if="true" style="height: 100%">
        <div class="layoutJSON">
          Displayed as <code>[x, y, w, h]</code>:
          <div class="columns">
            <div class="layoutItem" v-for="item in layout" :key="item.i">
              <b>{{ item.i }}</b>: [{{ item.x }}, {{ item.y }}, {{ item.w }}, {{ item.h }}]
            </div>
          </div>
        </div>
        <button @click="addItem">Add an item dynamically</button>
        <input type="checkbox" v-model="draggable" /> Draggable
        <input type="checkbox" v-model="resizable" /> Resizable
        <input type="checkbox" v-model="responsive" /> Responsive
        <grid-layout :layout="layout" :col-num="colNum" :row-height="1" :is-draggable="draggable"
          :is-resizable="resizable" :responsive="responsive" :vertical-compact="true" :use-css-transforms="true" :margin="[0, 0]">
          <grid-item v-for="item in layout" :static="item.static" :x="item.x" :y="item.y" :w="item.w" :h="item.h"
            :i="item.i" :key="item.i" :minW="1" :maxW="colNum" drag-allow-from=".vue-draggable-handle"
            drag-ignore-from=".no-drag" @resized="resizedEvent" :ref="gi => { gridItems[item.i] = gi }">
            <div class="vue-draggable-handle" style="top: -21px; left: 0px;"></div>
            <span class="remove" @click="removeItem(item.i)" style="top: -21px; right: 0px;">x</span>
            <vuedraggable class="dragArea list-group" :list="item.list" group="people1" @change="change" item-key="id"
              style="background-color: aquamarine; min-height: 48px; padding: 5px;" :data-grid-item-id="item.i"
              :ref="di => { draggableItems[item.i] = di }">
              <template #item="{ element }">
                <div class="list-group-item" @click="clicked(element)">
                  <!-- {{ element.type }} -->
                  <!-- <component v-bind:is="element.type" v-model="cps[element.ref].modelValue" v-bind="cps[element.ref]"
                    :style="'color:' + cps[element.ref]['color']" :ref="el => { elements[element.ref] = el }" /> -->
                    <component v-bind:is="element.type"/>
                  </div>
              </template>
            </vuedraggable>
          </grid-item>
        </grid-layout>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { GridLayout, GridItem } from 'vue3-grid-layout'
import vuedraggable from 'vuedraggable'
import { uid } from 'quasar'

import { useStore } from '../stores/main.ts'
const store = useStore()

const layout = ref([])
const draggable = true
const resizable = true
const responsive = true
const colNum = 512
let index = 0

const list3 = ref([])
const cps = store.cps
const selected_cp = ref({})

const elements = ref({})
const gridItems = ref({})
const draggableItems = ref({})

const addItem = function () {
  console.log('addItem')
  // Add a new item. It must have a u nique key!
  layout.value.push({
    x: (layout.value.length * 1) % (colNum || 2),
    // y: layout.value.length + (colNum || 12), // puts it at the bottom
    y: 0,
    w: 100,
    h: 50,
    i: index,
    list: ref([])
  });
  // Increment the counter to ensure key is always unique.
  index = index + 1
  console.log(layout.value)
}

const clicked = function (element) {
  console.log('clicked')
  console.log(element)
  console.log(elements.value)
  list3.value = Object.entries(elements.value[element.ref])
  store.list3 = Object.entries(elements.value[element.ref])
  selected_cp.value = element
  store.selected_cp = element
}

const resizedEvent = function (i, newH, newW, newHPx, newWPx) {
  console.log('RESIZED i=' + i + ', H=' + newH + ', W=' + newW + ', H(px)=' + newHPx + ', W(px)=' + newWPx);
  console.log(layout.value)
  console.log(gridItems.value)
  const tmp = gridItems.value[i].$el.children[2].offsetHeight
  const h = Math.round(tmp / 1) + 2
  layout.value = layout.value.map((g, idx) => {
    if (g.i === i) {
      return { ...g, h: h };
    } else {
      return g;
    }
  });
}

const change = function (evt) {
  window.console.log(evt)
  console.log(elements.value[evt.added.element.ref])
  const draggableItem = elements.value[evt.added.element.ref].$el.parentNode.parentNode
  const gridItemId = draggableItem.dataset.gridItemId
  const tmp = draggableItem.offsetHeight
  const h = Math.round(tmp / 1) + 2

  layout.value = layout.value.map((g, idx) => {
    if (g.i.toString() === gridItemId) {
      return { ...g, h: h };
    } else {
      return g;
    }
  });
}

const removeItem = function (val) {
  console.log('removeItem')
  const index = layout.value.map(item => item.i).indexOf(val);
  layout.value.splice(index, 1);
}
</script>

<style>
.layoutJSON {
  background: #ddd;
  border: 1px solid black;
  margin-top: 10px;
  padding: 10px;
}

.columns {
  -moz-columns: 120px;
  -webkit-columns: 120px;
  columns: 120px;
}

/*************************************/

.remove {
  position: absolute;
  right: 2px;
  top: 0;
  cursor: pointer;
}

.vue-grid-layout {
  background: #eee;
}

.vue-grid-item:not(.vue-grid-placeholder) {
  background: #ccc;
  border: 1px solid black;
}

.vue-grid-item .resizing {
  opacity: 0.9;
}

.vue-grid-item .static {
  background: #cce;
}

.vue-grid-item .text {
  font-size: 24px;
  text-align: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  height: 100%;
  width: 100%;
}

.vue-grid-item .no-drag {
  height: 100%;
  width: 100%;
}

.vue-grid-item .minMax {
  font-size: 12px;
}

.vue-grid-item .add {
  cursor: pointer;
}

.vue-draggable-handle {
  position: absolute;
  width: 20px;
  height: 20px;
  top: 0;
  left: 0;
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><circle cx='5' cy='5' r='5' fill='#999999'/></svg>") no-repeat;
  background-position: bottom right;
  padding: 0 8px 8px 0;
  background-repeat: no-repeat;
  background-origin: content-box;
  box-sizing: border-box;
  cursor: pointer;
}

.vue-draggable-handle {
  position: absolute;
  width: 20px;
  height: 20px;
  top: 0;
  right: 0;
  padding: 0 8px 8px 0;
  background-origin: content-box;
  background-color: black;
  box-sizing: border-box;
  border-radius: 10px;
  cursor: pointer;
}
</style>