<template>
  <div>

    <q-splitter
      v-model="splitterModel"
      horizontal
      style="height: 800px"
    >

      <template v-slot:before>
        <div class="q-pa-md">
          <q-form-builder :value="fields" />
        </div>
      </template>

      <template v-slot:after>
        <div class="q-pa-md">
          <div v-for="(field, index) in fields" :key="index">
          <component v-model="fieldData[field.cid]" @input="onInput" v-bind:is="getElement(field)" :label="field.label"
            :required="field.required" :field_options="field.field_options" :id="field.cid" :cid="field.cid"
            :ref="field.cid" debounce="500" />
          </div>
        </div>
      </template>

    </q-splitter>

    
    <div class="row no-wrap justify-around q-px-md q-pt-md">
      
     
      
      <!-- <QFormBuilder></QFormBuilder> -->
      <!-- <q-form-builder :value="fields" /> -->
      <!-- <div v-mutation="handler1" @dragenter="onDragEnter" @dragleave="onDragLeave" @dragover="onDragOver" @drop="onDrop"
        class="drop-target-1 rounded-borders overflow-hidden">
        <q-input for="qi_1" draggable="true" @dragstart="onDragStart" class="box"></q-input>
        <q-select for="qs_1" draggable="true" @dragstart="onDragStart" class="box" v-model="model" :options="options" label="Standard" />

      </div>

      <div style="width: 1000px; background-color: antiquewhite;">

        <grid-layout :layout="layout" :col-num="128" :responsive="true" :row-height="5" :is-draggable="true"
          :is-resizable="true" :is-mirrored="false" :vertical-compact="true" @layout-created="layoutCreatedEvent"
          @layout-before-mount="layoutBeforeMountEvent" @layout-mounted="layoutMountedEvent"
          @layout-ready="layoutReadyEvent" @layout-updated="layoutUpdatedEvent"
          @breakpoint-changed="breakpointChangedEvent" :margin="[5, 5]"
          :breakpoints="{ gaga: 1300, schurz: 1200, md: 996, pups: 768, xs: 480, xxs: 0 }"
          :cols="{ gaga: 128, schurz: 128, md: 128, pups: 128, xs: 128, xxs: 128 }" :use-css-transforms="true">

          <grid-item v-for="(item, index) in layout" :key="index" :x="item.x" :y="item.y" :w="item.w" :h="item.h"
            :i="item.i" :static="item.static" @resize="resizeEvent" @resized="resizedEvent" @move="moveEvent"
            @moved="movedEvent" @ontainer-resized="containerResizedEvent">

            <div v-mutation="handler2" @dragenter="onDragEnter" @dragleave="onDragLeave" @dragover="onDragOver"
              @drop="onDrop" class="drop-target rounded-borders overflow-hidden">
              {{ item.i }}
            </div>
          </grid-item>
        </grid-layout>

      </div> -->

      <!-- form rendering -->
      <!-- <div class="q-pa-md q-form-container">
        <h4>Form Rendering</h4>
        <div v-for="(field, index) in fields" :key="index">
          <component v-model="fieldData[field.cid]" @input="onInput" v-bind:is="getElement(field)" :label="field.label"
            :required="field.required" :field_options="field.field_options" :id="field.cid" :cid="field.cid"
            :ref="field.cid" debounce="500" />
        </div>
      </div> -->

    </div>

    <!-- <div class="row justify-around items-start">
      <div class="col row justify-center q-pa-md">
        <div class="text-subtitle1">
          Mutation Info
        </div>
        <div v-for="status in status1" :key="status">
          {{ status }}
        </div>
      </div>

      <div class="col row justify-center q-pa-md">
        <div class="text-subtitle1">
          Mutation Info
        </div>
        <div v-for="status in status2" :key="status">
          {{ status }}
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import QFormBuilder from 'components/QFormBuilder.vue';
import TextElement from 'components/elements/TextElement.vue';

