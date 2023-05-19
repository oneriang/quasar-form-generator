<template>
  <div id="editor" ref="editor"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
// import * as monaco from 'monaco-editor';

// import customLangMonarch from 'components/custom-lang-monarch'

// monaco.languages.register({ id: 'custom' })
// monaco.languages.setMonarchTokensProvider('custom', customLangMonarch)

const editor = ref();

onMounted(() => {
  // The Monaco Editor can be easily created, given an
  // empty container and an options literal.
  // Two members of the literal are "value" and "language".
  // The editor takes the full size of its container.

  monaco.editor.create(editor.value, {
    value: "function hello() {\n\talert('Hello world!');\n}",
    language: 'javascript',
  });

  const ShowAutocompletion = function (obj) {
    // Disable default autocompletion for javascript
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      noLib: true,
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
    monaco.languages.registerCompletionItemProvider('javascript', {
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
  };

  const obj = {
    Person: {
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


<style scoped>
#editor {
  width: 100vw;
  height: 100vh;
}
</style>
