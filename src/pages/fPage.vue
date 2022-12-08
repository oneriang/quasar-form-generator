<template>
    <div id="app" class="workspace">
        <!-- <tool-bar></tool-bar> -->
        <div class="rect-wrapper" ref="rectWrapper">

            <q-menu touch-position context-menu @mousedown.stop>
                <q-list style="min-width: 100px" dense>
                    <q-item clickable v-close-popup @click="addRect">
                        <q-item-section>New tab</q-item-section>
                    </q-item>
                </q-list>
            </q-menu>
            <VueDragResize v-for="(rect, index) in rects" :key="index" :w="rect.width" :h="rect.height" :x="rect.left"
                :y="rect.top" :parentW="wrapperSize.width" :parentH="wrapperSize.height" :axis="rect.axis"
                :isActive="rect.active" :minw="rect.minw" :minh="rect.minh" :isDraggable="rect.draggable"
                :isResizable="rect.resizable" :parentLimitation="rect.parentLim" :snapToGrid="rect.snapToGrid"
                :gridX="gridX" :gridY="gridY" :aspectRatio="rect.aspectRatio" :z="rect.zIndex"
                :contentClass="rect.class" :stickSize="rect.stickSize" v-on:activated="activateEv(index)"
                v-on:deactivated="deactivateEv(index)" v-on:dragging="changeDimensions($event, index)"
                v-on:resizing="changeDimensions($event, index)" dragHandle=".drag" :preventActiveBehavior="false">
                <!-- <div style="height: 20px; background-color: red; position: absolute; width: 100%; top: -20px; cursor: move;"
                    class="drag">
                   
                    <q-bar dense class="bg-black text-white drag">
                        <q-space />
                        <q-icon name="battery_full" />
                    </q-bar>
                </div> -->



                <q-bar dense class="bg-black text-white drag "
                    style="height: 20px; background-color: red; position: absolute; width: 100%; top: -20px; cursor: move;">
                    <q-space />
                    <q-icon name="battery_full">
                        <q-menu touch-position>
                            <element-list-component></element-list-component>
                        </q-menu>
                    </q-icon>
                </q-bar>
                <div>
                    <q-menu touch-position context-menu @mousedown.stop>
                        <element-list-component></element-list-component>
                    </q-menu>
                    <vuedraggable class="dragArea list-group" :list="list" group="people1" @change="change"
                        item-key="id"
                        style="background-color: aquamarine; min-height: 100px; padding: 5px; height:100%;"
                        @start="vuedraggable_start" @end="vuedraggable_end">
                        <template #item="{ element }">
                            <div class="list-group-item" @click="clicked(element)">
                                <component v-bind:is="element.type" v-model="cps[element.ref].modelValue"
                                    v-bind="cps[element.ref]" :style="'color:' + cps[element.ref]['color']"
                                    :ref="el => { elements[element.ref] = el }">
                                    <template v-if="element.type === 'q-card'">
                                        <q-card-section>
                                            <div class="text-h6">Our Changing Planet</div>
                                            <div class="text-subtitle2">by John Doe</div>
                                        </q-card-section>

                                        <q-card-section>
                                            abcdefg
                                        </q-card-section>
                                    </template>
                                </component>
                                <!-- <component v-bind:is="element.type" v-model="cps[element.ref].modelValue"
                                    v-bind="cps[element.ref]" :style="'color:' + cps[element.ref]['color']"
                                    :ref="el => { elements[element.ref] = el }"> -->
                            </div>
                        </template>
                    </vuedraggable>
                </div>

            </VueDragResize>

            <div v-for="n in horizontalGridLinesCount" class="horizontal-line" :key="n"
                :style="'top:' + gridY * n + 'px'"></div>
            <div v-for="n in verticalGridLinesCount" class="vertical-line" :key="n" :style="'left:' + gridX * n + 'px'">
            </div>
        </div>
    </div>

</template>

<style>
html,
body {
    height: 100%;
    width: 100%;
}

/* .workspace {
    width: 100%;
    height: 100%;
    background-color: #FAFBFC;
    display: grid;
    grid-template-columns: 200px auto;
    column-gap: 20px;
    grid-template-rows: auto;
    row-gap: 20px;
    padding: 20px;
    box-sizing: border-box;
} */

.workspace {
    width: 100%;
    height: 100%;
    background-color: #f5e29f;
    display: fixed;
    /* padding: 20px; */
    box-sizing: border-box;
}

.horizontal-line {
    width: 100%;
    height: 2px;
    margin-top: -1px;
    background-color: #f1f1f1;
    position: absolute;
}

.vertical-line {
    height: 100%;
    width: 2px;
    margin-left: -1px;
    background-color: #f1f1f1;
    position: absolute;
}

.rect-wrapper {
    height: 100%;
    width: 100%;
    position: fixed;
    background-color: rgb(147, 236, 111);
    border: 1px solid #ebedf8;
}