import TestPage from './TestPage.vue';
import { ref } from 'vue'
// import { GridLayout, GridItem } from 'vue3-grid-layout'
export default {
  name: 'custom-c',
  components: {
    // GridLayout,
    // GridItem
    QFormBuilder,
    TextElement,
    TestPage
  },
  setup() {
    const fields = ref([])
    const fieldData = ref([])
    const status1 = ref([])
    const status2 = ref([])
    const splitterModel = ref(50) 
    const layout = [
      { 'x': 0, 'y': 0, 'w': 50, 'h': 5, i: '0', static: true },
      { 'x': 50, 'y': 0, 'w': 50, 'h': 5, i: '1' }
    ]
    const lastBreakpoint = ref(null)
    const model = ref(null)
    const options = [
      'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
    ]
    return {
      fields,
      fieldData,
      status1,
      status2,
      splitterModel,
      layout,
      lastBreakpoint,
      model,
      options,
      handler1(mutationRecords) {
        status1.value = []
        for (const index in mutationRecords) {
          const record = mutationRecords[index]
          const info = `type: ${record.type}, nodes added: ${record.addedNodes.length > 0 ? 'true' : 'false'}, nodes removed: ${record.removedNodes.length > 0 ? 'true' : 'false'}, oldValue: ${record.oldValue}`
          status1.value.push(info)
        }
      },

      handler2(mutationRecords) {
        status2.value = []
        for (const index in mutationRecords) {
          const record = mutationRecords[index]
          const info = `type: ${record.type}, nodes added: ${record.addedNodes.length > 0 ? 'true' : 'false'}, nodes removed: ${record.removedNodes.length > 0 ? 'true' : 'false'}, oldValue: ${record.oldValue}`
          status2.value.push(info)
        }
      },

      onDrop(e) {
        console.log('onDrop')
        e.preventDefault()

        // don't drop on other draggables
        if (e.target.draggable === true) {
          return
        }

        const draggedId = e.dataTransfer.getData('text')
        const draggedEl = document.getElementById(draggedId)

        // check if original parent node
        if (draggedEl.parentNode === e.target) {
          e.target.classList.remove('drag-enter')
          return
        }

        // make the exchange
        // draggedEl.parentNode.removeChild(draggedEl)
        e.target.appendChild(draggedEl.parentNode.parentNode.parentNode.parentNode)
        e.target.classList.remove('drag-enter')
      },
      // store the id of the draggable element
      onDragStart(e) {
        console.log('onDragStart')
        e.dataTransfer.setData('text', e.target.id)
        e.dataTransfer.dropEffect = 'move'
      },

      onDragEnter(e) {
        console.log('onDragEnter')
        // don't drop on other draggables
        if (e.target.draggable !== true) {
          e.target.classList.add('drag-enter')
        }
      },

      onDragLeave(e) {
        console.log('onDragLeave')
        e.target.classList.remove('drag-enter')
      },

      onDragOver(e) {
        console.log('onDragOver')
        e.preventDefault()
      },
      moveEvent: function () {
        console.log('moveEvent')
      },
      resizedEvent: function () {
        console.log('resizedEvent')
      },
      movedEvent: function () {
        console.log('movedEvent')
      },
      containerResizedEvent: function () {
        console.log('containerResizedEvent')
      },
      resizeEvent: function (i, newH, newW, newHPx, newWPx) {
        console.log(i, newH, newW, newHPx, newWPx)
      },
      layoutBeforeMountEvent: function () {
        console.log('layoutBeforeMountEvent')
      },
      layoutMountedEvent: function () {
        console.log('layoutMountedEvent')
      },
      layoutReadyEvent: function () {
        console.log('layoutReadyEvent')
      },
      layoutUpdatedEvent: function () {
        console.log('layoutUpdatedEvent')
      },
      breakpointChangedEvent: function () {
        console.log('breakpointChangedEvent')
      },
      layoutCreatedEvent: function (newLayout) {
        console.log(newLayout)
        // var comp = this.$children[0];
        // var _ = this;
        // window.addEventListener("resize", function () {

        //   if (_.lastBreakpoint !== comp.lastBreakpoint) {
        //     console.log("resize!");
        //   }

        //   _.lastBreakpoint = comp.lastBreakpoint;

        // });


      },
    /**
     * When a value is input into the rendered form, echo it to the debug line
     */
     onInput (val, id) {
      // console.debug(`${id}: ` + JSON.stringify(val))
    },
    /**
     * Determine the name of the Element object based on the 'field_type' of the field data object
     */
    getElement (field) {
      const nameParts = field.field_type.split('_')
      for (let i = 0; i < nameParts.length; i++) {
        nameParts[i] = nameParts[i].charAt(0).toUpperCase() + nameParts[i].slice(1)
      }
      return nameParts.join('') + 'Element'
    }
    }
  }
}
</script>

<style scoped lang="sass">
.drop-target-1
  height: 400px
  width: 200px
  min-width: 200px
  background-color: gainsboro

.drop-target
  height: 100%
  width: 100%
  min-width: 100%
  background-color: gainsboro

.drag-enter
  outline-style: dashed

.box
  width: 100%
  height: 100px
  float: left
  cursor: pointer

@media only screen and (max-width: 500px)
  .drop-target
    height: 100%
    width: 100%
    min-width: 100%
    background-color: gainsboro

  .box
    width: 50px
    height: 50px

.box:nth-child(3)
  clear: both

.navy
  background-color: navy

.red
  background-color: firebrick

.green
  background-color: darkgreen

.orange
  background-color: orange

</style>
