<p align="center">
  <a href="https://github.com/william0119/slim-project-plugin" target="_blank">
    <img src="./public/images/logo.svg" alt="William" width="280" height="175">
  </a>
</p>

# Webpack Slim Project Plugin

A Webpack plugin that output redundant files map for project.

### Features

- Output the redundant files sourcemap of project
- Support custom configuration

### Install

```bash
npm i @ignorance/validator --save-dev
```

### Usage

```javascript
// webpack.config.js

const WebpackSlimProjectPlugin = require("webpack-slim-project-plugin");

...
plugins: [
  new WebpackSlimProjectPlugin({
    include: [...],
    exclude: [...],
    ...
  }),
],
...

```

outputed the source map of redundant files(CleanRedundantFilesPlugin.json).

### Issues

- This plugin only supports projects built by webpack
- Unable to accurately detect the dependency relationship of typescript
- If other plugins in the project operated on compilation.fileDependencies, the result will not match expectations
