<template>
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

        <grid-layout :layout="layout" :col-num="colNum" :row-height="1" :is-draggable="draggable"
          :is-resizable="resizable" :vertical-compact="true" :use-css-transforms="true" :margin="[0, 0]">
          <grid-item v-for="item in layout" :static="item.static" :x="item.x" :y="item.y" :w="item.w" :h="item.h"
            :i="item.i" :key="item.i" :minW="1" :maxW="colNum" drag-allow-from=".vue-draggable-handle"
            drag-ignore-from=".no-drag" @resized="resizedEvent" :ref="gi => { gridItems[item.i] = gi }">
            <div class="vue-draggable-handle" style="top: -21px; left: 0px;"></div>
            <span class="remove" @click="removeItem(item.i)" style="top: -21px; right: 0px;">x</span>
            <vuedraggable class="dragArea list-group" :list="item.list" group="people1" @change="change" item-key="id"
              style="background-color: aquamarine; min-height: 48px; padding: 5px;" :data-grid-item-id="item.i" :ref="di => { draggableItems[item.i] = di }">
              <template #item="{ element }">
                <div class="list-group-item" @click="clicked(element)">
                  {{ element.type }}
                  <component v-bind:is="element.type" v-model="cps[element.ref].modelValue" v-bind="cps[element.ref]"
                    :style="'color:' + cps[element.ref]['color']" :ref="el => { elements[element.ref] = el }" />
                </div>
              </template>
            </vuedraggable>
          </grid-item>
        </grid-layout>
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
    y: layout.value.length + (colNum || 12), // puts it at the bottom
    // y: 0,
    w: 100,
    h: 50,
    i: index,
    list: ref([])
  });
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
  // layout.value[i] = {
  //   x: layout.value[i].x,
  //   y: layout.value[i].y,
  //   w: layout.value[i].w,
  //   h: 10
  // }
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
    // console.log(g)
    // console.log(i)
    // console.log(gridItemId)
    if (g.i.toString() === gridItemId) {
      return { ...g, h: h };
    } else {
      return g;
    }
  });
}
</script>

<script>
import { GridLayout, GridItem } from 'vue3-grid-layout'
import draggable from 'vuedraggable'
import { uid } from 'quasar'

import { useStore } from '../stores/main.ts'
const store = useStore()

