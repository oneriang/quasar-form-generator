<script setup>
// import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

import * as monaco from 'monaco-editor';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';

import { ref, onMounted } from 'vue';

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new jsonWorker();
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker();
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker();
    }
    if (['typescript', 'javascript'].includes(label)) {
      return new tsWorker();
    }
    return new EditorWorker();
  },
};

import customLangMonarch from 'components/custom-lang-monarch';

monaco.languages.register({ id: 'custom' });
const config = {
  surroundingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '<', close: '>' },
    { open: "'", close: "'" },
    { open: '"', close: '"' },
  ],
  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: "'", close: "'", notIn: ['string', 'comment'] },
    { open: '"', close: '"', notIn: ['string', 'comment'] },
  ],
};
monaco.languages.setLanguageConfiguration('custom', config);
monaco.languages.setMonarchTokensProvider('custom', customLangMonarch);
monaco.languages.typescript.javascriptDefaults.setCompilerOptions({ allowJs:false, noLib: true, allowNonTsExtensions: true })

const editor = ref();

onMounted(() => {
  monaco.editor.create(editor.value, {
    value: `// Type source code in your language here...
      class MyClass {
        @attribute
        void main() {
          Console.writeln( "Hello Monarch world\n");
        }
      }`,
    language: 'custom',
  });

  // Helper function to return the monaco completion item type of a thing
  function getType(thing, isMember) {
    isMember =
      isMember == undefined
        ? typeof isMember == 'boolean'
          ? isMember
          : false
        : false; // Give isMember a default value of false

    switch ((typeof thing).toLowerCase()) {
      case 'object':
        return monaco.languages.CompletionItemKind.Class;

      case 'function':
        return isMember
          ? monaco.languages.CompletionItemKind.Method
          : monaco.languages.CompletionItemKind.Function;

      default:
        return isMember
          ? monaco.languages.CompletionItemKind.Property
          : monaco.languages.CompletionItemKind.Variable;
    }
  }

  // Register object that will return autocomplete items
  monaco.languages.registerCompletionItemProvider('custom', {
    // Run this function when the period or open parenthesis is typed (and anything after a space)
    triggerCharacters: ['.', '('],

    // Function to generate autocompletion results
    provideCompletionItems: function (model, position, token) {
      console.log('provideCompletionItems');

      var textUntilPosition = model.getValueInRange({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      });
      if (textUntilPosition.indexOf('{{') < 0) {
        return { suggestions: [] };
      }
      // var textUntilPosition = model.getValueInRange({
      //   startLineNumber: 1,
      //   startColumn: 1,
      //   endLineNumber: 100,
      //   endColumn: 1000
      // });
      // var match = textUntilPosition.match(
      //   /\s*\{\{\n*\S*\n*\}\}$/
      // );
      // if (!match) {
      //   return { suggestions: [] };
      // }

      // Split everything the user has typed on the current line up at each space, and only look at the last word
      var last_chars = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: 0,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      });

      // var match = last_chars.match(
      //   /"dependencies"\s*:\s*\{\s*("[^"]*"\s*:\s*"[^"]*"\s*,\s*)*([^"]*)?$/
      // );
      // var match = last_chars.match(
      //   /\s*\{\{\n*\s*\n*\}\}$/
      // );
      // if (!match) {
      //   return { suggestions: [] };
      // }

      last_chars = last_chars.replace('{{', '');
      last_chars = last_chars.trim();

      // if (!last_chars.startsWith('X') && !last_chars.startsWith('x')) {
      //   return { suggestions: [] };
      // }

      var words = last_chars.replace('\t', '').split(' ');
      var active_typing = words[words.length - 1]; // What the user is currently typing (everything after the last space)

      // If the last character typed is a period then we need to look at member objects of the obj object
      var is_member = active_typing.charAt(active_typing.length - 1) == '.';

      // Array of autocompletion results
      var result = [];

      // Used for generic handling between member and non-member objects
      var last_token = obj;
      var prefix = '';

      if (is_member) {
        // Is a member, get a list of all members, and the prefix
        var parents = active_typing
          .substring(0, active_typing.length - 1)
          .split('.');
        last_token = obj[parents[0]];
        prefix = parents[0];

        // Loop through all the parents the current one will have (to generate prefix)
        for (var i = 1; i < parents.length; i++) {
          if (last_token.hasOwnProperty(parents[i])) {
            prefix += '.' + parents[i];
            last_token = last_token[parents[i]];
          } else {
            // Not valid
            return result;
          }
        }

        prefix += '.';
      }

      // Get all the child properties of the last token
      for (var prop in last_token) {
        // Do not show properites that begin with "__"
        if (last_token.hasOwnProperty(prop) && !prop.startsWith('__')) {
          // Get the detail type (try-catch) incase object does not have prototype
          var details = '';
          try {
            details = last_token[prop].__proto__.constructor.name;
          } catch (e) {
            details = typeof last_token[prop];
          }

          // Create completion object
          var to_push = {
            // label: prefix + prop,
            label: prop,
            kind: getType(last_token[prop], is_member),
            detail: details,
            insertText: prop,
          };

          // Change insertText and documentation for functions
          if (to_push.detail.toLowerCase() == 'function') {
            to_push.insertText += '(';
            to_push.documentation = last_token[prop].toString().split('{')[0]; // Show function prototype in the documentation popup
          }

          // Add to final results
          result.push(to_push);
        }
      }

      console.log(result);

      return {
        suggestions: result,
      };
    },
  });

  // const ShowAutocompletion = function (obj) {
  //   console.log('ShowAutocompletion');
  //   console.log(obj);
  //   // // Disable default autocompletion for javascript
  //   // monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
  //   //   noLib: true,
  //   // });

  //   // Helper function to return the monaco completion item type of a thing
  //   function getType(thing, isMember) {
  //     isMember =
  //       isMember == undefined
  //         ? typeof isMember == 'boolean'
  //           ? isMember
  //           : false
  //         : false; // Give isMember a default value of false

  //     switch ((typeof thing).toLowerCase()) {
  //       case 'object':
  //         return monaco.languages.CompletionItemKind.Class;

  //       case 'function':
  //         return isMember
  //           ? monaco.languages.CompletionItemKind.Method
  //           : monaco.languages.CompletionItemKind.Function;

  //       default:
  //         return isMember
  //           ? monaco.languages.CompletionItemKind.Property
  //           : monaco.languages.CompletionItemKind.Variable;
  //     }
  //   }
  // };

  const obj = {
    XPerson: {
      name: '',
      age: 0,
      a: {
        a1: {
          a2: 'a2',
        },
      },
    },
  };

  // ShowAutocompletion(obj);
});
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
