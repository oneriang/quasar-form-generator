<template>
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

    <div class="col-3">
      <h3>Draggable 2</h3>
      <draggable class="dragArea list-group" :list="list2" group="people" @change="log" item-key="id"
        style="background-color: aquamarine; min-height: 200px">
        <template #item="{ element }">
          <div class="list-group-item">
            {{ element }}
            <!-- <component v-bind:is="element.type" :label="cps[element.ref].label" :ref="element.ref"
              @click="clicked(element)" 
              v-model="cps[element.ref].value"
              :outlined="cps[element.ref].outlined" :dense="cps[element.ref].dense"  
              :square="cps[element.ref].square"
              :dark="cps[element.ref].dark"/> -->
              <component v-bind:is="element.type" :ref="element.ref"
              @click="clicked(element)" 
              v-model="cps[element.ref].modelValue" 
              v-bind="cps[element.ref]"/>
          </div>
        </template>
      </draggable>
    </div>

    <div class="col-6">
      <h3>Draggable 3</h3>
      <draggable class="dragArea list-group" :list="list3" group="people" @change="log" item-key="id"
        style="background-color: aquamarine;">
        <template #item="{ element }">
          <div class="list-group-item">
            {{ element[0] }} : {{ typeof (element[1]) }} : {{ element[1] }}
            <template v-if="typeof (element[1]) === 'boolean'">
              <!-- <q-toggle v-model="element[1]" @update:modelValue="updateModelValue1" /> -->
              <q-toggle v-model="cps[selected_cp.ref][element[0]]" />
            </template>
            <template v-else-if="typeof (element[1]) === 'string'">
              <!-- <q-input v-model="element[1]" @update:modelValue="updateModelValue" /> -->
              <q-input v-model="cps[selected_cp.ref][element[0]]" />
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
</template>

<script>
import draggable from 'vuedraggable'
// import { QInput, QBtn, QSelect, QRadio, QSlider } from 'quasar'
import { uid } from 'quasar'
// let idGlobal = 8;
export default {
  name: 'custom-clone',
  display: 'Custom Clone',
  order: 3,
  components: {
    draggable,
    // QInput,
    // QBtn,
    // QSelect,
    // QRadio,
    // QSlider
  },
  data() {
    return {
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
      vmdl3: {},
      objs: {
        label: '',
        outlined: false
      },
      cps: {},
      selected_cp: null
    };
  },
  methods: {
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
      // this.vmdl3 = JSON.parse(JSON.stringify(this.$refs[element.ref]));
      this.vmdl3 = Object.assign({}, this.$refs[element.ref]);
      this.list3 = Object.entries(this.$refs[element.ref])
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
        modelValue: null,
        label: '',
        outlined: false,
        dense: false,
        square: false,
        dark: false
      }
      console.log(this.cps)
    },
    cid() {
      const id = uid()
      this.add_cps(id)
      return id
    }
  },
};
</script>
<style scoped>

</style>