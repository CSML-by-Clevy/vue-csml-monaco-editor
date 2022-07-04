<template>
  <div class="c-csml-monaco-editor">
    <MonacoEditor
      v-if="isMounted"
      class="c-monaco-editor"
      :value="value"
      :theme="theme"
      :language="language"
      :options="customOptions"
      @editorWillMount="onEditorWillMount"
      @editorDidMount="onEditorDidMount"
      @change="onChange"
    />
  </div>
</template>

<script>
const monaco = require('monaco-editor');
import MonacoEditor from './MonacoEditor';
import defaultOptions from './configuration/default-options';
import csmlMonarchTokens from './configuration/csml/monarch-tokens.js';
import csmlCompletionItemProvider from './configuration/csml/completion.js';
import csmlLanguageConfiguration from './configuration/csml/language-configuration.js';
import nightOwl from './configuration/themes/Night Owl.json';

/**
 * A Monaco editor component with CSML support and a default opiniated configuration.
 *
 * @vue-prop {String} value - The editor's content.
 * @vue-prop {String} [theme='vs-dark'] - The theme of the editor.
 * @vue-data {Object} monaco - The monaco instance.
 * @vue-data {Object} editor - The editor instance.
 * @vue-event {Object} editorWillMount - Emit monaco instance before mount.
 * @vue-event {Object} editorDidMount - Emit editor instance after mount.
 * @vue-event save - Emit a save event.
 */
export default /*#__PURE__*/{
  name: 'CsmlMonacoEditor',

  components: {
    MonacoEditor,
  },

  props: {
    value: {
      type: String,
      required: true,
    },
    theme: {
      type: String,
      default: 'night-owl',
    },
    language: {
      type: String,
      default: 'csml',
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      monaco: null,
      editor: null,

      isMounted: false,
    };
  },

  computed: {
    customOptions() {
      return {
       ...defaultOptions,
       ...this.options,
      };
    },
  },

  mounted() {
    // Register the CSML language
    monaco.languages.register({ id: 'csml' });
    monaco.languages.onLanguage('csml', this.setupCsmlSupport);

    // Define the Night Owl theme
    monaco.editor.defineTheme('night-owl', nightOwl);

    this.isMounted = true;
  },

  methods: {
    onEditorWillMount(monaco) {
      this.monaco = monaco;
      this.$emit('editorWillMount', this.monaco);
    },

    onEditorDidMount(editor) {
      this.editor = editor;

      this.setupCommands(editor);

      this.$emit('editorDidMount', this.editor);
    },

    setupCsmlSupport() {
      monaco.languages.setMonarchTokensProvider('csml', csmlMonarchTokens);
      monaco.languages.setLanguageConfiguration('csml', csmlLanguageConfiguration);
      monaco.languages.registerCompletionItemProvider('csml', csmlCompletionItemProvider);
    },

    setupCommands(editor) {
      // Ctrl + S: save
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () =>
        this.$emit('save'),
      );

      // Ctrl + Shift + /: line comment
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.US_SLASH, () =>
        editor.getAction('editor.action.commentLine').run(),
      );
    },

    onChange(value) {
      this.$emit('input', value);
    },
  },
};
</script>

<style scoped>
.c-csml-monaco-editor {
  position: relative;
}

.c-monaco-editor {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.c-monaco-editor >>> *:focus {
  outline: 1px solid #007fd4;
}
</style>
