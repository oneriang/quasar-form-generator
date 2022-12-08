import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import types from './mutation-types';

export const useStore = defineStore('main', {
  state: () => ({
    counter: 0,
    cps: {},
    elements: {},
    list: ref([]),
    list3: ref([]),
    selected_cp: {},
    activeRectId: null,
    rect:  {
      'width': 200,
      'height': 'auto',
      'top': 10,
      'left': 10,
      'draggable': true,
      'resizable': true,
      'minw': 10,
      'minh': 100,
      'axis': 'both',
      'parentLim': true,
      'snapToGrid': false,
      'aspectRatio': false,
      'zIndex': 1,
      'color': '#EF9A9A',
      'active': false,
      'stickSize': 8
    },
    rects: [
      // {
      //   'width': 200,
      //   'height': 'auto',
      //   'top': 10,
      //   'left': 10,
      //   'draggable': true,
      //   'resizable': true,
      //   'minw': 10,
      //   'minh': 100,
      //   'axis': 'both',
      //   'parentLim': true,
      //   'snapToGrid': false,
      //   'aspectRatio': false,
      //   'zIndex': 1,
      //   'color': '#EF9A9A',
      //   'active': false,
      //   'stickSize': 8
      // }
    ],
    gridX: 50,
    gridY: 50,
    verticalGridLinesCount: 0,
    horizontalGridLinesCount: 0,
    gridVisibility: false,
    wrapperSize: reactive({ width: 0, height: 0 })
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
    activeRect: (state) => {
      return state.rects[state.activeRectId] ?? null;
    }
  },
  actions: {
    increment() {
      this.counter++;
    },
    addRect(){
      this.rects.push(this.rect)
    },
    add_cps(id: string | number) {
      this.cps[id] = {
        dark: false,
        modelValue: '',
        error: false,
        errorMessage: '',
        noErrorIcon: false,
        rules: [],
        // reactiveRules: false,
        // lazyRules: false,
        label: "afasd",
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
        blur: null,
        select: null,
        getNativeElement: null,
        nativeEl: null,
        // onChange: 'alert(1)'
        // onClick:(e: any)=>{alert(1)}
      }
      console.log(this.cps)
      this.elements[id] = null
    },
    setActive( { id } ) {
      if (this.activeRectId !== null) {
        this.disableActive(this.activeRectId)
      }
      this.enableActive(id)
    },
    unsetActive({ id }) {
      this.disableActive(id)
    },
    toggleDraggable() {
      console.log('toggleDraggable')
      const id = this.activeRectId;
      if (id === null) {
        return;
      }

      if (!this.rects[id].draggable) {
        this.enableDraggable(id)
      } else {
        this.disableDraggable(id)
      }
    },

    enableDraggable1() {
      console.log('enableDraggable1')
      const id = this.activeRectId;
      if (id === null) {
        return;
      }
       this.enableDraggable(id)
    },

    disableDraggable1() {
      console.log('disableDraggable1')
      const id = this.activeRectId;
      if (id === null) {
        return;
      }

        this.disableDraggable(id)
    },
    toggleResizable() {
      const id = this.activeRectId;
      if (id === null) {
        return;
      }
      if (!this.rects[id].resizable) {
        this.enableResizable(id)
      } else {
        this.disableResizable(id)
      }
    },

    toggleParentLimitation() {
      const id = this.activeRectId;
      if (id === null) {
        return;
      }
      if (!this.rects[id].parentLim) {
        this.enableParentLimitation(id)
      } else {
        this.disableParentLimitation(id)
      }
    },
    toggleSnapToGrid() {
      const id = this.activeRectId;
      if (id === null) {
        return;
      }
      if (!this.rects[id].snapToGrid) {
        this.enableSnapToGrid(id)
      } else {
        this.disableSnapToGrid(id)
      }
    },
    toggleAspectRatio() {
      const id = this.activeRectId;
      if (id === null) {
        return;
      }
      if (!this.rects[id].aspectRatio) {
        this.enableAspect(id)
      } else {
        this.disableAspect(id)
      }
    },
    setWidth(width) {
      const id = this.activeRectId;
      if (id === null) {
        return;
      }
      this.changeWidth({ id, width })
    },
    setHeight(height) {
      const id = this.activeRectId;
      if (id === null) {
        return;
      }
      this.changeHeight({ id, height })
    },
    setTop(top) {
      const id = this.activeRectId;
      if (id === null) {
        return;
      }
      this.changeTop({ id, top })
    },
    setLeft(left) {
      const id = this.activeRectId;
      if (id === null) {
        return;
      }
      this.changeLeft({ id, left })
    },
    changeXLock() {
      const id = this.activeRectId;
      if (id === null) {
        return;
      }
      switch (this.rects[id].axis) {
        case 'both':
          this.enableYAxis(id)
          break;
        case 'x':
          this.enableNoneAxis(id)
          break;
        case 'y':
          this.enableBothAxis(id)
          break;
        case 'none':
          this.enableXAxis(id)
          break;
      }
    },
    changeYLock() {
      const id = this.activeRectId;
      if (id === null) {
        return;
      }

      switch (this.rects[id].axis) {
        case 'both':
          this.enableXAxis(id)
          break;
        case 'x':
          this.enableBothAxis(id)
          break;
        case 'y':
          this.enableNoneAxis(id)
          break;
        case 'none':
          this.enableYAxis(id)
          break;
      }
    },
    changeZToBottom() {
      const id = this.activeRectId;
      if (id === null) {
        return;
      }
      if (this.rects[id].zIndex === 1) {
        return;
      }

      this.changeZindex({ id, zIndex: 1 })

      for (let i = 0, l = state.rects.length; i < l; i++) {
        if (i !== id) {
          if (state.rects[i].zIndex === state.rects.length) {
            continue;
          }
          this.changeZindex({ id: i, zIndex: this.rects[i].zIndex + 1 })
        }
      }
    },
    changeZToTop() {
      const id = this.activeRectId;
      if (id === null) {
        return;
      }
      if (this.rects[id].zIndex === this.rects.length) {
        return;
      }

      this.changeZindex({ id, zIndex: state.rects.length })

      for (let i = 0, l = this.rects.length; i < l; i++) {
        if (i !== id) {
          if (this.rects[i].zIndex === 1) {
            continue;
          }
          this.changeZindex({ id: i, zIndex: this.rects[i].zIndex - 1 })
        }
      }
    },
    setMinWidth(width) {
      const id = this.activeRectId;
      if (id === null) {
        return;
      }
      this.changeMinw({ id, minw: width })
    },
    setMinHeight(height) {
      const id = this.activeRectId;
      if (id === null) {
        return;
      }
      this.changeMinh({ id, minh: height })
    },
    setGridX(gridX) {
      const id = this.activeRectId;
      if (id === null) {
        return;
      }
      this.changeGridX({ id, gridX })
    },
    setGridY(gridY) {
      const id = this.activeRectId;
      if (id === null) {
        return;
      }
      this.changeGridY({ id, gridY })
    },
    setStickSize(stickSize) {
      const id = this.activeRectId;
      if (id === null) {
        return;
      }
      this.changeStickSize({ id, stickSize })
    },
    enableActive(id) {
      this.activeRectId = id;
      this.rects[id].active = true;
      this.rects[id].zIndex = 10;
    },
    disableActive(id) {
      if (id === this.activeRectId) {
        this.activeRectId = null;
      }
      this.rects[id].active = false;
      this.rects[id].zIndex = 1;
    },
    enableAspect(id) {
      this.rects[id].aspectRatio = true;
    },
    disableAspect(id) {
      this.rects[id].aspectRatio = false;
    },
    enableDraggable(id) {
      this.rects[id].draggable = true;
    },
    disableDraggable(id) {
      this.rects[id].draggable = false;
    },
    enableResizable(id) {
      this.rects[id].resizable = true;
    },
    disableResizable(id) {
      this.rects[id].resizable = false;
    },
    enableSnapToGrid(id) {
      this.rects[id].snapToGrid = true;
    },
    disableSnapToGrid(id) {
      this.rects[id].snapToGrid = false;
    },
    enableBothAxis(id) {
      this.rects[id].axis = 'both';
    },
    enableNoneAxis(id) {
      this.rects[id].axis = 'none';
    },
    enableXAxis(id) {
      this.rects[id].axis = 'x';
    },
    enableYAxis(id) {
      this.rects[id].axis = 'y';
    },
    enableParentLimitation(id) {
      this.rects[id].parentLim = true;
    },
    disableParentLimitation(id) {
      this.rects[id].parentLim = false;
    },
    changeZindex(payload) {
      this.rects[payload.id].zIndex = payload.zIndex;
    },
    changeHeight(payload) {
      this.rects[payload.id].height = payload.height;
    },
    changeWidth(payload) {
      this.rects[payload.id].width = payload.width;
    },
    changeTop(payload) {
      this.rects[payload.id].top = payload.top;
    },
    changeLeft(payload) {
      this.rects[payload.id].left = payload.left;
    },
    changeMinh(payload) {
      this.rects[payload.id].minh = payload.minh;
    },
    changeMinw(payload) {
      this.rects[payload.id].minw = payload.minw;
    },
    changeGridX(payload) {
      this.rects[payload.id].gridX = payload.gridX;
    },
    changeGridY(payload) {
      this.rects[payload.id].gridY = payload.gridY;
    },
    changeStickSize(payload) {
      this.rects[payload.id].stickSize = payload.stickSize;
    },
  },
});