.filler {
    width: 100%;
    height: 100%;
}

/* .drag {
    display: none;
} */

/* .drag:hover {
    display: block;
} */

/* .content-container .drag {
    display: none;
}

.content-container:hover .drag {
    display: block;
} */

.vdr .drag {
    display: none;
}

.vdr .vdr-stick {
    display: none;
}

.vdr:hover .drag {
    display: flex;
}

.vdr:hover .vdr-stick {
    display: block;
}

.vdr.active .drag {
    display: flex;
}

.vdr.active .vdr-stick {
    display: block;
}

/* .vdr.inactive .drag {
    display: none;
}

.vdr.inactive .vdr-stick {
    display: none;
} */
</style>

<script>
import vuedraggable from 'vuedraggable'

import ElementListComponent from 'components/ElementListComponent.vue';
import VueDragResize from '/root/ws/quasar/quasar-form-generator/src/components/component/vue-drag-resize.vue';
// import VueDragResize from 'vue3-drag-resize';
import ToolBar from '../components/toolbar/ToolBar.vue';
import { storeToRefs } from "pinia";
import { useStore } from '../stores/main.ts'
import { ref, onMounted, reactive, watch, computed } from 'vue';

export default {
    name: 'App',
    components: {
        vuedraggable,
        VueDragResize,
        ToolBar,
        ElementListComponent
    },
    setup() {
        // const list = ref([])
        const store = useStore();
        const { list, cps, gridX, gridY, rects, verticalGridLinesCount, horizontalGridLinesCount, gridVisibility, wrapperSize } = storeToRefs(store);
        const rectWrapper = ref(null);
        // const gridVisibility = ref(false);
        // const gridVisibility = store.gridVisibility;

        const activeRect = computed(() => store.activeRect);

        // const gridX = ref(50);
        // const gridY = ref(50);
        // const gridX = ref(store.gridX);
        // const gridY = ref(store.gridY);

        // const verticalGridLinesCount = ref(0);
        // const horizontalGridLinesCount = ref(0);
        // const verticalGridLinesCount = ref(store.verticalGridLinesCount);
        // const horizontalGridLinesCount = ref(store.horizontalGridLinesCount);

        // const rects = store.rects;
        // const wrapperSize = reactive({ width: 0, height: 0 });
        // const wrapperSize = store.wrapperSize

        // const cps = store.cps
        const elements = ref({})

        const changeDimensions = (newRect) => {
            console.log('changeDimensions')
            // store.dispatch('rect/setTop', newRect.top);
            // store.dispatch('rect/setLeft', newRect.left);
            // store.dispatch('rect/setWidth', newRect.width);
            // store.dispatch('rect/setHeight', newRect.height);
            store.setTop(newRect.top);
            store.setLeft(newRect.left);
            store.setWidth(newRect.width);
            store.setHeight(newRect.height);
            // store.setHeight('');
        };

        const activateEv = (index) => {
            console.log('activateEv')
            store.setActive({ id: index });
        };

        const deactivateEv = (index) => {
            console.log('deactivateEv')
            store.unsetActive({ id: index });
        };

        const changeWrapperSize = () => {
            console.log('changeWrapperSize')
            // wrapperSize.width = rectWrapper.value.clientWidth;
            // wrapperSize.height = rectWrapper.value.clientHeight;
            wrapperSize.value.width = rectWrapper.value.clientWidth;
            wrapperSize.value.height = rectWrapper.value.clientHeight;
        };

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

        watch(wrapperSize, () => {
            changeGrid(gridVisibility.value, { gridX: gridX.value, gridY: gridY.value });
            // changeGrid(store.gridVisibility, { gridX: gridX, gridY: gridY });
        });

        onMounted(changeWrapperSize);
        window.addEventListener('resize', changeWrapperSize);

        const clicked = function (element) {
            console.log('clicked')
            console.log(element)
            console.log(elements.value)
            // list3.value = Object.entries(elements.value[element.ref])
            store.list3 = Object.entries(elements.value[element.ref])
            // selected_cp.value = element
            store.selected_cp = element
        }

        const vuedraggable_start = function (element) {
            console.log('vuedraggable_start')
            console.log(element)
            // activeRect.value.isDraggable = false
            // store.disableDraggable1()
        }

        const vuedraggable_end = function (element) {
            console.log('vuedraggable_end')
            console.log(element)
            // activeRect.value.isDraggable = true
            // store.enableDraggable1()
        }

        const addRect = function () {
            console.log('addRect')
            store.addRect()
        }

        return {
            addRect,
            clicked,
            vuedraggable_start,
            vuedraggable_end,
            elements,
            cps,
            list,
            gridX,
            gridY,
            rects,
            changeGrid,
            rectWrapper,
            wrapperSize,
            activateEv,
            deactivateEv,
            changeDimensions,
            horizontalGridLinesCount,
            verticalGridLinesCount,
        };
    },
};
</script>