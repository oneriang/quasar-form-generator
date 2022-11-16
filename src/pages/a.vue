<div id="app">
    <grid-layout
              :layout.sync="layout"
              :col-num="128"
              :responsive="true"
              :row-height="5"
              :is-draggable="true"
              :is-resizable="true"
              :is-mirrored="false"
              :vertical-compact="true"
              @layout-updated="layoutUpdatedEvent"
              @layout-created="layoutCreatedEvent"
              :margin="[5, 5]"
              :breakpoints="{ gaga: 1300,schurz: 1200, md: 996, pups: 768, xs: 480, xxs: 0}"
              :cols="{ gaga:128, schurz: 128, md: 128, pups: 128, xs: 128, xxs: 128 }"
              :use-css-transforms="true"
      >
  
          <grid-item v-for="item in layout"
                     :x="item.x"
                     :y="item.y"
                     :w="item.w"
                     :h="item.h"
                     :i="item.i"
                     @resize="resizeEvent">
              {{item.i}}
          </grid-item>
      </grid-layout>
    <button id="addnew" ref="addNewButton">New (+)</button>
  </div>

  <style>
.vue-grid-layout {
  background-color: lightgrey;
}
.vue-grid-item {
  background-color: grey;
}</style>

<script>
var testLayout = [
	    {"x":0,"y":0,"w":1,"h":1,"i":"0"}
	];
	
	new Vue({
	    el: '#app',
	    data: {
	        layout: testLayout,
          lastBreakpoint: null
	    },
 
    methods: {
      layoutUpdatedEvent: function() {},
      resizeEvent: function(i, newH, newW, newHPx, newWPx){},
      layoutCreatedEvent: function(newLayout) {
        
        var comp = this.$children[0];
        var _ = this;
        window.addEventListener("resize", function() {
          
          if(_.lastBreakpoint !== comp.lastBreakpoint) {
            console.log("resize!");
          }
        
          _.lastBreakpoint = comp.lastBreakpoint;
          
        });
  

      },
      
    },
    mounted: function() {
 
        var comp = this.$children[0];
      
        this.$refs.addNewButton.addEventListener("click", function() {
          console.log(comp);
          comp.layout.push({"x":comp.layout.length+1,"y":0,"w":1,"h":1,"i":comp.layout.length+1});
          
        });
      }
 
	});
</script>