const fs = require('fs');
const path = require('path');
const glob = require('fast-glob');

const projectName = path.basename(process.cwd());

/**
 * @description: get file dependencies Map
 * @param {*} compilation
 * @return {*} Map
 */
function getFilesDepsMap(compilation) {
  const res = Array.from(compilation.fileDependencies).reduce(
    (count, depsFilePath) => {
      // exclude node_modules
      !depsFilePath.includes(`${projectName}/node_modules`)
        && count.set(depsFilePath, true);
      return count;
    },
    new Map(),
  );
  return res;
}

/**
 * @description: get file list from the target directory
 * @param {*} options
 * @return {*} string[]
 */
function getIncludeFiles(options) {
  const { include, exclude } = options;
  const fileList = [...include, ...exclude.map(file => `!${file}`)];
  return glob
    .sync(fileList, options.globOptions)
    .map(filePath => path.resolve(process.cwd(), filePath));
}

/**
 * @description: remove file
 * @param {*} redundantFiles
 * @return {*}
 */
function removeFiles(redundantFiles) {
  redundantFiles.forEach(file => {
    fs.unlink(file, err => {
      if (err) {
        console.warn(`<CleanRedundantFilesPlugin>--file: ${file} delete failed`);
        throw err;
      }
    });
  });
}

class CleanRedundantFilesPlugin {
  constructor(options = {}) {
    this.options = {
      // target directory
      include: [...new Set([...(options.include || []), 'src/**/*'])],
      // exclude file
      exclude: [...new Set([...(options.exclude || []), 'node_modules/**/*', 'src/**/*.ts'])],
      globOptions: options.globOptions || {},
      // auto remove
      autoRemove: options.autoRemove || false,
    };
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync(
      'CleanRedundantFilesPlugin',
      (compilation, callback) => {
        this.applyAfterEmit(this.options, compilation);
        callback();
      },
    );
  }

  /**
   * @description: afterEmit hook
   * @param {*} options
   * @param {*} compilation
   * @return {*}
   */
  applyAfterEmit(options, compilation) {
    const filesDeps = getFilesDepsMap(compilation);
    const includeFiles = getIncludeFiles(options);
    const redundantFiles = includeFiles.filter(file => !filesDeps.has(file));
    // output json
    fs.writeFileSync('./redundant-files.json', JSON.stringify(redundantFiles));

    options.autoRemove && removeFiles(redundantFiles);
  }
}

module.exports = CleanRedundantFilesPlugin;
