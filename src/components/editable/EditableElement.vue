<template>
  <div class="q-editable-element">
    <div class="overlay" @click="onClick"></div>
    <component v-bind:is="element" :label="value.label" :required="value.required" :field_options="value.field_options"
      :id="value.id" :cid="value.cid" />
  </div>
</template>

<script>
import TextElement from 'components/elements/TextElement.vue'
// import ParagraphElement from 'components/elements/ParagraphElement'
// import CheckboxesElement from 'components/elements/CheckboxesElement'
// import RadioElement from 'components/elements/RadioElement'
// import DateElement from 'components/elements/DateElement'
// import TimeElement from 'components/elements/TimeElement'
// import DropdownElement from 'components/elements/DropdownElement'
// import EmailElement from 'components/elements/EmailElement'
// import NameElement from 'components/elements/NameElement'
// import SimpleNameElement from 'components/elements/SimpleNameElement'
// import AddressElement from 'components/elements/AddressElement'
// import PhoneElement from 'components/elements/PhoneElement'
// import FileElement from 'components/elements/FileElement'
// import PaymentElement from 'components/elements/PaymentElement'
// import TermsElement from 'components/elements/TermsElement'
// import SectionBreakElement from 'components/elements/SectionBreakElement'
// import PageBreakElement from 'components/elements/PageBreakElement'

export default {
  name: 'EditableElement',
  components: { 
    TextElement
    // , ParagraphElement, CheckboxesElement, RadioElement, DateElement, TimeElement, DropdownElement, EmailElement, NameElement, SimpleNameElement, AddressElement, PhoneElement, FileElement, PaymentElement, TermsElement, SectionBreakElement, PageBreakElement 
  },
  props: ['vmValue'],
  // props: {
  //   value: {
  //     required: true,
  //     type: Array
  //   },
  // },
  methods: {
    onClick: function () {
      this.$emit('my-click', this.value)
    }
  },
  computed: {
    element: function () {
      const nameParts = this.value.field_type.split('_')
      for (let i = 0; i < nameParts.length; i++) {
        nameParts[i] = nameParts[i].charAt(0).toUpperCase() + nameParts[i].slice(1)
      }
      return nameParts.join('') + 'Element'
    },
    value: {
      get() {
        return this.vmValue
      },
      set(value) {
        this.$emit('update:vmValue', value)
      }
    }
  }
}
</script>

<style scoped>
.q-editable-element {
  position: relative;
  padding: 5px;
}

.overlay {
  position: absolute;
  z-index: 2;
  cursor: pointer;
  width: 100%;
  height: 100%;
}
</style>
