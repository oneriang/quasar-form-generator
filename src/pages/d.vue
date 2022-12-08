<template>
  <div>
    <div class="row">
      <div class="col-3">
        <h3>Draggable 1</h3>
        <draggable class="dragArea list-group" :list="list1" :group="{ name: 'people', pull: 'clone', put: false }"
          :clone="cloneDog" @change="log" item-key="id" style="background-color: aliceblue;">
          <template #item="{ element }">
            <div class="list-group-item">
              {{ element.name }}
            </div>
          </template>
        </draggable>
      </div>

      <!-- <div class="col-3" v-if="true">
        <h3>Draggable 2</h3> 
        <draggable class="dragArea list-group" :list="list2" group="people" @change="log" item-key="id"
          style="background-color: aquamarine; min-height: 200px">
          <template #item="{ element }">
            <div class="list-group-item">
              {{ element }}
              <component v-bind:is="element.type" :ref="element.ref" @click="clicked(element)"
                v-model="cps[element.ref].modelValue" v-bind="cps[element.ref]" />
            </div>
          </template>
        </draggable>
      </div> -->

      <div class="col-6" v-if="true" style="height: 100%">
        <h3>Draggable 2</h3>
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
          :is-resizable="resizable" :vertical-compact="true" :use-css-transforms="true">
          <grid-item v-for="item in layout" :static="item.static" :x="item.x" :y="item.y" :w="item.w" :h="item.h"
            :i="item.i" :key="item.i" :minW="1" :maxW="colNum" drag-allow-from=".vue-draggable-handle"
            drag-ignore-from=".no-drag">
            <div class="vue-draggable-handle" style="top: -21px; left: 0px;"></div>
            <span class="remove" @click="removeItem(item.i)" style="top: -21px; right: 0px;">x</span>
            <draggable class="dragArea list-group" :list="item.list" group="people" @change="log" item-key="id"
              style="background-color: aquamarine; height:100%; padding: 5px">
              <template #item="{ element }">
                <div class="list-group-item" @click="clicked(element)">
                  <component v-bind:is="element.type" :ref="element.ref"
                    v-model="cps[element.ref].modelValue" v-bind="cps[element.ref]"
                    :style="'color:' + cps[element.ref]['color']" />
                </div>
              </template>
            </draggable>
            <!-- <q-input style="height:100%; width:100%;" filled inputStyle="height:100%; width:100%;"/> -->
          </grid-item>
        </grid-layout>
      </div>

      <div class="col-3">
        <h3>Draggable 3</h3>
        <!-- {{ list3 }} -->
        <draggable class="dragArea list-group" :list="list3" group="people" @change="log" item-key="id"
          style="background-color: aquamarine;">
          <template #item="{ element }">
            <div class="list-group-item">
              {{ element[0] }} : {{ typeof (element[1]) }} : {{ element[1] }}
              <template v-if="typeof (element[1]) === 'boolean'">
                <q-toggle v-model="cps[selected_cp.ref][element[0]]" dense/>
              </template>
              <template v-else-if="typeof (element[1]) === 'string'">
                <template v-if="['color', 'bgColor', 'labelColor'].includes(element[0])">
                  <!-- <q-input filled v-model="cps[selected_cp.ref][element[0]]" class="my-input">
                    <template v-slot:append>
                      <q-icon name="colorize" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-color v-model="cps[selected_cp.ref][element[0]]" />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input> -->
                  <q-select filled v-model="cps[selected_cp.ref][element[0]]" :options="options" dense options-dense emit-value>
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
                  <q-input v-model="cps[selected_cp.ref][element[0]]" dense/>
                </template>
              </template>
              <template v-else>

              </template>
            </div>
          </template>
        </draggable>
      </div>

      <!-- <rawDisplayer class="col-3" :value="list1" title="List 1" />

    <rawDisplayer class="col-3" :value="list2" title="List 2" /> -->
    </div>

  </div>
</template>
<script>
import { GridLayout, GridItem } from 'vue3-grid-layout'
import draggable from 'vuedraggable'
import { uid } from 'quasar'

import { useStore } from '../stores/main.ts'
const store = useStore()

export default {
  name: 'vue-grid-layout',
  display: 'vue-grid-layout',
  components: {
    GridLayout,
    GridItem,
    draggable,
  },
  data() {
    return {
      layout: [
        // { x: 0, y: 0, w: 2, h: 2, i: '0' },
        // { x: 2, y: 0, w: 2, h: 2, i: '1' },
        // { x: 4, y: 0, w: 2, h: 2, i: '2' },
        // { x: 6, y: 0, w: 2, h: 2, i: '3' },
        // { x: 8, y: 0, w: 2, h: 2, i: '4' },
        // { x: 10, y: 0, w: 2, h: 2, i: '5' },
        // { x: 10, y: 2, w: 2, h: 2, i: '6' },
      ],
      draggable: true,
      resizable: true,
      colNum: 512,
      index: 0,
      list1: [
        { name: 'QInput', id: 1, type: 'q-input', ref: 'qInput' },
        { name: 'QBtn', id: 2, type: 'q-btn', ref: 'qBtn' },
        { name: 'QSelect', id: 3, type: 'q-select', ref: 'qSelect' },
        { name: 'QRadio', id: 4, type: 'q-radio', ref: 'qRadio' },
        { name: 'QSlider', id: 5, type: 'q-slider', ref: 'qSlider' },

      ],
      list2: [
        // { name: 'cat 5', id: 5 },
        // { name: 'cat 6', id: 6 },
        // { name: 'cat 7', id: 7 }
      ],
      txt: '',
      list3: [],
      // vmdl3: {},
      objs: {
        label: '',
        outlined: false
      },
      cps: store.cps,
      selected_ref: '',
      selected_cp: null,
      model: null,
      options: [
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
    }
  },
  watch: {
    // 算出 getter 関数
    selected_ref(newVal, oldVal) {
      if (this.newVal === '') {
        this.list3 = []
        return
      }
      this.list3 = Object.entries(this.$refs[newVal][0])
    }
  },
  mounted() {
    // this.$gridlayout.load();
    this.index = this.layout.length;
  },
  methods: {
    addItem: function () {
      console.log('addItem')
      // Add a new item. It must have a u nique key!
      this.layout.push({
        x: (this.layout.length * 1) % (this.colNum || 2),
        // y: this.layout.length + (this.colNum || 12), // puts it at the bottom
        y: 0,
        w: 100,
        h: 5,
        i: this.index,
        list: []
      });
      // Increment the counter to ensure key is always unique.
      this.index++;
    },
    removeItem: function (val) {
      console.log('removeItem')
      const index = this.layout.map(item => item.i).indexOf(val);
      this.layout.splice(index, 1);
    },
    log: function (evt) {
      window.console.log(evt)
    },
    cloneDog(item) {
      const c_item = JSON.parse(JSON.stringify(item))
      const id = uid()
      this.add_cps(id)
      c_item.ref = id
      return c_item
    },
    clicked(element) {
      console.log('clicked')
      console.log(element)
      console.log(this.$refs)
      // // this.vmdl3 = JSON.parse(JSON.stringify(this.$refs[element.ref]));
      // this.vmdl3 = Object.assign({}, this.$refs[element.ref][0]);
      console.log(this.$refs[element.ref][0])
      this.selected_ref = element.ref
      // this.list3 = Object.entries(this.$refs[element.ref][0])
      this.selected_cp = element
    },
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
        label: "",
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
        clearIcon: false,
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
        onClick:(e)=>{alert(1)}
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