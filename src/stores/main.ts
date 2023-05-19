import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import types from './mutation-types';
import { uid } from 'quasar'

interface ElementObject {
  // key に string、value も string が返る
  [key: string]: any;
}

interface RectsObject {
  // key に string、value も string が返る
  [key: string]: any;
}

interface payload { 
  id: string,
  zIndex?: number,
  height?: number,
  width?: number,
  top?: number,
  left?: number,
  minh?: number,
  minw?: number,
  gridX?: number,
  gridY?: number,
  stickSize?: number
} 

export const useStore = defineStore('main', {
  state: () => ({
    counter: 0,
    cps: {},
    elementList: <ElementObject>{},
    // list: ref([]),
    propertyList: ref([]),
    selected_cp: {},
    activeRectId: '',
    activeElement: {},
    rect:  {
      'id': uid(),
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
      'stickSize': 8,
      elementList:[]
    },
    rects: <RectsObject>{},
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
    setActiveElement(element){
      if (this.activeElement) {
        this.activeElement.active = false        
      }
      element.active = true
      this.activeElement = element
    },
    addRect(){
      const newRect = JSON.parse(JSON.stringify(this.rect))
      newRect.id = uid()
      this.rects[newRect.id] = newRect
      this.elementList[newRect.id] = {}
    },
    deleteRect(id: string){
      console.log('deleteRect')
      if (!id) {
        id = this.activeRectId
      }
      delete this.rects[id]
      this.activeRectId = ''
    },
    deleteElement(element){
      console.log('deleteElement')
      console.log(element)
      const idx = this.rects[this.activeRectId].elementList.indexOf(element) 
      this.rects[this.activeRectId].elementList.splice(idx, 1)
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
      // this.elements[id] = null
    },
    setActive(id: string) {
      if (this.activeRectId !== '') {
        this.disableActive(this.activeRectId)
      }
      this.enableActive(id)
    },
    unsetActive(id: string) {
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
    setWidth(width: number) {
      const id = this.activeRectId;
      if (id === null) {
        return;
      }
      this.changeWidth({ id, width })
    },
    setHeight(height: number) {
      const id = this.activeRectId;
      if (id === null) {
        return;
      }
      this.changeHeight({ id, height })
    },
    setTop(top: number) {
      const id = this.activeRectId;
      if (id === null) {
        return;
      }
      this.changeTop({ id, top })
    },
    setLeft(left: number) {
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

      // for (let i = 0, l = state.rects.length; i < l; i++) {
      //   if (i !== id) {
      //     if (state.rects[i].zIndex === state.rects.length) {
      //       continue;
      //     }
      //     this.changeZindex({ id: i, zIndex: this.rects[i].zIndex + 1 })
      //   }
      // }
      const len = Object.keys(this.rects).length
      for (const key in this.rects) {
        if (Object.prototype.hasOwnProperty.call(this.rects, key)) {
          const el = this.rects[key]
          if (key !== id) {
            if (el.zIndex === len) {
              continue
            }
            this.changeZindex({ id: key, zIndex: el.zIndex + 1 } )
          }
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

      this.changeZindex({ id, zIndex: this.rects.length })

      // for (let i = 0, l = this.rects.length; i < l; i++) {
      //   if (i !== id) {
      //     if (this.rects[i].zIndex === 1) {
      //       continue;
      //     }
      //     this.changeZindex({ id: i, zIndex: this.rects[i].zIndex - 1 })
      //   }
      // }
      const len = Object.keys(this.rects).length
      for (const key in this.rects) {
        if (Object.prototype.hasOwnProperty.call(this.rects, key)) {
          const el = this.rects[key]
          if (key !== id) {
            if (el.zIndex === 1) {
              continue
            }
            this.changeZindex({ id: key, zIndex: el.zIndex + 1 } )
          }
        }
      }
    },
    setMinWidth(width: number) {
      const id = this.activeRectId;
      if (id === null) {
        return;
      }
      this.changeMinw({ id, minw: width })
    },
    setMinHeight(height: number) {
      const id = this.activeRectId;
      if (id === null) {
        return;
      }
      this.changeMinh({ id, minh: height })
    },
    setGridX(gridX: number) {
      const id = this.activeRectId;
      if (id === null) {
        return;
      }
      this.changeGridX({ id, gridX })
    },
    setGridY(gridY: number) {
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
    enableActive(id: string) {
      this.activeRectId = id;
      this.rects[id].active = true;
      this.rects[id].zIndex = 10;
    },
    disableActive(id: string) {
      if (id === this.activeRectId) {
        this.activeRectId = '';
      }
      this.rects[id].active = false;
      this.rects[id].zIndex = 1;
    },
    enableAspect(id: string) {
      this.rects[id].aspectRatio = true;
    },
    disableAspect(id: string) {
      this.rects[id].aspectRatio = false;
    },
    enableDraggable(id: string) {
      this.rects[id].draggable = true;
    },
    disableDraggable(id: string) {
      this.rects[id].draggable = false;
    },
    enableResizable(id: string) {
      this.rects[id].resizable = true;
    },
    disableResizable(id: string) {
      this.rects[id].resizable = false;
    },
    enableSnapToGrid(id: string) {
      this.rects[id].snapToGrid = true;
    },
    disableSnapToGrid(id: string) {
      this.rects[id].snapToGrid = false;
    },
    enableBothAxis(id: string) {
      this.rects[id].axis = 'both';
    },
    enableNoneAxis(id: string) {
      this.rects[id].axis = 'none';
    },
    enableXAxis(id: string) {
      this.rects[id].axis = 'x';
    },
    enableYAxis(id: string) {
      this.rects[id].axis = 'y';
    },
    enableParentLimitation(id: string) {
      this.rects[id].parentLim = true;
    },
    disableParentLimitation(id: string) {
      this.rects[id].parentLim = false;
    },
    changeZindex(payload: payload) {
      this.rects[payload.id].zIndex = payload.zIndex;
    },
    changeHeight(payload: payload) {
      this.rects[payload.id].height = payload.height;
    },
    changeWidth(payload: payload) {
      this.rects[payload.id].width = payload.width;
    },
    changeTop(payload: payload) {
      this.rects[payload.id].top = payload.top;
    },
    changeLeft(payload: payload) {
      this.rects[payload.id].left = payload.left;
    },
    changeMinh(payload: payload) {
      this.rects[payload.id].minh = payload.minh;
    },
    changeMinw(payload: payload) {
      this.rects[payload.id].minw = payload.minw;
    },
    changeGridX(payload: payload) {
      this.rects[payload.id].gridX = payload.gridX;
    },
    changeGridY(payload: payload) {
      this.rects[payload.id].gridY = payload.gridY;
    },
    changeStickSize(payload: payload) {
      this.rects[payload.id].stickSize = payload.stickSize;
    },
  },
  persist: true
});
