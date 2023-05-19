<template>
  <div>
    <div ref="editor"></div>
    <q-btn label="ok" @click="getValue"/>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
// import { EditorState, EditorView, basicSetup } from "@codemirror/basic-setup";
import {basicSetup, EditorView} from "codemirror"
import {EditorState, Compartment} from "@codemirror/state"
// import {python} from "@codemirror/lang-python"
import { ViewPlugin } from '@codemirror/view';
import { javascript } from "@codemirror/lang-javascript";

import {CompletionContext} from "@codemirror/autocomplete"
import {autocompletion} from "@codemirror/autocomplete"

// let str = "The quick brown {{fox}} jumps over the lazy {{dog}}.";
// let regex = /\{\{[^}]*\}\}/g;
// let matches = str.match(regex);


// console.log(matches); // Output: ["{{fox}}", "{{dog}}"]


function myCompletions(context) {
  console.log(context)
  // let word = context.matchBefore(/\w*/)
  // let word = context.matchBefore(/\{\{.*/)
    let word = context.matchBefore(/\..*/)
  // let word = context.matchBefore(/\{\{.*\}\}/)
  // console.log(word)
  word.text = word.text.replace('.','')
  // console.log(word)
  if (word.from == word.to && !context.explicit)
    return null
  return {
    from: word.from,
    // options: [
    //   {label: "_match", type: "keyword"},
    //   {label: "_hello", type: "variable", info: "(World)"},
    //   {label: "_magic", type: "text", apply: "⠁⭒*.✩.*⭒⠁", detail: "macro"}
    // ]
    options: [
      {label: "match", type: "keyword"},
      {label: "hello", type: "variable", info: "(World)"},
      {label: "magic", type: "text", apply: "⠁⭒*.✩.*⭒⠁", detail: "macro"}
    ].map(tag => ({label: tag.label, type: "keyword"}))
  }
}

//!completeJSDoc

import {syntaxTree} from "@codemirror/language"

const tagOptions = [
  "constructor", "deprecated", "link", "param", "returns", "type", "test"
].map(tag => ({label: "@" + tag, type: "keyword"}))

function completeJSDoc(context) {
  let nodeBefore = syntaxTree(context.state).resolveInner(context.pos, -1)
  if (nodeBefore.name != "BlockComment" ||
      context.state.sliceDoc(nodeBefore.from, nodeBefore.from + 3) != "/**")
    return null
  let textBefore = context.state.sliceDoc(nodeBefore.from, context.pos)
  // let tagBefore = /@\w*$/.exec(textBefore)
  let tagBefore = /@\w*$/.exec(textBefore)
  if (!tagBefore && !context.explicit) return null
  return {
    from: tagBefore ? nodeBefore.from + tagBefore.index : context.pos,
    options: tagOptions,
    // validFor: /^(@\w*)?$/
    validFor: /^(@\w*)?$/
  }
}

//!jsDocCompletions

import {javascriptLanguage} from "@codemirror/lang-javascript"

const jsDocCompletions = javascriptLanguage.data.of({
  autocomplete: completeJSDoc
})


function addStringJs(stringOfJs) {
  return new Function(stringOfJs)();
}
window.addStringJs = addStringJs

export default {
  name: 'code-editor',
  props: {
    modelValue: {
      type: String,
      default: () => 'hhhh'
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const editor = ref(null);
    let cm
    onMounted(() => {
      const updateValue = (e, cm) => {
        console.log('updateValue')
        const code = cm.state.doc.toString()
        emit('update:modelValue', code)
      }
        // const events = ['blur', 'keyup', 'paste', 'cut', 'delete', 'mouseup']
        // const eventHandler = ViewPlugin.define(cm => null, {
        //   eventHandlers: Object.fromEntries(events.map(e => [e, updateValue]))
        // })
      //  cm = new EditorView({
      //   state: EditorState.create({
      //     extensions: [basicSetup, javascript(), eventHandler],
      //     doc: props.modelValue,
      //   }),
      //   parent: editor.value
      // });
      cm = new EditorView({
        state: EditorState.create({
          doc: "/** Complete tags here\n    @pa\n */\n",
          extensions: [
            basicSetup,
            javascriptLanguage,
            // jsDocCompletions,
            autocompletion({override: [myCompletions]}),
            // eventHandler
          ],
        }),
        parent: editor.value
      });
    });
    const getValue = () => {
      console.log(props.modelValue)
      console.log(cm.state.doc.toString())
      window.addStringJs(cm.state.doc.toString())
    }
    return { editor, getValue };
  }
}
</script>
<style scoped>
.cm-editor {
  height: 100%;
  border: solid 1px #ddd;
  border-radius: 4px;
}
</style>