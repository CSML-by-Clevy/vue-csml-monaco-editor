<script>
/* eslint-disable vue/require-default-prop */

/**
 * Heavily inspired by https://github.com/egoist/vue-monaco/blob/master/src/MonacoEditor.js.
 * Low-level component that should NOT be modified unless you know what you're doing.
 */
export default /*#__PURE__*/{
  name: 'MonacoEditor',

  model: {
    event: 'change',
  },

  props: {
    original: String,
    value: {
      type: String,
      required: true,
    },
    theme: {
      type: String,
      default: 'vs',
    },
    language: String,
    options: Object,
    amdRequire: {
      type: Function,
    },
    diffEditor: {
      type: Boolean,
      default: false,
    },
  },

  watch: {
    options: {
      deep: true,
      handler(options) {
        if (this.editor) {
          const editor = this.getModifiedEditor();
          editor.updateOptions(options);
        }
      },
    },

    value(newValue) {
      if (this.editor) {
        const editor = this.getModifiedEditor();
        if (newValue !== editor.getValue()) {
          editor.setValue(newValue);
        }
      }
    },

    original(newValue) {
      if (this.editor && this.diffEditor) {
        const editor = this.getOriginalEditor();
        if (newValue !== editor.getValue()) {
          editor.setValue(newValue);
        }
      }
    },

    language(newVal) {
      if (this.editor) {
        const editor = this.getModifiedEditor();
        this.monaco.editor.setModelLanguage(editor.getModel(), newVal);
      }
    },

    theme(newVal) {
      if (this.editor) {
        this.monaco.editor.setTheme(newVal);
      }
    },
  },

  mounted() {
    if (this.amdRequire) {
      this.amdRequire(['vs/editor/editor.main'], () => {
        this.monaco = window.monaco;
        this.$nextTick(() => {
          this.initMonaco(window.monaco);
        });
      });
    } else {
      // ESM format so it can't be resolved by commonjs `require` in eslint
      const monaco = require('monaco-editor');
      this.monaco = monaco;
      this.$nextTick(() => {
        this.initMonaco(monaco);
      });
    }
  },

  beforeDestroy() {
    this.editor && this.editor.dispose();
  },

  methods: {
    initMonaco(monaco) {
      this.$emit('editorWillMount', this.monaco);

      const options = {
        ...{
          value: this.value,
          theme: this.theme,
          language: this.language,
        },
        ...this.options,
      };

      if (this.diffEditor) {
        this.editor = monaco.editor.createDiffEditor(this.$el, options);
        const originalModel = monaco.editor.createModel(
          this.original,
          this.language,
        );
        const modifiedModel = monaco.editor.createModel(
          this.value,
          this.language,
        );
        this.editor.setModel({
          original: originalModel,
          modified: modifiedModel,
        });
      } else {
        this.editor = monaco.editor.create(this.$el, options);
      }

      // @event `change`
      const editor = this.getModifiedEditor();
      editor.onDidChangeModelContent(event => {
        const value = editor.getValue();
        if (this.value !== value) {
          this.$emit('change', value, event);
        }
      });

      this.$emit('editorDidMount', this.editor);
    },

    getEditor() {
      return this.editor;
    },

    getModifiedEditor() {
      return this.diffEditor ? this.editor.getModifiedEditor() : this.editor;
    },

    getOriginalEditor() {
      return this.diffEditor ? this.editor.getOriginalEditor() : this.editor;
    },

    focus() {
      this.editor.focus();
    },
  },

  render(h) {
    return h('div');
  },
};
</script>