export default {
  name: 'vue-grid-layout',
  display: 'vue-grid-layout',
  // components: {
  //   GridLayout,
  //   GridItem,
  //   draggable,
  // },
  // data() {
  //   return {
  //     layout: [
  //       // { x: 0, y: 0, w: 2, h: 2, i: '0' },
  //       // { x: 2, y: 0, w: 2, h: 2, i: '1' },
  //       // { x: 4, y: 0, w: 2, h: 2, i: '2' },
  //       // { x: 6, y: 0, w: 2, h: 2, i: '3' },
  //       // { x: 8, y: 0, w: 2, h: 2, i: '4' },
  //       // { x: 10, y: 0, w: 2, h: 2, i: '5' },
  //       // { x: 10, y: 2, w: 2, h: 2, i: '6' },
  //     ],
  //     draggable: true,
  //     resizable: true,
  //     colNum: 512,
  //     index: 0,
  //     list1: [
  //       { name: 'QInput', id: 1, type: 'q-input', ref: 'qInput' },
  //       { name: 'QBtn', id: 2, type: 'q-btn', ref: 'qBtn' },
  //       { name: 'QSelect', id: 3, type: 'q-select', ref: 'qSelect' },
  //       { name: 'QRadio', id: 4, type: 'q-radio', ref: 'qRadio' },
  //       { name: 'QSlider', id: 5, type: 'q-slider', ref: 'qSlider' },

  //     ],
  //     list2: [
  //       // { name: 'cat 5', id: 5 },
  //       // { name: 'cat 6', id: 6 },
  //       // { name: 'cat 7', id: 7 }
  //     ],
  //     txt: '',
  //     list3: [],
  //     // vmdl3: {},
  //     objs: {
  //       label: '',
  //       outlined: false
  //     },
  //     cps: store.cps,
  //     selected_ref: '',
  //     selected_cp: null,
  //     model: null,
  //     options: [
  //       {
  //         label: 'red',
  //         value: 'red',
  //         description: 'red',
  //       },
  //       {
  //         label: 'pink',
  //         value: 'pink',
  //         description: 'pink',
  //       },
  //       {
  //         label: 'purple',
  //         value: 'purple',
  //         description: 'purple',
  //       },
  //       {
  //         label: 'deep-purple',
  //         value: 'deep-purple',
  //         description: 'deep-purple',
  //       },
  //       {
  //         label: 'indigo',
  //         value: 'indigo',
  //         description: 'indigo',
  //       },
  //     ]
  //   }
  // },
  // watch: {
  //   // 算出 getter 関数
  //   selected_ref(newVal, oldVal) {
  //     if (this.newVal === '') {
  //       this.list3 = []
  //       return
  //     }
  //     this.list3 = Object.entries(this.$refs[newVal][0])
  //   }
  // },
  mounted() {
    // this.$gridlayout.load();
    // this.index = this.layout.length;
  },
  methods: {
    // addItem: function () {
    //   console.log('addItem')
    //   // Add a new item. It must have a u nique key!
    //   this.layout.push({
    //     x: (this.layout.length * 1) % (this.colNum || 2),
    //     // y: this.layout.length + (this.colNum || 12), // puts it at the bottom
    //     y: 0,
    //     w: 100,
    //     h: 5,
    //     i: this.index,
    //     list: []
    //   });
    //   // Increment the counter to ensure key is always unique.
    //   this.index++;
    // },
    removeItem: function (val) {
      console.log('removeItem')
      const index = this.layout.map(item => item.i).indexOf(val);
      this.layout.splice(index, 1);
    },
    // log: function (evt) {
    //   window.console.log(evt)
    // },
    cloneDog(item) {
      const c_item = JSON.parse(JSON.stringify(item))
      const id = uid()
      this.add_cps(id)
      c_item.ref = id
      return c_item
    },
    // clicked(element) {
    //   console.log('clicked')
    //   console.log(element)
    //   console.log(this.$refs)
    //   // // this.vmdl3 = JSON.parse(JSON.stringify(this.$refs[element.ref]));
    //   // this.vmdl3 = Object.assign({}, this.$refs[element.ref][0]);
    //   console.log(this.$refs[element.ref][0])
    //   this.selected_ref = element.ref
    //   // this.list3 = Object.entries(this.$refs[element.ref][0])
    //   this.selected_cp = element
    // },
    updateModelValue(newValue) {
      this.cps[this.selected_cp.ref].label = newValue
      return true
    },
    updateModelValue1(newValue) {
      console.log(newValue)
      console.log(arguments)
      this.cps[this.selected_cp.ref].outlined = newValue
      return true
    },
    add_cps(id) {
      this.cps[id] = {
        // modelValue: null,
        // label: '',
        // outlined: false,
        // dense: false,
        // square: false,
        // dark: false
        // "dark": false,
        // "modelValue": null,
        // "error": null,
        // "noErrorIcon": false,
        // "reactiveRules": false,
        // "lazyRules": false,
        // "label": "",
        // "stackLabel": false,
        // "hideHint": false,
        // "filled": false,
        // "outlined": false,
        // "borderless": false,
        // "standout": false,
        // "square": false,
        // "loading": false,
        // "labelSlot": false,
        // "bottomSlots": false,
        // "hideBottomSpace": false,
        // "rounded": false,
        // "dense": false,
        // "itemAligned": false,
        // "counter": false,
        // "clearable": false,
        // "disable": false,
        // "readonly": false,
        // "autofocus": false,
        // "reverseFillMask": false,
        // "fillMask": false,
        // "unmaskedValue": false,
        // "type": "text",
        // "autogrow": false,
        // "hasError": false,
        dark: false,
        modelValue: null,
        error: false,
        errorMessage: '',
        noErrorIcon: false,
        rules: [],
        // reactiveRules: false,
        // lazyRules: false,
        label: '',
        stackLabel: false,
        hint: '',
        hideHint: false,
        prefix: '',
        suffix: '',
        labelColor: '',
        color: '',
        bgColor: '',
        filled: false,
        outlined: false,
        borderless: false,
        standout: false,
        square: false,
        loading: false,
        labelSlot: false,
        bottomSlots: false,
        hideBottomSpace: false,
        rounded: false,
        dense: false,
        itemAligned: false,
        counter: false,
        clearable: false,
        clearIcon: '',
        disable: false,
        readonly: false,
        autofocus: false,
        for: '',
        maxlength: '',
        mask: '',
        reverseFillMask: false,
        fillMask: false,
        unmaskedValue: false,
        name: '',
        shadowText: '',
        // type: "text",
        debounce: '',
        autogrow: false,
        inputClass: '',
        inputStyle: '',
        // resetValidation: null,
        // validate: null,
        hasError: false,
        focus: '',
        // blur: null,
        // select: null,
        // getNativeElement: null,
        // nativeEl: null
        // onChange: 'alert(1)'
        // onClick: (e) => { alert(1) }
      }
      console.log(this.cps)
    },
    cid() {
      const id = uid()
      this.add_cps(id)
      return id
    }
  }
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