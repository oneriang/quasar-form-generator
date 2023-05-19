<script setup>
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { ref, onMounted } from 'vue'
import customLangMonarch from 'components/custom-lang-monarch'

monaco.languages.register({ id: 'custom' })
monaco.languages.setMonarchTokensProvider('custom', customLangMonarch)

const editor = ref()

onMounted(() => {
  monaco.editor.create(editor.value, {
    value: `// Type source code in your language here...
    class MyClass {
      @attribute
      void main() {
        Console.writeln( "Hello Monarch world");
      }
    }`,
    language: 'custom',
  })
})
</script>

<template>
  <div id="editor" ref="editor"></div>
</template>

<style scoped>
#editor {
  width: 100vw;
  height: 100vh;
}
</style>
