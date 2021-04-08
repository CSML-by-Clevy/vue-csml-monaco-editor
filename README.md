# CSML Monaco Editor

> CSML Monaco Editor is a customized version of Monaco Editor with support for the CSML language.

## Table of Contents

- [Quick start](#quick-start)
- [Project setup](#project-setup)

## Quick start

You need [Vue.js](https://vuejs.org/) **version 2.6+**.

### 1 Install via npm

```bash
npm install @clevy/csml-monaco-editor
```

### 2 Import and use CSML components

Bundle
```javascript
import Vue from 'vue';
import CsmlMonacoEditor from '@clevy/csml-monaco-editor';

Vue.use(CsmlMonacoEditor);
```
or Individual Components
```javascript
import Vue from 'vue'
import { CsmlMonacoEditor } from '@clevy/csml-monaco-editor'

Vue.use(CsmlMonacoEditor)
```

## CSML Monaco Editor

To avoid a large bundle size, Monaco Editor is externalized from the library.
So if you want to use the `csml-monaco-editor` component in your project, you have to install and load Monaco Editor in your project directly.

```bash
npm install monaco-editor
npm install monaco-editor-webpack-plugin
```

### Use ESM version with webpack

Use [monaco-editor-webpack-plugin](https://github.com/Microsoft/monaco-editor-webpack-plugin):

```js
// webpack.config.js
const MonacoEditorPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
  plugins: [
    new MonacoEditorPlugin({
      // Available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options.
      languages: [],
      features: [
        '!codelens',
        '!colorPicker',
      ],
    })
  ]
}
```

If using [Vue CLI](https://cli.vuejs.org) instead of Webpack directly, you can add to `vue.config.js`:
```js
// vue.config.js
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin({
        // Available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options.
        languages: [],
        features: [
          '!codelens',
          '!colorPicker',
        ],
      }),
    ],
  },
};
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```
