<script>
import Vue from 'vue';
// Uncomment import and local "components" registration if library is not registered globally.
// import { CsmlMonacoEditor } from '@/entry.esm';

export default Vue.extend({
  name: 'ServeDev',
  // components: {
  //  CsmlMonacoEditor,
  // }
});
</script>

<template>
  <div id="app">
    <csml-monaco-editor />
  </div>
</template>
