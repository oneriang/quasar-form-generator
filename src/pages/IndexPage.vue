<template>
    <q-splitter
      v-model="splitterModel"
      horizontal
      style="height: 800px"
    >

      <template v-slot:before>
        <q-form-builder :value="fields" />
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
</template>

<script>
import QFormBuilder from 'components/QFormBuilder.vue';
import TextElement from 'components/elements/TextElement.vue';

import TestPage from './TestPage.vue';
import { ref } from 'vue'
// import { GridLayout, GridItem } from 'vue3-grid-layout'
export default {
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
