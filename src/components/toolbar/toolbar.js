// import { useStore } from 'vuex';
import { useStore } from '../../stores/main.ts'
import { computed, watch, ref } from 'vue';

const onlyNumbers = (e) => {
    if (e.keyCode === 13) {
        return true;
    }
    const char = String.fromCharCode(e.keyCode);
    if (/^[0-9]+$/.test(char)) {
        return true;
    }

    e.preventDefault();
    return false;
};

export default {
    name: 'ToolBar',

    setup(props, { emit }) {
        const store = useStore();
        const showGrid = ref(false);
        const gridX = ref(50);
        const gridY = ref(50);

        // const activeRect = computed(() => store.getters['rect/activeRect']);
        const activeRect = computed(() => store.activeRect);
        const toolsDisabled = computed(() => activeRect.value === null);

        const width = computed({
            get: () => activeRect.value?.width,
            set: (val) => store.setWidth(parseInt(val, 10)),
        });
        const height = computed({
            get: () => activeRect.value?.height,
            // set: val => store.dispatch('rect/setHeight', parseInt(val, 10)),
            set: val => store.setHeight(parseInt(val, 10)),
        });
        const top = computed({
            get: () => activeRect.value?.top,
            // set: val => store.dispatch('rect/setTop', parseInt(val, 10)),
            set: val => store.setTop(parseInt(val, 10)),
        });
        const left = computed({
            get: () => activeRect.value?.left,
            // set: val => store.dispatch('rect/setLeft', parseInt(val, 10)),
            set: val => store.setLeft(parseInt(val, 10)),
        });
        const minWidth = computed({
            get: () => activeRect.value?.minw,
            // set: val => store.dispatch('rect/setMinWidth', parseInt(val, 10)),
            set: val => store.setMinWidth(parseInt(val, 10)),
        });
        const minHeight = computed({
            get: () => activeRect.value?.minh,
            // set: val => store.dispatch('rect/setMinHeight', parseInt(val, 10)),
            set: val => store.setMinHeight(parseInt(val, 10)),
        });

        const stickSize = computed({
            get: () => activeRect.value?.stickSize,
            // set: val => store.dispatch('rect/setStickSize', parseInt(val, 10)),
            set: val => store.setStickSize(parseInt(val, 10)),
        });
        const snapToGrid = computed({
            get: () => activeRect.value?.snapToGrid,
            // set: val => store.dispatch('rect/toggleSnapToGrid', val),
            set: val => store.toggleSnapToGrid(val),
        });

        const aspectRatio = computed({
            get: () => activeRect.value?.aspectRatio,
            // set: val => store.dispatch('rect/toggleAspectRatio', val),
            set: val => store.toggleAspectRatio(val),
        });
        const leftIsLocked = computed({
            get: () => activeRect.value?.axis === 'y' || activeRect.value?.axis === 'none',
            // set: val => store.dispatch('rect/changeXLock', val),
            set: val => store.changeXLock(val),
        });
        const topIsLocked = computed({
            get: () => activeRect.value?.axis === 'x' || activeRect.value?.axis === 'none',
            // set: val => store.dispatch('rect/changeYLock', val),
            set: val => store.changeYLock(val),
        });

        const isResizable = computed({
            get: () => activeRect.value?.resizable,
            // set: val => store.dispatch('rect/toggleResizable', val),
            set: val => store.toggleResizable(val),
        });
        const isDraggable = computed({
            get: () => activeRect.value?.draggable,
            // set: val => store.dispatch('rect/toggleDraggable', val),
            set: val => store.toggleDraggable(val),
        });
        const parentLimitation = computed({
            get: () => activeRect.value?.parentLim,
            // set: val => store.dispatch('rect/toggleParentLimitation', val),
            set: val => store.toggleParentLimitation(val),
        });

        watch(showGrid, val => emit('changeGrid', val, { gridX: gridX.value, gridY: gridY.value }));
        watch(gridX, val => emit('changeGrid', showGrid.value, { gridX: val, gridY: gridY.value }));
        watch(gridY, val => emit('changeGrid', showGrid.value, { gridX: gridX.value, gridY: val }));

        return {
            toolsDisabled,
            onlyNumbers,
            width,
            height,
            top,
            left,
            minWidth,
            gridX,
            gridY,
            minHeight,
            stickSize,
            snapToGrid,
            showGrid,
            isResizable,
            isDraggable,
            parentLimitation,
            aspectRatio,
            leftIsLocked,
            topIsLocked
        };
    },
};